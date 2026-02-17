import 'dotenv/config'

export const config = {
    baseUrl: process.env.API_BASE_URL || 'https://conduit-api.bondaracademy.com/api',
    uiBaseUrl: process.env.UI_BASE_URL || 'https://conduit.bondaracademy.com',
    credentials: {
        email: process.env.USER_EMAIL || 'test-user@example.com',
        password: process.env.USER_PASSWORD || 'test-password'
    },
    timeout: 30000,
    retries: process.env.CI ? 2 : 0
}
