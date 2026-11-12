import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import PendingUser from '@/models/PendingUser';

const isProduction = process.env.NODE_ENV === 'production';

// PERMANENT FIX: Force NextAuth URL in production to prevent localhost fallback
if (isProduction) {
  process.env.NEXTAUTH_URL = 'https://creatorskithub.com';
}

const cookiePrefix = isProduction ? '__Secure-' : '';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || process.env.JWT_SECRET || '';

const getBaseUrl = () => {
  if (isProduction) {
    return 'https://creatorskithub.com';
  }
  if (process.env.NEXTAUTH_URL && !process.env.NEXTAUTH_URL.includes('localhost')) {
    return process.env.NEXTAUTH_URL.replace(/\/$/, '');
  }
  return 'http://localhost:3000';
};

export const authOptions = {
  trustHost: true,
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      wellKnown: null,
      issuer: 'https://accounts.google.com',
      authorization: {
        url: 'https://accounts.google.com/o/oauth2/v2/auth',
        params: {
          prompt: 'select_account',
          access_type: 'offline',
          response_type: 'code',
          scope: 'openid email profile',
        },
      },
      token: 'https://oauth2.googleapis.com/token',
      userinfo: 'https://openidconnect.googleapis.com/v1/userinfo',
      jwks_endpoint: 'https://www.googleapis.com/oauth2/v3/certs',
      checks: ['state'],
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please provide both email and password.');
        }

        await dbConnect();
        const cleanEmail = credentials.email.toLowerCase().trim();
        const user = await User.findOne({ email: cleanEmail }).select('+password');

        if (!user) {
          throw new Error('No account found with this email. Please sign up first.');
        }

        if (!user.password && user.authProvider === 'google') {
          throw new Error('This account was created with Google. Please use Continue with Google.');
        }

        const isMatch = await bcrypt.compare(credentials.password, user.password || '');
        if (!isMatch) {
          throw new Error('Incorrect password. Please try again.');
        }

        return {
          id: user._id.toString(),
          dbId: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role || 'user',
          isVerified: user.isVerified ?? true,
          image: user.profileImage || '',
        };
      },
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  useSecureCookies: isProduction,
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: isProduction,
      },
    },
    callbackUrl: {
      name: `${cookiePrefix}next-auth.callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: isProduction,
      },
    },
    csrfToken: {
      name: `${cookiePrefix}next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: isProduction,
      },
    },
    state: {
      name: `${cookiePrefix}next-auth.state`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: isProduction,
        maxAge: 900,
      },
    },
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          await dbConnect();
          const cleanEmail = (user?.email || profile?.email || '').toLowerCase().trim();
          if (!cleanEmail) return false;

          const googleName = user?.name || profile?.name || cleanEmail.split('@')[0];
          const googleImage = user?.image || profile?.picture || '';
          const googleId = account?.providerAccountId || user?.id || '';

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
            { upsert: true, new: true, lean: true, projection: { _id: 1, name: 1, email: 1, role: 1, profileImage: 1, isVerified: 1 } }
          );

          if (dbUser) {
            user.dbId = dbUser._id.toString();
            user.role = dbUser.role || 'user';
            user.name = dbUser.name || user.name;
            user.image = dbUser.profileImage || user.image;
            user.isVerified = dbUser.isVerified ?? true;
          }

          PendingUser.deleteOne({ email: cleanEmail }).catch(() => { });
          return true;
        } catch (err) {
          console.error('[AUTH] Google signIn error:', err);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.dbId || user.id || user._id?.toString();
        token.role = user.role || 'user';
        token.name = user.name || token.name;
        token.email = (user.email || token.email || '').toLowerCase().trim();
        token.isVerified = user.isVerified ?? true;
        if (user.image) token.picture = user.image;
        return token;
      }
      if (trigger === 'update' && session) {
        if (session.name) token.name = session.name;
        if (session.role) token.role = session.role;
        return token;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id || token.sub;
        session.user.role = token.role || 'user';
        session.user.name = token.name || session.user.name;
        session.user.email = token.email || session.user.email;
        session.user.isVerified = token.isVerified ?? true;
        if (token.picture) session.user.image = token.picture;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      const baseClean = getBaseUrl();
      let targetUrl = url;

      if (targetUrl.startsWith('/')) {
        if (targetUrl.startsWith('//')) {
          targetUrl = '/' + targetUrl.replace(/^\/+/, '');
        }
        targetUrl = baseClean + targetUrl;
      }

      try {
        const parsed = new URL(targetUrl, baseClean);
        const isAllowed =
          parsed.hostname === 'localhost' ||
          parsed.hostname === '127.0.0.1' ||
          parsed.hostname === 'creatorskithub.com' ||
          parsed.hostname.endsWith('.creatorskithub.com');

        if (!isAllowed) return baseClean;

        if (parsed.pathname === '/login' || parsed.pathname === '/register') {
          const nested = parsed.searchParams.get('redirect') || parsed.searchParams.get('callbackUrl');
          if (nested && nested !== '/login' && nested !== '/register') {
            if (nested.startsWith('/')) {
              return baseClean + nested;
            }
          }
          return baseClean;
        }

        return parsed.toString();
      } catch (err) {
        return baseClean;
      }
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: NEXTAUTH_SECRET,
};