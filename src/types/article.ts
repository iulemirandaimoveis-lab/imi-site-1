export type ArticleCategory = 'market-analysis' | 'investment' | 'appraisal' | 'consulting' | 'real-estate-law'

export interface Article {
    id: string
    slug: string
    title: string
    excerpt: string
    content: string
    category: ArticleCategory

    // Media
    coverImage: {
        url: string
        alt: string
        width: number
        height: number
    }

    // Author
    author: {
        name: string
        role: string
        image?: string
    }

    // SEO
    metaDescription: string
    keywords: string[]

    // Metadata
    publishedAt: Date
    updatedAt: Date
    readingTime: number // in minutes
    featured: boolean
}

export interface ArticleFilter {
    category?: ArticleCategory
    featured?: boolean
}
