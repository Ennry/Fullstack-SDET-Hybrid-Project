export const dataFactory = {
    article: (prefix: string = 'Test') => ({
        article: {
            title: `${prefix} Article ${Date.now()}`,
            description: `${prefix} description`,
            body: `${prefix} body content`,
            tagList: [`${prefix.toLowerCase()}-tag`]
        }
    }),

    updateArticle: (prefix: string = 'Updated') => ({
        article: {
            title: `${prefix} Article ${Date.now()}`,
            description: `${prefix} description`,
            body: `${prefix} body content`,
            tagList: [`${prefix.toLowerCase()}-tag`]
        }
    }),

    invalidArticle: () => ({
        article: {
            title: '',
            description: 'Invalid',
            body: 'Body',
            tagList: []
        }
    })
}
