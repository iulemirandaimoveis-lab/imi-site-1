'use client'

import { useState } from 'react'
import { ChevronRight, Building2, MapPin, Loader2, Save } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Button from '@/components/ui/Button'

// Types for form data
interface PropertyForm {
    name: string
    type: string
    status_commercial: string
    price_from: string
    city: string
    description: string
}

export default function NewPropertyPage() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const [formData, setFormData] = useState<PropertyForm>({
        name: '',
        type: 'apartment',
        status_commercial: 'draft',
        price_from: '',
        city: '',
        description: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Generate slug from name
            const slug = formData.name
                .toLowerCase()
                .normalize('NFD') // decomposed characters
                .replace(/[\u0300-\u036f]/g, '') // remove accents
                .replace(/[^a-z0-9]+/g, '-') // special chars to dash
                .replace(/^-+|-+$/g, '') // trim dashes

            const { data, error } = await supabase
                .from('developments')
                .insert([
                    {
                        name: formData.name,
                        slug: slug + '-' + Date.now().toString().slice(-4), // Ensure uniqueness
                        type: formData.type,
                        status_commercial: formData.status_commercial,
                        price_from: formData.price_from ? parseFloat(formData.price_from) : null,
                        city: formData.city,
                        description: formData.description,
                        // Default values for required fields if any
                        address: formData.city, // Fallback if address is required
                        neighborhood: 'Centro' // Fallback
                    }
                ])
                .select()

            if (error) {
                console.error('Submission error:', error)
                toast.error('Erro detalhado: ' + error.message)
            } else {
                toast.success('Imóvel criado com sucesso!')
                router.push('/backoffice/imoveis')
            }
        } catch (err: any) {
            console.error('Unexpected error:', err)
            toast.error('Erro de conexão ou código: ' + (err.message || String(err)))
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-24 animate-fade-in text-gray-900 dark:text-gray-100">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-display font-bold">Adicionar Novo Imóvel</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Cadastre um novo empreendimento no sistema.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-card-dark rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Building2 size={20} className="text-primary" />
                        Informações Básicas
                    </h3>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nome do Empreendimento *</label>
                        <input
                            required
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            type="text"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-gray-400"
                            placeholder="Ex: Residencial Horizon Lake"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Tipo de Imóvel</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option value="apartment">Apartamento</option>
                                <option value="house">Casa</option>
                                <option value="commercial">Comercial</option>
                                <option value="land">Terreno</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Status Comercial</label>
                            <select
                                name="status_commercial"
                                value={formData.status_commercial}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option value="draft">Rascunho</option>
                                <option value="launch">Lançamento</option>
                                <option value="construction">Em Obras</option>
                                <option value="ready">Pronto para Morar</option>
                                <option value="published">Publicado</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Preço Inicial (R$)</label>
                            <input
                                name="price_from"
                                value={formData.price_from}
                                onChange={handleChange}
                                type="number"
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-gray-400"
                                placeholder="0,00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Cidade</label>
                            <input
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-gray-400"
                                placeholder="Ex: São Paulo"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Descrição</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-gray-400 resize-none"
                            placeholder="Descreva o empreendimento..."
                        />
                    </div>
                </div>

                <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
                    <Button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-3 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        Cancelar
                    </Button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-3 bg-primary text-white rounded-lg font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <>
                                <Save size={20} />
                                Salvar Imóvel
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}
