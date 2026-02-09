'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Plus, Edit, Trash2, Building2, Upload, X, DollarSign, MapPin } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Toast, { useToast } from '@/components/ui/Toast'
import { uploadMultipleFiles, deleteFile } from '@/lib/supabase/storage'

interface Development {
    id: string
    name: string
    slug: string
    description: string | null
    neighborhood: string
    city: string
    state: string
    price_from: number
    units: number
    status: string
    delivery: string | null
    image: string | null
    developer_id: string | null
    gallery_images: string[] | null
    floor_plans: string[] | null
    videos: string[] | null
    created_at: string
}

interface Developer {
    id: string
    name: string
}

export default function DevelopmentsPage() {
    const supabase = createClientComponentClient()
    const { toasts, showToast, removeToast } = useToast()
    const [developments, setDevelopments] = useState<Development[]>([])
    const [developers, setDevelopers] = useState<Developer[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingDevelopment, setEditingDevelopment] = useState<Development | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        neighborhood: '',
        city: 'João Pessoa',
        state: 'PB',
        price_from: 0,
        units: 0,
        status: 'Lançamento',
        delivery: '',
        image: '',
        developer_id: '',
        gallery_images: [] as string[],
        floor_plans: [] as string[],
        videos: [] as string[]
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        setIsLoading(true)
        try {
            const [devsRes, developersRes] = await Promise.all([
                supabase.from('developments').select('*').order('created_at', { ascending: false }),
                supabase.from('developers').select('id, name').eq('active', true).order('name')
            ])

            if (devsRes.error) throw devsRes.error
            if (developersRes.error) throw developersRes.error

            setDevelopments(devsRes.data || [])
            setDevelopers(developersRes.data || [])
        } catch (err: any) {
            showToast(err.message || 'Erro ao carregar dados', 'error')
        } finally {
            setIsLoading(false)
        }
    }

    function validateForm() {
        const newErrors: Record<string, string> = {}
        if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório'
        if (!formData.neighborhood.trim()) newErrors.neighborhood = 'Bairro é obrigatório'
        if (formData.price_from <= 0) newErrors.price_from = 'Preço deve ser maior que zero'
        if (formData.units <= 0) newErrors.units = 'Unidades deve ser maior que zero'
        if (!formData.developer_id) newErrors.developer_id = 'Construtora é obrigatória'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 5 * 1024 * 1024) {
            showToast('Imagem principal deve ter no máximo 5MB', 'error')
            return
        }

        setIsUploading(true)
        try {
            const { urls, errors } = await uploadMultipleFiles('developments', [file])
            if (errors.length) throw errors[0]
            if (urls.length > 0) {
                setFormData(prev => ({ ...prev, image: urls[0] }))
                showToast('Imagem principal carregada', 'success')
            }
        } catch (err: any) {
            showToast('Erro no upload da imagem principal', 'error')
        } finally {
            setIsUploading(false)
        }
    }

    async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files
        if (!files || files.length === 0) return

        setIsUploading(true)
        try {
            const fileArray = Array.from(files)
            const { urls, errors } = await uploadMultipleFiles('developments', fileArray)

            if (errors.length) showToast(`${errors.length} imagens falharam. Tente novamente.`, 'error')
            if (urls.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    gallery_images: [...prev.gallery_images, ...urls]
                }))
                showToast(`${urls.length} imagens adicionadas à galeria`, 'success')
            }
        } catch (err) {
            showToast('Erro no upload da galeria', 'error')
        } finally {
            setIsUploading(false)
        }
    }

    async function handleFloorPlansUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files
        if (!files || files.length === 0) return

        setIsUploading(true)
        try {
            const fileArray = Array.from(files)
            const { urls, errors } = await uploadMultipleFiles('developments', fileArray)

            if (errors.length) showToast(`${errors.length} plantas falharam`, 'error')
            if (urls.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    floor_plans: [...prev.floor_plans, ...urls]
                }))
                showToast(`${urls.length} plantas adicionadas`, 'success')
            }
        } catch (err) {
            showToast('Erro no upload das plantas', 'error')
        } finally {
            setIsUploading(false)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!validateForm()) {
            showToast('Preencha os campos obrigatórios corretamente', 'error')
            return
        }

        setIsSaving(true)
        try {
            const payload = {
                ...formData,
                developer_id: formData.developer_id || null,
                delivery: formData.delivery || null,
                slug: formData.slug || formData.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-')
            }

            if (editingDevelopment) {
                const { error } = await supabase
                    .from('developments')
                    .update(payload)
                    .eq('id', editingDevelopment.id)
                if (error) throw error
                showToast('Imóvel atualizado com sucesso', 'success')
            } else {
                const { error } = await supabase
                    .from('developments')
                    .insert([payload])
                if (error) throw error
                showToast('Imóvel criado com sucesso', 'success')
            }

            setIsModalOpen(false)
            resetForm()
            fetchData()
        } catch (err: any) {
            showToast(err.message || 'Erro ao salvar imóvel', 'error')
        } finally {
            setIsSaving(false)
        }
    }

    async function handleDelete(id: string, image: string | null, gallery: string[] | null, plans: string[] | null) {
        if (!confirm('Tem certeza que deseja excluir este imóvel? Todas as imagens serão apagadas.')) return

        try {
            const allUrls = [image, ...(gallery || []), ...(plans || [])].filter(Boolean) as string[]

            // Delete files efficiently
            await Promise.all(allUrls.map(async (url) => {
                const path = url.split('/').pop()
                if (path) await deleteFile('developments', path)
            }))

            const { error } = await supabase
                .from('developments')
                .delete()
                .eq('id', id)

            if (error) throw error
            showToast('Imóvel excluído com sucesso', 'success')
            fetchData()
        } catch (err: any) {
            showToast('Erro ao excluir imóvel', 'error')
        }
    }

    function openEditModal(development: Development) {
        setEditingDevelopment(development)
        setFormData({
            name: development.name,
            slug: development.slug,
            description: development.description || '',
            neighborhood: development.neighborhood,
            city: development.city,
            state: development.state,
            price_from: development.price_from,
            units: development.units,
            status: development.status,
            delivery: development.delivery || '',
            image: development.image || '',
            developer_id: development.developer_id || '',
            gallery_images: development.gallery_images || [],
            floor_plans: development.floor_plans || [],
            videos: development.videos || []
        })
        setErrors({})
        setIsModalOpen(true)
    }

    function resetForm() {
        setFormData({
            name: '',
            slug: '',
            description: '',
            neighborhood: '',
            city: 'João Pessoa',
            state: 'PB',
            price_from: 0,
            units: 0,
            status: 'Lançamento',
            delivery: '',
            image: '',
            developer_id: '',
            gallery_images: [],
            floor_plans: [],
            videos: []
        })
        setEditingDevelopment(null)
        setErrors({})
    }

    function removeGalleryImage(index: number) {
        setFormData(prev => ({
            ...prev,
            gallery_images: prev.gallery_images.filter((_, i) => i !== index)
        }))
    }

    function removeFloorPlan(index: number) {
        setFormData(prev => ({
            ...prev,
            floor_plans: prev.floor_plans.filter((_, i) => i !== index)
        }))
    }

    if (isLoading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-slate-200 rounded w-1/4"></div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (<div key={i} className="h-96 bg-slate-200 rounded-xl"></div>))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-8">
            {toasts.map(toast => (
                <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
            ))}

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-navy-900">Imóveis</h1>
                    <p className="text-slate-600 mt-1">{developments.length} empreendimentos cadastrados</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="w-5 h-5 mr-2" />
                    Novo Imóvel
                </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {developments.map((dev) => (
                    <div key={dev.id} className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-lg transition-all group">
                        <div className="relative h-48">
                            {dev.image ? (
                                <img src={dev.image} alt={dev.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                    <Building2 className="w-12 h-12 text-slate-300" />
                                </div>
                            )}
                            <div className="absolute top-2 right-2">
                                <span className={`px-2 py-1 rounded text-xs font-bold shadow-sm ${dev.status === 'Pronto' ? 'bg-green-500 text-white' :
                                        dev.status === 'Em Obras' ? 'bg-blue-500 text-white' :
                                            'bg-navy-900 text-white'
                                    }`}>
                                    {dev.status}
                                </span>
                            </div>
                        </div>

                        <div className="p-6">
                            <h3 className="text-xl font-bold text-navy-900 mb-1 truncate" title={dev.name}>{dev.name}</h3>
                            <p className="text-sm text-slate-600 mb-4 flex items-center gap-1">
                                <MapPin className="w-4 h-4" /> {dev.neighborhood}, {dev.city}
                            </p>

                            <div className="bg-slate-50 p-3 rounded-lg mb-4">
                                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">A partir de</p>
                                <p className="text-lg font-bold text-navy-900 flex items-center gap-1">
                                    <DollarSign className="w-4 h-4 text-green-600" />
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(dev.price_from)}
                                </p>
                            </div>

                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="sm" variant="outline" onClick={() => openEditModal(dev)} className="flex-1">
                                    <Edit className="w-4 h-4 mr-1" /> Editar
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDelete(dev.id, dev.image, dev.gallery_images, dev.floor_plans)}
                                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200"
                                >
                                    <Trash2 className="w-4 h-4 mr-1" /> Excluir
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between z-10">
                            <h2 className="text-2xl font-bold text-navy-900">
                                {editingDevelopment ? 'Editar Imóvel' : 'Novo Imóvel'}
                            </h2>
                            <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="p-2 hover:bg-slate-100 rounded-full">
                                <X className="w-6 h-6 text-slate-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-8">
                            {/* Informações Básicas */}
                            <section className="space-y-4">
                                <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider border-b pb-2">Informações Básicas</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Input
                                        label="Nome do Empreendimento *"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        error={errors.name}
                                        required
                                    />
                                    <div>
                                        <label className="block text-sm font-semibold text-navy-900 mb-2">Construtora *</label>
                                        <select
                                            value={formData.developer_id}
                                            onChange={(e) => setFormData(prev => ({ ...prev, developer_id: e.target.value }))}
                                            className={`w-full h-11 px-4 rounded-lg border ${errors.developer_id ? 'border-red-500' : 'border-slate-200'} focus:ring-2 focus:ring-navy-900 transition-all outline-none`}
                                        >
                                            <option value="">Selecione...</option>
                                            {developers.map(dev => <option key={dev.id} value={dev.id}>{dev.name}</option>)}
                                        </select>
                                        {errors.developer_id && <p className="text-xs text-red-500 mt-1">{errors.developer_id}</p>}
                                    </div>
                                </div>
                                <Textarea
                                    label="Descrição"
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    rows={4}
                                />
                            </section>

                            {/* Localização */}
                            <section className="space-y-4">
                                <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider border-b pb-2">Localização</h3>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <Input
                                        label="Bairro *"
                                        value={formData.neighborhood}
                                        onChange={(e) => setFormData(prev => ({ ...prev, neighborhood: e.target.value }))}
                                        error={errors.neighborhood}
                                        required
                                    />
                                    <Input
                                        label="Cidade *"
                                        value={formData.city}
                                        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                                        required
                                    />
                                    <Input
                                        label="Estado *"
                                        value={formData.state}
                                        onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                                        required
                                        maxLength={2}
                                    />
                                </div>
                            </section>

                            {/* Detalhes Comerciais */}
                            <section className="space-y-4">
                                <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider border-b pb-2">Detalhes Comerciais</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Input
                                        label="Preço Inicial (R$) *"
                                        type="number"
                                        value={formData.price_from}
                                        onChange={(e) => setFormData(prev => ({ ...prev, price_from: Number(e.target.value) }))}
                                        error={errors.price_from}
                                        required
                                        min={0}
                                    />
                                    <Input
                                        label="Total de Unidades *"
                                        type="number"
                                        value={formData.units}
                                        onChange={(e) => setFormData(prev => ({ ...prev, units: Number(e.target.value) }))}
                                        error={errors.units}
                                        required
                                        min={0}
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-navy-900 mb-2">Status da Obra</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                            className="w-full h-11 px-4 rounded-lg border border-slate-200 focus:ring-2 focus:ring-navy-900 outline-none"
                                        >
                                            <option value="Lançamento">Lançamento</option>
                                            <option value="Em Obras">Em Obras</option>
                                            <option value="Pronto">Pronto</option>
                                            <option value="Entregue">Entregue</option>
                                        </select>
                                    </div>
                                    <Input label="Previsão de Entrega" value={formData.delivery} onChange={(e) => setFormData(prev => ({ ...prev, delivery: e.target.value }))} placeholder="Ex: Dez/2026" />
                                </div>
                            </section>

                            {/* Mídia */}
                            <section className="space-y-6">
                                <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider border-b pb-2">Mídia & Imagens</h3>

                                {/* Imagem Principal */}
                                <div>
                                    <label className="block text-sm font-semibold text-navy-900 mb-2">Imagem de Capa (Principal)</label>
                                    <div className="flex gap-4 items-start">
                                        <div className="flex-1">
                                            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-navy-50 file:text-navy-700 hover:file:bg-navy-100" />
                                        </div>
                                    </div>
                                    {formData.image && (
                                        <div className="mt-4 relative inline-block">
                                            <img src={formData.image} alt="Capa" className="h-40 object-cover rounded-lg shadow-md" />
                                            <button type="button" onClick={() => setFormData(prev => ({ ...prev, image: '' }))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600"><X className="w-4 h-4" /></button>
                                        </div>
                                    )}
                                </div>

                                {/* Galeria */}
                                <div>
                                    <label className="block text-sm font-semibold text-navy-900 mb-2">Galeria de Fotos (Múltiplas)</label>
                                    <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} disabled={isUploading} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-navy-50 file:text-navy-700 hover:file:bg-navy-100" />

                                    {formData.gallery_images.length > 0 && (
                                        <div className="grid grid-cols-4 md:grid-cols-6 gap-4 mt-4 bg-slate-50 p-4 rounded-xl">
                                            {formData.gallery_images.map((url, i) => (
                                                <div key={i} className="relative group">
                                                    <img src={url} alt={`Galeria ${i}`} className="w-full h-24 object-cover rounded-lg shadow-sm" />
                                                    <button type="button" onClick={() => removeGalleryImage(i)} className="absolute top-1 right-1 bg-red-500/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"><X className="w-3 h-3" /></button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Plantas */}
                                <div>
                                    <label className="block text-sm font-semibold text-navy-900 mb-2">Plantas Baixas</label>
                                    <input type="file" accept="image/*" multiple onChange={handleFloorPlansUpload} disabled={isUploading} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-navy-50 file:text-navy-700 hover:file:bg-navy-100" />

                                    {formData.floor_plans.length > 0 && (
                                        <div className="grid grid-cols-4 md:grid-cols-6 gap-4 mt-4 bg-slate-50 p-4 rounded-xl">
                                            {formData.floor_plans.map((url, i) => (
                                                <div key={i} className="relative group">
                                                    <img src={url} alt={`Planta ${i}`} className="w-full h-24 object-contain bg-white rounded-lg shadow-sm border" />
                                                    <button type="button" onClick={() => removeFloorPlan(i)} className="absolute top-1 right-1 bg-red-500/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"><X className="w-3 h-3" /></button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </section>

                            <div className="flex gap-4 pt-4 border-t border-slate-200">
                                <Button type="submit" className="flex-1 h-12 text-lg" disabled={isSaving || isUploading}>
                                    {isSaving ? 'Salvando...' : (editingDevelopment ? 'Salvar Alterações' : 'Cadastrar Imóvel')}
                                </Button>
                                <Button type="button" variant="outline" className="flex-1 h-12 text-lg" onClick={() => { setIsModalOpen(false); resetForm(); }} disabled={isSaving}>
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
