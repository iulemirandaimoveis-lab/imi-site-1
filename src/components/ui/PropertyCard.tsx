'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Property } from '@/types/property'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'

interface PropertyCardProps {
    property: Property
}

export default function PropertyCard({ property }: PropertyCardProps) {
    const primaryImage = property.images.find(img => img.isPrimary) || property.images[0]

    return (
        <Card hover className="overflow-hidden">
            <Link href={`/imoveis/${property.slug}`}>
                <div className="relative h-64 bg-neutral-200">
                    {primaryImage ? (
                        <Image
                            src={primaryImage.url}
                            alt={primaryImage.alt}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-neutral-100">
                            <svg className="w-16 h-16 text-neutral-400" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            </svg>
                        </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {property.status === 'lancamento' && (
                            <Badge variant="info">Lançamento</Badge>
                        )}
                        {property.technicalAnalysisAvailable && (
                            <Badge variant="success">Análise técnica disponível</Badge>
                        )}
                        {property.isStrategicAsset && (
                            <Badge variant="warning">Ativo estratégico</Badge>
                        )}
                    </div>
                </div>
            </Link>

            <div className="p-6">
                <Link href={`/imoveis/${property.slug}`}>
                    <h3 className="text-xl font-bold text-neutral-900 mb-2 hover:text-primary-700 transition-colors">
                        {property.title}
                    </h3>
                </Link>

                <p className="text-sm text-neutral-600 mb-4">
                    {property.neighborhood}, {property.city}
                </p>

                <div className="flex items-center gap-4 text-sm text-neutral-600 mb-4">
                    {property.bedrooms && (
                        <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            </svg>
                            <span>{property.bedrooms} quartos</span>
                        </div>
                    )}
                    <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                        </svg>
                        <span>{property.area}m²</span>
                    </div>
                </div>

                <div className="mb-4">
                    {property.priceOnRequest ? (
                        <p className="text-2xl font-bold text-primary-900">Sob consulta</p>
                    ) : (
                        <p className="text-2xl font-bold text-primary-900">{formatCurrency(property.price!)}</p>
                    )}
                </div>

                <Button asChild variant="outline" className="w-full">
                    <Link href={`/imoveis/${property.slug}`}>Ver análise do imóvel</Link>
                </Button>
            </div>
        </Card>
    )
}
