
'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

interface AdsPerformanceChartProps {
    data: Array<{ date: string; spend: number; conversions: number }>
}

export default function AdsPerformanceChart({ data }: AdsPerformanceChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="h-[300px] flex items-center justify-center text-imi-300 italic text-sm">
                Aguardando dados de performance...
            </div>
        )
    }

    return (
        <div className="h-[350px] w-full bg-white p-6 rounded-[2rem] border border-imi-100 shadow-soft">
            <h3 className="text-sm font-black text-imi-400 uppercase tracking-widest mb-6 px-2">Investimento vs Conversões</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94A3B8', fontSize: 10 }}
                    />
                    <YAxis
                        yId="left"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94A3B8', fontSize: 10 }}
                    />
                    <YAxis
                        yId="right"
                        orientation="right"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#EAB308', fontSize: 10 }}
                    />
                    <Tooltip
                        contentStyle={{
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                        }}
                    />
                    <Bar yId="left" dataKey="spend" fill="#0F172A" radius={[4, 4, 0, 0]} barSize={20} name="Investimento (R$)" />
                    <Bar yId="right" dataKey="conversions" fill="#EAB308" radius={[4, 4, 0, 0]} barSize={20} name="Conversões" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
