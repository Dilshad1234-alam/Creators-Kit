import { NextResponse } from 'next/server';
import '@/lib/loadEnv';
import dbConnect from '@/lib/mongodb';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    await dbConnect();
    const cwd = process.cwd();
    const checked = [
      path.join(cwd, '.env'),
      path.join(cwd, '.env.production'),
      path.join(cwd, '.env.local'),
      path.join(cwd, '..', '.env'),
      path.join(cwd, '..', '.env.production'),
      path.join(cwd, '..', '.env.local'),
      '/home/u633803084/domains/creatorskithub.com/.env',
      '/home/u633803084/domains/creatorskithub.com/public_html/.env',
    ];
    const found = checked.filter(p => {
      try { return fs.existsSync(p); } catch { return false; }
    });

    return NextResponse.json({
      message: 'Database connected successfully',
      cwd,
      found_env_files: found,
      node_env: process.env.NODE_ENV || 'undefined',
      nextauth_url: process.env.NEXTAUTH_URL || 'undefined',
      auth_trust_host: process.env.AUTH_TRUST_HOST || 'undefined',
      has_google_id: !!(process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID),
      has_google_secret: !!process.env.GOOGLE_CLIENT_SECRET,
      has_nextauth_secret: !!process.env.NEXTAUTH_SECRET,
      has_mongodb_uri: !!process.env.MONGODB_URI,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed', details: error.message },
      { status: 500 }
    );
  }
}
