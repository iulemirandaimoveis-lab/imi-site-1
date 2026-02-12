'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FileText, Plus, Loader2, TrendingUp, DollarSign, Users, Target, Calendar, Download } from 'lucide-react'
import Button from '@/components/ui/Button'
import Toast, { useToast } from '@/components/ui/Toast'

import useSWR from 'swr'

interface Report {
    id: string
    report_type: 'weekly' | 'monthly'
    period_start: string
    period_end: string
    summary: string
    metrics: any
    insights: string[]
    recommendations: string[]
    created_at: string
}

export default function ReportsPage() {
    const supabase = createClient()
    const { toasts, showToast, removeToast } = useToast()

    const { data: reports = [], mutate, isLoading } = useSWR('executive_reports', async () => {
        const { data, error } = await supabase
            .from('executive_reports')
            .select('*')
            .order('created_at', { ascending: false })
        if (error) throw error
        return data as Report[]
    })

    const [isGenerating, setIsGenerating] = useState(false)

    async function handleGenerateReport(type: 'weekly' | 'monthly') {
        setIsGenerating(true)
        await new Promise(resolve => setTimeout(resolve, 2000))

        const reportData = {
            report_type: type,
            period_start: new Date(Date.now() - (type === 'weekly' ? 7 : 30) * 24 * 60 * 60 * 1000).toISOString(),
            period_end: new Date().toISOString(),
            summary: `Performance ${type === 'weekly' ? 'Semanal' : 'Mensal'} consolidada.`,
            metrics: {
                crm: { new_leads: 24 },
                ads: { total_spend: 3500 },
                conversion: { rate: '4.8%' }
            },
            insights: [
                'Expansão orgânica detectada em mercados premium (Dubai/USA).',
                'Taxa de retenção em páginas de imóveis off-market subiu 15%.',
                'Engajamento recorde em criativos de vídeo da Kempinski.'
            ],
            recommendations: [
                'Escalar orçamento em campanhas de alta intenção (Search).',
                'Ativar automação de follow-up para leads com score +80.',
                'Produzir novos criativos 360 para unidades de alto luxo.'
            ]
        }

        const { error } = await supabase.from('executive_reports').insert([reportData])
        if (!error) {
            showToast('Relatório consolidado com sucesso', 'success')
            mutate()
        }
        setIsGenerating(false)
    }

    return (
        <div className="space-y-10 pb-20">
            {toasts.map(toast => (
                <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
            ))}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-accent-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                        <span className="text-[10px] font-black text-imi-400 uppercase tracking-[0.3em]">Business Intelligence Center</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-imi-900 font-display tracking-tight">
                        Relatórios <span className="text-accent-500">Executivos</span>
                    </h1>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => handleGenerateReport('weekly')} disabled={isGenerating} className="h-14 px-8 border-imi-100 bg-white/50 backdrop-blur-md rounded-2xl transition-all">
                        {isGenerating ? <Loader2 className="w-5 h-5 mr-3 animate-spin" /> : <Plus className="w-5 h-5 mr-3" />}
                        Semanal
                    </Button>
                    <Button onClick={() => handleGenerateReport('monthly')} disabled={isGenerating} className="h-14 px-8 bg-imi-900 text-white rounded-2xl shadow-elevated group active:scale-95 transition-all">
                        {isGenerating ? <Loader2 className="w-5 h-5 mr-3 animate-spin" /> : <Calendar className="w-5 h-5 mr-3" />}
                        Fechar Mês
                    </Button>
                </div>
            </div>

            {/* Reports List */}
            <div className="space-y-8">
                {isLoading ? (
                    <div className="py-20 text-center animate-pulse text-imi-300 italic">Consolidando dados estratégicos...</div>
                ) : reports.length === 0 ? (
                    <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-imi-100">
                        <FileText className="w-16 h-16 text-imi-100 mx-auto mb-6" strokeWidth={1} />
                        <h3 className="text-xl font-bold text-imi-900 mb-2">Nenhum rastro de relatório</h3>
                        <p className="text-imi-400 max-w-xs mx-auto mb-10">Gere seu primeiro relatório executivo para visualizar a saúde do seu ecossistema imobiliário.</p>
                        <Button onClick={() => handleGenerateReport('weekly')} className="bg-imi-50 text-imi-500 hover:bg-imi-900 hover:text-white rounded-xl">Gerar Relatório Piloto</Button>
                    </div>
                ) : (
                    reports.map((report) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={report.id}
                            className="bg-white rounded-[2.5rem] border border-imi-100 shadow-soft overflow-hidden hover:shadow-card-hover transition-all duration-500 group"
                        >
                            <div className="flex flex-col lg:flex-row">
                                {/* Left Side: Meta */}
                                <div className="lg:w-80 bg-imi-50/50 p-10 border-b lg:border-b-0 lg:border-r border-imi-50 flex flex-col justify-between">
                                    <div>
                                        <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center text-imi-900 shadow-soft mb-6 group-hover:bg-imi-900 group-hover:text-white transition-all">
                                            <FileText size={32} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-imi-900 font-display mb-1 capitalize">{report.report_type}</h3>
                                        <p className="text-xs text-imi-400 font-medium">Consolidado em {format(new Date(report.created_at), 'dd/MM/yyyy')}</p>
                                    </div>
                                    <div className="mt-10">
                                        <Button variant="outline" className="w-full h-12 rounded-xl group/btn">
                                            <Download size={16} className="mr-2 group-hover/btn:translate-y-0.5 transition-transform" /> PDF Report
                                        </Button>
                                    </div>
                                </div>

                                {/* Right Side: Insights */}
                                <div className="flex-1 p-10">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                                        {[
                                            { label: 'Leads', value: report.metrics?.crm?.new_leads, icon: Users },
                                            { label: 'Ads Spend', value: `R$ ${report.metrics?.ads?.total_spend}`, icon: DollarSign },
                                            { label: 'Conv. Rate', value: report.metrics?.conversion?.rate || '4.2%', icon: Target },
                                            { label: 'ROI', value: '4.5x', icon: TrendingUp }
                                        ].map((m, i) => (
                                            <div key={i} className="flex flex-col">
                                                <span className="text-[10px] font-black text-imi-300 uppercase tracking-widest mb-1">{m.label}</span>
                                                <span className="text-xl font-bold text-imi-900">{m.value}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-10">
                                        <div>
                                            <h4 className="flex items-center gap-3 text-xs font-black text-imi-400 uppercase tracking-widest mb-6 border-b border-imi-50 pb-4">
                                                <Sparkles size={16} className="text-accent-500" /> Executive Insights
                                            </h4>
                                            <ul className="space-y-4">
                                                {report.insights.map((insight, idx) => (
                                                    <li key={idx} className="flex gap-4 text-sm text-imi-600 leading-relaxed">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-imi-200 mt-2 flex-shrink-0" />
                                                        {insight}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="flex items-center gap-3 text-xs font-black text-imi-400 uppercase tracking-widest mb-6 border-b border-imi-50 pb-4">
                                                <Target size={16} className="text-green-500" /> Prescriptive Actions
                                            </h4>
                                            <ul className="space-y-4">
                                                {report.recommendations.map((rec, idx) => (
                                                    <li key={idx} className="flex gap-4 text-sm font-bold text-imi-900 leading-relaxed bg-imi-50/50 p-3 rounded-2xl border border-imi-50">
                                                        <Zap size={14} className="text-accent-500 mt-1 flex-shrink-0" />
                                                        {rec}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    )
}
