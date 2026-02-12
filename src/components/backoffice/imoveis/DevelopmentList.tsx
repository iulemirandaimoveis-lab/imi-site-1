import { Development } from '@/types/development'
import DevelopmentCard from './DevelopmentCard'
import { Loader2, SearchX } from 'lucide-react'
import Button from '@/components/ui/Button'

interface DevelopmentListProps {
    developments: Development[]
    isLoading: boolean
    onEdit: (id: string) => void
    onDelete: (id: string) => void
    onNew?: () => void
    selectedIds?: string[]
    onSelect?: (id: string) => void
}

export default function DevelopmentList({ developments, isLoading, onEdit, onDelete, onNew, selectedIds, onSelect }: DevelopmentListProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="bg-white rounded-[2rem] border border-imi-50 h-[450px] animate-pulse shadow-sm p-4">
                        <div className="aspect-[4/3] bg-imi-50 rounded-2xl mb-4"></div>
                        <div className="space-y-4">
                            <div className="h-6 bg-imi-50 rounded w-3/4"></div>
                            <div className="h-4 bg-imi-50 rounded w-1/2"></div>
                            <div className="grid grid-cols-3 gap-4 pt-4">
                                <div className="h-8 bg-imi-50 rounded"></div>
                                <div className="h-8 bg-imi-50 rounded"></div>
                                <div className="h-8 bg-imi-50 rounded"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (!developments || developments.length === 0) {
        return (
            <div className="bg-white rounded-[3rem] border border-dashed border-imi-100 p-20 text-center shadow-soft">
                <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 bg-imi-50 rounded-full flex items-center justify-center mx-auto mb-6 text-imi-300">
                        <SearchX className="w-10 h-10" strokeWidth={1} />
                    </div>
                    <h3 className="text-2xl font-bold text-imi-900 mb-2 font-display">
                        Nenhum ativo estratégico encontrado
                    </h3>
                    <p className="text-imi-400 mb-8 leading-relaxed font-medium">
                        Os filtros atuais não retornaram resultados ou o inventário está vazio.
                    </p>
                    {onNew && (
                        <div className="flex justify-center">
                            <Button onClick={onNew} className="bg-imi-900 text-white rounded-xl shadow-elevated hover:bg-imi-800 transition-all">
                                Cadastrar Novo Ativo
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white dark:bg-card-dark rounded-xl shadow-soft border border-gray-100 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                            <th className="p-4 w-12 text-center">
                                {/* Header Checkbox could go here if we had select all logic passed down or handled here */}
                            </th>
                            <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Imóvel</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Valor (VGV)</th>
                            <th className="p-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {developments.map((dev) => (
                            <tr key={dev.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <td className="p-4 text-center">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                                        checked={selectedIds?.includes(dev.id)}
                                        onChange={() => onSelect && onSelect(dev.id)}
                                    />
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden relative shrink-0">
                                            {dev.media?.[0]?.url && (
                                                <img
                                                    src={dev.media[0].url}
                                                    alt={dev.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">{dev.title}</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">{dev.address?.city || 'Localização não informada'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${dev.status_commercial === 'published'
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                        }`}>
                                        {dev.status_commercial === 'published' ? 'Ativo' : 'Inativo'}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dev.price_from || 0)}
                                        </span>
                                        <span className="text-[10px] text-gray-500">Valor Inicial</span>
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => onEdit(dev.id)}
                                            className="p-2 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                                            title="Editar"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                        </button>
                                        <button
                                            onClick={() => onDelete(dev.id)}
                                            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                                            title="Excluir"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
