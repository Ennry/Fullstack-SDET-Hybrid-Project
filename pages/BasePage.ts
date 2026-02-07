import { Page } from '@playwright/test'
import { config } from '../utils/config'

export class BasePage {
    protected page: Page
    protected baseUrl = config.uiBaseUrl

    constructor(page: Page) {
        this.page = page
    }

    async navigate(path: string = '') {
        await this.page.goto(`${this.baseUrl}${path}`)
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle')
    }

    async getTitle() {
        return await this.page.title()
    }
}