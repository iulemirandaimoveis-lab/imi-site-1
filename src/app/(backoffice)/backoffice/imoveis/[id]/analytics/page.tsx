
'use client'

import { useParams } from 'next/navigation'
import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import {
    Activity,
    Users,
    MousePointerClick,
    Clock,
    ChevronLeft,
    TrendingUp,
    MapPin,
    ArrowUpRight,
    PieChart,
    Search
} from 'lucide-react'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import OriginsChart from '@/app/(backoffice)/backoffice/dashboard/components/OriginsChart'

const supabase = createClient()

export default function PropertyAnalyticsPage() {
    const { id } = useParams()

    const { data: property, isLoading } = useSWR(`property_${id}`, async () => {
        const { data, error } = await supabase
            .from('developments')
            .select('*')
            .eq('id', id)
            .single()
        if (error) throw error
        return data
    })

    if (isLoading) return <div className="p-20 text-center animate-pulse text-imi-300 italic">Auditando métricas do ativo...</div>

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex items-center gap-6 mb-10">
                <Link href="/backoffice/imoveis" className="w-12 h-12 rounded-2xl bg-white border border-imi-100 flex items-center justify-center text-imi-400 hover:text-imi-900 transition-all shadow-soft">
                    <ChevronLeft size={20} />
                </Link>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-imi-400 uppercase tracking-[0.3em]">Asset Performance Report</span>
                    </div>
                    <h1 className="text-4xl font-bold text-imi-900 font-display tracking-tight">
                        Analytics: <span className="text-accent-500">{property?.name}</span>
                    </h1>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Visualizações Totais', value: property?.views_count || 0, trend: '+14%', icon: Activity },
                    { label: 'Leads Gerados', value: property?.leads_count || 0, trend: '+3', icon: Users },
                    { label: 'Cliques em Links', value: '142', trend: '+12%', icon: MousePointerClick },
                    { label: 'Tempo Médio', value: '3m 42s', trend: '+10s', icon: Clock }
                ].map((kpi, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-[2rem] border border-imi-50 shadow-soft"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-xl bg-imi-50 flex items-center justify-center text-imi-900">
                                <kpi.icon size={20} />
                            </div>
                            <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{kpi.trend}</span>
                        </div>
                        <p className="text-[10px] font-black text-imi-400 uppercase tracking-widest leading-none mb-1">{kpi.label}</p>
                        <h3 className="text-3xl font-bold text-imi-900">{kpi.value}</h3>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Origins of interest */}
                <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] border border-imi-100 shadow-soft">
                    <h3 className="text-sm font-black text-imi-400 uppercase tracking-widest mb-8">Origem do Interesse</h3>
                    <OriginsChart data={[
                        { name: 'Instagram Ads', value: 45 },
                        { name: 'Google Search', value: 30 },
                        { name: 'Direct/QR Code', value: 25 }
                    ]} />
                </div>

                {/* Performance Timeline */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-imi-100 shadow-soft">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-sm font-black text-imi-400 uppercase tracking-widest">Performance Mensal</h3>
                        <div className="flex gap-2">
                            <Button variant="outline" className="h-8 px-4 text-[10px] font-black uppercase tracking-widest rounded-lg">30 Dias</Button>
                            <Button variant="outline" className="h-8 px-4 text-[10px] font-black uppercase tracking-widest rounded-lg opacity-50">90 Dias</Button>
                        </div>
                    </div>
                    <div className="h-[300px] flex items-center justify-center italic text-imi-200 text-sm">
                        [ Gráfico de Tendência Carregando... ]
                    </div>
                </div>
            </div>

            {/* Leads associated with this property */}
            <div className="bg-white rounded-[2.5rem] border border-imi-100 shadow-soft overflow-hidden">
                <div className="p-8 border-b border-imi-50 flex items-center justify-between">
                    <h3 className="text-sm font-black text-imi-400 uppercase tracking-widest">Leads Interessados neste Ativo</h3>
                    <Button variant="outline" className="h-10 px-6 text-[10px] font-black uppercase tracking-widest rounded-xl">Explorar Todos</Button>
                </div>
                <div className="p-8 text-center text-imi-300 italic py-20">
                    Nenhum lead quente associado diretamente nas últimas 24h.
                </div>
            </div>
        </div>
    )
}
