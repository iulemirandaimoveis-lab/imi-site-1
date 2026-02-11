'use client'

import React, { useState } from 'react'
import { Plus, Building2, SearchX } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import {
    PropertyKPIs,
    PropertyFilters,
    PropertyCard,
    BulkActions,
    TrackingLinkModal,
    useProperties,
    deleteProperty,
    Property,
    PropertyFilterParams as PropertyFilterParamsType
} from '@/modules/imoveis'
import { useToast } from '@/components/ui/Toast'
import Toast from '@/components/ui/Toast'

export default function ImoveisPage() {
    const router = useRouter()
    const { toasts, showToast, removeToast } = useToast()

    const [filters, setFilters] = useState<PropertyFilterParamsType>({
        status: 'all',
        type: 'all',
        developer_id: 'all',
        neighborhood: 'all',
        sort: 'recent',
    })

    const { properties, isLoading, mutate, total } = useProperties(filters)
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [linkModalProperty, setLinkModalProperty] = useState<Property | null>(null)

    function handleSelectProperty(id: string) {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(selectedId => selectedId !== id)
                : [...prev, id]
        )
    }

    function handleSelectAll() {
        setSelectedIds(properties.map(p => p.id))
    }

    function handleClearSelection() {
        setSelectedIds([])
    }

    function handleEdit(property: Property) {
        router.push(`/backoffice/imoveis/${property.id}`)
    }

    async function handleDelete(property: Property) {
        if (!confirm(`Confirmar exclusão de "${property.name}"?`)) return

        try {
            await deleteProperty(property.id)
            showToast('Empreendimento removido com sucesso', 'success')
            mutate()
        } catch (err: any) {
            showToast(err.message || 'Falha ao remover registro', 'error')
        }
    }

    function handleGenerateLink(property: Property) {
        setLinkModalProperty(property)
    }

    function handleClearFilters() {
        setFilters({
            status: 'all',
            type: 'all',
            developer_id: 'all',
            neighborhood: 'all',
            sort: 'recent',
        })
    }

    return (
        <div className="p-8 max-w-[1600px] mx-auto">
            {/* Toast System */}
            <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>

            {/* Header Visual de Autoridade */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-1 bg-imi-900"></div>
                        <span className="text-xs font-bold text-imi-500 uppercase tracking-[0.2em]">Inventory Management</span>
                    </div>
                    <h1 className="text-4xl font-bold text-imi-900 tracking-tight">Imóveis Inteligentes</h1>
                    <p className="text-slate-500 mt-2 font-medium">
                        Gestão estratégica de ativos e empreendimentos de alta performance.
                    </p>
                </div>
                <Button onClick={() => router.push('/backoffice/imoveis/novo')} className="shadow-lg shadow-imi-900/10">
                    <Plus className="w-5 h-5 mr-3" />
                    Novo Ativo
                </Button>
            </div>

            {/* Camada Estratégica: KPIs */}
            <PropertyKPIs />

            {/* Camada Operacional: Filtros e Lote */}
            <div className="sticky top-0 z-40 bg-[#f8fafc]/80 backdrop-blur-md py-4 -mx-4 px-4 mb-8">
                <PropertyFilters
                    filters={filters}
                    onFiltersChange={setFilters}
                    onClear={handleClearFilters}
                />

                {properties.length > 0 && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                        <BulkActions
                            selectedIds={selectedIds}
                            onSelectAll={handleSelectAll}
                            onClearSelection={handleClearSelection}
                            totalCount={total}
                            onActionComplete={() => {
                                mutate()
                                handleClearSelection()
                                showToast('Operação em lote concluída', 'success')
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Camada de Dados: Grid */}
            {isLoading && properties.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-white rounded-2xl border border-slate-100 h-[450px] animate-pulse shadow-sm">
                            <div className="aspect-[4/3] bg-slate-50 rounded-t-2xl"></div>
                            <div className="p-6 space-y-4">
                                <div className="h-6 bg-slate-50 rounded w-3/4"></div>
                                <div className="h-4 bg-slate-50 rounded w-1/2"></div>
                                <div className="grid grid-cols-3 gap-4 pt-4">
                                    <div className="h-8 bg-slate-50 rounded"></div>
                                    <div className="h-8 bg-slate-50 rounded"></div>
                                    <div className="h-8 bg-slate-50 rounded"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : properties.length === 0 ? (
                <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-20 text-center shadow-soft">
                    <div className="max-w-md mx-auto">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                            <SearchX className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-imi-900 mb-2">
                            Nenhum dado estratégico encontrado
                        </h3>
                        <p className="text-slate-500 mb-8 leading-relaxed">
                            {filters.search || filters.status !== 'all' || filters.type !== 'all'
                                ? 'Os critérios de filtragem atuais não retornaram nenhum ativo em nosso ecossistema.'
                                : 'O seu inventário corporativo está vazio. Inicie o cadastramento de ativos para começar a trackear.'}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button onClick={handleClearFilters} variant="outline">
                                Limpar Filtros
                            </Button>
                            <Button onClick={() => router.push('/backoffice/imoveis/novo')}>
                                Cadastrar Novo Ativo
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {properties.map(property => (
                        <PropertyCard
                            key={property.id}
                            property={property}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onGenerateLink={handleGenerateLink}
                            onSelect={handleSelectProperty}
                            isSelected={selectedIds.includes(property.id)}
                        />
                    ))}
                </div>
            )}

            {/* Camada de Interação: Modais */}
            {linkModalProperty && (
                <TrackingLinkModal
                    property={linkModalProperty}
                    onClose={() => setLinkModalProperty(null)}
                />
            )}
        </div>
    )
}
