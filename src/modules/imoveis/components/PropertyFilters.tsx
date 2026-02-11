'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, X } from 'lucide-react'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { PropertyFilterParams as PropertyFilterParamsType } from '../types'
import { createClient } from '@/lib/supabase/client'

interface PropertyFiltersProps {
    filters: PropertyFilterParamsType
    onFiltersChange: (filters: PropertyFilterParamsType) => void
    onClear: () => void
}

export default function PropertyFilters({ filters, onFiltersChange, onClear }: PropertyFiltersProps) {
    const supabase = createClient()
    const [developers, setDevelopers] = useState<Array<{ id: string; name: string }>>([])
    const [neighborhoods, setNeighborhoods] = useState<string[]>([])
    const [isExpanded, setIsExpanded] = useState(false)

    useEffect(() => {
        fetchFilterOptions()
    }, [])

    async function fetchFilterOptions() {
        // Buscar construtoras
        const { data: devs } = await supabase
            .from('developers')
            .select('id, name')
            .eq('active', true)
            .order('name')

        if (devs) setDevelopers(devs)

        // Buscar bairros únicos
        const { data: props } = await supabase
            .from('developments')
            .select('neighborhood')

        if (props) {
            const uniqueNeighborhoods = Array.from(new Set(props.map(p => p.neighborhood).filter(Boolean)))
            setNeighborhoods(uniqueNeighborhoods.sort())
        }
    }

    const hasActiveFilters =
        filters.search ||
        (filters.status && filters.status !== 'all') ||
        (filters.type && filters.type !== 'all') ||
        (filters.developer_id && filters.developer_id !== 'all') ||
        (filters.neighborhood && filters.neighborhood !== 'all') ||
        filters.price_min ||
        filters.price_max ||
        (filters.bedrooms && filters.bedrooms !== 'all')

    return (
        <div className="bg-white rounded-xl p-6 border border-slate-200 mb-6">
            <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nome, descrição ou bairro..."
                            value={filters.search || ''}
                            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
                            className="w-full h-11 pl-10 pr-4 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-imi-500"
                        />
                    </div>
                </div>

                <Button
                    variant={isExpanded ? 'primary' : 'outline'}
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros
                </Button>

                {hasActiveFilters && (
                    <Button variant="outline" onClick={onClear}>
                        <X className="w-4 h-4 mr-2" />
                        Limpar
                    </Button>
                )}
            </div>

            {isExpanded && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
                    <Select
                        label="Status"
                        value={filters.status || 'all'}
                        onChange={(e) => onFiltersChange({ ...filters, status: e.target.value as any })}
                        options={[
                            { value: 'all', label: 'Todos' },
                            { value: 'active', label: 'Ativo' },
                            { value: 'inactive', label: 'Inativo' },
                            { value: 'pending', label: 'Pendente' },
                            { value: 'sold', label: 'Vendido' },
                        ]}
                    />

                    <Select
                        label="Tipo"
                        value={filters.type || 'all'}
                        onChange={(e) => onFiltersChange({ ...filters, type: e.target.value as any })}
                        options={[
                            { value: 'all', label: 'Todos' },
                            { value: 'apartment', label: 'Apartamento' },
                            { value: 'house', label: 'Casa' },
                            { value: 'penthouse', label: 'Cobertura' },
                            { value: 'studio', label: 'Studio' },
                            { value: 'land', label: 'Terreno' },
                        ]}
                    />

                    <Select
                        label="Construtora"
                        value={filters.developer_id || 'all'}
                        onChange={(e) => onFiltersChange({ ...filters, developer_id: e.target.value })}
                        options={[
                            { value: 'all', label: 'Todas' },
                            ...developers.map(dev => ({ value: dev.id, label: dev.name }))
                        ]}
                    />

                    <Select
                        label="Bairro"
                        value={filters.neighborhood || 'all'}
                        onChange={(e) => onFiltersChange({ ...filters, neighborhood: e.target.value })}
                        options={[
                            { value: 'all', label: 'Todos' },
                            ...neighborhoods.map(n => ({ value: n, label: n }))
                        ]}
                    />

                    <Input
                        label="Preço Mínimo"
                        type="number"
                        value={filters.price_min || ''}
                        onChange={(e) => onFiltersChange({ ...filters, price_min: e.target.value ? Number(e.target.value) : undefined })}
                        placeholder="R$ 0"
                    />

                    <Input
                        label="Preço Máximo"
                        type="number"
                        value={filters.price_max || ''}
                        onChange={(e) => onFiltersChange({ ...filters, price_max: e.target.value ? Number(e.target.value) : undefined })}
                        placeholder="R$ 0"
                    />

                    <Select
                        label="Quartos"
                        value={filters.bedrooms?.toString() || 'all'}
                        onChange={(e) => onFiltersChange({ ...filters, bedrooms: e.target.value === 'all' ? 'all' : Number(e.target.value) as any })}
                        options={[
                            { value: 'all', label: 'Todos' },
                            { value: '1', label: '1 quarto' },
                            { value: '2', label: '2 quartos' },
                            { value: '3', label: '3 quartos' },
                            { value: '4', label: '4+ quartos' },
                        ]}
                    />

                    <Select
                        label="Ordenar por"
                        value={filters.sort || 'recent'}
                        onChange={(e) => onFiltersChange({ ...filters, sort: e.target.value as any })}
                        options={[
                            { value: 'recent', label: 'Mais recentes' },
                            { value: 'name', label: 'Nome A-Z' },
                            { value: 'price_asc', label: 'Menor preço' },
                            { value: 'price_desc', label: 'Maior preço' },
                            { value: 'views', label: 'Mais visualizados' },
                        ]}
                    />
                </div>
            )}
        </div>
    )
}
