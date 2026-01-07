import 'dotenv/config'

export const config = {
    baseUrl: process.env.API_BASE_URL || 'https://conduit-api.bondaracademy.com/api',
    credentials: {
        email: process.env.USER_EMAIL || '',
        password: process.env.USER_PASSWORD || ''
    },
    timeout: 30000,
    retries: process.env.CI ? 2 : 0
}