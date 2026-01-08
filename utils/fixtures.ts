import { test as base, Page } from '@playwright/test'
import { ApiHelper } from './apiHelper'
import { config } from './config'
import { LoginPage } from '../pages/LoginPage'
import { ArticlePage } from '../pages/ArticlePage'
import { EditorPage } from '../pages/EditorPage'
import { HomePage } from '../pages/HomePage'

type Fixtures = {
    api: ApiHelper
    authApi: ApiHelper
    loginPage: LoginPage
    articlePage: ArticlePage
    editorPage: EditorPage
    homePage: HomePage
    authPage: Page
}

export const test = base.extend<Fixtures>({

    api: async ({ request }, use) => {
        const api = new ApiHelper(request, config.baseUrl)
        await use(api)
    },

    authApi: async ({ request }, use) => {
        const api = new ApiHelper(request, config.baseUrl)

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
        const token = loginBody.user.token

        api.withHeaders({ Authorization: `Token ${token}` })
        await use(api)
    },

    authPage: async ({ page, request }, use) => {
        // Login via API (faster!)
        const loginResponse = await request.post(`${config.baseUrl}/users/login`, {
            data: {
                user: {
                    email: config.credentials.email,
                    password: config.credentials.password
                }
            }
        })

        const loginBody = await loginResponse.json()
        const token = loginBody.user.token

        // Set token in browser
        await page.goto('https://conduit.bondaracademy.com')
        await page.evaluate((token) => {
            localStorage.setItem('jwtToken', token)
        }, token)

        await page.reload()
        await use(page)
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