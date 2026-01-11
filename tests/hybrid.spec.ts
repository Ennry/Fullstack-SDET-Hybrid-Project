import { test, expect } from '../utils/fixtures'
import { dataFactory } from '../utils/dataFactory'
import { ArticlePage } from '../pages/ArticlePage'
import { HomePage } from '../pages/HomePage'

test.describe('Hybrid Tests - API + UI @hybrid', () => {

    test('Create article via API, verify in UI', async ({ authApi, authPage }) => {
        // API: Create article
        const response = await authApi
            .path('/articles')
            .postRequest(201, dataFactory.article('Hybrid'))

        const slug = response.article.slug
        console.log('API: Article created:', slug)

        // UI: Verify article
        const articlePage = new ArticlePage(authPage)
        await articlePage.goto(slug)

        const title = await articlePage.getTitle()
        expect(title).toContain('Hybrid')
        console.log('UI: Article verified')

        // API: Cleanup
        await authApi.path(`/articles/${slug}`).deleteRequest()
        console.log('API: Cleanup done')
    })

    test('Create article via UI, verify via API', async ({ authApi, authPage }) => {
        const { EditorPage } = await import('../pages/EditorPage')
        const editorPage = new EditorPage(authPage)

        const uniqueTitle = `UI Article ${Date.now()}`

        // UI: Create article
        await editorPage.goto()
        await editorPage.createArticle(
            uniqueTitle,
            'Test description',
            'Test body content',
            ['hybrid-test']
        )

        const slug = await editorPage.getSlugFromUrl()
        console.log('UI: Article created:', slug)

        // API: Verify article
        const response = await authApi
            .path(`/articles/${slug}`)
            .getRequest()

        expect(response.article.title).toBe(uniqueTitle)
        console.log('API: Article verified')

        // API: Cleanup
        await authApi.path(`/articles/${slug}`).deleteRequest()
        console.log('API: Cleanup done')
    })

    test('Delete via API, verify gone in UI', async ({ authApi, authPage }) => {
        // API: Create article
        const response = await authApi
            .path('/articles')
            .postRequest(201, dataFactory.article('ToDelete'))

        const slug = response.article.slug
        console.log('API: Article created:', slug)

        // API: Delete article
        await authApi.path(`/articles/${slug}`).deleteRequest()
        console.log('API: Article deleted')

        // UI: Verify gone
        const articlePage = new ArticlePage(authPage)
        await articlePage.goto(slug)

        const isVisible = await articlePage.isArticleVisible()
        expect(isVisible).toBe(false)
        console.log('UI: Confirmed article gone')
    })

    test('Verify tags sync between API and UI', async ({ api, page }) => {
        // API: Get tags
        const apiResponse = await api.path('/tags').getRequest()
        const apiTags = apiResponse.tags
        console.log('API: Got', apiTags.length, 'tags')

        // UI: Get tags (wait for load)
        const homePage = new HomePage(page)
        await homePage.goto()

        // Wait for tags to appear
        await page.waitForSelector('.tag-list', { timeout: 10000 })

        const uiTags = await homePage.getTags()
        console.log('UI: Got', uiTags.length, 'tags')
        console.log('UI Tags:', uiTags)

        // Verify tags exist
        expect(uiTags.length).toBeGreaterThan(0)

        // Verify some tags exist in both
        const commonTag = apiTags[0]
        expect(uiTags).toContain(commonTag)
        console.log('Verified tag sync:', commonTag)
    })

})