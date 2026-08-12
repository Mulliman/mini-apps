import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('.', import.meta.url));
const brandingDir = resolve(rootDir, 'apps/shared/branding');

const BRANDING_MIME: Record<string, string> = {
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const PUBLIC_MIME: Record<string, string> = {
  ...BRANDING_MIME,
  '.json': 'application/json',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.txt': 'text/plain',
};

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'root-redirect',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/') {
            res.statusCode = 302;
            res.setHeader('Location', '/apps/homepage/index.html');
            res.end();
          } else {
            next();
          }
        });
      }
    },
    {
      // The deploy build copies apps/shared/branding to /branding/, and every
      // app's favicon points there. Serving it from the same path in dev keeps
      // the icons from being silently missing while developing.
      name: 'shared-branding',
      configureServer(server) {
        server.middlewares.use('/branding', (req, res, next) => {
          const name = (req.url || '/').split('?')[0].replace(/^\/+/, '');
          const file = join(brandingDir, name);
          if (!name || !file.startsWith(brandingDir) || !existsSync(file) || !statSync(file).isFile()) {
            next();
            return;
          }
          res.setHeader('Content-Type', BRANDING_MIME[extname(file).toLowerCase()] || 'application/octet-stream');
          createReadStream(file).pipe(res);
        });
      }
    },
    {
      // Each app's own Vite server publishes its `public/` at that app's web root,
      // and the deploy build copies it in the same place. The monorepo-wide dev
      // server sees the raw source tree instead, so those files would 404 here and
      // only here. Fall back to `<app>/public/<rest>` to keep dev honest.
      name: 'app-public-fallback',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = (req.url || '').split('?')[0];
          const match = /^\/apps\/([^/]+)\/([^/]+)\/(.+)$/.exec(url);
          if (!match) return next();

          const [, category, app, rest] = match;
          const appDir = resolve(rootDir, 'apps', category, app);
          if (existsSync(join(appDir, rest))) return next();

          const publicFile = join(appDir, 'public', rest);
          if (!publicFile.startsWith(join(appDir, 'public')) || !existsSync(publicFile) || !statSync(publicFile).isFile()) {
            return next();
          }

          res.setHeader('Content-Type', PUBLIC_MIME[extname(publicFile).toLowerCase()] || 'application/octet-stream');
          createReadStream(publicFile).pipe(res);
        });
      }
    }
  ]
});
