import { test, expect } from '../../utils/fixtures'
import { validateSchema } from '../../utils/schemaValidator'
import articleSchema from '../../schemas/article.schema.json'
import articlesSchema from '../../schemas/articles.schema.json'
import tagsSchema from '../../schemas/tags.schema.json'
import { dataFactory } from '../../utils/dataFactory'

test.describe('Conduit API', () => {
    test('GET - Fetch Tags @smoke @schema', async ({ api }) => {
        const response = await api.path('/tags').getRequest<{ tags: string[] }>()

        const { valid, errors } = validateSchema(tagsSchema, response)
        expect(valid, `Schema errors: ${errors}`).toBe(true)
        expect(response.tags.length).toBeGreaterThan(0)
    })

    test('GET - Fetch Articles @smoke @schema', async ({ api }) => {
        const response = await api
            .path('/articles')
            .getRequest<{ articles: Array<{ slug: string; title: string; description: string }> }>()

        const { valid, errors } = validateSchema(articlesSchema, response)
        expect(valid, `Schema errors: ${errors}`).toBe(true)
        expect(response).toHaveProperty('articles')
    })

    test('CRUD - Full Article Lifecycle @crud @schema', async ({ authApi }) => {
        let slug: string | undefined
        let updatedSlug: string | undefined

        try {
            // CREATE
            const createBody = await authApi.path('/articles').postRequest<{
                article: { slug: string; title: string; description: string }
            }>(201, dataFactory.article('CRUD'))

            const createValidation = validateSchema(articleSchema, createBody)
            expect(createValidation.valid, `Schema errors: ${createValidation.errors}`).toBe(true)

            slug = createBody.article.slug
            console.log('CREATE:', slug)
            expect(createBody.article.title).toContain('CRUD Article')

            // READ
            const readBody = await authApi
                .path(`/articles/${slug}`)
                .getRequest<{ article: { slug: string; title: string; description: string } }>()

            const readValidation = validateSchema(articleSchema, readBody)
            expect(readValidation.valid, `Schema errors: ${readValidation.errors}`).toBe(true)

            console.log('READ:', readBody.article.slug)
            expect(readBody.article.slug).toBe(slug)

            // UPDATE
            const updateBody = await authApi.path(`/articles/${slug}`).putRequest<{
                article: { slug: string; title: string; description: string }
            }>(200, dataFactory.updateArticle('Updated'))

            const updateValidation = validateSchema(articleSchema, updateBody)
            expect(updateValidation.valid, `Schema errors: ${updateValidation.errors}`).toBe(true)

            updatedSlug = updateBody.article.slug
            console.log('UPDATE:', updatedSlug)
            expect(updateBody.article.description).toBe('Updated description')

            // DELETE
            await authApi.path(`/articles/${updatedSlug}`).deleteRequest()

            slug = undefined
            updatedSlug = undefined
            console.log('DELETE: Done')

            // VERIFY DELETION
            const allArticles = await authApi
                .path('/articles')
                .getRequest<{ articles: Array<{ slug: string }> }>()

            const deleted = allArticles.articles.find(
                (a: { slug: string }) => a.slug === updatedSlug
            )
            expect(deleted).toBeUndefined()
            console.log('VERIFIED: Article does not exist')
        } finally {
            // Cleanup if test failed mid-way
            const cleanupSlug = updatedSlug || slug
            if (cleanupSlug) {
                try {
                    await authApi.path(`/articles/${cleanupSlug}`).deleteRequest()
                    console.log('CLEANUP: Deleted leftover article:', cleanupSlug)
                } catch {
                    console.log('CLEANUP: Article already deleted or not found')
                }
            }
        }
    })
})
