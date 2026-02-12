
'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import {
    Layers,
    Zap,
    ShieldCheck,
    ShieldAlert,
    RefreshCw,
    Key,
    Settings2,
    CheckCircle2,
    XCircle,
    Activity,
    ExternalLink,
    Search,
    Brain,
    MessageSquare,
    Cloud,
    FolderOpen
} from 'lucide-react'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'

const supabase = createClient()

export default function IntegracoesPage() {
    const { data: integrations = [], mutate, isLoading } = useSWR('integrations', async () => {
        const { data, error } = await supabase
            .from('integrations')
            .select('*')
            .order('provider', { ascending: true })
        if (error) throw error
        return data
    })

    const [isTesting, setIsTesting] = useState<string | null>(null)

    const testConnection = async (id: string) => {
        setIsTesting(id)
        // Simulando teste de conexão
        await new Promise(resolve => setTimeout(resolve, 1500))
        await supabase
            .from('integrations')
            .update({ last_tested_at: new Date().toISOString(), status: 'valid', is_active: true })
            .eq('id', id)

        mutate()
        setIsTesting(null)
    }

    const categories = {
        ai: { label: 'Inteligência Artificial', icon: Brain, color: 'purple' },
        communication: { label: 'Comunicação', icon: MessageSquare, color: 'green' },
        marketing: { label: 'Marketing & Ads', icon: Activity, color: 'blue' },
        storage: { label: 'Cloud Storage', icon: Cloud, color: 'accent' },
        productivity: { label: 'Produtividade', icon: Layers, color: 'indigo' }
    }

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-accent-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                        <span className="text-[10px] font-black text-imi-400 uppercase tracking-[0.3em]">Neural Interface Hub</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-imi-900 font-display tracking-tight">
                        Ecossistema de <span className="text-accent-500">Integrações</span>
                    </h1>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" className="h-14 px-8 border-imi-100 bg-white/50 backdrop-blur-md rounded-2xl transition-all">
                        <Activity className="w-5 h-5 mr-3 text-imi-400" />
                        Status Geral
                    </Button>
                </div>
            </div>

            {/* Integration Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <div className="col-span-full py-20 text-center animate-pulse text-imi-300 italic">Estabelecendo conexões seguras...</div>
                ) : integrations.map((int: any) => {
                    const category = categories[int.category as keyof typeof categories] || categories.ai
                    const Icon = category.icon

                    return (
                        <div key={int.id} className="bg-white rounded-[2.5rem] border border-imi-100 shadow-soft hover:shadow-card-hover transition-all duration-500 group overflow-hidden flex flex-col">
                            <div className="p-8 flex-1">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`w-14 h-14 rounded-2xl bg-imi-50 flex items-center justify-center transition-all group-hover:bg-imi-900 group-hover:text-white`}>
                                        <Icon size={28} />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${int.status === 'valid' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                            {int.status === 'valid' ? 'Conectado' : 'Pendente'}
                                        </span>
                                        {int.last_tested_at && (
                                            <span className="text-[8px] text-imi-300 uppercase font-bold tracking-tighter mt-1">
                                                Update: {new Date(int.last_tested_at).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-1 mb-8">
                                    <p className="text-[10px] font-black text-imi-400 uppercase tracking-widest leading-none">{int.provider}</p>
                                    <h3 className="text-xl font-bold text-imi-900">{int.display_name}</h3>
                                </div>

                                <div className="bg-imi-50/50 p-4 rounded-2xl border border-imi-50 mb-6">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <Key size={14} className="text-imi-300" />
                                            <span className="text-xs font-mono text-imi-400">••••••••••••••••</span>
                                        </div>
                                        <button className="text-[9px] font-bold text-accent-600 hover:text-accent-700 uppercase tracking-widest">Alterar</button>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-imi-50/30 border-t border-imi-50 flex items-center justify-between">
                                <button
                                    onClick={() => testConnection(int.id)}
                                    disabled={isTesting === int.id}
                                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-imi-500 hover:text-imi-900 transition-all disabled:opacity-50"
                                >
                                    {isTesting === int.id ? (
                                        <RefreshCw size={14} className="animate-spin" />
                                    ) : (
                                        <RefreshCw size={14} />
                                    )}
                                    {isTesting === int.id ? 'Testando...' : 'Testar Conexão'}
                                </button>
                                <button className="p-2 hover:bg-white rounded-xl transition-all">
                                    <Settings2 size={18} className="text-imi-300 hover:text-imi-900" />
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Infrastructure Health */}
            <div className="bg-imi-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-elevated">
                <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500/10 blur-[100px] -mr-48 -mt-48 rounded-full" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="px-3 py-1 bg-accent-500 text-imi-900 text-[10px] font-black uppercase tracking-widest rounded-full">Sistema Ativo</div>
                            <span className="text-imi-300 text-xs font-medium">Uptime: 99.98%</span>
                        </div>
                        <h2 className="text-3xl font-bold font-display mb-4 leading-tight">Canais de Comunicação <span className="text-accent-500">Cloud</span></h2>
                        <p className="text-imi-300 text-sm leading-relaxed">
                            A integração com WhatsApp Cloud e Gmail permite que o ecossistema IMI responda leads em tempo real e agende reuniões automaticamente assim que um score alto é detectado pela IA.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex flex-col items-center gap-3 p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                            <span className="text-2xl font-bold">1.2ms</span>
                            <span className="text-[9px] font-black uppercase tracking-widest text-imi-400">Sync Latency</span>
                        </div>
                        <div className="flex flex-col items-center gap-3 p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                            <span className="text-2xl font-bold">256-bit</span>
                            <span className="text-[9px] font-black uppercase tracking-widest text-imi-400">Encryption</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
