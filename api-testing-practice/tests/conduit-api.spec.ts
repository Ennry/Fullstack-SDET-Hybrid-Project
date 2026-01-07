import { test, expect } from '../utils/fixtures'
import { validateSchema } from '../utils/schemaValidator'
import articleSchema from '../schemas/article.schema.json'
import articlesSchema from '../schemas/articles.schema.json'
import tagsSchema from '../schemas/tags.schema.json'
import { dataFactory } from '../utils/dataFactory'

test.describe('Conduit API', () => {

    test('GET - Fetch Tags @smoke @schema', async ({ api }) => {
        const response = await api
            .path('/tags')
            .getRequest()

        // Schema validation
        const { valid, errors } = validateSchema(tagsSchema, response)
        expect(valid, `Schema errors: ${errors}`).toBe(true)

        expect(response.tags.length).toBeGreaterThan(0)
    })

    test('GET - Fetch Articles @smoke @schema', async ({ api }) => {
        const response = await api
            .path('/articles')
            .getRequest()

        // Schema validation
        const { valid, errors } = validateSchema(articlesSchema, response)
        expect(valid, `Schema errors: ${errors}`).toBe(true)

        expect(response).toHaveProperty('articles')
    })

    test('CRUD - Full Article Lifecycle @crud @schema', async ({ authApi }) => {
        // CREATE
        const createBody = await authApi
            .path('/articles')
            .postRequest(201, dataFactory.article('CRUD'))

        // Schema validation on CREATE
        const createValidation = validateSchema(articleSchema, createBody)
        expect(createValidation.valid, `Schema errors: ${createValidation.errors}`).toBe(true)

        const slug = createBody.article.slug
        console.log('CREATE:', slug)

        expect(createBody.article.title).toContain('CRUD Article')

        // READ
        const readBody = await authApi
            .path(`/articles/${slug}`)
            .getRequest()

        // Schema validation on READ
        const readValidation = validateSchema(articleSchema, readBody)
        expect(readValidation.valid, `Schema errors: ${readValidation.errors}`).toBe(true)

        console.log('READ:', readBody.article.slug)
        expect(readBody.article.slug).toBe(slug)

        // UPDATE
        const updateBody = await authApi
            .path(`/articles/${slug}`)
            .putRequest(200, dataFactory.article('Updated'))

        // Schema validation on UPDATE
        const updateValidation = validateSchema(articleSchema, updateBody)
        expect(updateValidation.valid, `Schema errors: ${updateValidation.errors}`).toBe(true)

        const updatedSlug = updateBody.article.slug
        console.log('UPDATE:', updatedSlug)
        expect(updateBody.article.description).toBe('Updated description')

        // DELETE
        await authApi
            .path(`/articles/${updatedSlug}`)
            .deleteRequest()

        console.log('DELETE: Done')

        // VERIFY DELETION
        const allArticles = await authApi
            .path('/articles')
            .getRequest()

        const deleted = allArticles.articles.find((a: any) => a.slug === updatedSlug)
        expect(deleted).toBeUndefined()

        console.log('VERIFIED: Article does not exist')
    })

})