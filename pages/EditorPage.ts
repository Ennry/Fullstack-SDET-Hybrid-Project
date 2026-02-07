import { Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class EditorPage extends BasePage {

    private get titleInput() { return this.page.locator('[placeholder="Article Title"]') }
    private get descriptionInput() { return this.page.locator('[placeholder="What\'s this article about?"]') }
    private get bodyInput() { return this.page.locator('[placeholder="Write your article (in markdown)"]') }
    private get tagsInput() { return this.page.locator('[placeholder="Enter tags"]') }
    private get publishButton() { return this.page.locator('button:has-text("Publish")') }

    constructor(page: Page) {
        super(page)
    }

    async goto() {
        await this.navigate('/editor')
    }

    async createArticle(title: string, description: string, body: string, tags: string[] = []) {
        await this.titleInput.fill(title)
        await this.descriptionInput.fill(description)
        await this.bodyInput.fill(body)

        for (const tag of tags) {
            await this.tagsInput.fill(tag)
            await this.tagsInput.press('Enter')
        }

        await this.publishButton.click()
    }

    async getSlugFromUrl() {
        await this.page.waitForURL(/\/article\//)
        const url = this.page.url()
        return url.split('/article/')[1]
    }
}