export type PropertyType = 'apartment' | 'house' | 'commercial' | 'land'
export type PropertyStatus = 'lancamento' | 'usado'
export type PropertyPurpose = 'moradia' | 'investimento'

export interface Property {
    id: string
    slug: string
    title: string
    description: string
    type: PropertyType
    status: PropertyStatus
    purpose?: PropertyPurpose

    // Location
    city: string
    neighborhood: string
    address?: string

    // Details
    bedrooms?: number
    bathrooms?: number
    parkingSpaces?: number
    area: number // in m²

    // Pricing
    price?: number
    priceOnRequest: boolean

    // Media
    images: PropertyImage[]
    videoUrl?: string

    // Features
    features: string[]
    technicalAnalysisAvailable: boolean
    isStrategicAsset: boolean

    // Market context
    marketContext?: string
    idealBuyerProfile?: string

    // Builder relationship
    builderId?: string
    builderName?: string

    // Metadata
    createdAt: Date
    updatedAt: Date
    featured: boolean
}

export interface PropertyImage {
    url: string
    alt: string
    width: number
    height: number
    isPrimary?: boolean
}

export interface PropertyFilter {
    type?: PropertyType[]
    status?: PropertyStatus
    city?: string
    neighborhood?: string
    purpose?: PropertyPurpose
    minPrice?: number
    maxPrice?: number
    minArea?: number
    maxArea?: number
    bedrooms?: number
}
