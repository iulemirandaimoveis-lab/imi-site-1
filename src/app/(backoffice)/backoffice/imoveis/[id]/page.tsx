'use client'

import React, { useState, useEffect } from 'react'
import { ChevronLeft, Building2, Image as ImageIcon, Layers, BarChart3, Link as LinkIcon, Settings2, ShieldCheck } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import Button from '@/components/ui/Button'
import {
    PropertyForm,
    MediaUploader,
    useProperty,
    updateProperty,
    PropertyFormData,
    calculatePropertyScore,
    formatCurrency
} from '@/modules/imoveis'
import { useToast } from '@/components/ui/Toast'
import Toast from '@/components/ui/Toast'

type TabType = 'basic' | 'media' | 'units' | 'analytics' | 'tracking' | 'events'

export default function EditarImovelPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string
    const { toasts, showToast, removeToast } = useToast()

    const { property, isLoading, mutate, error } = useProperty(id)
    const [activeTab, setActiveTab] = useState<TabType>('basic')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Redirecionar se erro ou se tentar acessar 'novo' via rota dinâmica
    useEffect(() => {
        if (id === 'novo') router.replace('/backoffice/imoveis/novo')
        if (error) {
            showToast('Falha ao localizar o ativo imobiliário', 'error')
            router.push('/backoffice/imoveis')
        }
    }, [id, error, router, showToast])

    if (isLoading || !property) {
        return (
            <div className="p-8 max-w-[1400px] mx-auto animate-pulse">
                <div className="h-20 bg-slate-50 rounded-2xl mb-12"></div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1 h-64 bg-slate-50 rounded-2xl"></div>
                    <div className="lg:col-span-3 h-[600px] bg-slate-50 rounded-2xl"></div>
                </div>
            </div>
        )
    }

    const score = calculatePropertyScore(property)

    async function handleUpdateBasic(data: PropertyFormData) {
        setIsSubmitting(true)
        try {
            await updateProperty(id, data)
            showToast('Inteligência básica atualizada com sucesso', 'success')
            mutate()
        } catch (err: any) {
            showToast(err.message || 'Erro ao persistir alterações', 'error')
        } finally {
            setIsSubmitting(false)
        }
    }

    async function handleUpdateMedia(mediaData: any) {
        try {
            await updateProperty(id, mediaData)
            showToast('Portfólio de mídia atualizado', 'success')
            mutate()
        } catch (err: any) {
            showToast(err.message || 'Erro ao processar uploads', 'error')
        }
    }

    const tabs = [
        { id: 'basic', label: 'Inteligência Básica', icon: Building2 },
        { id: 'media', label: 'Portfólio de Mídia', icon: ImageIcon },
        { id: 'units', label: 'Mapa de Unidades', icon: Layers },
        { id: 'tracking', label: 'Performance de Links', icon: LinkIcon },
        { id: 'analytics', label: 'Estatísticas Reais', icon: BarChart3 },
        { id: 'events', label: 'Protocolos e Eventos', icon: ShieldCheck },
    ]

    return (
        <div className="p-8 max-w-[1400px] mx-auto">
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

            {/* Control Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => router.push('/backoffice/imoveis')}
                        className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <ChevronLeft className="w-5 h-5 text-imi-900" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`w-2 h-2 rounded-full ${property.status === 'active' ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                            <span className="text-[10px] font-bold text-imi-500 uppercase tracking-widest">{property.status} • Asset ID: {id.split('-')[0]}</span>
                        </div>
                        <h1 className="text-3xl font-bold text-imi-900 tracking-tight">{property.name}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="px-4 py-2 text-center border-r border-slate-100">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inventory Score</div>
                        <div className={`text-xl font-black ${score > 80 ? 'text-green-600' : score > 50 ? 'text-imi-600' : 'text-orange-500'}`}>{score}</div>
                    </div>
                    <div className="px-4 py-2 text-center">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Reach</div>
                        <div className="text-xl font-black text-imi-900">{property.views || 0}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Navigation Sidebar */}
                <div className="lg:col-span-1 space-y-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all font-bold text-xs uppercase tracking-widest border-2 ${activeTab === tab.id
                                    ? 'bg-imi-900 text-white border-imi-900 shadow-lg shadow-imi-900/10'
                                    : 'bg-white text-slate-400 border-white hover:border-slate-100 hover:text-slate-600'
                                }`}
                        >
                            <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-imi-400' : 'text-slate-200'}`} />
                            {tab.label}
                        </button>
                    ))}

                    <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100 italic">
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">
                            "Toda alteração neste módulo reflete em tempo real no website público e nos portais integrados (Fase 4)."
                        </p>
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    {activeTab === 'basic' && (
                        <div className="animate-in fade-in duration-500">
                            <PropertyForm
                                property={property}
                                onSubmit={handleUpdateBasic}
                                onCancel={() => router.push('/backoffice/imoveis')}
                                isSubmitting={isSubmitting}
                            />
                        </div>
                    )}

                    {activeTab === 'media' && (
                        <div className="animate-in fade-in duration-500">
                            <MediaUploader
                                propertyId={property.id}
                                images={property.gallery_images || []}
                                floorPlans={property.floor_plans || []}
                                videos={property.videos || []}
                                virtualTourUrl={property.virtual_tour_url}
                                brochureUrl={property.brochure_url}
                                onUpdate={handleUpdateMedia}
                            />
                        </div>
                    )}

                    {(activeTab === 'units' || activeTab === 'analytics' || activeTab === 'tracking' || activeTab === 'events') && (
                        <div className="bg-white rounded-3xl border border-slate-100 p-20 text-center animate-in zoom-in-95 duration-300">
                            <Settings2 className="w-16 h-16 text-slate-100 mx-auto mb-6" />
                            <h3 className="text-xl font-bold text-imi-900 mb-2 font-display uppercase tracking-widest">Módulo em Integração</h3>
                            <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                                Esta funcionalidade estratégica está agendada para o ciclo de expansão (Fase 2-3 do cronograma oficial).
                            </p>
                            <div className="mt-8 pt-8 border-t border-slate-50 flex justify-center gap-8">
                                <div className="text-center">
                                    <div className="text-[10px] font-bold text-slate-300 uppercase mb-1">Status</div>
                                    <div className="text-xs font-bold text-imi-600 uppercase tracking-tighter">Desenvolvimento</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-[10px] font-bold text-slate-300 uppercase mb-1">Prioridade</div>
                                    <div className="text-xs font-bold text-imi-600 uppercase tracking-tighter">Alta</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
