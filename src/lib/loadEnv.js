import fs from 'fs';
import path from 'path';

let loaded = false;

export function loadProductionEnv() {
  if (loaded) return;
  loaded = true;

  const cwd = process.cwd();
  const candidates = [
    path.join(cwd, '.env'),
    path.join(cwd, '.env.production'),
    path.join(cwd, '.env.local'),
    path.join(cwd, '..', '.env'),
    path.join(cwd, '..', '.env.production'),
    path.join(cwd, '..', '.env.local'),
  ];

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
      // Ignore
    }
  }
}

// Auto-run once on module import
loadProductionEnv();

