'use client'

import React, { useState } from 'react'
import { ChevronLeft, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { PropertyForm, createProperty, PropertyFormData } from '@/modules/imoveis'
import { useToast } from '@/components/ui/Toast'
import Toast from '@/components/ui/Toast'

export default function NovoImovelPage() {
    const router = useRouter()
    const { toasts, showToast, removeToast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleSubmit(data: PropertyFormData) {
        setIsSubmitting(true)

        try {
            const property = await createProperty(data)
            showToast('Ativo imobiliário cadastrado com sucesso!', 'success')

            // Pequeno delay para o usuário ver o toast antes do redirecionamento
            setTimeout(() => {
                router.push(`/backoffice/imoveis/${property.id}`)
            }, 1500)
        } catch (err: any) {
            showToast(err.message || 'Falha ao processar cadastro do ativo', 'error')
            setIsSubmitting(false)
        }
    }

    return (
        <div className="p-8 max-w-[1200px] mx-auto">
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

            {/* Navigation Header */}
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => router.back()}
                        className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-all shadow-sm group"
                    >
                        <ChevronLeft className="w-5 h-5 text-imi-900 group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-0.5 bg-imi-900"></div>
                            <span className="text-[10px] font-bold text-imi-500 uppercase tracking-widest">New Asset Creation</span>
                        </div>
                        <h1 className="text-3xl font-bold text-imi-900 tracking-tight">Expandir Portfólio</h1>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Form Area */}
                <div className="lg:col-span-2">
                    <PropertyForm
                        onSubmit={handleSubmit}
                        onCancel={() => router.push('/backoffice/imoveis')}
                        isSubmitting={isSubmitting}
                    />
                </div>

                {/* Support Sidebar */}
                <div className="hidden lg:block space-y-8">
                    <div className="bg-imi-900 rounded-3xl p-8 text-white shadow-xl">
                        <h4 className="text-sm font-bold uppercase tracking-widest mb-4 text-imi-400">Diretrizes de Qualidade</h4>
                        <ul className="space-y-4 text-sm text-imi-100">
                            <li className="flex gap-3">
                                <div className="w-5 h-5 bg-imi-800 rounded flex items-center justify-center flex-shrink-0 text-[10px] font-bold">01</div>
                                <p><strong>Nomenclatura Padrão:</strong> Utilize nomes comerciais limpos, sem emojis ou caracteres especiais.</p>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-5 h-5 bg-imi-800 rounded flex items-center justify-center flex-shrink-0 text-[10px] font-bold">02</div>
                                <p><strong>Localização Precisa:</strong> Garanta que o bairro e cidade estejam corretos para filtros precisos no website.</p>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-5 h-5 bg-imi-800 rounded flex items-center justify-center flex-shrink-0 text-[10px] font-bold">03</div>
                                <p><strong>Pricing:</strong> O preço "a partir de" é o gatilho principal de conversão nas listagens públicas.</p>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                        <h4 className="text-sm font-bold text-imi-900 uppercase tracking-widest mb-4">Próximos Passos</h4>
                        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                            Após o cadastro inicial, você será direcionado para a central de inteligência do ativo, onde poderá realizar o upload de mídias, gerenciar unidades e configurar links de rastreamento.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-imi-900/40">
                                <div className="w-2 h-2 rounded-full bg-current"></div>
                                <span className="text-xs font-bold uppercase tracking-tighter">Mídias e Fotos</span>
                            </div>
                            <div className="flex items-center gap-3 text-imi-900/40">
                                <div className="w-2 h-2 rounded-full bg-current"></div>
                                <span className="text-xs font-bold uppercase tracking-tighter">Inventário de Unidades</span>
                            </div>
                            <div className="flex items-center gap-3 text-imi-900/40">
                                <div className="w-2 h-2 rounded-full bg-current"></div>
                                <span className="text-xs font-bold uppercase tracking-tighter">Configurações de SEO</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
