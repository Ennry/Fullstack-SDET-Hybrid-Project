import { Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class ArticlePage extends BasePage {

    private get articleTitle() { return this.page.locator('h1') }
    private get articleBody() { return this.page.locator('.article-content p') }
    private get deleteButton() { return this.page.locator('button:has-text("Delete Article")') }
    private get authorName() { return this.page.locator('.author') }

    constructor(page: Page) {
        super(page)
    }

    async goto(slug: string) {
        await this.navigate(`/article/${slug}`)
    }

    async getTitle() {
        return await this.articleTitle.textContent()
    }

    async getBody() {
        return await this.articleBody.textContent()
    }

    async getAuthor() {
        return await this.authorName.textContent()
    }

    async deleteArticle() {
        await this.deleteButton.click()
    }

    async isArticleVisible() {
        return await this.articleTitle.isVisible()
    }
}