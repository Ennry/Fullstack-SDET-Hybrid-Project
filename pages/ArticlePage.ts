import { Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class ArticlePage extends BasePage {

    private articleTitle = 'h1'
    private articleBody = '.article-content p'
    private deleteButton = 'button:has-text("Delete Article")'
    private authorName = '.author'

    constructor(page: Page) {
        super(page)
    }

    async goto(slug: string) {
        await this.navigate(`/article/${slug}`)
    }

    async getTitle() {
        return await this.page.textContent(this.articleTitle)
    }

    async getBody() {
        return await this.page.textContent(this.articleBody)
    }

    async getAuthor() {
        return await this.page.textContent(this.authorName)
    }

    async deleteArticle() {
        await this.page.click(this.deleteButton)
    }

    async isArticleVisible() {
        return await this.page.isVisible(this.articleTitle)
    }
}