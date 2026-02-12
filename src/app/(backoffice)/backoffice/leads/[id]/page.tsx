
'use client'

import { useParams } from 'next/navigation'
import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import {
    Users,
    MessageSquare,
    Mail,
    Calendar,
    Phone,
    Sparkles,
    Zap,
    TrendingUp,
    ExternalLink,
    ChevronLeft,
    Plus,
    Clock,
    CheckCircle2,
    Search,
    MapPin,
    Building2,
    ArrowUpRight,
    MousePointerClick
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const supabase = createClient()

export default function LeadDetailPage() {
    const { id } = useParams()

    const { data: lead, mutate: mutateLead, isLoading: leadLoading } = useSWR(`lead_${id}`, async () => {
        const { data, error } = await supabase
            .from('leads')
            .select('*, developments(name)')
            .eq('id', id)
            .single()
        if (error) throw error
        return data
    })

    const { data: interactions = [], isLoading: intLoading } = useSWR(`lead_interactions_${id}`, async () => {
        const { data, error } = await supabase
            .from('lead_interactions')
            .select('*')
            .eq('lead_id', id)
            .order('created_at', { ascending: false })
        if (error) throw error
        return data
    })

    if (leadLoading) return <div className="p-20 text-center animate-pulse text-imi-300 italic">Estabelecendo conexão neural com o lead...</div>

    const scoreColor = (score: number) => {
        if (score >= 80) return 'text-green-500'
        if (score >= 50) return 'text-amber-500'
        return 'text-red-500'
    }

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="flex items-center gap-6">
                    <Link href="/backoffice/leads" className="w-12 h-12 rounded-2xl bg-white border border-imi-100 flex items-center justify-center text-imi-400 hover:text-imi-900 transition-all shadow-soft">
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black text-imi-400 uppercase tracking-[0.3em]">Lead Intelligent File</span>
                        </div>
                        <h1 className="text-4xl font-bold text-imi-900 font-display tracking-tight">
                            {lead?.name}
                        </h1>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" className="h-14 px-8 border-imi-100 bg-white/50 backdrop-blur-md rounded-2xl transition-all">
                        <Mail className="w-5 h-5 mr-3 text-imi-400" />
                        Email
                    </Button>
                    <Button className="h-14 px-8 bg-imi-900 text-white rounded-2xl shadow-elevated group active:scale-95 transition-all">
                        <Phone className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
                        WhatsApp
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Profile Card & IA Insights */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-imi-100 shadow-soft">
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-24 h-24 rounded-[2rem] bg-imi-50 flex items-center justify-center text-4xl font-bold text-imi-200 border border-white shadow-inner mb-4">
                                {lead?.name.charAt(0)}
                            </div>
                            <h2 className="text-xl font-bold text-imi-900">{lead?.name}</h2>
                            <p className="text-sm text-imi-400">{lead?.email}</p>
                            <span className="mt-4 px-4 py-1.5 bg-imi-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest">{lead?.status}</span>
                        </div>

                        <div className="space-y-4 pt-8 border-t border-imi-50">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-imi-400 uppercase">Origem</span>
                                <span className="text-xs font-black text-imi-900">{lead?.source || 'Direto'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-imi-400 uppercase">Interesse</span>
                                <span className="text-xs font-black text-imi-900">{lead?.developments?.name || lead?.interest || 'Geral'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-imi-400 uppercase">Data de Entrada</span>
                                <span className="text-xs font-black text-imi-900">{format(new Date(lead?.created_at), 'dd/MM/yyyy')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-imi-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-elevated">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/10 blur-[60px] rounded-full -mr-10 -mt-10" />
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <Sparkles className="text-accent-500" size={24} />
                                    <h3 className="text-lg font-bold font-display">IA Score</h3>
                                </div>
                                <div className={`text-4xl font-bold ${scoreColor(lead?.ai_score || 0)}`}>{lead?.ai_score || 0}</div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] font-black text-imi-400 uppercase tracking-widest mb-2">Próxima Ação Sugerida</p>
                                    <div className="p-4 bg-white/10 rounded-2xl border border-white/10 text-xs leading-relaxed">
                                        {lead?.ai_next_action || 'Analise o comportamento do lead para gerar uma recomendação.'}
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    {lead?.ai_recommendations?.map((rec: string, i: number) => (
                                        <div key={i} className="flex gap-3 text-[10px] font-medium text-imi-300">
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent-500 mt-1 flex-shrink-0" />
                                            {rec}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timeline & Interactions */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-xl font-bold text-imi-900">Histórico de <span className="text-imi-400">Interações</span></h2>
                        <Button variant="outline" className="h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                            <Plus size={14} className="mr-2" />
                            Nova Nota
                        </Button>
                    </div>

                    <div className="bg-white rounded-[2.5rem] border border-imi-100 shadow-soft overflow-hidden">
                        <div className="divide-y divide-imi-50">
                            {interactions.length > 0 ? interactions.map((interaction: any) => (
                                <div key={interaction.id} className="p-8 hover:bg-imi-50/30 transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-imi-50 flex items-center justify-center text-imi-900">
                                                {interaction.interaction_type === 'whatsapp' ? <MessageSquare size={18} /> : <Phone size={18} />}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-imi-900 capitalize">{interaction.interaction_type} <span className="text-imi-300 font-medium">({interaction.direction})</span></h4>
                                                <div className="flex items-center gap-2 text-[10px] text-imi-400 font-medium mt-1">
                                                    <Clock size={12} /> {format(new Date(interaction.created_at), "dd/MM/yyyy 'às' HH:mm")}
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border border-imi-100 bg-imi-50 text-imi-400`}>
                                            {interaction.outcome || 'Pendente'}
                                        </span>
                                    </div>
                                    {interaction.notes && (
                                        <p className="text-sm text-imi-500 leading-relaxed ml-14">
                                            {interaction.notes}
                                        </p>
                                    )}
                                </div>
                            )) : (
                                <div className="p-20 text-center italic text-imi-300">
                                    Nenhuma interação registrada ainda.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Behavior Analytics Preview */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-imi-100 shadow-soft">
                        <h3 className="text-sm font-black text-imi-400 uppercase tracking-widest mb-8">Comportamento do Ativo</h3>
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-[10px] font-black text-imi-300 uppercase mb-4">Imóvel Mais Visto</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-12 bg-imi-100 rounded-xl animate-pulse" />
                                    <div>
                                        <p className="font-bold text-imi-900 truncate max-w-[150px]">{lead?.developments?.name || 'Carregando...'}</p>
                                        <p className="text-[10px] text-accent-500 font-bold uppercase tracking-widest">Interesse Alto</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-imi-300 uppercase mb-4">Ação Dominante</p>
                                <div className="flex items-center gap-3">
                                    <MousePointerClick className="text-imi-400" size={24} />
                                    <span className="text-lg font-bold text-imi-900">Clique Externo</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
