/**
 * K6 Load Testing Script
 *
 * Prerequisites:
 * 1. Install k6: https://k6.io/docs/getting-started/installation/
 *    - Windows: choco install k6
 *    - macOS: brew install k6
 *    - Linux: sudo apt install k6
 *
 * 2. Run this script:
 *    k6 run load-tests/articles-load.js
 *
 * 3. Run with options:
 *    k6 run --vus 50 --duration 1m load-tests/articles-load.js
 */

import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate, Trend } from 'k6/metrics'
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js'

// Custom metrics
const errorRate = new Rate('errors')
const articleLoadTime = new Trend('article_load_time')

// Test configuration
export const options = {
    stages: [
        { duration: '30s', target: 10 },
        { duration: '1m', target: 10 },
        { duration: '30s', target: 50 },
        { duration: '1m', target: 50 },
        { duration: '30s', target: 0 }
    ],
    thresholds: {
        http_req_duration: ['p(95)<2000'],
        errors: ['rate<0.1']
    }
}

const BASE_URL = 'https://conduit-api.bondaracademy.com/api'

export default function () {
    // Test 1: Get Articles
    const articlesResponse = http.get(`${BASE_URL}/articles?limit=10`)

    check(articlesResponse, {
        'articles status is 200': r => r.status === 200,
        'articles response time < 2000ms': r => r.timings.duration < 2000,
        'articles has data': r => {
            try {
                return JSON.parse(r.body).articles.length > 0
            } catch {
                return false
            }
        }
    })

    articleLoadTime.add(articlesResponse.timings.duration)
    errorRate.add(articlesResponse.status !== 200)

    sleep(1)

    // Test 2: Get Tags
    const tagsResponse = http.get(`${BASE_URL}/tags`)

    check(tagsResponse, {
        'tags status is 200': r => r.status === 200,
        'tags response time < 1000ms': r => r.timings.duration < 1000,
        'tags has data': r => {
            try {
                return JSON.parse(r.body).tags.length > 0
            } catch {
                return false
            }
        }
    })

    errorRate.add(tagsResponse.status !== 200)

    sleep(1)

    // Test 3: Get Single Article (if articles exist)
    try {
        const articles = JSON.parse(articlesResponse.body).articles
        if (articles.length > 0) {
            const slug = articles[0].slug
            const singleArticleResponse = http.get(`${BASE_URL}/articles/${slug}`)

            check(singleArticleResponse, {
                'single article status is 200': r => r.status === 200,
                'single article has slug': r => {
                    try {
                        return JSON.parse(r.body).article.slug === slug
                    } catch {
                        return false
                    }
                }
            })

            errorRate.add(singleArticleResponse.status !== 200)
        }
    } catch {
        errorRate.add(true)
    }

    sleep(1)
}

export function handleSummary(data) {
    return {
        'load-tests/summary.json': JSON.stringify(data, null, 2),
        stdout: textSummary(data, { indent: ' ', enableColors: true })
    }
}
