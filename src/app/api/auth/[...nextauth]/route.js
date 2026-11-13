import '@/lib/loadEnv';
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

if (process.env.NODE_ENV === 'production') {
  process.env.NEXTAUTH_URL = 'https://creatorskithub.com';
  process.env.NEXTAUTH_URL_INTERNAL = 'https://creatorskithub.com';
}
process.env.AUTH_TRUST_HOST = 'true';

const handler = NextAuth(authOptions);

export async function GET(req, context) {
  try {
    if (context?.params) {
      context.params = await context.params;
    }
    return await handler(req, context);
  } catch (err) {
    console.error('[AUTH_ERROR] NextAuth GET handler error:', err);
    return new Response(
      JSON.stringify({
        error: 'Authentication failed',
        details: err?.message || 'Unknown NextAuth error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function POST(req, context) {
  try {
    if (context?.params) {
      context.params = await context.params;
    }
    return await handler(req, context);
  } catch (err) {
    console.error('[AUTH_ERROR] NextAuth POST handler error:', err);
    return new Response(
      JSON.stringify({
        error: 'Authentication failed',
        details: err?.message || 'Unknown NextAuth error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
