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
        email: requireEnv('USER_EMAIL'),
        password: requireEnv('USER_PASSWORD')
    },
    timeout: 30000,
    retries: process.env.CI ? 2 : 0
}