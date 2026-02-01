export interface Builder {
    id: string
    slug: string
    name: string
    logo: string
    description: string
    website?: string

    // Quality indicators
    technicalCriteria: string[]
    constructionQuality: string
    economicViability: string

    // Properties
    propertyIds: string[]

    // Metadata
    createdAt: Date
    updatedAt: Date
    featured: boolean
}
