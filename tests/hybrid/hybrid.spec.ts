import { test, expect } from '../../utils/fixtures'
import { dataFactory } from '../../utils/dataFactory'
import { ArticlePage } from '../../pages/ArticlePage'
import { EditorPage } from '../../pages/EditorPage'
import { HomePage } from '../../pages/HomePage'

test.describe('Hybrid Tests - API + UI @hybrid', () => {
    test('Create article via API, verify in UI', async ({ authApi, authPage }) => {
        let slug: string | undefined

        try {
            // API: Create article
            const response = await authApi
                .path('/articles')
                .postRequest<{ article: { slug: string } }>(201, dataFactory.article('Hybrid'))

            slug = response.article.slug
            console.log('API: Article created:', slug)

            // Guard check — satisfies TypeScript
            if (!slug) throw new Error('Article slug was not returned from API')

            // UI: Verify article
            const articlePage = new ArticlePage(authPage)
            await articlePage.goto(slug)

            const title = await articlePage.getTitle()
            expect(title).toContain('Hybrid')
            console.log('UI: Article verified')
        } finally {
            if (slug) {
                await authApi.path(`/articles/${slug}`).deleteRequest()
                console.log('API: Cleanup done')
            }
        }
    })

    test('Create article via UI, verify via API', async ({ authApi, authPage }) => {
        let slug: string | undefined

        try {
            const editorPage = new EditorPage(authPage)
            const uniqueTitle = `UI Article ${Date.now()}`

            // UI: Create article
            await editorPage.goto()
            await editorPage.createArticle(uniqueTitle, 'Test description', 'Test body content', [
                'hybrid-test'
            ])

            slug = await editorPage.getSlugFromUrl()
            console.log('UI: Article created:', slug)

            if (!slug) throw new Error('Could not extract slug from URL')

            // API: Verify article
            const response = await authApi
                .path(`/articles/${slug}`)
                .getRequest<{ article: { title: string } }>()

            expect(response.article.title).toBe(uniqueTitle)
            console.log('API: Article verified')
        } finally {
            if (slug) {
                await authApi.path(`/articles/${slug}`).deleteRequest()
                console.log('API: Cleanup done')
            }
        }
    })

    test('Delete via API, verify gone in UI', async ({ authApi, authPage }) => {
        let slug: string | undefined

        try {
            // API: Create article
            const response = await authApi
                .path('/articles')
                .postRequest<{ article: { slug: string } }>(201, dataFactory.article('ToDelete'))

            slug = response.article.slug
            console.log('API: Article created:', slug)

            if (!slug) throw new Error('Article slug was not returned from API')

            // API: Delete article
            await authApi.path(`/articles/${slug}`).deleteRequest()
            console.log('API: Article deleted')

            // UI: Verify gone
            const articlePage = new ArticlePage(authPage)
            await articlePage.goto(slug)

            const isVisible = await articlePage.isArticleVisible()
            expect(isVisible).toBe(false)
            console.log('UI: Confirmed article gone')

            slug = undefined // Already deleted, skip finally cleanup
        } finally {
            if (slug) {
                await authApi.path(`/articles/${slug}`).deleteRequest()
                console.log('API: Cleanup done')
            }
        }
    })

    test('Verify tags sync between API and UI', async ({ api, page }) => {
        // API: Get tags
        const apiResponse = await api.path('/tags').getRequest<{ tags: string[] }>()
        const apiTags: string[] = apiResponse.tags
        console.log('API: Got', apiTags.length, 'tags')
        console.log('API Tags (first 10):', apiTags.slice(0, 10))

        // UI: Get tags
        const homePage = new HomePage(page)
        await homePage.goto()

        const uiTags = await homePage.getTags()
        console.log('UI: Got', uiTags.length, 'tags')
        console.log('UI Tags:', uiTags)

        // Verify UI has tags
        expect(uiTags.length).toBeGreaterThan(0)

        // Find common tags (case-insensitive, trimmed)
        const normalizedUiTags = uiTags.map(t => t.toLowerCase().trim())
        const normalizedApiTags = apiTags.map(t => t.toLowerCase().trim())

        const commonTags = normalizedApiTags.filter(tag => normalizedUiTags.includes(tag))
        console.log('Common tags found:', commonTags.length)
        console.log('Common tags:', commonTags.slice(0, 5))

        expect(commonTags.length).toBeGreaterThan(0)
        console.log('Verified tag sync')
    })
})
