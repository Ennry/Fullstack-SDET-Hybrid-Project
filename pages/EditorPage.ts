import { Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class EditorPage extends BasePage {
    
    private titleInput = '[placeholder="Article Title"]'
    private descriptionInput = '[placeholder="What\'s this article about?"]'
    private bodyInput = '[placeholder="Write your article (in markdown)"]'
    private tagsInput = '[placeholder="Enter tags"]'
    private publishButton = 'button:has-text("Publish")'

    constructor(page: Page) {
        super(page)
    }

    async goto() {
        await this.navigate('/editor')
    }

    async createArticle(title: string, description: string, body: string, tags: string[] = []) {
        await this.page.fill(this.titleInput, title)
        await this.page.fill(this.descriptionInput, description)
        await this.page.fill(this.bodyInput, body)

        for (const tag of tags) {
            await this.page.fill(this.tagsInput, tag)
            await this.page.press(this.tagsInput, 'Enter')
        }

        await this.page.click(this.publishButton)
    }

    async getSlugFromUrl() {
        await this.page.waitForURL(/\/article\//)
        const url = this.page.url()
        return url.split('/article/')[1]
    }
}