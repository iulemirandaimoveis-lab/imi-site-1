'use client'

import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import DevelopmentFilters from '@/components/backoffice/imoveis/DevelopmentFilters'
import DevelopmentList from '@/components/backoffice/imoveis/DevelopmentList'
import PropertyKPIs from '@/components/backoffice/imoveis/PropertyKPIs'
import BulkActions from '@/components/backoffice/imoveis/BulkActions'
import { useDevelopments, deleteDevelopment } from '@/hooks/use-developments'
import { useToast } from '@/components/ui/Toast'
import Toast from '@/components/ui/Toast'

export default function ImoveisPage() {
    const router = useRouter()
    const { toasts, showToast, removeToast } = useToast()
    const [filters, setFilters] = useState<any>({})
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    const { developments, isLoading, mutate, total } = useDevelopments(filters)

    function handleNew() {
        router.push('/backoffice/imoveis/novo')
    }

    function handleEdit(id: string) {
        router.push(`/backoffice/imoveis/${id}`)
    }

    async function handleDelete(id: string) {
        if (!confirm('Tem certeza que deseja excluir permanentemente este empreendimento?')) return

        try {
            await deleteDevelopment(id)
            showToast('Empreendimento excluído com sucesso', 'success')
            mutate()
        } catch (err: any) {
            showToast(err.message || 'Erro ao excluir', 'error')
        }
    }

    function handleSelect(id: string) {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        )
    }

    function handleSelectAll() {
        if (developments) {
            setSelectedIds(developments.map(d => d.id))
        }
    }

    function handleClearSelection() {
        setSelectedIds([])
    }

    return (
        <div className="p-8 max-w-[1600px] mx-auto pb-40">
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

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-1 bg-imi-900"></div>
                        <span className="text-xs font-bold text-imi-500 uppercase tracking-[0.2em]">Gestão de Ativos</span>
                    </div>
                    <h1 className="text-4xl font-bold text-imi-900 tracking-tight font-display">Imóveis Inteligentes</h1>
                    <p className="text-imi-500 mt-2 font-medium">
                        Gestão estratégica de empreendimentos e unidades de alta performance.
                    </p>
                </div>
            </div>

            {/* KPIs */}
            <PropertyKPIs />

            {/* Filters & Bulk Actions */}
            <div className="sticky top-0 z-40 bg-[#f8fafc]/95 backdrop-blur-md py-4 -mx-4 px-4 mb-8 space-y-4">
                <DevelopmentFilters
                    onFilterChange={setFilters}
                    onNew={handleNew}
                />

                {selectedIds.length > 0 && (
                    <BulkActions
                        selectedIds={selectedIds}
                        onSelectAll={handleSelectAll}
                        onClearSelection={handleClearSelection}
                        totalCount={total}
                        onActionComplete={() => {
                            mutate()
                            handleClearSelection()
                        }}
                    />
                )}
            </div>

            {/* List */}
            <DevelopmentList
                developments={developments}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onNew={handleNew}
                selectedIds={selectedIds}
                onSelect={handleSelect}
            />
        </div>
    )
}
