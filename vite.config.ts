import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    {
      name: 'design-mode-worker',
      // Serve MSW directly from the installed package, only in opt-in dev mode.
      // Nothing is copied into public/ or shipped in dist/.
      apply: 'serve',
      configureServer(server) {
        const env = loadEnv(mode, process.cwd(), 'VITE_');
        if ((process.env.VITE_USE_MOCK_API ?? env.VITE_USE_MOCK_API) !== 'true') return;
        const require = createRequire(import.meta.url);
        const worker = readFileSync(require.resolve('msw/mockServiceWorker.js'));
        server.middlewares.use('/mockServiceWorker.js', (_req, res) => {
          res.setHeader('Content-Type', 'application/javascript');
          res.setHeader('Cache-Control', 'no-store');
          res.end(worker);
        });
      },
    },
  ],
}))
