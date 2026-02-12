
'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import {
    Users,
    ChevronRight,
    MoreVertical,
    Plus,
    Sparkles,
    Zap,
    Clock,
    ArrowLeft,
    Search,
    Filter
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { format } from 'date-fns'

const supabase = createClient()

const columns = [
    { id: 'new', title: 'Novos Leads', color: 'blue' },
    { id: 'contacted', title: 'Em Contato', color: 'amber' },
    { id: 'qualified', title: 'Qualificados', color: 'purple' },
    { id: 'won', title: 'Ganhos', color: 'green' }
]

export default function LeadsKanbanPage() {
    const { data: leads = [], mutate, isLoading } = useSWR('leads_kanban', async () => {
        const { data, error } = await supabase
            .from('leads')
            .select('*')
            .order('ai_score', { ascending: false })
        if (error) throw error
        return data
    })

    const handleDragOver = (e: React.DragEvent) => e.preventDefault()

    const handleDrop = async (e: React.DragEvent, status: string) => {
        const id = e.dataTransfer.getData('id')
        const { error } = await supabase
            .from('leads')
            .update({ status })
            .eq('id', id)

        if (!error) mutate()
    }

    return (
        <div className="space-y-10 pb-20 h-screen flex flex-col overflow-hidden -m-8 p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 flex-shrink-0">
                <div className="flex items-center gap-6">
                    <Link href="/backoffice/leads" className="w-12 h-12 rounded-2xl bg-white border border-imi-100 flex items-center justify-center text-imi-400 hover:text-imi-900 transition-all shadow-soft">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black text-imi-400 uppercase tracking-[0.3em]">Commercial OS</span>
                        </div>
                        <h1 className="text-4xl font-bold text-imi-900 font-display tracking-tight">
                            Pipeline <span className="text-accent-500">Kanban</span>
                        </h1>
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="flex items-center gap-4 px-6 py-3 bg-white rounded-2xl border border-imi-50 shadow-soft">
                        <Search className="text-imi-300" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar investidor..."
                            className="bg-transparent border-none outline-none text-sm font-medium w-48 placeholder:text-imi-200"
                        />
                    </div>
                    <Button className="h-14 px-8 bg-imi-900 text-white rounded-2xl shadow-elevated group active:scale-95 transition-all">
                        <Plus className="w-5 h-5 mr-3" />
                        Novo Lead
                    </Button>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="flex gap-6 flex-1 overflow-x-auto pb-6 scrollbar-elegant">
                {columns.map(col => (
                    <div
                        key={col.id}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, col.id)}
                        className="flex-shrink-0 w-80 flex flex-col gap-4"
                    >
                        <div className="flex items-center justify-between px-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${col.id === 'new' ? 'bg-blue-500' : col.id === 'contacted' ? 'bg-amber-500' : col.id === 'qualified' ? 'bg-purple-500' : 'bg-green-500'}`} />
                                <h3 className="text-sm font-black text-imi-900 uppercase tracking-widest">{col.title}</h3>
                            </div>
                            <span className="text-[10px] font-black text-imi-300 bg-imi-50 px-2 py-0.5 rounded-md">
                                {leads.filter((l: any) => l.status === col.id).length}
                            </span>
                        </div>

                        <div className="flex-1 bg-imi-50/30 rounded-[2.5rem] border border-imi-50 p-4 space-y-4 overflow-y-auto scrollbar-hide">
                            {isLoading ? (
                                <div className="py-10 text-center animate-pulse text-imi-200 text-xs font-bold uppercase">Sincronizando...</div>
                            ) : leads.filter((l: any) => l.status === col.id).map((lead: any) => (
                                <div
                                    draggable
                                    onDragStart={(e: React.DragEvent) => {
                                        e.dataTransfer.setData('id', lead.id)
                                    }}
                                    key={lead.id}
                                    className="bg-white p-6 rounded-3xl border border-imi-100 shadow-soft hover:shadow-card-hover cursor-grab active:cursor-grabbing group transition-all"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest border ${lead.ai_priority === 'critical' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-imi-50 text-imi-400 border-imi-100'}`}>
                                            {lead.ai_priority || 'medium'}
                                        </div>
                                        {lead.ai_score && (
                                            <div className="flex items-center gap-1 text-[10px] font-black text-accent-600">
                                                <Zap size={10} className="fill-accent-500" />
                                                {lead.ai_score}
                                            </div>
                                        )}
                                    </div>

                                    <h4 className="font-bold text-imi-900 mb-1 group-hover:text-accent-600 transition-colors uppercase tracking-tight">{lead.name}</h4>
                                    <p className="text-[10px] text-imi-400 font-medium mb-4 truncate">{lead.interest || 'Interesse Geral'}</p>

                                    <div className="flex items-center justify-between pt-4 border-t border-imi-50">
                                        <div className="flex items-center gap-2 text-[10px] text-imi-300 font-bold uppercase">
                                            <Clock size={12} />
                                            {format(new Date(lead.created_at), 'dd MMM')}
                                        </div>
                                        <Link href={`/backoffice/leads/${lead.id}`}>
                                            <button className="p-2 hover:bg-imi-50 rounded-lg transition-colors text-imi-200 hover:text-imi-900">
                                                <ChevronRight size={16} />
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
