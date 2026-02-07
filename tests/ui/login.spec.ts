import { test, expect } from '../../utils/fixtures'
import { config } from '../../utils/config'

test.describe('Login Tests @smoke', () => {
    test('Successful login via UI', async ({ page, loginPage }) => {
        await loginPage.goto()
        await loginPage.login(config.credentials.email, config.credentials.password)

        // Wait for redirect away from login
        await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 10000 })

        // Verify logged in — editor link visible
        await expect(page.locator('a[href="/editor"]')).toBeVisible()
        console.log('Login successful')
    })

    test('Failed login with wrong password', async ({ page, loginPage }) => {
        await loginPage.goto()
        await loginPage.login(config.credentials.email, 'wrong-password-123')

        // Wait for error message
        await page.locator('.error-messages').waitFor({ timeout: 10000 })

        const error = await loginPage.getErrorMessage()
        expect(error).toBeTruthy()
        console.log('Error message displayed:', error)
    })

    test('Failed login with empty fields', async ({ page, loginPage }) => {
        await loginPage.goto()
        await loginPage.login('', '')

        // Should stay on login page
        expect(page.url()).toContain('/login')
    })

    test('Failed login with invalid email format', async ({ page, loginPage }) => {
        await loginPage.goto()
        await loginPage.login('not-an-email', 'password123')

        await page.locator('.error-messages').waitFor({ timeout: 10000 })
        const error = await loginPage.getErrorMessage()
        expect(error).toBeTruthy()
    })
})
