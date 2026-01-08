import { Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class LoginPage extends BasePage {

    private emailInput = '[placeholder="Email"]'
    private passwordInput = '[placeholder="Password"]'
    private signInButton = 'button:has-text("Sign in")'
    private errorMessages = '.error-messages'

    constructor(page: Page) {
        super(page)
    }

    async goto() {
        await this.navigate('/login')
    }

    async login(email: string, password: string) {
        await this.page.fill(this.emailInput, email)
        await this.page.fill(this.passwordInput, password)
        await this.page.click(this.signInButton)
    }

    async getErrorMessage() {
        return await this.page.textContent(this.errorMessages)
    }
}