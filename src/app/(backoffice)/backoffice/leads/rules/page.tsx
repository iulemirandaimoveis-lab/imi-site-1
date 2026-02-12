'use client'

import { Settings, Zap, Target, Plus } from 'lucide-react'

export default function LeadRulesPage() {
    return (
        <div className="space-y-6 pb-24 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-display font-bold text-text-header-light dark:text-white">Regras de Pontuação</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Configure como os leads são classificados automaticamente.</p>
                </div>
                <button className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90 transition-colors">
                    <Plus size={20} />
                </button>
            </div>

            <div className="space-y-4">
                {/* Rule 1 */}
                <div className="bg-white dark:bg-card-dark rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between group hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 flex items-center justify-center">
                            <Zap size={20} className="fill-current" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">Engajamento Alto</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Se o lead abrir 3 emails em 7 dias.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">+20 pts</span>
                        <div className="w-12 h-6 bg-green-500 rounded-full p-1 cursor-pointer flex justify-end">
                            <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                        </div>
                    </div>
                </div>

                {/* Rule 2 */}
                <div className="bg-white dark:bg-card-dark rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between group hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 flex items-center justify-center">
                            <Target size={20} className="fill-current" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">Perfil Ideal</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Cargo: Diretor/CEO + Localização: SP.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">+50 pts</span>
                        <div className="w-12 h-6 bg-green-500 rounded-full p-1 cursor-pointer flex justify-end">
                            <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                        </div>
                    </div>
                </div>

                {/* Rule 3 */}
                <div className="bg-white dark:bg-card-dark rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between group hover:shadow-md transition-all opacity-60">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center">
                            <Settings size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">Site Visitado</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Visitou página de preços > 2x.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">+10 pts</span>
                        <div className="w-12 h-6 bg-gray-300 dark:bg-gray-700 rounded-full p-1 cursor-pointer flex justify-start">
                            <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
