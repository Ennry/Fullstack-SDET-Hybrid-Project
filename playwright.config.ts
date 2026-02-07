import { defineConfig, devices } from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(__dirname, '.env') })

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
        ['html', { outputFolder: 'playwright-report' }],
        ['allure-playwright', { outputFolder: 'allure-results' }]
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
            testDir: './tests/api',
            testMatch: ['*.spec.ts']
        },

        // Performance Tests
        {
            name: 'performance',
            testDir: './tests/performance',
            testMatch: '*.spec.ts'
        },

        // Desktop Browsers
        {
            name: 'chromium',
            testDir: './tests/hybrid',
            testMatch: '*.spec.ts',
            use: { ...devices['Desktop Chrome'] }
        },
        {
            name: 'firefox',
            testDir: './tests/hybrid',
            testMatch: '*.spec.ts',
            use: { ...devices['Desktop Firefox'] }
        },
        {
            name: 'webkit',
            testDir: './tests/hybrid',
            testMatch: '*.spec.ts',
            use: { ...devices['Desktop Safari'] }
        },

        // Mobile Browsers
        {
            name: 'mobile-chrome',
            testDir: './tests/hybrid',
            testMatch: '*.spec.ts',
            use: { ...devices['Pixel 5'] }
        },
        {
            name: 'mobile-safari',
            testDir: './tests/hybrid',
            testMatch: '*.spec.ts',
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
