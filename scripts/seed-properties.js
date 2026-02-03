const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const properties = [
    {
        title: 'Mansão Contemporânea no Jardins',
        slug: 'mansao-contemporanea-jardins',
        description: 'Obra de arte arquitetônica. Projeto premiado com 4 suítes, living com pé direito duplo e integração total com a área externa. Acabamentos em mármore importado e madeira nobre. Sistema de automação completo.',
        price: 12500000.00,
        area: 650,
        bedrooms: 4,
        bathrooms: 6,
        parkingSpots: 4,
        address: 'Rua Colômbia',
        neighborhood: 'Jardim Europa',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01438-000',
        status: 'AVAILABLE',
        isFeatured: true,
        isExclusive: true, // "Selo Verificado"
        hasAnalysis: true,
        images: [
            '/images/properties/house-facade.png',
            '/images/properties/living-room.png'
        ]
    },
    {
        title: 'Penthouse Triplex com Vista 360º',
        slug: 'penthouse-triplex-itaim',
        description: 'Exclusividade e privacidade nas alturas. Cobertura triplex no coração do Itaim Bibi. Piscina privativa, terraço gourmet e vista cinematográfica para o Parque do Povo.',
        price: 28000000.00,
        area: 820,
        bedrooms: 5,
        bathrooms: 7,
        parkingSpots: 6,
        address: 'Rua Leopoldo Couto de Magalhães Júnior',
        neighborhood: 'Itaim Bibi',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '04542-000',
        status: 'AVAILABLE',
        isFeatured: true,
        isExclusive: true,
        hasAnalysis: true,
        images: [
            '/images/properties/apartment-building.png',
            '/images/properties/living-room.png'
        ]
    },
    {
        title: 'Apartamento Design na Vila Nova',
        slug: 'apartamento-design-vila-nova',
        description: 'Sofisticação e conforto. Apartamento reformado por escritório renomado. Planta inteligente, muita luz natural e localização privilegiada próximo à Praça Pereira Coutinho.',
        price: 4800000.00,
        area: 210,
        bedrooms: 3,
        bathrooms: 4,
        parkingSpots: 3,
        address: 'Rua Diogo Jácome',
        neighborhood: 'Vila Nova Conceição',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '04512-000',
        status: 'AVAILABLE',
        isFeatured: false,
        isExclusive: false,
        hasAnalysis: false,
        images: [
            '/images/properties/living-room.png'
        ]
    }
]

async function main() {
    console.log('🌱 Iniciando Seed...')

    // Check existing
    const count = await prisma.property.count()
    if (count > 0) {
        console.log(`⚠️ Já existem ${count} imóveis. Limpando...`)
        await prisma.property.deleteMany({}) // Clean slate for "Professional" look
    }

    for (const p of properties) {
        console.log(`🏠 Criando: ${p.title}`)
        await prisma.property.create({
            data: {
                title: p.title,
                slug: p.slug,
                description: p.description,
                price: p.price,
                area: p.area,
                bedrooms: p.bedrooms,
                bathrooms: p.bathrooms,
                parkingSpots: p.parkingSpots,
                address: p.address,
                neighborhood: p.neighborhood,
                city: p.city,
                state: p.state,
                zipCode: p.zipCode,
                status: p.status,
                isFeatured: p.isFeatured,
                isExclusive: p.isExclusive,
                hasAnalysis: p.hasAnalysis,
                images: {
                    create: p.images.map((url, idx) => ({
                        url: url,
                        alt: `${p.title} - Imagem ${idx + 1}`,
                        order: idx,
                        isPrimary: idx === 0
                    }))
                }
            }
        })
    }
    console.log('✅ Seed preenchido com sucesso!')
}

main()
    .catch((e) => {
        console.error(e)
        // If error is about missing column in DB, we know why.
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
