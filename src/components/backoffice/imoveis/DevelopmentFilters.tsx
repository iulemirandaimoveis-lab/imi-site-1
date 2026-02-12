import { useState } from 'react'
import { Search, Plus, Filter } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface Filters {
    search: string
    status: string
    type: string
}

interface DevelopmentFiltersProps {
    onFilterChange: (filters: Filters) => void
    onNew: () => void
}

export default function DevelopmentFilters({ onFilterChange, onNew }: DevelopmentFiltersProps) {
    const [filters, setFilters] = useState<Filters>({
        search: '',
        status: 'all',
        type: 'all'
    })

    const handleChange = (key: keyof Filters, value: string) => {
        const newFilters = { ...filters, [key]: value }
        setFilters(newFilters)
        onFilterChange(newFilters)
    }

    return (
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="relative flex-1 group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-imi-300 group-focus-within:text-accent-500 transition-colors w-5 h-5" />
                <Input
                    className="pl-14 pr-6 h-14 bg-white rounded-2xl border-imi-100 placeholder:text-imi-300 focus:border-accent-500 focus:ring-accent-500/20 text-imi-900 font-medium transition-all"
                    placeholder="Buscar por nome, cidade ou código..."
                    value={filters.search}
                    onChange={(e) => handleChange('search', e.target.value)}
                />
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 lg:pb-0">
                <select
                    className="h-14 bg-white border border-imi-100 rounded-2xl px-6 text-sm font-bold text-imi-600 focus:outline-none focus:ring-2 focus:ring-accent-500 appearance-none min-w-[160px]"
                    value={filters.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    style={{ backgroundImage: 'none' }} // Remove default arrow if customized
                >
                    <option value="all">Status: Todos</option>
                    <option value="draft">Rascunho</option>
                    <option value="published">Publicado</option>
                    <option value="campaign">Em Campanha</option>
                    <option value="sold">100% Vendido</option>
                </select>

                <select
                    className="h-14 bg-white border border-imi-100 rounded-2xl px-6 text-sm font-bold text-imi-600 focus:outline-none focus:ring-2 focus:ring-accent-500 appearance-none min-w-[160px]"
                    value={filters.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                >
                    <option value="all">Tipo: Todos</option>
                    <option value="apartment">Apartamento</option>
                    <option value="house">Casa</option>
                    <option value="commercial">Comercial</option>
                    <option value="land">Terreno</option>
                    <option value="resort">Resort</option>
                </select>

                <Button onClick={onNew} className="h-14 px-8 bg-imi-900 text-white rounded-2xl shadow-elevated hover:bg-imi-800 transition-all active:scale-95 group flex-shrink-0">
                    <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform" />
                    Novo Empreendimento
                </Button>
            </div>
        </div>
    )
}
