'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, FileText, Video, Link as LinkIcon, Loader2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { uploadMedia } from '@/lib/supabase/storage'
import { useToast } from '@/components/ui/Toast'

interface MediaUploaderProps {
    propertyId: string
    images: string[]
    floorPlans: string[]
    videos: string[]
    virtualTourUrl: string | null
    brochureUrl: string | null
    onUpdate: (data: {
        gallery_images?: string[]
        floor_plans?: string[]
        videos?: string[]
        virtual_tour_url?: string | null
        brochure_url?: string | null
    }) => Promise<void>
}

export default function MediaUploader({
    propertyId,
    images,
    floorPlans,
    videos,
    virtualTourUrl,
    brochureUrl,
    onUpdate,
}: MediaUploaderProps) {
    const { showToast } = useToast()
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState<string>('')
    const [tourUrl, setTourUrl] = useState(virtualTourUrl || '')
    const [activeTab, setActiveTab] = useState<'images' | 'plans' | 'videos' | 'tour'>('images')

    const imageInputRef = useRef<HTMLInputElement>(null)
    const planInputRef = useRef<HTMLInputElement>(null)

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>, type: 'images' | 'plans') {
        const files = Array.from(e.target.files || [])
        if (files.length === 0) return

        setIsUploading(true)
        setUploadProgress(`Enviando ${files.length} arquivo(s)...`)

        try {
            const uploadedUrls: string[] = []

            for (let i = 0; i < files.length; i++) {
                const file = files[i]
                setUploadProgress(`Enviando ${i + 1}/${files.length}...`)

                // Use 'developments' bucket and organize by type
                const url = await uploadMedia(file, `${propertyId}/${type}`, 'developments')
                if (url) uploadedUrls.push(url)
            }

            const currentList = type === 'images' ? images : floorPlans
            const newList = [...currentList, ...uploadedUrls]

            await onUpdate(
                type === 'images'
                    ? { gallery_images: newList }
                    : { floor_plans: newList }
            )

            setUploadProgress('Upload concluído!')
            showToast('Arquivos enviados com sucesso', 'success')
            setTimeout(() => setUploadProgress(''), 2000)
        } catch (err: any) {
            showToast('Erro ao fazer upload: ' + err.message, 'error')
        } finally {
            setIsUploading(false)
            if (imageInputRef.current) imageInputRef.current.value = ''
            if (planInputRef.current) planInputRef.current.value = ''
        }
    }

    async function handleRemove(url: string, type: 'images' | 'plans') {
        if (!confirm('Tem certeza que deseja remover este arquivo?')) return

        try {
            // Note: Currently direct delete via client might be restricted or require specific RLS. 
            // For now we just remove from the array in DB.
            // Ideally we should also delete from storage.

            const currentList = type === 'images' ? images : floorPlans
            const newList = currentList.filter(img => img !== url)

            await onUpdate(
                type === 'images'
                    ? { gallery_images: newList }
                    : { floor_plans: newList }
            )
            showToast('Arquivo removido da galeria', 'success')
        } catch (err: any) {
            showToast('Erro ao remover arquivo: ' + err.message, 'error')
        }
    }

    async function handleSaveTourUrl() {
        try {
            await onUpdate({ virtual_tour_url: tourUrl || null })
            showToast('Link do tour virtual atualizado', 'success')
        } catch (err: any) {
            showToast('Erro ao salvar URL: ' + err.message, 'error')
        }
    }

    const tabs = [
        { id: 'images', label: 'Galeria', icon: ImageIcon, count: images.length },
        { id: 'plans', label: 'Plantas', icon: FileText, count: floorPlans.length },
        { id: 'videos', label: 'Vídeos', icon: Video, count: videos.length },
        { id: 'tour', label: 'Tour Virtual', icon: LinkIcon, count: virtualTourUrl ? 1 : 0 },
    ]

    return (
        <div className="bg-white rounded-2xl border border-imi-100 shadow-soft overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-imi-50 bg-imi-50/30">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-xs font-bold uppercase tracking-wider transition-all ${activeTab === tab.id
                            ? 'bg-white text-imi-900 border-b-2 border-imi-900 shadow-sm'
                            : 'text-imi-400 hover:text-imi-600 hover:bg-imi-50'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                        {tab.count > 0 && (
                            <span className="ml-1 px-1.5 py-0.5 bg-imi-100 text-imi-600 rounded-full text-[9px] font-black">
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Conteúdo */}
            <div className="p-8">
                {/* Galeria de Imagens */}
                {activeTab === 'images' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div>
                            <input
                                ref={imageInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => handleUpload(e, 'images')}
                                className="hidden"
                            />
                            <Button
                                variant="outline"
                                onClick={() => imageInputRef.current?.click()}
                                disabled={isUploading}
                                className="w-full h-14 border-dashed border-2 border-imi-200 hover:border-imi-400 hover:bg-imi-50 text-imi-500 font-bold uppercase tracking-widest"
                            >
                                <Upload className="w-5 h-5 mr-3" />
                                {isUploading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="animate-spin" /> {uploadProgress}
                                    </span>
                                ) : 'Adicionar Fotos à Galeria'}
                            </Button>
                            <p className="text-center text-[10px] uppercase tracking-widest text-imi-300 mt-2 font-bold">
                                Formatos: JPG, PNG, WEBP. Max: 5MB.
                            </p>
                        </div>

                        {images.length === 0 ? (
                            <div className="text-center py-12 bg-imi-50 rounded-2xl border border-dashed border-imi-100">
                                <ImageIcon className="w-12 h-12 mx-auto mb-3 text-imi-200" />
                                <p className="text-sm font-bold text-imi-400">Nenhuma foto enviada</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {images.map((img, index) => (
                                    <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-imi-100 bg-imi-50">
                                        <img
                                            src={img}
                                            alt={`Imagem ${index + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleRemove(img, 'images')}
                                                className="w-10 h-10 bg-white text-red-500 rounded-xl flex items-center justify-center hover:bg-red-50 transition-colors shadow-lg active:scale-95"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Plantas */}
                {activeTab === 'plans' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div>
                            <input
                                ref={planInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => handleUpload(e, 'plans')}
                                className="hidden"
                            />
                            <Button
                                variant="outline"
                                onClick={() => planInputRef.current?.click()}
                                disabled={isUploading}
                                className="w-full h-14 border-dashed border-2 border-imi-200 hover:border-imi-400 hover:bg-imi-50 text-imi-500 font-bold uppercase tracking-widest"
                            >
                                <FileText className="w-5 h-5 mr-3" />
                                {isUploading ? uploadProgress : 'Adicionar Plantas Humanizadas'}
                            </Button>
                        </div>

                        {floorPlans.length === 0 ? (
                            <div className="text-center py-12 bg-imi-50 rounded-2xl border border-dashed border-imi-100">
                                <FileText className="w-12 h-12 mx-auto mb-3 text-imi-200" />
                                <p className="text-sm font-bold text-imi-400">Nenhuma planta cadastrada</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                                {floorPlans.map((plan, index) => (
                                    <div key={index} className="relative group aspect-[3/4] rounded-xl overflow-hidden border border-imi-100 bg-white p-2">
                                        <img
                                            src={plan}
                                            alt={`Planta ${index + 1}`}
                                            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                                            <button
                                                onClick={() => handleRemove(plan, 'plans')}
                                                className="w-10 h-10 bg-white text-red-500 rounded-xl flex items-center justify-center hover:bg-red-50 transition-colors shadow-lg active:scale-95"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Vídeos */}
                {activeTab === 'videos' && (
                    <div className="text-center py-20 bg-imi-50 rounded-2xl border border-imi-100 animate-in fade-in duration-300">
                        <Video className="w-12 h-12 mx-auto mb-4 text-imi-200" />
                        <h4 className="text-imi-900 font-bold mb-1 uppercase tracking-widest">Upload de Vídeos</h4>
                        <p className="text-xs text-imi-400 font-medium">Integração nativa com YouTube e Vimeo em breve.</p>
                    </div>
                )}

                {/* Tour Virtual */}
                {activeTab === 'tour' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div className="bg-imi-50 p-6 rounded-2xl border border-imi-100">
                            <h4 className="text-xs font-black text-imi-400 uppercase tracking-widest mb-4">Link Tour 360°</h4>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <Input
                                        value={tourUrl}
                                        onChange={(e) => setTourUrl(e.target.value)}
                                        placeholder="https://my.matterport.com/show/?m=..."
                                        className="bg-white"
                                    />
                                </div>
                                <div className="flex items-end mb-1">
                                    <Button onClick={handleSaveTourUrl} className="h-11 bg-imi-900 text-white hover:bg-black rounded-xl uppercase tracking-widest font-bold text-xs px-6">
                                        Vincular
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {virtualTourUrl ? (
                            <div className="relative aspect-video rounded-2xl overflow-hidden border border-imi-200 shadow-sm bg-black group cursor-pointer">
                                <div className="absolute inset-0 flex items-center justify-center text-white flex-col gap-4 group-hover:scale-105 transition-transform duration-700">
                                    <LinkIcon className="w-12 h-12 text-imi-400" />
                                    <div className="text-center">
                                        <p className="font-bold uppercase tracking-widest text-sm">Tour Virtual Ativo</p>
                                        <a
                                            href={virtualTourUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-imi-300 hover:text-white underline mt-1 block"
                                        >
                                            Clique para testar a experiência
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-imi-100">
                                <LinkIcon className="w-12 h-12 mx-auto mb-3 text-imi-100" />
                                <p className="text-sm font-bold text-imi-400">Nenhum tour vinculado</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
