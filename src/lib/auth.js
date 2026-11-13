import '@/lib/loadEnv';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import PendingUser from '@/models/PendingUser';

const isProduction = process.env.NODE_ENV === 'production';

// PERMANENT ENFORCEMENT: Force NextAuth URL and reverse-proxy trust in production
if (isProduction) {
  process.env.NEXTAUTH_URL = 'https://creatorskithub.com';
  process.env.NEXTAUTH_URL_INTERNAL = 'https://creatorskithub.com';
}
process.env.AUTH_TRUST_HOST = 'true';

const cookiePrefix = isProduction ? '__Secure-' : '';

const NEXTAUTH_SECRET =
  process.env.NEXTAUTH_SECRET ||
  process.env.AUTH_SECRET ||
  process.env.JWT_SECRET ||
  '9569bbd37859d9e4d925e16947b6f9a794afe5d929f473be9d21195f690a94ee';

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
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Please provide both email and password.');
          }

          await dbConnect();
          const cleanEmail = credentials.email.toLowerCase().trim();
          let user = await User.findOne({ email: cleanEmail }).select('+password');

          // Auto-Signup: Automatically register user if email doesn't exist
          if (!user) {
            if (credentials.password.length < 6) {
              throw new Error('Password must be at least 6 characters long.');
            }

            const localPart = cleanEmail.split('@')[0] || 'Creator';
            const formattedName = localPart
              .replace(/[._-]+/g, ' ')
              .split(' ')
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ') || 'Creator';

            user = new User({
              name: formattedName,
              email: cleanEmail,
              password: credentials.password, // Pre-save hook hashes with bcrypt automatically
              role: 'user',
              isVerified: true,
              authProvider: 'credentials',
            });

            await user.save();
            console.log(`[AUTH] Auto-created new user via NextAuth: ${user.email} (ID: ${user._id})`);
            PendingUser.deleteMany({ email: cleanEmail }).catch(() => {});
          } else {
            // Existing user: Verify password
            if (!user.password) {
              user.password = credentials.password;
              await user.save();
            } else {
              const isMatch = await bcrypt.compare(credentials.password, user.password);
              if (!isMatch) {
                throw new Error('Incorrect password. Please try again or use Forgot Password.');
              }
            }
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
        } catch (authErr) {
          console.error('[AUTH_ERROR] Credentials authorize error:', authErr.message);
          throw authErr;
        }
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
  },

  logger: {
    error(code, metadata) {
      console.error(`[AUTH_ERROR] [NextAuth Error] [${code}]:`, metadata);
    },
    warn(code) {
      console.warn(`[AUTH_WARN] [NextAuth Warning] [${code}]`);
    },
  },

  callbacks: {
    async signIn() {
      return true;
    },

    async jwt({ token, user, trigger, session }) {
      try {
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
      } catch (jwtErr) {
        console.error('[AUTH_ERROR] NextAuth JWT callback error:', jwtErr);
        return token;
      }
    },

    async session({ session, token }) {
      try {
        if (session.user) {
          session.user.id = token.id || token.sub;
          session.user.role = token.role || 'user';
          session.user.name = token.name || session.user.name;
          session.user.email = token.email || session.user.email;
          session.user.isVerified = token.isVerified ?? true;
          if (token.picture) session.user.image = token.picture;
        }
        return session;
      } catch (sessErr) {
        console.error('[AUTH_ERROR] NextAuth Session callback error:', sessErr);
        return session;
      }
    },

    async redirect({ url, baseUrl }) {
      const productionBase = 'https://creatorskithub.com';
      const effectiveBase = isProduction ? productionBase : (baseUrl || 'http://localhost:3000');

      let targetUrl = url || effectiveBase;

      if (targetUrl.startsWith('/')) {
        const cleanPath = targetUrl.replace(/^\/+/, '/');
        return `${effectiveBase}${cleanPath}`;
      }

      try {
        const parsed = new URL(targetUrl, effectiveBase);

        const isAllowed =
          parsed.hostname === 'creatorskithub.com' ||
          parsed.hostname.endsWith('.creatorskithub.com') ||
          parsed.hostname === 'localhost' ||
          parsed.hostname === '127.0.0.1';

        if (!isAllowed) {
          return effectiveBase;
        }

        if (isProduction && (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1')) {
          return `${productionBase}${parsed.pathname}${parsed.search}`;
        }

        if (parsed.pathname === '/login' || parsed.pathname === '/register') {
          const nested = parsed.searchParams.get('redirect') || parsed.searchParams.get('callbackUrl');
          if (nested && !nested.startsWith('/login') && !nested.startsWith('/register')) {
            return nested.startsWith('/') ? `${effectiveBase}${nested}` : nested;
          }
          return effectiveBase;
        }

        return parsed.toString();
      } catch (redirectErr) {
        console.error('[AUTH_ERROR] NextAuth Redirect callback error:', redirectErr);
        return effectiveBase;
      }
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: NEXTAUTH_SECRET,
};
