'use client'

import React, { useState, useEffect } from 'react'
import { ChevronLeft, Building2, Layers, BarChart3, Link as LinkIcon, ShieldCheck } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { useDevelopment, updateDevelopment } from '@/hooks/use-developments'
import DevelopmentForm from '@/components/backoffice/imoveis/DevelopmentForm'
import { useToast } from '@/components/ui/Toast'
import Toast from '@/components/ui/Toast'
import PropertyUnitsManager from '@/components/backoffice/imoveis/PropertyUnitsManager'
import PropertyEvents from '@/components/backoffice/imoveis/PropertyEvents'
import TrackedLinksList from '@/components/backoffice/imoveis/TrackedLinksList'
import PropertyAnalytics from '@/components/backoffice/imoveis/PropertyAnalytics'

type TabType = 'details' | 'units' | 'tracking' | 'events' | 'analytics'

export default function EditarImovelPage() {
    const router = useRouter()
    const { id } = useParams()
    const { toasts, showToast, removeToast } = useToast()
    const [activeTab, setActiveTab] = useState<TabType>('details')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { development, isLoading, error, mutate } = useDevelopment(id as string)

    useEffect(() => {
        if (error) {
            showToast('Erro ao carregar empreendimento', 'error')
            router.push('/backoffice/imoveis')
        }
    }, [error, router, showToast])

    const handleUpdate = async (data: any) => {
        setIsSubmitting(true)
        try {
            await updateDevelopment(id as string, data)
            showToast('Empreendimento atualizado com sucesso', 'success')
            mutate()
        } catch (err: any) {
            showToast(err.message || 'Erro ao atualizar', 'error')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading || !development) {
        return (
            <div className="p-8 max-w-[1400px] mx-auto animate-pulse">
                <div className="h-20 bg-imi-50 rounded-2xl mb-12"></div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1 h-64 bg-imi-50 rounded-2xl"></div>
                    <div className="lg:col-span-3 h-[600px] bg-imi-50 rounded-2xl"></div>
                </div>
            </div>
        )
    }

    const tabs = [
        { id: 'details', label: 'Detalhes & Mídia', icon: Building2 },
        { id: 'units', label: 'Unidades & Tipologias', icon: Layers },
        { id: 'tracking', label: 'Links & Campanhas', icon: LinkIcon },
        { id: 'events', label: 'Histórico & Eventos', icon: ShieldCheck },
        { id: 'analytics', label: 'Analytics em Breve', icon: BarChart3 },
    ]

    return (
        <div className="p-8 max-w-[1400px] mx-auto pb-40">
            {/* Toast System */}
            <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
                {toasts.map(toast => (
                    <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
                ))}
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 animate-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => router.push('/backoffice/imoveis')}
                        className="w-12 h-12 bg-white rounded-2xl border border-imi-100 flex items-center justify-center hover:bg-imi-50 transition-all shadow-soft"
                    >
                        <ChevronLeft className="w-5 h-5 text-imi-900" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`w-2 h-2 rounded-full ${development.status_commercial === 'published' ? 'bg-green-500' : 'bg-imi-300'}`}></span>
                            <span className="text-[10px] font-black text-imi-400 uppercase tracking-widest">{development.status_commercial} • ID: {development.id.split('-')[0]}</span>
                        </div>
                        <h1 className="text-3xl font-bold text-imi-900 tracking-tight font-display">{development.title}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-imi-100 shadow-soft">
                    <div className="px-4 py-1 text-center border-r border-imi-50">
                        <div className="text-[10px] font-black text-imi-300 uppercase tracking-widest">Score</div>
                        <div className="text-xl font-black text-imi-900">{development.inventory_score || 0}</div>
                    </div>
                    <div className="px-4 py-1 text-center">
                        <div className="text-[10px] font-black text-imi-300 uppercase tracking-widest">Leads</div>
                        <div className="text-xl font-black text-imi-900">{development.leads_count || 0}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1 space-y-3">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all font-bold text-xs uppercase tracking-widest border-l-4 ${activeTab === tab.id
                                ? 'bg-white border-imi-900 text-imi-900 shadow-soft translate-x-2'
                                : 'bg-transparent border-transparent text-imi-400 hover:bg-imi-50/50 hover:text-imi-600'
                                }`}
                        >
                            <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-imi-900' : 'text-imi-300'}`} />
                            {tab.label}
                        </button>
                    ))}

                    <div className="pt-8 px-6 text-xs text-imi-300 leading-relaxed font-medium italic">
                        Alterações são refletidas automaticamente no portal público e apps conectados.
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    {activeTab === 'details' && (
                        <div className="animate-in fade-in zoom-in-95 duration-300">
                            <DevelopmentForm
                                initialData={development}
                                onSubmit={handleUpdate}
                                isSubmitting={isSubmitting}
                            />
                        </div>
                    )}

                    {activeTab === 'units' && (
                        <div className="animate-in fade-in zoom-in-95 duration-300">
                            <PropertyUnitsManager propertyId={development.id} />
                        </div>
                    )}

                    {activeTab === 'tracking' && (
                        <div className="animate-in fade-in zoom-in-95 duration-300">
                            <TrackedLinksList propertyId={development.id} property={development} />
                        </div>
                    )}

                    {activeTab === 'events' && (
                        <div className="animate-in fade-in zoom-in-95 duration-300">
                            <PropertyEvents propertyId={development.id} />
                        </div>
                    )}

                    {activeTab === 'analytics' && (
                        <div className="animate-in zoom-in-95 duration-300">
                            <PropertyAnalytics propertyId={development.id} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
