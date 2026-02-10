'use client';

import { useState, useMemo } from 'react';
import useSWR from 'swr';
import { createClient } from '@/lib/supabase/client';
import {
    Plus, Search, Filter, Edit2, Trash2, ExternalLink, Building2, MapPin,
    Copy, Eye, EyeOff, Link2, Download, BarChart3, X, Loader2, CheckCircle2
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

function cn(...c: any[]) { return c.filter(Boolean).join(' '); }
function ScoreBadge({ score }: { score: number }) {
    const color = score >= 70 ? 'text-green-600 bg-green-50' : score >= 40 ? 'text-yellow-600 bg-yellow-50' : 'text-red-500 bg-red-50';
    return <span className={cn('text-[10px] font-black px-2 py-1 rounded-lg', color)}>{score}/100</span>;
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
    const [sel, setSel] = useState<string[]>([]);
    const [showF, setShowF] = useState(false);
    const [linkModal, setLinkModal] = useState<any>(null);
    const [linkCh, setLinkCh] = useState('instagram');
    const [linkCamp, setLinkCamp] = useState('');
    const [genLink, setGenLink] = useState(false);

    const { data: devs, mutate, isLoading } = useSWR('devs-list', async () => {
        const { data, error } = await supabase.from('developments').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    });

    const filtered = useMemo(() => {
        if (!devs) return [];
        return devs.filter(d => {
            const ms = !search || [d.name, d.city, d.neighborhood, d.developer].some(f => f?.toLowerCase().includes(search.toLowerCase()));
            const mst = statusF === 'all' || d.status === statusF;
            const mv = visF === 'all' || d.status_comercial === visF;
            const mr = regionF === 'all' || d.region === regionF;
            return ms && mst && mv && mr;
        });
    }, [devs, search, statusF, visF, regionF]);

    const stats = useMemo(() => ({ total: devs?.length || 0, pub: devs?.filter(d => d.status_comercial === 'publicado').length || 0, draft: devs?.filter(d => !d.status_comercial || d.status_comercial === 'rascunho').length || 0, avg: devs?.length ? Math.round(devs.reduce((a, d) => a + (d.score || 0), 0) / devs.length) : 0 }), [devs]);

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

    const handleCSV = () => {
        if (!filtered?.length) return;
        const h = ['Nome', 'Status', 'Tipo', 'Cidade', 'Bairro', 'Construtora', 'Preco Min', 'Score', 'Publicacao'];
        const r = filtered.map(d => [d.name, statusLabels[d.status] || d.status, tipoLabels[d.tipo] || d.tipo, d.city, d.neighborhood, d.developer, d.price_min, d.score, visibilityLabels[d.status_comercial] || d.status_comercial]);
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-imi-900 font-display">Imoveis</h1>
                    <p className="text-imi-500 text-sm mt-1">Hub operacional de ativos imobiliarios.</p>
                </div>
                <Button asChild className="bg-imi-900 hover:bg-imi-800 h-12 w-full sm:w-auto">
                    <Link href="/backoffice/imoveis/novo"><Plus size={20} className="mr-2" /> Novo Empreendimento</Link>
                </Button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[{ l: 'Total', v: stats.total, i: Building2, b: 'bg-blue-50' }, { l: 'Publicados', v: stats.pub, i: Eye, b: 'bg-green-50' }, { l: 'Rascunhos', v: stats.draft, i: EyeOff, b: 'bg-imi-50' }, { l: 'Score Medio', v: stats.avg + '/100', i: BarChart3, b: 'bg-accent-500/10' }].map(k => (
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
                        <input type="text" placeholder="Buscar nome, cidade, bairro, construtora..." className="w-full pl-10 pr-4 h-11 rounded-xl border border-imi-100 text-sm focus:ring-accent-500 focus:border-accent-500" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setShowF(!showF)} className={cn('flex items-center gap-2 px-4 h-11 rounded-xl border text-sm font-bold transition-all', showF ? 'bg-imi-900 text-white border-imi-900' : 'border-imi-100 text-imi-500')}><Filter size={16} /> Filtros</button>
                        <button onClick={handleCSV} className="flex items-center gap-2 px-4 h-11 rounded-xl border border-imi-100 text-sm font-bold text-imi-500 hover:border-imi-300"><Download size={16} /> CSV</button>
                    </div>
                </div>
                <AnimatePresence>{showF && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-imi-50">
                            <select value={statusF} onChange={e => setStatusF(e.target.value)} className="h-10 rounded-xl border-imi-100 text-xs font-bold"><option value="all">Status: Todos</option><option value="launch">Lancamento</option><option value="under_construction">Em Obras</option><option value="ready">Pronto</option></select>
                            <select value={visF} onChange={e => setVisF(e.target.value)} className="h-10 rounded-xl border-imi-100 text-xs font-bold"><option value="all">Publicacao: Todos</option><option value="rascunho">Rascunho</option><option value="publicado">Publicado</option><option value="campanha">Campanha</option><option value="privado">Privado</option></select>
                            <select value={regionF} onChange={e => setRegionF(e.target.value)} className="h-10 rounded-xl border-imi-100 text-xs font-bold"><option value="all">Regiao: Todas</option><option value="paraiba">Paraiba</option><option value="pernambuco">Pernambuco</option><option value="sao-paulo">Sao Paulo</option></select>
                            <button onClick={() => { setStatusF('all'); setVisF('all'); setRegionF('all'); setSearch(''); }} className="h-10 rounded-xl border border-imi-100 text-xs font-bold text-imi-400">Limpar</button>
                        </div>
                    </motion.div>
                )}</AnimatePresence>
            </div>

            {/* Bulk Bar */}
            <AnimatePresence>{sel.length > 0 && (
                <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} className="bg-imi-900 text-white rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <span className="text-sm font-bold">{sel.length} selecionado(s)</span>
                    <div className="flex flex-wrap gap-2">
                        <button onClick={() => handleBulkVis('publicado')} className="px-3 h-9 bg-green-600 rounded-lg text-xs font-bold">Publicar</button>
                        <button onClick={() => handleBulkVis('rascunho')} className="px-3 h-9 bg-imi-700 rounded-lg text-xs font-bold">Despublicar</button>
                        <button onClick={() => handleBulkVis('privado')} className="px-3 h-9 bg-red-600 rounded-lg text-xs font-bold">Privar</button>
                        <button onClick={() => setSel([])} className="px-3 h-9 bg-white/10 rounded-lg text-xs font-bold">Cancelar</button>
                    </div>
                </motion.div>
            )}</AnimatePresence>

            {/* Mobile Cards */}
            <div className="space-y-3 lg:hidden">
                {isLoading ? Array(3).fill(0).map((_, i) => <div key={i} className="bg-white rounded-2xl p-5 animate-pulse border border-imi-50 h-32" />) : filtered.length === 0 ? <div className="bg-white rounded-2xl p-12 text-center text-imi-400 border border-imi-50">Nenhum imovel encontrado.</div> : filtered.map(dev => (
                    <div key={dev.id} className="bg-white rounded-2xl border border-imi-50 shadow-soft overflow-hidden">
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
                                <ScoreBadge score={dev.score || 0} />
                            </div>
                            <QualityAlerts dev={dev} />
                            <div className="flex items-center gap-2 mt-3">
                                <span className={cn('text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full', statusColors[dev.status] || 'bg-imi-100 text-imi-500')}>{statusLabels[dev.status] || dev.status}</span>
                                <span className={cn('text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full', visibilityColors[dev.status_comercial] || visibilityColors.rascunho)}>{visibilityLabels[dev.status_comercial] || 'Rascunho'}</span>
                                {dev.price_min > 0 && <span className="ml-auto text-sm font-bold text-imi-900">R$ {dev.price_min?.toLocaleString('pt-BR')}</span>}
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

            {/* Desktop Table */}
            <div className="bg-white rounded-2xl shadow-soft border border-imi-50 overflow-hidden hidden lg:block">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead><tr className="bg-imi-50/50 border-b border-imi-100">
                            <th className="px-4 py-3 w-10"><button onClick={toggleAll} className={cn('w-5 h-5 rounded border-2 flex items-center justify-center', sel.length === filtered.length && filtered.length > 0 ? 'bg-imi-900 border-imi-900' : 'border-imi-200')}>{sel.length === filtered.length && filtered.length > 0 && <CheckCircle2 size={12} className="text-white" />}</button></th>
                            <th className="px-4 py-3 text-[10px] font-bold text-imi-400 uppercase tracking-widest">Empreendimento</th>
                            <th className="px-4 py-3 text-[10px] font-bold text-imi-400 uppercase tracking-widest text-center">Status</th>
                            <th className="px-4 py-3 text-[10px] font-bold text-imi-400 uppercase tracking-widest text-center">Publicacao</th>
                            <th className="px-4 py-3 text-[10px] font-bold text-imi-400 uppercase tracking-widest">Local</th>
                            <th className="px-4 py-3 text-[10px] font-bold text-imi-400 uppercase tracking-widest">Investimento</th>
                            <th className="px-4 py-3 text-[10px] font-bold text-imi-400 uppercase tracking-widest text-center">Score</th>
                            <th className="px-4 py-3 text-[10px] font-bold text-imi-400 uppercase tracking-widest text-right">Acoes</th>
                        </tr></thead>
                        <tbody className="divide-y divide-imi-50">
                            {isLoading ? Array(5).fill(0).map((_, i) => <tr key={i} className="animate-pulse"><td colSpan={8} className="px-4 py-6 h-16 bg-imi-50/20" /></tr>) : filtered.length === 0 ? <tr><td colSpan={8} className="px-4 py-16 text-center text-imi-400">Nenhum imovel encontrado.</td></tr> : filtered.map(dev => (
                                <tr key={dev.id} className="hover:bg-imi-50/30 transition-colors group">
                                    <td className="px-4 py-3"><button onClick={() => toggleSel(dev.id)} className={cn('w-5 h-5 rounded border-2 flex items-center justify-center', sel.includes(dev.id) ? 'bg-imi-900 border-imi-900' : 'border-imi-200 group-hover:border-imi-400')}>{sel.includes(dev.id) && <CheckCircle2 size={12} className="text-white" />}</button></td>
                                    <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="relative w-10 h-10 rounded-lg bg-imi-100 overflow-hidden flex-shrink-0 border border-imi-100">{dev.images?.main ? <Image src={dev.images.main} alt={dev.name} fill className="object-cover" sizes="40px" /> : <Building2 className="w-5 h-5 m-2.5 text-imi-300" />}</div><div className="min-w-0"><div className="font-bold text-imi-900 text-sm truncate max-w-[200px]">{dev.name}</div><div className="text-[10px] text-imi-400 truncate">{dev.developer}</div></div></div></td>
                                    <td className="px-4 py-3 text-center"><span className={cn('text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full', statusColors[dev.status])}>{statusLabels[dev.status]}</span></td>
                                    <td className="px-4 py-3 text-center"><span className={cn('text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full', visibilityColors[dev.status_comercial] || visibilityColors.rascunho)}>{visibilityLabels[dev.status_comercial] || 'Rascunho'}</span></td>
                                    <td className="px-4 py-3"><div className="flex items-center gap-1 text-xs text-imi-600"><MapPin size={10} className="text-accent-500" />{dev.neighborhood || '-'}, {dev.city || '-'}</div></td>
                                    <td className="px-4 py-3">{dev.price_min > 0 ? <div><div className="text-sm font-bold text-imi-900">R$ {dev.price_min?.toLocaleString('pt-BR')}</div><div className="text-[10px] text-imi-400">a partir de</div></div> : <span className="text-[10px] text-imi-300 italic">Sem preco</span>}</td>
                                    <td className="px-4 py-3 text-center"><ScoreBadge score={dev.score || 0} /></td>
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
        </div>
    );
}
