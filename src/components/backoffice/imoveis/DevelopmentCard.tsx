import { Development } from '@/types/development'
import { Edit, Trash2, MapPin, Building2, Car, Bed, Bath, ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'

interface DevelopmentCardProps {
    development: Development
    onEdit: () => void
    onDelete: () => void
    onSelect?: () => void
    isSelected?: boolean
}

export default function DevelopmentCard({ development, onEdit, onDelete, onSelect, isSelected }: DevelopmentCardProps) {
    const statusColors = {
        draft: 'bg-slate-100 text-slate-600',
        published: 'bg-green-100 text-green-700',
        campaign: 'bg-accent-100 text-accent-700',
        sold: 'bg-imi-900 text-white',
        private: 'bg-purple-100 text-purple-700'
    }

    return (
        <div className="bg-white rounded-[2rem] border border-imi-100 shadow-soft overflow-hidden group hover:shadow-card-hover transition-all duration-300">
            {/* Image Area */}
            <div className="relative h-64 overflow-hidden bg-imi-50">
                {onSelect && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelect();
                        }}
                        className={`absolute top-4 right-4 z-20 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${isSelected
                                ? 'bg-imi-900 border-imi-900 text-white shadow-lg'
                                : 'bg-white/80 border-white backdrop-blur-sm hover:bg-white'
                            }`}
                    >
                        {isSelected && <div className="w-3 h-3 bg-white rounded-full" />}
                    </button>
                )}

                {development.image ? (
                    <Image
                        src={development.image}
                        alt={development.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-imi-300">
                        <Building2 size={48} strokeWidth={1} />
                    </div>
                )}

                <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColors[development.status_commercial] || 'bg-slate-100'}`}>
                        {development.status_commercial}
                    </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent pt-12">
                    <h3 className="text-white font-bold text-lg leading-tight mb-1 truncate">{development.title}</h3>
                    <div className="flex items-center text-white/80 text-xs">
                        <MapPin size={12} className="mr-1" />
                        {development.neighborhood}, {development.city}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-6">
                <div className="grid grid-cols-3 gap-2 mb-6 text-imi-500">
                    <div className="flex flex-col items-center p-2 rounded-xl bg-imi-50/50">
                        <Bed size={16} className="mb-1 text-imi-400" />
                        <span className="text-xs font-bold">{development.bedrooms} dorms</span>
                    </div>
                    <div className="flex flex-col items-center p-2 rounded-xl bg-imi-50/50">
                        <Car size={16} className="mb-1 text-imi-400" />
                        <span className="text-xs font-bold">{development.parking_spaces} vagas</span>
                    </div>
                    <div className="flex flex-col items-center p-2 rounded-xl bg-imi-50/50">
                        <ArrowUpRight size={16} className="mb-1 text-imi-400" />
                        <span className="text-xs font-bold">{development.area_from}m²</span>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-6 pt-4 border-t border-imi-50">
                    <div>
                        <span className="text-[10px] font-black text-imi-300 uppercase tracking-widest block mb-1">Valor de Venda</span>
                        <span className="text-lg font-bold text-imi-900 font-display">
                            {development.price_from ? formatCurrency(development.price_from) : 'Sob Consulta'}
                        </span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button onClick={onEdit} className="flex-1 h-10 border border-imi-100 bg-white hover:bg-imi-50 text-imi-600 rounded-xl text-xs font-bold uppercase tracking-wider transition-all">
                        <Edit size={14} className="mr-2" /> Editar
                    </Button>
                    <button onClick={onDelete} className="w-10 h-10 flex items-center justify-center rounded-xl border border-red-50 text-red-300 hover:text-red-500 hover:bg-red-50 transition-all">
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}
