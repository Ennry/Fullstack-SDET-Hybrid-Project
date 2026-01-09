import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report' }]
  ],

  use: {
    baseURL: 'https://conduit.bondaracademy.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },

  projects: [
    // API Tests
    {
      name: 'api-tests',
      testMatch: ['api.spec.ts', 'data-driven.spec.ts', 'error-handling.spec.ts']
    },

    // Performance Tests
    {
      name: 'performance',
      testMatch: 'performance.spec.ts'
    },

    // Desktop Browsers
    {
      name: 'chromium',
      testMatch: 'hybrid.spec.ts',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      testMatch: 'hybrid.spec.ts',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      testMatch: 'hybrid.spec.ts',
      use: { ...devices['Desktop Safari'] }
    },

    // Mobile Browsers
    {
      name: 'mobile-chrome',
      testMatch: 'hybrid.spec.ts',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'mobile-safari',
      testMatch: 'hybrid.spec.ts',
      use: { ...devices['iPhone 12'] }
    }
  ]
})

/* Run your local dev server before starting the tests */
// webServer: {
//   command: 'npm run start',
//   url: 'http://localhost:3000',
//   reuseExistingServer: !process.env.CI,
// },