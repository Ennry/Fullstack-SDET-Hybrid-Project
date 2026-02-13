import { test, expect } from '../../utils/fixtures'

const validArticles = [
    {
        title: 'First Article',
        description: 'First description',
        body: 'First body',
        tagList: ['tag1']
    },
    {
        title: 'Second Article',
        description: 'Second description',
        body: 'Second body',
        tagList: ['tag2', 'tag3']
    },
    {
        title: 'Article with Special Chars!@#',
        description: 'Special description',
        body: 'Special body',
        tagList: []
    }
]

const invalidArticles = [
    {
        name: 'Empty title',
        data: { title: '', description: 'Desc', body: 'Body', tagList: [] as string[] },
        expectedStatus: 422
    },
    {
        name: 'Missing body',
        data: { title: 'Title', description: 'Desc', tagList: [] as string[] },
        expectedStatus: 422
    },
    {
        name: 'Missing description',
        data: { title: 'Title', body: 'Body', tagList: [] as string[] },
        expectedStatus: 422
    }
]

test.describe('Data-Driven Tests @data-driven', () => {
    for (const article of validArticles) {
        test(`Create valid article: "${article.title}" @positive`, async ({ authApi }) => {
            let slug: string | undefined

            try {
                const response = await authApi.path('/articles').postRequest<{ article: { slug: string; description: string } }>(201, {
                    article: {
                        ...article,
                        title: `${article.title} ${Date.now()}`
                    }
                })

                slug = response.article.slug
                expect(response.article).toHaveProperty('slug')
                expect(response.article.description).toBe(article.description)
            } finally {
                if (slug) {
                    await authApi.path(`/articles/${slug}`).deleteRequest()
                }
            }
        })
    }

    for (const testCase of invalidArticles) {
        test(`Reject invalid article: ${testCase.name} @negative`, async ({ authApi }) => {
            await authApi.path('/articles').postRequest(testCase.expectedStatus, {
                article: testCase.data
            })
        })
    }
})
