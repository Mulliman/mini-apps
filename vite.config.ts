import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
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
    }
  ]
});
