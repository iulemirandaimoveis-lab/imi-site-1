import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { supabaseAdmin } from '@/lib/supabase'
import { z } from 'zod'

export const runtime = 'nodejs';

/**
 * GET /api/properties
 * Lista todos os imóveis (com filtros opcionais)
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)

        const status = searchParams.get('status')
        const isFeatured = searchParams.get('featured') === 'true'
        const minPrice = searchParams.get('minPrice')
        const maxPrice = searchParams.get('maxPrice')
        const bedrooms = searchParams.get('bedrooms')
        const neighborhood = searchParams.get('neighborhood')

        const where: any = {}

        if (status) where.status = status
        if (isFeatured) where.isFeatured = true
        if (minPrice) where.price = { ...where.price, gte: parseFloat(minPrice) }
        if (maxPrice) where.price = { ...where.price, lte: parseFloat(maxPrice) }
        if (bedrooms) where.bedrooms = parseInt(bedrooms)
        if (neighborhood) where.neighborhood = { contains: neighborhood, mode: 'insensitive' }

        const properties = await prisma.property.findMany({
            where,
            include: {
                images: {
                    orderBy: { order: 'asc' }
                },
                _count: {
                    select: {
                        accessLogs: true,
                        clientLinks: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json({
            success: true,
            data: properties,
            count: properties.length
        })
    } catch (error) {
        console.error('Error fetching properties:', error)
        return NextResponse.json(
            { success: false, error: 'Erro ao buscar imóveis' },
            { status: 500 }
        )
    }
}

/**
 * POST /api/properties
 * Cria um novo imóvel
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validation Schema
        const schema = z.object({
            title: z.string().min(5, "Título muito curto"),
            description: z.string().optional(),
            price: z.number().min(0),
            area: z.number().min(0),
            bedrooms: z.number().min(0),
            bathrooms: z.number().min(0),
            parkingSpots: z.number().min(0),
            address: z.string().optional(),
            neighborhood: z.string().min(2, "Bairro obrigatório"),
            city: z.string().min(2),
            state: z.string().length(2),
            zipCode: z.string().optional(),
            status: z.enum(['AVAILABLE', 'RESERVED', 'SOLD', 'ANALYSIS']).default('AVAILABLE'),
            isFeatured: z.boolean().default(false),
            isExclusive: z.boolean().default(false),
            hasAnalysis: z.boolean().default(false),
            images: z.array(z.object({
                url: z.string().url(),
                alt: z.string().optional(),
                isPrimary: z.boolean().optional()
            })).optional()
        })

        const data = schema.parse(body)

        // Robust Slug Generation
        let baseSlug = data.title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')

        let slug = baseSlug
        let counter = 1

        while (await prisma.property.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${counter}`
            counter++
        }

        // Create Property
        const property = await prisma.property.create({
            data: {
                title: data.title,
                slug,
                description: data.description || '',
                price: data.price,
                area: data.area,
                bedrooms: data.bedrooms,
                bathrooms: data.bathrooms,
                parkingSpots: data.parkingSpots,
                address: data.address || '',
                neighborhood: data.neighborhood,
                city: data.city,
                state: data.state,
                zipCode: data.zipCode,
                status: data.status,
                isFeatured: data.isFeatured,
                isExclusive: data.isExclusive,
                hasAnalysis: data.hasAnalysis,
                publishedAt: new Date()
            }
        })

        // Create Images
        if (data.images && data.images.length > 0) {
            await prisma.propertyImage.createMany({
                data: data.images.map((img, index) => ({
                    propertyId: property.id,
                    url: img.url,
                    alt: img.alt || data.title,
                    order: index,
                    isPrimary: img.isPrimary || index === 0
                }))
            })
        }

        return NextResponse.json({
            success: true,
            data: property
        }, { status: 201 })

    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: 'Dados inválidos', details: error.errors },
                { status: 400 }
            )
        }
        console.error('Error creating property:', error)
        return NextResponse.json(
            { success: false, error: 'Erro ao criar imóvel' },
            { status: 500 }
        )
    }
}
