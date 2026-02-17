import 'dotenv/config'

function requireEnv(key: string): string {
    const value = process.env[key]
    if (!value) {
        throw new Error(
            `Missing required env variable: ${key}\n` +
                `Please set it in your .env file or CI environment.`
        )
    }
    return value
}

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
