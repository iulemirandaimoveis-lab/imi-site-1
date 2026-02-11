'use client'

import { Building2, Eye, Users, TrendingUp, Package, DollarSign } from 'lucide-react'
import { usePropertyKPIs } from '../hooks/usePropertyKPIs'

export default function PropertyKPIs() {
    const { kpis, isLoading } = usePropertyKPIs()

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white rounded-xl p-6 border border-slate-200 animate-pulse">
                        <div className="h-12 w-12 bg-slate-200 rounded-xl mb-4"></div>
                        <div className="h-8 bg-slate-200 rounded mb-2"></div>
                        <div className="h-4 bg-slate-200 rounded w-20"></div>
                    </div>
                ))}
            </div>
        )
    }

    if (!kpis) return null

    const cards = [
        {
            title: 'Total Imóveis',
            value: kpis.total,
            subtitle: `${kpis.active} ativos`,
            icon: Building2,
            color: 'bg-imi-900',
        },
        {
            title: 'Valor Total',
            value: new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                notation: 'compact',
                maximumFractionDigits: 1
            }).format(kpis.totalValue),
            subtitle: `Média ${new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                notation: 'compact',
                maximumFractionDigits: 1
            }).format(kpis.avgPrice)}`,
            icon: DollarSign,
            color: 'bg-accent-400', // Changed to existing accent colour
        },
        {
            title: 'Total Unidades',
            value: kpis.totalUnits.toLocaleString('pt-BR'),
            subtitle: `${kpis.total > 0 ? (kpis.totalUnits / kpis.total).toFixed(0) : 0} por empreendimento`,
            icon: Package,
            color: 'bg-imi-700',
        },
        {
            title: 'Visualizações',
            value: kpis.totalViews.toLocaleString('pt-BR'),
            subtitle: `${kpis.totalLeads} leads (${kpis.conversionRate.toFixed(1)}%)`,
            icon: Eye,
            color: 'bg-imi-500',
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map((card) => (
                <div
                    key={card.title}
                    className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 ${card.color} text-white rounded-xl flex items-center justify-center`}>
                            <card.icon className="w-6 h-6" strokeWidth={2} />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-imi-900 mb-1">{card.value}</div>
                    <div className="text-sm text-slate-600">{card.title}</div>
                    <div className="text-xs text-slate-500 mt-1">{card.subtitle}</div>
                </div>
            ))}
        </div>
    )
}
