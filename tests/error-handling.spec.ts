import { test, expect } from '../utils/fixtures'

test.describe('Error Handling @negative', () => {

    // 401 UNAUTHORIZED
    test('401 - Create article without token', async ({ api }) => {
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

    test('401 - Delete article without token', async ({ api }) => {
        await api
            .path('/articles/some-slug')
            .deleteRequest(401)
    })

    test('401 - Update article without token', async ({ api }) => {
        await api
            .path('/articles/some-slug')
            .putRequest(401, {
                article: { title: 'Updated' }
            })
    })

    // 404 NOT FOUND
    test('404 - Get non-existent article', async ({ authApi }) => {
        await authApi
            .path('/articles/non-existent-slug-12345')
            .getRequest(404)
    })

    test('404 - Delete non-existent article', async ({ authApi }) => {
        await authApi
            .path('/articles/fake-slug-999')
            .deleteRequest(404)
    })

    test('404 - Update non-existent article', async ({ authApi }) => {
        await authApi
            .path('/articles/fake-slug-999')
            .putRequest(404, {
                article: { title: 'Updated' }
            })
    })

    test('404 - Get non-existent user profile', async ({ api }) => {
        await api
            .path('/profiles/non-existent-user-12345')
            .getRequest(404)
    })

    // 422 VALIDATION ERRORS
    test('422 - Create article with empty title', async ({ authApi }) => {
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

    test('422 - Create article with missing body', async ({ authApi }) => {
        const response = await authApi
            .path('/articles')
            .postRequest(422, {
                article: {
                    title: 'Test Title',
                    description: 'Test'
                }
            })

        expect(response).toHaveProperty('errors')
    })

    test('422 - Create article with missing description', async ({ authApi }) => {
        const response = await authApi
            .path('/articles')
            .postRequest(422, {
                article: {
                    title: 'Test Title',
                    body: 'Test Body'
                }
            })

        expect(response).toHaveProperty('errors')
    })

    test('422 - Register with invalid email', async ({ api }) => {
        const response = await api
            .path('/users')
            .postRequest(422, {
                user: {
                    username: 'testuser',
                    email: 'invalid-email',
                    password: 'password123'
                }
            })

        expect(response).toHaveProperty('errors')
    })

    test('422 - Create article with empty object', async ({ authApi }) => {
        await authApi
            .path('/articles')
            .postRequest(422, {
                article: {}
            })
    })

})