import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:5174',
    viewport: { width: 1440, height: 1000 },
    trace: 'retain-on-failure',
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : {},
  },
  webServer: [
    {
      command: 'npm run dev:mock -- --host 127.0.0.1 --port 5174 --strictPort',
      url: 'http://127.0.0.1:5174',
      env: { VITE_USE_MOCK_API: 'true', VITE_MOCK_ROLE: 'eboard' },
    },
    {
      command: 'npm run dev -- --host 127.0.0.1 --port 5175 --strictPort',
      url: 'http://127.0.0.1:5175',
      env: {
        VITE_USE_MOCK_API: 'false',
        VITE_API_BASE_URL: 'http://127.0.0.1:5175/backend',
        VITE_COGNITO_ISSUER: 'http://127.0.0.1:5175/oidc',
        VITE_COGNITO_CLIENT_ID: 'normal-mode-test',
        VITE_COGNITO_REDIRECT_URI: 'http://127.0.0.1:5175/auth',
      },
    },
  ],
});
