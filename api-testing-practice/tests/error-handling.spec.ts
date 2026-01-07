import { test, expect } from '../utils/fixtures'

test.describe('Error Handling @negative', () => {

    test('401 - Unauthorized without token', async ({ api }) => {
        await api
            .path('/articles')
            .postRequest(401, {
                article: {
                    title: 'Unauthorized',
                    description: 'Test',
                    body: 'Test',
                    tagList: []
                }
            })
    })

    test('404 - Article not found', async ({ authApi }) => {
        await authApi
            .path('/articles/non-existent-slug-12345')
            .getRequest(404)
    })

    test('422 - Validation error empty title', async ({ authApi }) => {
        const response = await authApi
            .path('/articles')
            .postRequest(422, {
                article: {
                    title: '',
                    description: 'Test',
                    body: 'Test',
                    tagList: []
                }
            })

        expect(response).toHaveProperty('errors')
    })
    
    test('Cannot delete non-existent article', async ({ authApi }) => {
        await authApi
            .path('/articles/fake-slug-999')
            .deleteRequest(404)
    })

})