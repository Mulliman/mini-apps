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
    }
  ]
});
