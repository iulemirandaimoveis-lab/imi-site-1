'use client';

import { useState, useMemo, useEffect } from 'react';
import useSWR from 'swr';
import { createClient } from '@/lib/supabase/client';
import {
    Plus, Search, Filter, Edit2, Trash2, ExternalLink, Building2, MapPin,
    Copy, Eye, EyeOff, Link2, Download, BarChart3, X, Loader2, CheckCircle2,
    Users, Calendar, TrendingUp, Grid3x3, List, LayoutGrid, Star, Tag,
    ChevronDown, ChevronUp, Zap, Clock, ArrowUpDown
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';

const supabase = createClient();

const statusLabels: Record<string, string> = { launch: 'Lancamento', ready: 'Pronto', under_construction: 'Em Obras' };
const statusColors: Record<string, string> = { launch: 'bg-imi-900 text-white', ready: 'bg-accent-500 text-imi-900', under_construction: 'bg-imi-500 text-white' };
const visibilityLabels: Record<string, string> = { rascunho: 'Rascunho', publicado: 'Publicado', campanha: 'Campanha', privado: 'Privado' };
const visibilityColors: Record<string, string> = { rascunho: 'bg-imi-100 text-imi-500', publicado: 'bg-green-100 text-green-700', campanha: 'bg-purple-100 text-purple-700', privado: 'bg-red-100 text-red-700' };
const tipoLabels: Record<string, string> = { apartamento: 'Apt', casa: 'Casa', flat: 'Flat', lote: 'Lote', comercial: 'Com', resort: 'Resort' };

type SortField = 'name' | 'score' | 'leads_count' | 'price_min' | 'updated_at' | 'created_at';
type SortDir = 'asc' | 'desc';
type ViewMode = 'table' | 'cards' | 'grid';

function cn(...c: any[]) { return c.filter(Boolean).join(' '); }

function ScoreBadge({ score, showBreakdown }: { score: number, showBreakdown?: boolean }) {
    const color = score >= 70 ? 'text-green-600 bg-green-50' : score >= 40 ? 'text-yellow-600 bg-yellow-50' : 'text-red-500 bg-red-50';
    const missing = 100 - score;
    return (
        <div className="group relative">
            <span className={cn('text-[10px] font-black px-2 py-1 rounded-lg cursor-help', color)}>
                {score}/100
            </span>
            {showBreakdown && missing > 0 && (
                <div className="absolute hidden group-hover:block z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 bg-imi-900 text-white text-[9px] px-3 py-2 rounded-lg whitespace-nowrap shadow-xl">
                    <div className="font-bold mb-1">Faltam {missing} pts</div>
                    <div className="text-imi-300">Hover para detalhes</div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-4 border-transparent border-t-imi-900" />
                </div>
            )}
        </div>
    );
}

function LeadsBadge({ count }: { count: number }) {
    if (count === 0) return <span className="text-[10px] text-imi-300">-</span>;
    const color = count >= 10 ? 'bg-green-50 text-green-700' : count >= 5 ? 'bg-yellow-50 text-yellow-700' : 'bg-blue-50 text-blue-700';
    return (
        <span className={cn('text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1', color)}>
            <Users size={10} /> {count}
        </span>
    );
}

function TimeAgo({ date }: { date: string }) {
    if (!date) return <span className="text-[10px] text-imi-300">-</span>;
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor(diff / (1000 * 60));
    const text = days > 0 ? `há ${days}d` : hours > 0 ? `há ${hours}h` : mins > 0 ? `há ${mins}m` : 'agora';
    return <span className="text-[10px] text-imi-400 flex items-center gap-1"><Clock size={10} />{text}</span>;
}

function QualityAlerts({ dev }: { dev: any }) {
    const a: string[] = [];
    if (!dev.images?.main) a.push('Sem foto');
    if (!dev.images?.videos?.length) a.push('Sem video');
    if (!dev.images?.floorPlans?.length) a.push('Sem planta');
    if (!dev.price_min) a.push('Sem preco');
    if (!dev.delivery_date) a.push('Sem entrega');
    if (!a.length) return null;
    return <div className="flex flex-wrap gap-1 mt-2">{a.map(x => <span key={x} className="text-[9px] font-bold bg-red-50 text-red-400 px-2 py-0.5 rounded-md uppercase tracking-wider">{x}</span>)}</div>;
}

export default function PropertiesPage() {
    const [search, setSearch] = useState('');
    const [statusF, setStatusF] = useState('all');
    const [visF, setVisF] = useState('all');
    const [regionF, setRegionF] = useState('all');
    const [devF, setDevF] = useState('all');
    const [tipoF, setTipoF] = useState('all');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
    const [sel, setSel] = useState<string[]>([]);
    const [showF, setShowF] = useState(false);
    const [linkModal, setLinkModal] = useState<any>(null);
    const [bulkEditModal, setBulkEditModal] = useState(false);
    const [linkCh, setLinkCh] = useState('instagram');
    const [linkCamp, setLinkCamp] = useState('');
    const [genLink, setGenLink] = useState(false);
    const [sortField, setSortField] = useState<SortField>('created_at');
    const [sortDir, setSortDir] = useState<SortDir>('desc');
    const [viewMode, setViewMode] = useState<ViewMode>('table');
    const [bulkTag, setBulkTag] = useState('');

    const { data: devs, mutate, isLoading } = useSWR('devs-list', async () => {
        const { data, error } = await supabase.from('developments').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    });

    const developers = useMemo(() => {
        if (!devs) return [];
        const unique = [...new Set(devs.map(d => d.developer).filter(Boolean))];
        return unique.sort();
    }, [devs]);

    const filtered = useMemo(() => {
        if (!devs) return [];
        let result = devs.filter(d => {
            const ms = !search || [d.name, d.city, d.neighborhood, d.developer].some(f => f?.toLowerCase().includes(search.toLowerCase()));
            const mst = statusF === 'all' || d.status === statusF;
            const mv = visF === 'all' || d.status_comercial === visF;
            const mr = regionF === 'all' || d.region === regionF;
            const md = devF === 'all' || d.developer === devF;
            const mt = tipoF === 'all' || d.tipo === tipoF;
            const mp = (d.price_min || 0) >= priceRange[0] && (d.price_min || 0) <= priceRange[1];
            return ms && mst && mv && mr && md && mt && mp;
        });

        // Sort
        result.sort((a, b) => {
            const aVal = a[sortField] || 0;
            const bVal = b[sortField] || 0;
            if (sortField === 'name') {
                return sortDir === 'asc' ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
            }
            return sortDir === 'asc' ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
        });

        return result;
    }, [devs, search, statusF, visF, regionF, devF, tipoF, priceRange, sortField, sortDir]);

    const stats = useMemo(() => ({
        total: devs?.length || 0,
        pub: devs?.filter(d => d.status_comercial === 'publicado').length || 0,
        draft: devs?.filter(d => !d.status_comercial || d.status_comercial === 'rascunho').length || 0,
        totalLeads: devs?.reduce((sum, d) => sum + (d.leads_count || 0), 0) || 0,
        avg: devs?.length ? Math.round(devs.reduce((a, d) => a + (d.score || 0), 0) / devs.length) : 0
    }), [devs]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
            if (e.key === '/') { e.preventDefault(); document.querySelector<HTMLInputElement>('input[type="text"]')?.focus(); }
            if (e.key === 'n') { e.preventDefault(); window.location.href = '/backoffice/imoveis/novo'; }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm('Excluir "' + name + '"? Irreversivel.')) return;
        const { error } = await supabase.from('developments').delete().eq('id', id);
        if (error) toast.error('Erro: ' + error.message); else { toast.success('Excluido'); mutate(); }
    };

    const handleDuplicate = async (dev: any) => {
        const { id, created_at, updated_at, ...rest } = dev;
        const { error } = await supabase.from('developments').insert([{ ...rest, name: rest.name + ' (copia)', slug: rest.slug + '-copia-' + Date.now(), status_comercial: 'rascunho', leads_count: 0, score: 0 }]);
        if (error) toast.error('Erro: ' + error.message); else { toast.success('Duplicado'); mutate(); }
    };

    const handleBulkVis = async (v: string) => {
        if (!sel.length) return;
        const { error } = await supabase.from('developments').update({ status_comercial: v, updated_at: new Date().toISOString() }).in('id', sel);
        if (error) toast.error('Erro: ' + error.message); else { toast.success(sel.length + ' atualizados'); setSel([]); mutate(); }
    };

    const handleBulkTag = async () => {
        if (!sel.length || !bulkTag) return;
        const updates = sel.map(async (id) => {
            const dev = devs?.find(d => d.id === id);
            if (!dev) return;
            const tags = dev.tags || [];
            if (!tags.includes(bulkTag)) {
                await supabase.from('developments').update({ tags: [...tags, bulkTag], updated_at: new Date().toISOString() }).eq('id', id);
            }
        });
        await Promise.all(updates);
        toast.success(`Tag "${bulkTag}" aplicada a ${sel.length} imoveis`);
        setBulkEditModal(false);
        setBulkTag('');
        setSel([]);
        mutate();
    };

    const handleCSV = () => {
        if (!filtered?.length) return;
        const h = ['Nome', 'Status', 'Tipo', 'Cidade', 'Bairro', 'Construtora', 'Preco Min', 'Score', 'Leads', 'Publicacao', 'Atualizado'];
        const r = filtered.map(d => [
            d.name,
            statusLabels[d.status] || d.status,
            tipoLabels[d.tipo] || d.tipo,
            d.city,
            d.neighborhood,
            d.developer,
            d.price_min,
            d.score,
            d.leads_count || 0,
            visibilityLabels[d.status_comercial] || d.status_comercial,
            d.updated_at
        ]);
        const csv = [h, ...r].map(x => x.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'imoveis-' + new Date().toISOString().split('T')[0] + '.csv'; a.click(); URL.revokeObjectURL(url);
        toast.success('CSV exportado');
    };

    const handleGenLink = async () => {
        if (!linkModal) return;
        setGenLink(true);
        const sc = Math.random().toString(36).slice(2, 8);
        const { error } = await supabase.from('tracked_links').insert([{ development_id: linkModal.id, channel: linkCh, utm_source: linkCh, utm_medium: 'cpc', utm_campaign: linkCamp || linkModal.slug, short_code: sc }]);
        if (error) { toast.error('Erro: ' + error.message); }
        else {
            const u = 'https://iulemirandaimoveis.com.br/pt/imoveis/' + linkModal.slug + '?utm_source=' + linkCh + '&utm_campaign=' + (linkCamp || linkModal.slug) + '&ref=' + sc;
            await navigator.clipboard.writeText(u); toast.success('Link copiado!'); setLinkModal(null); setLinkCamp(''); mutate();
        }
        setGenLink(false);
    };

    const toggleSel = (id: string) => setSel(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);
    const toggleAll = () => { if (sel.length === filtered.length) setSel([]); else setSel(filtered.map(d => d.id)); };

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
                {sortField === field ? (
                    sortDir === 'asc' ? <ChevronUp size={12} className="text-accent-500" /> : <ChevronDown size={12} className="text-accent-500" />
                ) : (
                    <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-40" />
                )}
            </div>
        </th>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-imi-900 font-display">Imoveis</h1>
                    <p className="text-imi-500 text-sm mt-1">Hub operacional de ativos imobiliarios. <kbd className="text-[9px] bg-imi-100 px-1.5 py-0.5 rounded">N</kbd> novo</p>
                </div>
                <div className="flex gap-2">
                    <div className="flex bg-white rounded-xl border border-imi-100 p-1">
                        <button onClick={() => setViewMode('table')} className={cn('p-2 rounded-lg', viewMode === 'table' ? 'bg-imi-900 text-white' : 'text-imi-400')} title="Tabela"><List size={16} /></button>
                        <button onClick={() => setViewMode('cards')} className={cn('p-2 rounded-lg', viewMode === 'cards' ? 'bg-imi-900 text-white' : 'text-imi-400')} title="Cards"><LayoutGrid size={16} /></button>
                        <button onClick={() => setViewMode('grid')} className={cn('p-2 rounded-lg', viewMode === 'grid' ? 'bg-imi-900 text-white' : 'text-imi-400')} title="Grid"><Grid3x3 size={16} /></button>
                    </div>
                    <Button asChild className="bg-imi-900 hover:bg-imi-800 h-12">
                        <Link href="/backoffice/imoveis/novo"><Plus size={20} className="mr-2" /> Novo</Link>
                    </Button>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                {[
                    { l: 'Total', v: stats.total, i: Building2, b: 'bg-blue-50' },
                    { l: 'Publicados', v: stats.pub, i: Eye, b: 'bg-green-50' },
                    { l: 'Rascunhos', v: stats.draft, i: EyeOff, b: 'bg-imi-50' },
                    { l: 'Total Leads', v: stats.totalLeads, i: Users, b: 'bg-purple-50' },
                    { l: 'Score Medio', v: stats.avg + '/100', i: BarChart3, b: 'bg-accent-500/10' }
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
                        <input type="text" placeholder="Buscar (pressione / para focar)..." className="w-full pl-10 pr-4 h-11 rounded-xl border border-imi-100 text-sm focus:ring-accent-500 focus:border-accent-500" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setShowF(!showF)} className={cn('flex items-center gap-2 px-4 h-11 rounded-xl border text-sm font-bold transition-all', showF ? 'bg-imi-900 text-white border-imi-900' : 'border-imi-100 text-imi-500')}><Filter size={16} /> Filtros {showF && '✓'}</button>
                        <button onClick={handleCSV} className="flex items-center gap-2 px-4 h-11 rounded-xl border border-imi-100 text-sm font-bold text-imi-500 hover:border-imi-300"><Download size={16} /> CSV</button>
                    </div>
                </div>
                <AnimatePresence>{showF && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-3 border-t border-imi-50">
                            <select value={statusF} onChange={e => setStatusF(e.target.value)} className="h-10 rounded-xl border-imi-100 text-xs font-bold"><option value="all">Status: Todos</option><option value="launch">Lancamento</option><option value="under_construction">Em Obras</option><option value="ready">Pronto</option></select>
                            <select value={visF} onChange={e => setVisF(e.target.value)} className="h-10 rounded-xl border-imi-100 text-xs font-bold"><option value="all">Publicacao: Todos</option><option value="rascunho">Rascunho</option><option value="publicado">Publicado</option><option value="campanha">Campanha</option><option value="privado">Privado</option></select>
                            <select value={regionF} onChange={e => setRegionF(e.target.value)} className="h-10 rounded-xl border-imi-100 text-xs font-bold"><option value="all">Regiao: Todas</option><option value="paraiba">Paraiba</option><option value="pernambuco">Pernambuco</option><option value="sao-paulo">Sao Paulo</option></select>
                            <select value={devF} onChange={e => setDevF(e.target.value)} className="h-10 rounded-xl border-imi-100 text-xs font-bold"><option value="all">Construtora: Todas</option>{developers.map(d => <option key={d} value={d}>{d}</option>)}</select>
                            <select value={tipoF} onChange={e => setTipoF(e.target.value)} className="h-10 rounded-xl border-imi-100 text-xs font-bold"><option value="all">Tipo: Todos</option><option value="apartamento">Apartamento</option><option value="casa">Casa</option><option value="flat">Flat</option><option value="lote">Lote</option><option value="comercial">Comercial</option><option value="resort">Resort</option></select>
                        </div>
                        <div className="flex justify-end pt-3">
                            <button onClick={() => { setStatusF('all'); setVisF('all'); setRegionF('all'); setDevF('all'); setTipoF('all'); setSearch(''); }} className="text-xs font-bold text-imi-400 hover:text-imi-900 flex items-center gap-1"><X size={12} /> Limpar Filtros</button>
                        </div>
                    </motion.div>
                )}</AnimatePresence>
            </div>

            {/* Bulk Bar */}
            <AnimatePresence>{sel.length > 0 && (
                <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} className="bg-imi-900 text-white rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <span className="text-sm font-bold flex items-center gap-2"><Zap size={16} className="text-accent-500" /> {sel.length} selecionado(s)</span>
                    <div className="flex flex-wrap gap-2">
                        <button onClick={() => handleBulkVis('publicado')} className="px-3 h-9 bg-green-600 rounded-lg text-xs font-bold hover:bg-green-700">Publicar</button>
                        <button onClick={() => handleBulkVis('rascunho')} className="px-3 h-9 bg-imi-700 rounded-lg text-xs font-bold hover:bg-imi-600">Despublicar</button>
                        <button onClick={() => handleBulkVis('privado')} className="px-3 h-9 bg-red-600 rounded-lg text-xs font-bold hover:bg-red-700">Privar</button>
                        <button onClick={() => setBulkEditModal(true)} className="px-3 h-9 bg-purple-600 rounded-lg text-xs font-bold hover:bg-purple-700 flex items-center gap-1"><Tag size={12} /> Tag</button>
                        <button onClick={() => setSel([])} className="px-3 h-9 bg-white/10 rounded-lg text-xs font-bold hover:bg-white/20">Cancelar</button>
                    </div>
                </motion.div>
            )}</AnimatePresence>

            {/* Mobile Cards */}
            {viewMode === 'cards' && (
                <div className="space-y-3">
                    {isLoading ? Array(3).fill(0).map((_, i) => <div key={i} className="bg-white rounded-2xl p-5 animate-pulse border border-imi-50 h-32" />) : filtered.length === 0 ? <div className="bg-white rounded-2xl p-12 text-center text-imi-400 border border-imi-50">Nenhum imovel encontrado.</div> : filtered.map(dev => (
                        <div key={dev.id} className="bg-white rounded-2xl border border-imi-50 shadow-soft overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="p-4">
                                <div className="flex items-start gap-3">
                                    <button onClick={() => toggleSel(dev.id)} className={cn('mt-1 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0', sel.includes(dev.id) ? 'bg-imi-900 border-imi-900' : 'border-imi-200')}>{sel.includes(dev.id) && <CheckCircle2 size={12} className="text-white" />}</button>
                                    <div className="relative w-14 h-14 rounded-xl bg-imi-100 overflow-hidden flex-shrink-0 border border-imi-100">
                                        {dev.images?.main ? <Image src={dev.images.main} alt={dev.name} fill className="object-cover" sizes="56px" /> : <Building2 className="w-7 h-7 m-3.5 text-imi-300" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-imi-900 text-sm truncate">{dev.name}</h3>
                                        <p className="text-[11px] text-imi-400">{dev.developer}</p>
                                        <div className="flex items-center gap-1 mt-1 text-[11px] text-imi-500"><MapPin size={10} className="text-accent-500" />{dev.neighborhood ? dev.neighborhood + ', ' : ''}{dev.city || 'Sem cidade'}</div>
                                    </div>
                                    <div className="flex flex-col gap-1 items-end">
                                        <ScoreBadge score={dev.score || 0} showBreakdown />
                                        <LeadsBadge count={dev.leads_count || 0} />
                                    </div>
                                </div>
                                <QualityAlerts dev={dev} />
                                <div className="flex items-center gap-2 mt-3 flex-wrap">
                                    <span className={cn('text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full', statusColors[dev.status] || 'bg-imi-100 text-imi-500')}>{statusLabels[dev.status] || dev.status}</span>
                                    <span className={cn('text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full', visibilityColors[dev.status_comercial] || visibilityColors.rascunho)}>{visibilityLabels[dev.status_comercial] || 'Rascunho'}</span>
                                    {dev.price_min > 0 && <span className="ml-auto text-sm font-bold text-imi-900">R$ {dev.price_min?.toLocaleString('pt-BR')}</span>}
                                    <TimeAgo date={dev.updated_at} />
                                </div>
                            </div>
                            <div className="flex border-t border-imi-50 divide-x divide-imi-50">
                                <Link href={'/backoffice/imoveis/' + dev.id} className="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold text-imi-600 hover:bg-imi-50 min-h-[44px]"><Edit2 size={14} /> Editar</Link>
                                <button onClick={() => setLinkModal(dev)} className="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold text-accent-600 hover:bg-accent-500/5 min-h-[44px]"><Link2 size={14} /> Link</button>
                                <button onClick={() => handleDuplicate(dev)} className="flex items-center justify-center py-3 px-4 text-xs font-bold text-imi-400 hover:bg-imi-50 min-h-[44px]"><Copy size={14} /></button>
                                <button onClick={() => handleDelete(dev.id, dev.name)} className="flex items-center justify-center py-3 px-4 text-xs font-bold text-red-400 hover:bg-red-50 min-h-[44px]"><Trash2 size={14} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Grid View */}
            {viewMode === 'grid' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {isLoading ? Array(10).fill(0).map((_, i) => <div key={i} className="bg-white rounded-xl p-3 animate-pulse border border-imi-50 h-48" />) : filtered.length === 0 ? <div className="col-span-full bg-white rounded-2xl p-12 text-center text-imi-400 border border-imi-50">Nenhum imovel encontrado.</div> : filtered.map(dev => (
                        <div key={dev.id} className="bg-white rounded-xl border border-imi-50 shadow-soft overflow-hidden hover:shadow-lg transition-all group">
                            <div className="relative aspect-video bg-imi-100">
                                {dev.images?.main ? <Image src={dev.images.main} alt={dev.name} fill className="object-cover" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw" /> : <Building2 className="w-12 h-12 m-auto mt-12 text-imi-300" />}
                                <button onClick={() => toggleSel(dev.id)} className={cn('absolute top-2 left-2 w-6 h-6 rounded-lg border-2 flex items-center justify-center backdrop-blur-sm', sel.includes(dev.id) ? 'bg-imi-900 border-imi-900' : 'bg-white/80 border-white')}>{sel.includes(dev.id) && <CheckCircle2 size={14} className="text-white" />}</button>
                                <div className="absolute top-2 right-2"><ScoreBadge score={dev.score || 0} /></div>
                            </div>
                            <div className="p-3">
                                <h3 className="font-bold text-imi-900 text-xs truncate mb-1">{dev.name}</h3>
                                <p className="text-[9px] text-imi-400 truncate mb-2">{dev.developer}</p>
                                <div className="flex items-center justify-between gap-2">
                                    <LeadsBadge count={dev.leads_count || 0} />
                                    <Link href={'/backoffice/imoveis/' + dev.id} className="p-1.5 text-imi-400 hover:text-imi-900 hover:bg-imi-50 rounded"><Edit2 size={12} /></Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Desktop Table */}
            {viewMode === 'table' && (
                <div className="bg-white rounded-2xl shadow-soft border border-imi-50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead><tr className="bg-imi-50/50 border-b border-imi-100">
                                <th className="px-4 py-3 w-10"><button onClick={toggleAll} className={cn('w-5 h-5 rounded border-2 flex items-center justify-center', sel.length === filtered.length && filtered.length > 0 ? 'bg-imi-900 border-imi-900' : 'border-imi-200')}>{sel.length === filtered.length && filtered.length > 0 && <CheckCircle2 size={12} className="text-white" />}</button></th>
                                <SortHeader field="name">Empreendimento</SortHeader>
                                <th className="px-4 py-3 text-[10px] font-bold text-imi-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-4 py-3 text-[10px] font-bold text-imi-400 uppercase tracking-widest text-center">Publicacao</th>
                                <th className="px-4 py-3 text-[10px] font-bold text-imi-400 uppercase tracking-widest">Local</th>
                                <SortHeader field="price_min">Investimento</SortHeader>
                                <SortHeader field="leads_count">Leads</SortHeader>
                                <SortHeader field="score">Score</SortHeader>
                                <SortHeader field="updated_at">Atualizado</SortHeader>
                                <th className="px-4 py-3 text-[10px] font-bold text-imi-400 uppercase tracking-widest text-right">Acoes</th>
                            </tr></thead>
                            <tbody className="divide-y divide-imi-50">
                                {isLoading ? Array(5).fill(0).map((_, i) => <tr key={i} className="animate-pulse"><td colSpan={10} className="px-4 py-6 h-16 bg-imi-50/20" /></tr>) : filtered.length === 0 ? <tr><td colSpan={10} className="px-4 py-16 text-center text-imi-400">Nenhum imovel encontrado.</td></tr> : filtered.map(dev => (
                                    <tr key={dev.id} className="hover:bg-imi-50/30 transition-colors group">
                                        <td className="px-4 py-3"><button onClick={() => toggleSel(dev.id)} className={cn('w-5 h-5 rounded border-2 flex items-center justify-center', sel.includes(dev.id) ? 'bg-imi-900 border-imi-900' : 'border-imi-200 group-hover:border-imi-400')}>{sel.includes(dev.id) && <CheckCircle2 size={12} className="text-white" />}</button></td>
                                        <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="relative w-10 h-10 rounded-lg bg-imi-100 overflow-hidden flex-shrink-0 border border-imi-100">{dev.images?.main ? <Image src={dev.images.main} alt={dev.name} fill className="object-cover" sizes="40px" /> : <Building2 className="w-5 h-5 m-2.5 text-imi-300" />}</div><div className="min-w-0"><div className="font-bold text-imi-900 text-sm truncate max-w-[200px]">{dev.name}</div><div className="text-[10px] text-imi-400 truncate">{dev.developer}</div></div></div></td>
                                        <td className="px-4 py-3 text-center"><span className={cn('text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full', statusColors[dev.status])}>{statusLabels[dev.status]}</span></td>
                                        <td className="px-4 py-3 text-center"><span className={cn('text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full', visibilityColors[dev.status_comercial] || visibilityColors.rascunho)}>{visibilityLabels[dev.status_comercial] || 'Rascunho'}</span></td>
                                        <td className="px-4 py-3"><div className="flex items-center gap-1 text-xs text-imi-600"><MapPin size={10} className="text-accent-500" />{dev.neighborhood || '-'}, {dev.city || '-'}</div></td>
                                        <td className="px-4 py-3">{dev.price_min > 0 ? <div><div className="text-sm font-bold text-imi-900">R$ {dev.price_min?.toLocaleString('pt-BR')}</div><div className="text-[10px] text-imi-400">a partir de</div></div> : <span className="text-[10px] text-imi-300 italic">Sem preco</span>}</td>
                                        <td className="px-4 py-3 text-center"><LeadsBadge count={dev.leads_count || 0} /></td>
                                        <td className="px-4 py-3 text-center"><ScoreBadge score={dev.score || 0} showBreakdown /></td>
                                        <td className="px-4 py-3"><TimeAgo date={dev.updated_at} /></td>
                                        <td className="px-4 py-3 text-right"><div className="flex justify-end gap-1">
                                            <Link href={'/backoffice/imoveis/' + dev.id} className="p-2 text-imi-400 hover:text-imi-900 hover:bg-imi-50 rounded-lg" title="Editar"><Edit2 size={16} /></Link>
                                            <button onClick={() => setLinkModal(dev)} className="p-2 text-imi-400 hover:text-accent-600 hover:bg-accent-500/10 rounded-lg" title="Link"><Link2 size={16} /></button>
                                            <button onClick={() => handleDuplicate(dev)} className="p-2 text-imi-400 hover:text-imi-900 hover:bg-imi-50 rounded-lg" title="Duplicar"><Copy size={16} /></button>
                                            <button onClick={() => handleDelete(dev.id, dev.name)} className="p-2 text-imi-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Excluir"><Trash2 size={16} /></button>
                                            <Link href={'/pt/imoveis/' + dev.slug} target="_blank" className="p-2 text-imi-400 hover:text-accent-600 hover:bg-accent-500/10 rounded-lg" title="Ver site"><ExternalLink size={16} /></Link>
                                        </div></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal Link Trackeado */}
            <AnimatePresence>{linkModal && (<>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-imi-900/40 backdrop-blur-sm z-[200]" onClick={() => setLinkModal(null)} />
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-x-4 top-1/2 -translate-y-1/2 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-md bg-white rounded-3xl shadow-2xl z-[210] p-6 sm:p-8 space-y-6">
                    <div className="flex items-center justify-between"><h3 className="text-lg font-bold text-imi-900 font-display">Gerar Link Trackeado</h3><button onClick={() => setLinkModal(null)} className="p-2 hover:bg-imi-50 rounded-lg"><X size={20} className="text-imi-400" /></button></div>
                    <p className="text-sm text-imi-500">Imovel: <strong className="text-imi-900">{linkModal.name}</strong></p>
                    <div className="space-y-4">
                        <div><label className="text-[10px] font-bold text-imi-900 uppercase tracking-widest mb-2 block">Canal</label>
                            <div className="grid grid-cols-3 gap-2">{['instagram', 'google', 'whatsapp', 'email', 'linkedin', 'tiktok'].map(ch => (<button key={ch} onClick={() => setLinkCh(ch)} className={cn('py-2.5 rounded-xl text-xs font-bold border capitalize min-h-[44px]', linkCh === ch ? 'bg-imi-900 text-white border-imi-900' : 'border-imi-100 text-imi-500')}>{ch}</button>))}</div>
                        </div>
                        <div><label className="text-[10px] font-bold text-imi-900 uppercase tracking-widest mb-2 block">Campanha (opcional)</label><input value={linkCamp} onChange={e => setLinkCamp(e.target.value)} className="w-full h-11 rounded-xl border border-imi-100 px-4 text-sm" placeholder="Ex: lancamento-verao-2026" /></div>
                    </div>
                    <Button onClick={handleGenLink} disabled={genLink} className="w-full bg-imi-900 hover:bg-imi-800 h-12">{genLink ? <Loader2 size={18} className="animate-spin mr-2" /> : <Link2 size={18} className="mr-2" />}Gerar e Copiar</Button>
                </motion.div>
            </>)}</AnimatePresence>

            {/* Modal Bulk Tag */}
            <AnimatePresence>{bulkEditModal && (<>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-imi-900/40 backdrop-blur-sm z-[200]" onClick={() => setBulkEditModal(false)} />
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-x-4 top-1/2 -translate-y-1/2 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-md bg-white rounded-3xl shadow-2xl z-[210] p-6 sm:p-8 space-y-6">
                    <div className="flex items-center justify-between"><h3 className="text-lg font-bold text-imi-900 font-display">Aplicar Tag em {sel.length} Imoveis</h3><button onClick={() => setBulkEditModal(false)} className="p-2 hover:bg-imi-50 rounded-lg"><X size={20} className="text-imi-400" /></button></div>
                    <div><label className="text-[10px] font-bold text-imi-900 uppercase tracking-widest mb-2 block">Tag</label>
                        <div className="grid grid-cols-2 gap-2 mb-3">{['investimento', 'alto-padrao', 'renda', 'oportunidade', 'lancamento', 'destaque'].map(t => (<button key={t} onClick={() => setBulkTag(t)} className={cn('py-2.5 rounded-xl text-xs font-bold border capitalize min-h-[44px]', bulkTag === t ? 'bg-imi-900 text-white border-imi-900' : 'border-imi-100 text-imi-500')}>{t}</button>))}</div>
                        <input value={bulkTag} onChange={e => setBulkTag(e.target.value)} className="w-full h-11 rounded-xl border border-imi-100 px-4 text-sm" placeholder="Ou digite uma tag customizada..." />
                    </div>
                    <Button onClick={handleBulkTag} disabled={!bulkTag} className="w-full bg-imi-900 hover:bg-imi-800 h-12"><Tag size={18} className="mr-2" />Aplicar Tag</Button>
                </motion.div>
            </>)}</AnimatePresence>
        </div>
    );
}
