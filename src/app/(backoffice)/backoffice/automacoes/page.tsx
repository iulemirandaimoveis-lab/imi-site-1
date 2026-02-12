
'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import {
    Zap,
    Plus,
    Play,
    Pause,
    MoreVertical,
    Settings2,
    MessageSquare,
    Mail,
    Calendar,
    MousePointerClick,
    Users,
    Trash2,
    Activity,
    ChevronRight,
    Search
} from 'lucide-react'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'

const supabase = createClient()

export default function AutomacoesPage() {
    const [search, setSearch] = useState('')

    const { data: workflows = [], mutate, isLoading } = useSWR('automation_workflows', async () => {
        const { data, error } = await supabase
            .from('automation_workflows')
            .select('*')
            .order('created_at', { ascending: false })
        if (error) throw error
        return data
    })

    const toggleWorkflow = async (id: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from('automation_workflows')
            .update({ is_active: !currentStatus })
            .eq('id', id)
        if (!error) mutate()
    }

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-accent-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                        <span className="text-[10px] font-black text-imi-400 uppercase tracking-[0.3em]">Operational Scaling Engine</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-imi-900 font-display tracking-tight">
                        Automações <span className="text-accent-500">Inteligentes</span>
                    </h1>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" className="h-14 px-8 border-imi-100 bg-white/50 backdrop-blur-md rounded-2xl transition-all">
                        <Activity className="w-5 h-5 mr-3 text-imi-400" />
                        Ver Logs
                    </Button>
                    <Button className="h-14 px-8 bg-imi-900 text-white rounded-2xl shadow-elevated group active:scale-95 transition-all">
                        <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform" />
                        Criar Workflow
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Workflows Ativos', value: workflows.filter((w: any) => w.is_active).length, icon: Zap, color: 'blue' },
                    { label: 'Execuções (24h)', value: '1,284', icon: Activity, color: 'accent' },
                    { label: 'Time Saved', value: '42h', icon: Zap, color: 'green' },
                    { label: 'Sucesso', value: '99.8%', icon: Zap, color: 'indigo' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border border-imi-50 shadow-soft group hover:shadow-card-hover transition-all">
                        <p className="text-[10px] font-black text-imi-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-2xl font-bold text-imi-900">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Workflow Canvas List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {isLoading ? (
                    <div className="lg:col-span-2 py-20 text-center animate-pulse text-imi-300 italic">Sincronizando motores de automação...</div>
                ) : workflows.length > 0 ? workflows.map((workflow: any) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={workflow.id}
                        className={`bg-white rounded-[2.5rem] border ${workflow.is_active ? 'border-accent-100 shadow-soft' : 'border-imi-50 bg-imi-50/20 shadow-none'} p-8 transition-all hover:shadow-card-hover group relative overflow-hidden`}
                    >
                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${workflow.is_active ? 'bg-imi-900 text-accent-500 shadow-xl' : 'bg-imi-100 text-imi-400 font-bold'}`}>
                                    {workflow.trigger_type === 'new_lead' ? <Users size={28} /> : <MousePointerClick size={28} />}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-imi-900 font-display mb-1">{workflow.name}</h3>
                                    <p className="text-xs text-imi-400 font-medium">{workflow.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => toggleWorkflow(workflow.id, workflow.is_active)}
                                    className={`w-12 h-6 rounded-full transition-all relative ${workflow.is_active ? 'bg-green-500' : 'bg-imi-200'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${workflow.is_active ? 'left-7' : 'left-1'}`} />
                                </button>
                                <button className="p-2 hover:bg-imi-50 rounded-xl transition-colors">
                                    <MoreVertical size={20} className="text-imi-300" />
                                </button>
                            </div>
                        </div>

                        {/* Workflow Visual Preview */}
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="flex flex-col items-center">
                                <div className="text-[9px] font-black uppercase text-imi-300 mb-2">Trigger</div>
                                <div className="px-4 py-2 bg-imi-50 rounded-lg text-[10px] font-bold text-imi-900 border border-imi-100">
                                    {workflow.trigger_type === 'new_lead' ? 'Novo Lead' : 'Link Clicado'}
                                </div>
                            </div>

                            <ChevronRight size={16} className="text-imi-100 mt-4" />

                            <div className="flex flex-wrap gap-2 pt-4">
                                {['WhatsApp', 'Email', 'Criar CRM'].map((action, i) => (
                                    <div key={i} className="flex flex-col items-center">
                                        <div className="px-4 py-2 bg-imi-900 text-white rounded-lg text-[10px] font-bold flex items-center gap-2 border border-white/10">
                                            {action === 'WhatsApp' && <MessageSquare size={12} className="text-accent-500" />}
                                            {action === 'Email' && <Mail size={12} className="text-accent-500" />}
                                            {action === 'Criar CRM' && <Settings2 size={12} className="text-accent-500" />}
                                            {action}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-imi-50 flex items-center justify-between relative z-10">
                            <div className="flex gap-6">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-imi-300 uppercase leading-none mb-1">Execuções</span>
                                    <span className="text-sm font-bold text-imi-900">{workflow.run_count || 0}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-imi-300 uppercase leading-none mb-1">Last Run</span>
                                    <span className="text-sm font-bold text-imi-900">{workflow.last_run_at ? '2 min atrás' : 'Nunca'}</span>
                                </div>
                            </div>
                            <Button className="h-10 px-6 bg-imi-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-imi-800 transition-all">
                                Editar Canvas
                            </Button>
                        </div>

                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Zap size={150} className="text-imi-900 -rotate-12" />
                        </div>
                    </motion.div>
                )) : (
                    <div className="lg:col-span-2 bg-imi-50/50 rounded-[2.5rem] border-2 border-dashed border-imi-100 py-32 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-soft mb-6">
                            <Zap size={40} className="text-imi-200" />
                        </div>
                        <h3 className="text-xl font-bold text-imi-900 mb-2">Escalabilidade Operacional</h3>
                        <p className="text-imi-400 max-w-sm mb-10">Você ainda não tem automações ativas. Comece criando um workflow para novos leads.</p>
                        <Button className="h-14 px-10 bg-imi-900 text-white rounded-2xl shadow-elevated group active:scale-95 transition-all">
                            <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform" />
                            Criar meu primeiro Workflow
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
