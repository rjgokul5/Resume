import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  timeout: 30000,
  use: { baseURL: 'http://127.0.0.1:4173', headless: true },
  webServer: {
    command: 'npm run preview -- --port 4173 --strictPort --base /Resume/',
    url: 'http://127.0.0.1:4173/Resume/',
    reuseExistingServer: !process.env.CI,
  },
});
