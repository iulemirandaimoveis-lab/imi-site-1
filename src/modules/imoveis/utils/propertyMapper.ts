
import { Development } from '@/app/[lang]/(website)/imoveis/types/development';

export function mapDbPropertyToDevelopment(dbProp: any): Development {
    return {
        id: dbProp.id,
        slug: dbProp.slug,
        name: dbProp.name,
        developer: dbProp.developers?.name || dbProp.developer || 'IMI - Inteligência Imobiliária',
        developerLogo: dbProp.developers?.logo_url || null,
        status: (dbProp.status === 'ready' || dbProp.status_commercial === 'ready') ? 'ready' : 'launch',
        region: (dbProp.region as any) || 'paraiba',
        location: {
            neighborhood: dbProp.neighborhood || '',
            city: dbProp.city || '',
            state: dbProp.state || '',
            region: dbProp.region || 'paraiba',
            country: dbProp.country || 'Brasil',
            coordinates: {
                lat: dbProp.lat || -7.1150,
                lng: dbProp.lng || -34.8230
            },
            address: dbProp.address || ''
        },
        deliveryDate: dbProp.delivery || dbProp.delivery_date || '',
        registrationNumber: dbProp.registration_number || '',
        description: dbProp.description || '',
        shortDescription: dbProp.description ? dbProp.description.substring(0, 100) + '...' : '',
        features: Array.isArray(dbProp.features) ? dbProp.features : [],
        specs: {
            bedroomsRange: dbProp.bedrooms ? `${dbProp.bedrooms}` : 'Sob consulta',
            areaRange: dbProp.area_from ? `${dbProp.area_from}${dbProp.area_to ? '-' + dbProp.area_to : ''}m²` : 'Sob consulta',
            bathroomsRange: dbProp.bathrooms ? `${dbProp.bathrooms}` : undefined,
            parkingRange: dbProp.parking_spaces ? `${dbProp.parking_spaces}` : undefined,
        },
        priceRange: {
            min: dbProp.price_from || 0,
            max: dbProp.price_to || 0,
        },
        images: {
            main: dbProp.image || '/images/placeholders/property-main.jpg',
            gallery: Array.isArray(dbProp.gallery_images) ? dbProp.gallery_images : [],
            videos: Array.isArray(dbProp.videos) ? dbProp.videos : [],
            floorPlans: Array.isArray(dbProp.floor_plans) ? dbProp.floor_plans : [],
            virtualTour: dbProp.virtual_tour_url,
        },
        units: [], // Podem ser carregadas sob demanda ou com JOIN
        tags: Array.isArray(dbProp.tags) ? dbProp.tags : [],
        order: dbProp.display_order || 0,
        isHighlighted: dbProp.is_highlighted || false,
        createdAt: dbProp.created_at || new Date().toISOString(),
        updatedAt: dbProp.updated_at || new Date().toISOString(),
    };
}
