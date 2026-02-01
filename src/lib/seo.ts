import { Metadata } from 'next'

const SITE_NAME = 'IMI – Inteligência Imobiliária'
const SITE_DESCRIPTION = 'Avaliações imobiliárias técnicas, consultoria estratégica e corretagem com curadoria. Decisões imobiliárias baseadas em inteligência, método e segurança.'
const SITE_URL = 'https://imi.com.br' // Update with actual domain

export function generateMetadata({
    title,
    description,
    path = '',
    image,
}: {
    title: string
    description?: string
    path?: string
    image?: string
}): Metadata {
    const metaTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`
    const metaDescription = description || SITE_DESCRIPTION
    const url = `${SITE_URL}${path}`
    const metaImage = image || `${SITE_URL}/og-image.jpg`

    return {
        title: metaTitle,
        description: metaDescription,
        openGraph: {
            title: metaTitle,
            description: metaDescription,
            url,
            siteName: SITE_NAME,
            images: [
                {
                    url: metaImage,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            locale: 'pt_BR',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: metaTitle,
            description: metaDescription,
            images: [metaImage],
        },
        alternates: {
            canonical: url,
        },
    }
}

export function generateOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'RealEstateAgent',
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        address: {
            '@type': 'PostalAddress',
            addressCountry: 'BR',
        },
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            availableLanguage: 'Portuguese',
        },
    }
}
