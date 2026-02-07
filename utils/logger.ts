type LogLevel = 'INFO' | 'SUCCESS' | 'ERROR' | 'REQUEST' | 'RESPONSE'

const getTimestamp = (): string => {
    return new Date().toISOString()
}

const formatMessage = (level: LogLevel, message: string): string => {
    return `[${level}] ${getTimestamp()} - ${message}`
}

export const logger = {
    info: (message: string): void => {
        console.log(formatMessage('INFO', message))
    },

    success: (message: string): void => {
        console.log(formatMessage('SUCCESS', message))
    },

    error: (message: string): void => {
        console.error(formatMessage('ERROR', message))
    },

    request: (method: string, url: string, body?: object): void => {
        console.log(formatMessage('REQUEST', `${method} ${url}`))
        if (body) {
            console.log(`Body: ${JSON.stringify(body, null, 2)}`)
        }
    },

    response: (status: number, body?: object): void => {
        console.log(formatMessage('RESPONSE', `Status: ${status}`))
        if (body) {
            console.log(`Body: ${JSON.stringify(body, null, 2)}`)
        }
    }
}
