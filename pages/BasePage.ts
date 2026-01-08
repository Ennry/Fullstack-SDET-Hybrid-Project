import { Page } from '@playwright/test'

export class BasePage {
    protected page: Page
    protected baseUrl = 'https://conduit.bondaracademy.com'

    constructor(page: Page) {
        this.page = page
    }

    async navigate(path: string = '') {
        await this.page.goto(`${this.baseUrl}${path}`)
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle')
    }
}