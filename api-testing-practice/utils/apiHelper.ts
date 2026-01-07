import { APIRequestContext } from '@playwright/test'
import { logger } from './logger'

export class ApiHelper {
    private request: APIRequestContext
    private baseUrl: string
    private endpoint: string = ''
    private headers: Record<string, string> = {}

    constructor(request: APIRequestContext, baseUrl: string) {
        this.request = request
        this.baseUrl = baseUrl
    }

    private buildUrl(): string {
        return `${this.baseUrl}${this.endpoint}`
    }

    private async handleResponse(response: any, expectedStatus: number): Promise<any> {
        const status = response.status()
        
        if (status !== expectedStatus) {
            const body = await response.text()
            logger.error(`Expected ${expectedStatus}, got ${status}`)
            throw new Error(
                `Expected ${expectedStatus}, got ${status}\n` +
                `URL: ${this.buildUrl()}\n` +
                `Response: ${body}`
            )
        }

        if (expectedStatus === 204) {
            logger.response(status)
            return null
        }

        const json = await response.json()
        logger.response(status)
        return json
    }

    withHeaders(headers: Record<string, string>): this {
        this.headers = { ...this.headers, ...headers }
        return this
    }

    path(endpoint: string): this {
        this.endpoint = endpoint
        return this
    }

    async getRequest(expectedStatus: number = 200): Promise<any> {
        logger.request('GET', this.buildUrl())
        const response = await this.request.get(this.buildUrl(), { 
            headers: this.headers 
        })
        return this.handleResponse(response, expectedStatus)
    }

    async postRequest(expectedStatus: number = 201, body: object): Promise<any> {
        logger.request('POST', this.buildUrl(), body)
        const response = await this.request.post(this.buildUrl(), { 
            data: body, 
            headers: this.headers 
        })
        return this.handleResponse(response, expectedStatus)
    }

    async putRequest(expectedStatus: number = 200, body: object): Promise<any> {
        logger.request('PUT', this.buildUrl(), body)
        const response = await this.request.put(this.buildUrl(), { 
            data: body, 
            headers: this.headers 
        })
        return this.handleResponse(response, expectedStatus)
    }

    async patchRequest(expectedStatus: number = 200, body: object): Promise<any> {
        logger.request('PATCH', this.buildUrl(), body)
        const response = await this.request.patch(this.buildUrl(), { 
            data: body, 
            headers: this.headers 
        })
        return this.handleResponse(response, expectedStatus)
    }

    async deleteRequest(expectedStatus: number = 204): Promise<any> {
        logger.request('DELETE', this.buildUrl())
        const response = await this.request.delete(this.buildUrl(), { 
            headers: this.headers 
        })
        return this.handleResponse(response, expectedStatus)
    }
}