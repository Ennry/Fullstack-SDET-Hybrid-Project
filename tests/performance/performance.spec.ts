import { test, expect } from '@playwright/test'
import { config } from '../../utils/config'

test.describe('Performance Tests @performance', () => {

    test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage()
        await page.goto(config.uiBaseUrl)
        await page.waitForLoadState('networkidle')
        await page.close()
        console.log('Warmup complete')
    })

    test('Home page loads under 5 seconds', async ({ page }) => {
        await page.goto(config.uiBaseUrl)
        await page.waitForLoadState('load')

        const perfTiming = await page.evaluate(() => {
            const timing = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
            return {
                domContentLoaded: Math.round(timing.domContentLoadedEventEnd - timing.startTime),
                fullLoad: Math.round(timing.loadEventEnd - timing.startTime),
                ttfb: Math.round(timing.responseStart - timing.requestStart)
            }
        })

        console.log(`TTFB: ${perfTiming.ttfb}ms`)
        console.log(`DOM Loaded: ${perfTiming.domContentLoaded}ms`)
        console.log(`Full Load: ${perfTiming.fullLoad}ms`)

        expect(perfTiming.fullLoad).toBeLessThan(5000)
    })

    test('Login page loads under 3 seconds', async ({ page }) => {
        await page.goto(`${config.uiBaseUrl}/login`)
        await page.waitForLoadState('load')

        const perfTiming = await page.evaluate(() => {
            const timing = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
            return {
                fullLoad: Math.round(timing.loadEventEnd - timing.startTime)
            }
        })

        console.log(`Login page load: ${perfTiming.fullLoad}ms`)
        expect(perfTiming.fullLoad).toBeLessThan(3000)
    })

    test('API - Articles endpoint under 1 second', async ({ request }) => {
        const start = Date.now()
        await request.get(`${config.baseUrl}/articles`)
        const responseTime = Date.now() - start

        console.log(`API response time: ${responseTime}ms`)
        expect(responseTime).toBeLessThan(1000)
    })

    test('API - Tags endpoint under 500ms', async ({ request }) => {
        const start = Date.now()
        await request.get(`${config.baseUrl}/tags`)
        const responseTime = Date.now() - start

        console.log(`Tags API response: ${responseTime}ms`)
        expect(responseTime).toBeLessThan(500)
    })

    test('Articles render under 5 seconds', async ({ page }) => {
        const start = Date.now()
        await page.goto(config.uiBaseUrl)
        await page.locator('.article-preview').first().waitFor({ timeout: 5000 })
        const renderTime = Date.now() - start

        console.log(`Articles render time: ${renderTime}ms`)
        expect(renderTime).toBeLessThan(5000)
    })

})