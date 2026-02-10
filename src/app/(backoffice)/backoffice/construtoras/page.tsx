'use client';

import { useState, useMemo } from 'react';
import useSWR from 'swr';
import { createClient } from '@/lib/supabase/client';
import {
    Building2, MapPin, TrendingUp, Users, BarChart3, Search, Filter,
    ExternalLink, Grid3x3, List, ChevronDown, ChevronUp, Award, Star
} from 'lucide-react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

const supabase = createClient();

type SortField = 'name' | 'developments_count' | 'leads_count' | 'avg_score';
type SortDir = 'asc' | 'desc';
type ViewMode = 'cards' | 'table';

function cn(...c: any[]) { return c.filter(Boolean).join(' '); }

interface DeveloperStats {
    name: string;
    developments_count: number;
    leads_count: number;
    avg_score: number;
    regions: string[];
    cities: string[];
    total_investment: number;
    published_count: number;
    developments: any[];
}

export default function DevelopersPage() {
    const [search, setSearch] = useState('');
    const [regionF, setRegionF] = useState('all');
    const [showF, setShowF] = useState(false);
    const [sortField, setSortField] = useState<SortField>('developments_count');
    const [sortDir, setSortDir] = useState<SortDir>('desc');
    const [viewMode, setViewMode] = useState<ViewMode>('cards');

    const { data: devs, isLoading } = useSWR('devs-for-developers', async () => {
        const { data, error } = await supabase.from('developments').select('*');
        if (error) throw error;
        return data;
    });

    const developers = useMemo(() => {
        if (!devs) return [];

        // Group by developer
        const grouped = devs.reduce((acc, dev) => {
            const devName = dev.developer || 'Sem Construtora';
            if (!acc[devName]) {
                acc[devName] = {
                    name: devName,
                    developments_count: 0,
                    leads_count: 0,
                    avg_score: 0,
                    regions: new Set(),
                    cities: new Set(),
                    total_investment: 0,
                    published_count: 0,
                    developments: []
                };
            }
            acc[devName].developments_count++;
            acc[devName].leads_count += dev.leads_count || 0;
            acc[devName].avg_score += dev.score || 0;
            if (dev.region) acc[devName].regions.add(dev.region);
            if (dev.city) acc[devName].cities.add(dev.city);
            if (dev.price_min) acc[devName].total_investment += dev.price_min;
            if (dev.status_comercial === 'publicado') acc[devName].published_count++;
            acc[devName].developments.push(dev);
            return acc;
        }, {} as Record<string, any>);

        // Convert to array and calculate averages
        const result: DeveloperStats[] = Object.values(grouped).map((d: any) => ({
            name: d.name,
            developments_count: d.developments_count,
            leads_count: d.leads_count,
            avg_score: d.developments_count > 0 ? Math.round(d.avg_score / d.developments_count) : 0,
            regions: Array.from(d.regions),
            cities: Array.from(d.cities),
            total_investment: d.total_investment,
            published_count: d.published_count,
            developments: d.developments
        }));

        return result;
    }, [devs]);

    const filtered = useMemo(() => {
        if (!developers) return [];
        let result = developers.filter(d => {
            const ms = !search || d.name.toLowerCase().includes(search.toLowerCase());
            const mr = regionF === 'all' || d.regions.includes(regionF);
            return ms && mr;
        });

        // Sort
        result.sort((a, b) => {
            const aVal = a[sortField];
            const bVal = b[sortField];
            if (sortField === 'name') {
                return sortDir === 'asc' ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
            }
            return sortDir === 'asc' ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
        });

        return result;
    }, [developers, search, regionF, sortField, sortDir]);

    const stats = useMemo(() => ({
        total: developers.length,
        totalDevs: devs?.length || 0,
        totalLeads: developers.reduce((sum, d) => sum + d.leads_count, 0),
        avgDevsPerBuilder: developers.length > 0 ? Math.round(devs!.length / developers.length) : 0
    }), [developers, devs]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDir('desc');
        }
    };

    const SortHeader = ({ field, children }: { field: SortField, children: React.ReactNode }) => (
        <th onClick={() => handleSort(field)} className="px-4 py-3 text-[10px] font-bold text-imi-400 uppercase tracking-widest cursor-pointer hover:text-imi-900 select-none group">
            <div className="flex items-center gap-1">
                {children}
                {sortField === field && (
                    sortDir === 'asc' ? <ChevronUp size={12} className="text-accent-500" /> : <ChevronDown size={12} className="text-accent-500" />
                )}
            </div>
        </th>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-imi-900 font-display">Construtoras</h1>
                    <p className="text-imi-500 text-sm mt-1">Visão estratégica de parceiros e desenvolvedores.</p>
                </div>
                <div className="flex gap-2">
                    <div className="flex bg-white rounded-xl border border-imi-100 p-1">
                        <button onClick={() => setViewMode('cards')} className={cn('p-2 rounded-lg', viewMode === 'cards' ? 'bg-imi-900 text-white' : 'text-imi-400')} title="Cards"><Grid3x3 size={16} /></button>
                        <button onClick={() => setViewMode('table')} className={cn('p-2 rounded-lg', viewMode === 'table' ? 'bg-imi-900 text-white' : 'text-imi-400')} title="Tabela"><List size={16} /></button>
                    </div>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                    { l: 'Construtoras', v: stats.total, i: Building2, b: 'bg-blue-50' },
                    { l: 'Empreendimentos', v: stats.totalDevs, i: TrendingUp, b: 'bg-green-50' },
                    { l: 'Total Leads', v: stats.totalLeads, i: Users, b: 'bg-purple-50' },
                    { l: 'Média/Construtora', v: stats.avgDevsPerBuilder, i: BarChart3, b: 'bg-accent-500/10' }
                ].map(k => (
                    <div key={k.l} className="bg-white rounded-2xl p-4 border border-imi-50 shadow-soft flex items-center gap-3">
                        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', k.b)}><k.i size={18} className="text-imi-900" /></div>
                        <div><div className="text-lg font-black text-imi-900 leading-none">{k.v}</div><div className="text-[10px] font-bold text-imi-400 uppercase tracking-widest">{k.l}</div></div>
                    </div>
                ))}
            </div>

            {/* Search + Filters */}
            <div className="bg-white rounded-2xl shadow-soft border border-imi-50 p-4 space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-imi-300" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar construtora..."
                            className="w-full pl-10 pr-4 h-11 rounded-xl border border-imi-100 text-sm focus:ring-accent-500 focus:border-accent-500"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <button onClick={() => setShowF(!showF)} className={cn('flex items-center gap-2 px-4 h-11 rounded-xl border text-sm font-bold transition-all', showF ? 'bg-imi-900 text-white border-imi-900' : 'border-imi-100 text-imi-500')}>
                        <Filter size={16} /> Filtros {showF && '✓'}
                    </button>
                </div>
                <AnimatePresence>{showF && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-imi-50">
                            <select value={regionF} onChange={e => setRegionF(e.target.value)} className="h-10 rounded-xl border-imi-100 text-xs font-bold">
                                <option value="all">Região: Todas</option>
                                <option value="paraiba">Paraíba</option>
                                <option value="pernambuco">Pernambuco</option>
                                <option value="sao-paulo">São Paulo</option>
                            </select>
                        </div>
                    </motion.div>
                )}</AnimatePresence>
            </div>

            {/* Cards View */}
            {viewMode === 'cards' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {isLoading ? (
                        Array(6).fill(0).map((_, i) => <div key={i} className="bg-white rounded-2xl p-6 animate-pulse border border-imi-50 h-48" />)
                    ) : filtered.length === 0 ? (
                        <div className="col-span-full bg-white rounded-2xl p-12 text-center text-imi-400 border border-imi-50">Nenhuma construtora encontrada.</div>
                    ) : (
                        filtered.map(dev => (
                            <div key={dev.name} className="bg-white rounded-2xl border border-imi-50 shadow-soft overflow-hidden hover:shadow-lg transition-all group">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 bg-imi-900 rounded-xl flex items-center justify-center text-white font-black text-xl">
                                            {dev.name.charAt(0).toUpperCase()}
                                        </div>
                                        {dev.avg_score >= 70 && <Award size={20} className="text-accent-500" />}
                                    </div>

                                    <h3 className="font-bold text-imi-900 text-lg mb-2 font-display">{dev.name}</h3>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-imi-400 flex items-center gap-1"><Building2 size={12} /> Empreendimentos</span>
                                            <span className="font-bold text-imi-900">{dev.developments_count}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-imi-400 flex items-center gap-1"><Users size={12} /> Leads Gerados</span>
                                            <span className="font-bold text-green-600">{dev.leads_count}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-imi-400 flex items-center gap-1"><BarChart3 size={12} /> Score Médio</span>
                                            <span className={cn('font-bold', dev.avg_score >= 70 ? 'text-green-600' : dev.avg_score >= 40 ? 'text-yellow-600' : 'text-red-500')}>
                                                {dev.avg_score}/100
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-imi-400 flex items-center gap-1"><Star size={12} /> Publicados</span>
                                            <span className="font-bold text-imi-900">{dev.published_count}/{dev.developments_count}</span>
                                        </div>
                                    </div>

                                    {dev.cities.length > 0 && (
                                        <div className="pt-3 border-t border-imi-50">
                                            <p className="text-[10px] text-imi-400 uppercase tracking-widest font-bold mb-2">Atuação</p>
                                            <div className="flex flex-wrap gap-1">
                                                {dev.cities.slice(0, 3).map((city: string) => (
                                                    <span key={city} className="text-[9px] bg-imi-50 text-imi-600 px-2 py-1 rounded-lg font-bold flex items-center gap-1">
                                                        <MapPin size={8} /> {city}
                                                    </span>
                                                ))}
                                                {dev.cities.length > 3 && (
                                                    <span className="text-[9px] bg-imi-50 text-imi-400 px-2 py-1 rounded-lg font-bold">
                                                        +{dev.cities.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="border-t border-imi-50 p-4 bg-imi-50/30">
                                    <Link
                                        href={`/backoffice/imoveis?dev=${encodeURIComponent(dev.name)}`}
                                        className="flex items-center justify-center gap-2 text-sm font-bold text-imi-900 hover:text-accent-600 transition-colors"
                                    >
                                        Ver Empreendimentos <ExternalLink size={14} />
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Table View */}
            {viewMode === 'table' && (
                <div className="bg-white rounded-2xl shadow-soft border border-imi-50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-imi-50/50 border-b border-imi-100">
                                    <SortHeader field="name">Construtora</SortHeader>
                                    <SortHeader field="developments_count">Empreendimentos</SortHeader>
                                    <SortHeader field="leads_count">Leads Gerados</SortHeader>
                                    <SortHeader field="avg_score">Score Médio</SortHeader>
                                    <th className="px-4 py-3 text-[10px] font-bold text-imi-400 uppercase tracking-widest">Publicados</th>
                                    <th className="px-4 py-3 text-[10px] font-bold text-imi-400 uppercase tracking-widest">Atuação</th>
                                    <th className="px-4 py-3 text-[10px] font-bold text-imi-400 uppercase tracking-widest text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-imi-50">
                                {isLoading ? (
                                    Array(5).fill(0).map((_, i) => <tr key={i} className="animate-pulse"><td colSpan={7} className="px-4 py-6 h-16 bg-imi-50/20" /></tr>)
                                ) : filtered.length === 0 ? (
                                    <tr><td colSpan={7} className="px-4 py-16 text-center text-imi-400">Nenhuma construtora encontrada.</td></tr>
                                ) : (
                                    filtered.map(dev => (
                                        <tr key={dev.name} className="hover:bg-imi-50/30 transition-colors">
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-imi-900 rounded-lg flex items-center justify-center text-white font-black text-sm">
                                                        {dev.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-imi-900 text-sm">{dev.name}</div>
                                                        {dev.avg_score >= 70 && (
                                                            <div className="flex items-center gap-1 text-[9px] text-accent-600 font-bold">
                                                                <Award size={10} /> Top Performance
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="text-sm font-bold text-imi-900">{dev.developments_count}</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="text-sm font-bold text-green-600">{dev.leads_count}</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={cn('text-sm font-bold', dev.avg_score >= 70 ? 'text-green-600' : dev.avg_score >= 40 ? 'text-yellow-600' : 'text-red-500')}>
                                                    {dev.avg_score}/100
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="text-sm text-imi-600">{dev.published_count}/{dev.developments_count}</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex flex-wrap gap-1 max-w-[200px]">
                                                    {dev.cities.slice(0, 2).map((city: string) => (
                                                        <span key={city} className="text-[9px] bg-imi-50 text-imi-600 px-2 py-1 rounded-lg font-bold">
                                                            {city}
                                                        </span>
                                                    ))}
                                                    {dev.cities.length > 2 && (
                                                        <span className="text-[9px] bg-imi-50 text-imi-400 px-2 py-1 rounded-lg font-bold">
                                                            +{dev.cities.length - 2}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <Link
                                                    href={`/backoffice/imoveis?dev=${encodeURIComponent(dev.name)}`}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-imi-900 hover:text-accent-600 hover:bg-accent-500/10 rounded-lg transition-colors"
                                                >
                                                    Ver <ExternalLink size={12} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
