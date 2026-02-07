import { test as base, Page } from '@playwright/test'
import { ApiHelper } from './apiHelper'
import { config } from './config'
import { StateManager } from './stateManager'
import { LoginPage } from '../pages/LoginPage'
import { ArticlePage } from '../pages/ArticlePage'
import { EditorPage } from '../pages/EditorPage'
import { HomePage } from '../pages/HomePage'

type Fixtures = {
    api: ApiHelper
    authToken: string
    authApi: ApiHelper
    loginPage: LoginPage
    articlePage: ArticlePage
    editorPage: EditorPage
    homePage: HomePage
    authPage: Page
    stateManager: StateManager
}

export const test = base.extend<Fixtures>({
    api: async ({ request }, use) => {
        const api = new ApiHelper(request, config.baseUrl)
        await use(api)
    },

    authToken: async ({ request }, use) => {
        const loginResponse = await request.post(`${config.baseUrl}/users/login`, {
            data: {
                user: {
                    email: config.credentials.email,
                    password: config.credentials.password
                }
            }
        })

        if (!loginResponse.ok()) {
            throw new Error(`Login failed: ${loginResponse.status()}`)
        }

        const loginBody = await loginResponse.json()
        await use(loginBody.user.token)
    },

    authApi: async ({ request, authToken }, use) => {
        const api = new ApiHelper(request, config.baseUrl)
        api.withHeaders({ Authorization: `Token ${authToken}` })
        await use(api)
    },

    authPage: async ({ page, authToken }, use) => {
        await page.goto(config.uiBaseUrl)

        await page.evaluate(token => {
            localStorage.setItem('jwtToken', token)
        }, authToken)

        await page.reload()
        await page.waitForLoadState('networkidle')
        await page.waitForSelector('a[href="/editor"]', { timeout: 10000 })

        await use(page)
    },

    // eslint-disable-next-line no-empty-pattern
    stateManager: async ({}, use) => {
        const state = new StateManager()
        await use(state)
        state.clear()
    },

    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page))
    },

    articlePage: async ({ page }, use) => {
        await use(new ArticlePage(page))
    },

    editorPage: async ({ page }, use) => {
        await use(new EditorPage(page))
    },

    homePage: async ({ page }, use) => {
        await use(new HomePage(page))
    }
})

export { expect } from '@playwright/test'
