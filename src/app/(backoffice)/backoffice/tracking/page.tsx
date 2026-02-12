
'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import {
    Link as LinkIcon,
    MousePointerClick,
    Plus,
    Copy,
    ExternalLink,
    QrCode,
    BarChart3,
    Search,
    Filter,
    MoreVertical,
    Zap,
    Trash2,
    Calendar
} from 'lucide-react'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import { format } from 'date-fns'

const supabase = createClient()

export default function TrackingPage() {
    const [search, setSearch] = useState('')

    const { data: links = [], mutate, isLoading } = useSWR('tracked_links', async () => {
        const { data, error } = await supabase
            .from('tracked_links')
            .select('*, developments(name)')
            .order('created_at', { ascending: false })
        if (error) throw error
        return data
    })

    const filteredLinks = links.filter((link: any) =>
        link.short_code.toLowerCase().includes(search.toLowerCase()) ||
        link.developments?.name.toLowerCase().includes(search.toLowerCase()) ||
        link.utm_campaign?.toLowerCase().includes(search.toLowerCase())
    )

    const copyToClipboard = (code: string) => {
        const url = `${window.location.origin}/l/${code}`
        navigator.clipboard.writeText(url)
        alert('Link copiado para a área de transferência!')
    }

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-accent-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                        <span className="text-[10px] font-black text-imi-400 uppercase tracking-[0.3em]">Behavioral Intelligence Room</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-imi-900 font-display tracking-tight">
                        Tracking <span className="text-accent-500">Inteligente</span>
                    </h1>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" className="h-14 px-8 border-imi-100 bg-white/50 backdrop-blur-md rounded-2xl transition-all">
                        <Calendar className="w-5 h-5 mr-3 text-imi-400" />
                        Histórico
                    </Button>
                    <Button className="h-14 px-8 bg-imi-900 text-white rounded-2xl shadow-elevated group active:scale-95 transition-all">
                        <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform" />
                        Novo Link
                    </Button>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total de Cliques', value: links.reduce((acc: number, l: any) => acc + (l.clicks || 0), 0), icon: MousePointerClick, color: 'blue' },
                    { label: 'Conversão em Lead', value: '12.4%', icon: Zap, color: 'accent' },
                    { label: 'Links Ativos', value: links.length, icon: LinkIcon, color: 'green' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2rem] border border-imi-50 shadow-soft flex items-center justify-between group hover:shadow-card-hover transition-all">
                        <div>
                            <p className="text-[10px] font-black text-imi-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-bold text-imi-900">{stat.value}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-imi-50 flex items-center justify-center text-imi-900 group-hover:bg-imi-900 group-hover:text-white transition-all">
                            <stat.icon size={24} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-8 bg-white/50 backdrop-blur-md rounded-3xl border border-imi-100 shadow-soft">
                <div className="flex items-center gap-4 flex-1 w-full">
                    <Search className="text-imi-300" size={20} />
                    <input
                        type="text"
                        placeholder="Filtrar por código, imóvel ou campanha..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-transparent border-none outline-none text-sm font-medium w-full placeholder:text-imi-200"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-imi-50 text-imi-500 text-[10px] font-black uppercase tracking-widest hover:bg-imi-100 transition-all border border-imi-100">
                        <Filter size={14} /> Campanha
                    </button>
                </div>
            </div>

            {/* Links Table */}
            <div className="bg-white rounded-[2.5rem] border border-imi-100 shadow-soft overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-imi-50/50 border-bottom border-imi-50 text-[10px] font-black text-imi-400 uppercase tracking-widest">
                                <th className="px-8 py-6">Código / Link</th>
                                <th className="px-8 py-6">Destino</th>
                                <th className="px-8 py-6">Cliques</th>
                                <th className="px-8 py-6">Campanha</th>
                                <th className="px-8 py-6 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-imi-50">
                            {isLoading ? (
                                <tr><td colSpan={5} className="px-8 py-20 text-center text-imi-300 animate-pulse">Sincronizando tracking...</td></tr>
                            ) : filteredLinks.map((link: any) => (
                                <tr key={link.id} className="group hover:bg-imi-50/30 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-bold text-imi-900 group-hover:text-accent-600 transition-colors">/l/{link.short_code}</span>
                                            <span className="text-[10px] text-imi-300 truncate max-w-[200px]">{link.original_url}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent-500" />
                                            <span className="text-sm font-bold text-imi-700">{link.developments?.name || 'Geral'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold text-imi-900">{link.clicks || 0}</span>
                                            {link.unique_clicks > 0 && (
                                                <span className="text-[10px] text-imi-300 font-medium">({link.unique_clicks} únicos)</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${link.utm_campaign ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                            {link.utm_campaign || 'Orgânico'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => copyToClipboard(link.short_code)}
                                                className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-imi-100 text-imi-400 hover:text-accent-600 transition-all"
                                                title="Copiar Link"
                                            >
                                                <Copy size={18} />
                                            </button>
                                            <LinkIcon
                                                size={18}
                                                className="p-2 w-10 h-10 hover:bg-white rounded-xl border border-transparent hover:border-imi-100 text-imi-400 hover:text-blue-600 transition-all cursor-pointer"
                                                onClick={() => window.open(link.original_url, '_blank')}
                                            />
                                            <button className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-red-100 text-imi-400 hover:text-red-600 transition-all">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
