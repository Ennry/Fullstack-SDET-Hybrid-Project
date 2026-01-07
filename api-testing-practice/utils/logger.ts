type LogLevel = 'INFO' | 'SUCCESS' | 'ERROR' | 'REQUEST' | 'RESPONSE'

const getTimestamp = (): string => {
    return new Date().toISOString()
}

const formatMessage = (level: LogLevel, emoji: string, message: string): string => {
    return `${emoji} [${level}] ${getTimestamp()} - ${message}`
}

export const logger = {
    info: (message: string): void => {
        console.log(formatMessage('INFO', 'ℹ️ ', message))
    },

    success: (message: string): void => {
        console.log(formatMessage('SUCCESS', '✅', message))
    },

    error: (message: string): void => {
        console.log(formatMessage('ERROR', '❌', message))
    },

    request: (method: string, url: string, body?: object): void => {
        console.log(formatMessage('REQUEST', '🔄', `${method} ${url}`))
        if (body) {
            console.log(`   📦 Body: ${JSON.stringify(body, null, 2)}`)
        }
    },

    response: (status: number, body?: object): void => {
        const emoji = status < 400 ? '📥' : '⚠️'
        console.log(formatMessage('RESPONSE', emoji, `Status: ${status}`))
        if (body) {
            console.log(`   📦 Body: ${JSON.stringify(body, null, 2)}`)
        }
    }
}