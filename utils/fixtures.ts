import { test as base } from '@playwright/test'
import { ApiHelper } from './apiHelper'
import { config } from './config'

const BASE_URL = config.baseUrl
const USER_EMAIL = config.credentials.email
const USER_PASSWORD = config.credentials.password

type ApiFixtures = {
    api: ApiHelper
    authApi: ApiHelper
}

export const test = base.extend<ApiFixtures>({

    api: async ({ request }, use) => {
        const api = new ApiHelper(request, BASE_URL)
        await use(api)
    },

    authApi: async ({ request }, use) => {
        const api = new ApiHelper(request, BASE_URL)

        const loginResponse = await request.post(`${BASE_URL}/users/login`, {
            data: {
                user: {
                    email: USER_EMAIL,
                    password: USER_PASSWORD
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

})

export { expect } from '@playwright/test'