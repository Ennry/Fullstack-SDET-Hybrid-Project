import { Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class LoginPage extends BasePage {

    // Use getters so locators are created from the live page instance
    private get emailInput() { return this.page.locator('[placeholder="Email"]') }
    private get passwordInput() { return this.page.locator('[placeholder="Password"]') }
    private get signInButton() { return this.page.locator('button:has-text("Sign in")') }
    private get errorMessages() { return this.page.locator('.error-messages') }

    constructor(page: Page) {
        super(page)
    }

    async goto() {
        await this.navigate('/login')
    }

    async login(email: string, password: string) {
        await this.emailInput.fill(email)
        await this.passwordInput.fill(password)
        await this.signInButton.click()
    }

    async getErrorMessage() {
        return await this.errorMessages.textContent()
    }

    async isErrorVisible() {
        return await this.errorMessages.isVisible()
    }
}