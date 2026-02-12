'use client'

import { TrendingUp, DollarSign, Target, MousePointerClick, Filter } from 'lucide-react'

export default function AdsPage() {
    return (
        <div className="space-y-6 pb-24 animate-fade-in">
            <div className="flex justify-between items-center bg-white dark:bg-card-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-lg">
                    <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center">
                        FB
                    </div>
                    Facebook Ads
                </div>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Filter size={20} />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-card-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-medium mb-2">Impressões</p>
                    <h3 className="text-2xl font-display font-bold text-text-header-light dark:text-white">45.2k</h3>
                    <span className="text-xs text-green-500 font-bold flex items-center gap-1 mt-1">
                        <TrendingUp size={12} /> +24%
                    </span>
                </div>
                <div className="bg-white dark:bg-card-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-medium mb-2">Clicks (CTR)</p>
                    <h3 className="text-2xl font-display font-bold text-text-header-light dark:text-white">2.8%</h3>
                    <span className="text-xs text-green-500 font-bold flex items-center gap-1 mt-1">
                        <MousePointerClick size={12} /> +0.4%
                    </span>
                </div>
            </div>

            <div className="bg-white dark:bg-card-dark p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900 dark:text-white">Gasto da Campanha</h3>
                    <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-600 dark:text-gray-300">Últimos 30 dias</span>
                </div>

                <div className="flex items-end gap-2 mb-2">
                    <span className="text-3xl font-display font-bold text-text-header-light dark:text-white">R$ 1.250</span>
                    <span className="text-xs text-gray-500 mb-1.5">/ R$ 2.000 orçado</span>
                </div>

                <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: '62%' }}></div>
                </div>
                <div className="mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                </div>
            </div>

            <div className="bg-white dark:bg-card-dark rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900 dark:text-white">Melhores Anúncios</h3>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    <div className="p-4 flex gap-4">
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden relative">
                            {/* Placeholder Image */}
                            <div className="absolute inset-0 flex items-center justify-center text-[8px] text-gray-500 uppercase font-bold tracking-widest bg-gray-100 dark:bg-gray-800 text-center p-1">
                                Residencial One
                            </div>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-sm text-gray-900 dark:text-white">Campanha Lançamento - Vídeo</h4>
                            <div className="flex gap-4 mt-2">
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase">Custo/Lead</p>
                                    <p className="text-sm font-bold text-text-header-light dark:text-white">R$ 4,50</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase">Conv.</p>
                                    <p className="text-sm font-bold text-text-header-light dark:text-white">12%</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 flex gap-4">
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden relative">
                            {/* Placeholder Image */}
                            <div className="absolute inset-0 flex items-center justify-center text-[8px] text-gray-500 uppercase font-bold tracking-widest bg-gray-100 dark:bg-gray-800 text-center p-1">
                                Carrossel Fotos
                            </div>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-sm text-gray-900 dark:text-white">Carrossel Detalhes</h4>
                            <div className="flex gap-4 mt-2">
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase">Custo/Lead</p>
                                    <p className="text-sm font-bold text-text-header-light dark:text-white">R$ 3,20</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase">Conv.</p>
                                    <p className="text-sm font-bold text-text-header-light dark:text-white">15%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
