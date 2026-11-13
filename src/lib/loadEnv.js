import fs from 'fs';
import path from 'path';

let loaded = false;

export function loadProductionEnv() {
  if (loaded) return;
  loaded = true;

  const cwd = process.cwd();
  const candidates = new Set();

  // 1. Current working directory and parent paths up to root
  let currentDir = cwd;
  for (let i = 0; i < 6; i++) {
    candidates.add(path.join(currentDir, '.env'));
    candidates.add(path.join(currentDir, '.env.production'));
    candidates.add(path.join(currentDir, '.env.local'));
    const parent = path.dirname(currentDir);
    if (parent === currentDir) break;
    currentDir = parent;
  }

  // 2. Specific Hostinger paths based on server structure
  const hostingerPaths = [
    '/home/u633803084/domains/creatorskithub.com/.env',
    '/home/u633803084/domains/creatorskithub.com/.env.production',
    '/home/u633803084/domains/creatorskithub.com/.env.local',
    '/home/u633803084/domains/creatorskithub.com/public_html/.env',
    '/home/u633803084/domains/creatorskithub.com/public_html/.env.production',
    '/home/u633803084/domains/creatorskithub.com/hbuilds/.env',
    '/home/u633803084/.env',
  ];

  for (const hp of hostingerPaths) {
    candidates.add(hp);
  }

  // Parse each candidate env file safely
  for (const envPath of candidates) {
    try {
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        const lines = content.split(/\r?\n/);
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) continue;
          const eqIdx = trimmed.indexOf('=');
          if (eqIdx > 0) {
            const key = trimmed.slice(0, eqIdx).trim();
            let val = trimmed.slice(eqIdx + 1).trim();
            if (
              (val.startsWith('"') && val.endsWith('"')) ||
              (val.startsWith("'") && val.endsWith("'"))
            ) {
              val = val.slice(1, -1);
            }
            if (!process.env[key] && val) {
              process.env[key] = val;
            }
          }
        }
      }
    } catch (e) {
      // Ignore unreadable paths
    }
  }

  // 3. Guarantee critical Production and Auth configurations
  const isProd = process.env.NODE_ENV === 'production';

  if (isProd) {
    process.env.NEXTAUTH_URL = 'https://creatorskithub.com';
    process.env.NEXTAUTH_URL_INTERNAL = 'https://creatorskithub.com';
  } else if (!process.env.NEXTAUTH_URL) {
    process.env.NEXTAUTH_URL = 'http://localhost:3000';
  }

  // Always enforce reverse-proxy trust host for Hostinger Nginx / Cloudflare
  process.env.AUTH_TRUST_HOST = 'true';

  // Fallback for NextAuth / JWT secret
  if (!process.env.NEXTAUTH_SECRET) {
    process.env.NEXTAUTH_SECRET = '9569bbd37859d9e4d925e16947b6f9a794afe5d929f473be9d21195f690a94ee';
  }
  if (!process.env.AUTH_SECRET) {
    process.env.AUTH_SECRET = process.env.NEXTAUTH_SECRET;
  }
  if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = process.env.NEXTAUTH_SECRET;
  }
}

// Auto-run once on module import
loadProductionEnv();
