import { Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class HomePage extends BasePage {
    // Locators
    private articleLinks = '.article-preview h1'
    private tagList = '.tag-list'
    private tagPill = '.tag-list .tag-pill'
    private navUsername = '.nav-link:has-text("Your Feed")'

    constructor(page: Page) {
        super(page)
    }

    async goto() {
        await this.navigate('/')
        await this.page.waitForLoadState('networkidle')
    }

    async getArticleTitles() {
        return await this.page.locator(this.articleLinks).allTextContents()
    }

    async getTags() {
    await this.page.waitForSelector(this.tagList, { timeout: 10000 })
    const tags = await this.page.locator(this.tagPill).allTextContents()
    // Trim whitespace
    return tags.map(tag => tag.trim())
}

    async clickTag(tagName: string) {
        await this.page.click(`.tag-pill:has-text("${tagName}")`)
    }

    async isLoggedIn() {
        return await this.page.isVisible(this.navUsername)
    }
}