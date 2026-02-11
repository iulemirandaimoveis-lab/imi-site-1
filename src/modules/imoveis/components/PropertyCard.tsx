'use client'

import React from 'react'
import { Building2, MapPin, Bed, Bath, Car, Maximize, Eye, Users, Edit, Trash2, Link as LinkIcon } from 'lucide-react'
import { Property } from '../types'
import Image from 'next/image'
import Button from '@/components/ui/Button'

interface PropertyCardProps {
    property: Property
    onEdit: (property: Property) => void
    onDelete: (property: Property) => void
    onGenerateLink: (property: Property) => void
    onSelect?: (id: string) => void
    isSelected?: boolean
}

export default function PropertyCard({ property, onEdit, onDelete, onGenerateLink, onSelect, isSelected }: PropertyCardProps) {
    const statusColors = {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-slate-100 text-slate-600',
        pending: 'bg-yellow-100 text-yellow-800',
        sold: 'bg-red-100 text-red-800',
    }

    const statusLabels = {
        active: 'Ativo',
        inactive: 'Inativo',
        pending: 'Pendente',
        sold: 'Vendido',
    }

    const typeLabels = {
        apartment: 'Apartamento',
        house: 'Casa',
        penthouse: 'Cobertura',
        studio: 'Studio',
        land: 'Terreno',
    }

    return (
        <div className={`bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-all group relative ${isSelected ? 'border-imi-900 ring-2 ring-imi-900/10' : 'border-slate-200'}`}>
            {/* Selection Overlay */}
            {onSelect && (
                <div className="absolute top-4 left-4 z-20">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelect(property.id);
                        }}
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-imi-900 border-imi-900 text-white' : 'bg-white/80 border-white text-transparent'}`}
                    >
                        {isSelected && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                    </button>
                </div>
            )}

            {/* Imagem */}
            <div className="relative aspect-[4/3] bg-slate-100">
                {property.image ? (
                    <Image
                        src={property.image}
                        alt={property.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Building2 className="w-16 h-16 text-slate-300" />
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[property.status]}`}>
                        {statusLabels[property.status]}
                    </span>
                    {property.featured && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-accent-400 text-white">
                            Destaque
                        </span>
                    )}
                </div>

                {/* Score */}
                {property.score && (
                    <div className="absolute bottom-3 left-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-xs font-bold text-imi-900">{property.score}</span>
                    </div>
                )}
            </div>

            {/* Conteúdo */}
            <div className="p-5">
                {/* Construtora */}
                {property.developers && (
                    <p className="text-[10px] font-bold text-imi-400 uppercase tracking-widest mb-1">{property.developers.name}</p>
                )}

                {/* Nome */}
                <h3 className="text-lg font-bold text-imi-900 mb-1 line-clamp-1">
                    {property.name}
                </h3>

                {/* Localização */}
                <p className="text-sm text-slate-500 flex items-center gap-1.5 mb-3">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="line-clamp-1">{property.neighborhood}, {property.city}</span>
                </p>

                {/* Características */}
                <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-sm text-slate-600">
                    {property.bedrooms !== null && (
                        <div className="flex items-center gap-1.5">
                            <Bed className="w-4 h-4 text-imi-400" />
                            <span>{property.bedrooms}</span>
                        </div>
                    )}
                    {property.bathrooms !== null && (
                        <div className="flex items-center gap-1.5">
                            <Bath className="w-4 h-4 text-imi-400" />
                            <span>{property.bathrooms}</span>
                        </div>
                    )}
                    {property.area_from !== null && (
                        <div className="flex items-center gap-1.5">
                            <Maximize className="w-4 h-4 text-imi-400" />
                            <span>{property.area_from}m²</span>
                        </div>
                    )}
                </div>

                {/* Preço */}
                <div className="mb-4 pt-4 border-t border-slate-100">
                    <div className="text-[10px] font-bold text-imi-400 uppercase tracking-widest mb-0.5">Valor inicial</div>
                    <div className="text-xl font-bold text-imi-900">
                        {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                            minimumFractionDigits: 0
                        }).format(property.price_from)}
                    </div>
                </div>

                {/* Métricas */}
                <div className="flex items-center gap-4 mb-5 text-sm text-slate-400">
                    <div className="flex items-center gap-1.5">
                        <Eye className="w-4 h-4" />
                        <span>{property.views || 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        <span>{property.leads_count || 0}</span>
                    </div>
                </div>

                {/* Ações */}
                <div className="grid grid-cols-2 gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(property)}
                        className="w-full text-xs h-9"
                    >
                        <Edit className="w-3.5 h-3.5" />
                        Editar
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onGenerateLink(property)}
                        className="w-full text-xs h-9"
                    >
                        <LinkIcon className="w-3.5 h-3.5" />
                        Link
                    </Button>
                </div>

                <button
                    onClick={() => onDelete(property)}
                    className="w-full mt-3 text-[10px] font-bold text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors py-2"
                >
                    Excluir Imóvel
                </button>
            </div>
        </div>
    )
}
