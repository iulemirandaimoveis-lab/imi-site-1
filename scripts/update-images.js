const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const images = [
    '/images/properties/house-facade.png',
    '/images/properties/living-room.png',
    '/images/properties/apartment-building.png'
]

async function main() {
    console.log('🔍 Buscando imóveis...')
    const properties = await prisma.property.findMany({
        select: { id: true, title: true }
    })

    console.log(`✅ Encontrados ${properties.length} imóveis.`)

    for (const property of properties) {
        console.log(`🖼️ Atualizando imagens para: ${property.title}`)

        // Remove existing images to ensure fresh look
        await prisma.propertyImage.deleteMany({
            where: { propertyId: property.id }
        })

        // Add 3 images to each property
        for (let i = 0; i < images.length; i++) {
            await prisma.propertyImage.create({
                data: {
                    propertyId: property.id,
                    url: images[i],
                    alt: `Imagem ${i + 1} de ${property.title}`,
                    order: i,
                    isPrimary: i === 0
                }
            })
        }
    }

    console.log('🚀 Todas as imagens foram atualizadas com sucesso!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
