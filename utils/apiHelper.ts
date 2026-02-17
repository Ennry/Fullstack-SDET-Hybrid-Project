import { APIRequestContext, APIResponse } from '@playwright/test'
import { logger } from './logger'

export interface ArticleResponse {
    article: {
        slug: string
        title: string
        description: string
        body: string
        tagList: string[]
        createdAt: string
        updatedAt: string
        favorited: boolean
        favoritesCount: number
        author: {
            username: string
            bio: string | null
            image: string
            following: boolean
        }
    }
}

export interface ArticlesResponse {
    articles: ArticleResponse['article'][]
    articlesCount: number
}

export interface TagsResponse {
    tags: string[]
}

export interface ErrorResponse {
    errors: Record<string, string[]>
}

export class ApiHelper {
    private request: APIRequestContext
    private baseUrl: string
    private endpoint: string = ''
    private headers: Record<string, string> = {}
    private retryCount: number = 3
    private retryDelay: number = 1000

    constructor(request: APIRequestContext, baseUrl: string) {
        this.request = request
        this.baseUrl = baseUrl
    }

    private buildUrl(): string {
        return `${this.baseUrl}${this.endpoint}`
    }

    withRetry(count: number, delayMs: number = 1000): this {
        this.retryCount = count
        this.retryDelay = delayMs
        return this
    }

    private async executeWithRetry<T>(
        operation: () => Promise<T>,
        operationName: string
    ): Promise<T> {
        let lastError: Error | null = null

        for (let attempt = 1; attempt <= this.retryCount; attempt++) {
            try {
                return await operation()
            } catch (error) {
                lastError = error as Error
                if (attempt < this.retryCount) {
                    logger.info(
                        `${operationName} failed (attempt ${attempt}/${this.retryCount}), retrying in ${this.retryDelay}ms...`
                    )
                    await new Promise(resolve => setTimeout(resolve, this.retryDelay))
                }
            }
        }

        throw lastError
    }

    private async handleResponse<T>(response: APIResponse, expectedStatus: number): Promise<T> {
        const url = this.buildUrl()
        const status = response.status()

        this.endpoint = ''

        if (status !== expectedStatus) {
            const body = await response.text()
            logger.error(`Expected ${expectedStatus}, got ${status}`)
            throw new Error(
                `Expected ${expectedStatus}, got ${status}\n` +
                    `URL: ${url}\n` +
                    `Response: ${body}`
            )
        }

        if (expectedStatus === 204) {
            logger.response(status)
            return null as T
        }

        const json = await response.json()
        logger.response(status)
        return json as T
    }

    withHeaders(headers: Record<string, string>): this {
        this.headers = { ...this.headers, ...headers }
        return this
    }

    path(endpoint: string): this {
        this.endpoint = endpoint
        return this
    }

    async getRequest<T = unknown>(expectedStatus: number = 200): Promise<T> {
        const url = this.buildUrl()
        return this.executeWithRetry(async () => {
            logger.request('GET', url)
            const response = await this.request.get(url, {
                headers: this.headers
            })
            return this.handleResponse<T>(response, expectedStatus)
        }, `GET ${url}`)
    }

    async postRequest<T = unknown>(expectedStatus: number = 201, body: object): Promise<T> {
        const url = this.buildUrl()
        return this.executeWithRetry(async () => {
            logger.request('POST', url, body)
            const response = await this.request.post(url, {
                data: body,
                headers: this.headers
            })
            return this.handleResponse<T>(response, expectedStatus)
        }, `POST ${url}`)
    }

    async putRequest<T = unknown>(expectedStatus: number = 200, body: object): Promise<T> {
        const url = this.buildUrl()
        return this.executeWithRetry(async () => {
            logger.request('PUT', url, body)
            const response = await this.request.put(url, {
                data: body,
                headers: this.headers
            })
            return this.handleResponse<T>(response, expectedStatus)
        }, `PUT ${url}`)
    }

    async patchRequest<T = unknown>(expectedStatus: number = 200, body: object): Promise<T> {
        const url = this.buildUrl()
        return this.executeWithRetry(async () => {
            logger.request('PATCH', url, body)
            const response = await this.request.patch(url, {
                data: body,
                headers: this.headers
            })
            return this.handleResponse<T>(response, expectedStatus)
        }, `PATCH ${url}`)
    }

    async deleteRequest<T = unknown>(expectedStatus: number = 204): Promise<T> {
        const url = this.buildUrl()
        return this.executeWithRetry(async () => {
            logger.request('DELETE', url)
            const response = await this.request.delete(url, {
                headers: this.headers
            })
            return this.handleResponse<T>(response, expectedStatus)
        }, `DELETE ${url}`)
    }
}
