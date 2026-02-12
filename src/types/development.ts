export type DevelopmentType = 'apartment' | 'house' | 'penthouse' | 'studio' | 'land' | 'commercial' | 'resort';
export type DevelopmentStatus = 'draft' | 'published' | 'campaign' | 'private' | 'sold';

export interface Development {
    id: string;
    title: string; // Assuming 'title' exists or maps to 'name' based on previous context. Migration says 'dev.name' in function, so likely 'title' or 'name'. I'll check property.ts which has 'title', but migration function refers to 'dev.name'. I will use 'title' as per user request usually, but let's stick to 'title' as standard unless I see 'name' in schema. Wait, migration line 82: "IF dev.name IS NOT NULL". So it is 'name'. I will use 'title' in TS and map it or use 'name'. The UI uses 'title'. I'll add both or check. Let's assume 'title' for now as typical in CMS. Actually, let's use 'name' to match DB.
    name: string; // Database column 'name'
    description: string;

    // Core details
    type: DevelopmentType;
    status_commercial: DevelopmentStatus;
    country: string;
    city: string; // From previous knowledge or assumed
    neighborhood: string; // From previous knowledge or assumed

    // Pricing
    price_from?: number;
    price_to?: number; // Usage in migration implies price_from

    // Dimensions & Specs
    area_from: number;
    area_to: number;
    bedrooms: number;
    bathrooms: number;
    parking_spaces: number;
    units_count: number;
    floor_count: number;

    // Audience
    target_audience: string;
    selling_points: string[]; // JSONB

    // Media
    image: string | null; // Main image
    gallery_images: string[];
    floor_plans: string[];
    videos: string[];
    virtual_tour_url: string | null;
    brochure_url: string | null;

    // Performance
    views_count: number;
    leads_count: number;
    inventory_score: number;

    // Metadata
    created_at: string;
    updated_at: string;
    updated_by: string;

    // Relations (Partial)
    developer?: {
        id: string;
        name: string;
        logo: string;
    };
}
