import { Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class HomePage extends BasePage {

    private get articleLinks() { return this.page.locator('.article-preview h1') }
    private get tagList() { return this.page.locator('.sidebar .tag-list') }
    // Try multiple possible selectors for tag pills
    private get tagPills() { return this.page.locator('.sidebar .tag-list a') }
    private get navUsername() { return this.page.locator('.nav-link:has-text("Your Feed")') }

    constructor(page: Page) {
        super(page)
    }

    async goto() {
        await this.navigate('/')
        await this.page.waitForLoadState('networkidle')
    }

    async getArticleTitles() {
        return await this.articleLinks.allTextContents()
    }

    async getTags() {
        // Wait for the sidebar tag list container
        await this.tagList.waitFor({ state: 'visible', timeout: 15000 })

        // Wait for at least one tag pill to appear inside it
        await this.tagPills.first().waitFor({ state: 'visible', timeout: 15000 })

        const tags = await this.tagPills.allTextContents()
        return tags.map(tag => tag.trim()).filter(tag => tag.length > 0)
    }

    async clickTag(tagName: string) {
        await this.page.locator(`.sidebar .tag-list a:has-text("${tagName}")`).click()
    }

    async isLoggedIn() {
        return await this.navUsername.isVisible()
    }
}