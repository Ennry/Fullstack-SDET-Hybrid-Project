import { test, expect } from '@playwright/test'

test.describe('Performance Tests @performance', () => {

    // Warmup - For Cold Start
    test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage()
        await page.goto('https://conduit.bondaracademy.com')
        await page.waitForLoadState('networkidle')
        await page.close()
        console.log('✅ Warmup complete')
    })

    test('Home page loads under 5 seconds', async ({ page }) => {
        const start = Date.now()
        await page.goto('https://conduit.bondaracademy.com')
        await page.waitForLoadState('networkidle')
        const loadTime = Date.now() - start

        console.log(`📊 Page load time: ${loadTime}ms`)
        expect(loadTime).toBeLessThan(5000)
    })

    test('Login page loads under 3 seconds', async ({ page }) => {
        const start = Date.now()
        await page.goto('https://conduit.bondaracademy.com/login')
        await page.waitForLoadState('networkidle')
        const loadTime = Date.now() - start

        console.log(`📊 Login page load: ${loadTime}ms`)
        expect(loadTime).toBeLessThan(3000)
    })

    test('API - Articles endpoint under 1 second', async ({ request }) => {
        const start = Date.now()
        await request.get('https://conduit-api.bondaracademy.com/api/articles')
        const responseTime = Date.now() - start

        console.log(`📊 API response time: ${responseTime}ms`)
        expect(responseTime).toBeLessThan(1000)
    })

    test('API - Tags endpoint under 500ms', async ({ request }) => {
        const start = Date.now()
        await request.get('https://conduit-api.bondaracademy.com/api/tags')
        const responseTime = Date.now() - start

        console.log(`📊 Tags API response: ${responseTime}ms`)
        expect(responseTime).toBeLessThan(500)
    })

    test('Articles render under 5 seconds', async ({ page }) => {
        const start = Date.now()
        await page.goto('https://conduit.bondaracademy.com')
        await page.waitForSelector('.article-preview')
        const renderTime = Date.now() - start

        console.log(`📊 Articles render time: ${renderTime}ms`)
        expect(renderTime).toBeLessThan(5000)
    })

})