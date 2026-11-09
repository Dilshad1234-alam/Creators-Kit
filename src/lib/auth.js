import GoogleProvider from 'next-auth/providers/google';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import PendingUser from '@/models/PendingUser';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: 'select_account',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          await dbConnect();
          const cleanEmail = (user?.email || profile?.email || '').toLowerCase().trim();
          if (!cleanEmail) {
            console.error('[AUTH] Google signIn rejected: No email found in Google profile');
            return false;
          }

          const googleName = user?.name || profile?.name || cleanEmail.split('@')[0];
          const googleImage = user?.image || profile?.picture || '';
          const googleId = account?.providerAccountId || user?.id || '';

          // Streamlined atomic upsert using lean projection for minimal round-trip latency
          const updateOps = {
            $setOnInsert: {
              name: googleName,
              email: cleanEmail,
              role: 'user',
              authProvider: 'google',
            },
            $set: {
              isVerified: true,
              ...(googleId ? { googleId } : {}),
              ...(googleImage ? { profileImage: googleImage } : {}),
            },
          };

          const dbUser = await User.findOneAndUpdate(
            { email: cleanEmail },
            updateOps,
            {
              upsert: true,
              new: true,
              lean: true,
              projection: { _id: 1, name: 1, email: 1, role: 1, profileImage: 1, isVerified: 1 },
            }
          );

          // Attach synchronized DB user details directly onto the user object in-memory
          // so the following jwt callback receives it without querying MongoDB again
          if (dbUser) {
            user.dbId = dbUser._id.toString();
            user.role = dbUser.role || 'user';
            user.name = dbUser.name || user.name;
            user.image = dbUser.profileImage || user.image;
            user.isVerified = dbUser.isVerified ?? true;
          }

          // Clean up pending registration in background without blocking sign-in flow
          PendingUser.deleteOne({ email: cleanEmail }).catch(() => {});

          return true;
        } catch (err) {
          console.error('[AUTH] NextAuth Google signIn error:', err);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      // 1. Initial sign-in: user is passed from signIn callback with in-memory dbId and role
      if (account && user) {
        token.id = user.dbId || user.id;
        token.role = user.role || 'user';
        token.name = user.name || token.name;
        token.email = user.email || token.email;
        token.picture = user.image || token.picture;
        token.isVerified = user.isVerified ?? true;
        return token;
      }

      // 2. Check if user still exists in MongoDB Compass (in case of logout / deletion)
      if (token?.email) {
        try {
          await dbConnect();
          const cleanEmail = token.email.toLowerCase().trim();
          const dbUser = await User.findOne({ email: cleanEmail })
            .select('_id name email role profileImage isVerified')
            .lean();

          if (!dbUser) {
            // User deleted from MongoDB Compass on logout -> Revoke session and clean cookies
            throw new Error('SessionRevoked');
          }

          token.id = dbUser._id.toString();
          token.role = dbUser.role || 'user';
          token.name = dbUser.name || token.name;
          token.isVerified = dbUser.isVerified;
          if (dbUser.profileImage) {
            token.picture = dbUser.profileImage;
          }
        } catch (err) {
          if (err.message === 'SessionRevoked') {
            throw err;
          }
          console.error('[AUTH] NextAuth jwt verification error:', err);
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.email) {
        try {
          await dbConnect();
          const cleanEmail = token.email.toLowerCase().trim();
          const dbUser = await User.findOne({ email: cleanEmail }).select('_id name role profileImage isVerified').lean();
          if (!dbUser) {
            // User does not exist in MongoDB Compass (e.g. was deleted on logout)
            return null;
          }
          if (!session.user) session.user = {};
          session.user.id = dbUser._id.toString();
          session.user.role = dbUser.role || 'user';
          session.user.name = dbUser.name || session.user.name;
          session.user.email = cleanEmail;
          session.user.isVerified = dbUser.isVerified;
          if (dbUser.profileImage) {
            session.user.image = dbUser.profileImage;
          }
          return session;
        } catch (e) {
          return null;
        }
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      try {
        const parsed = new URL(url);
        if (parsed.origin === baseUrl) return url;
      } catch (e) {}
      return baseUrl;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
};
