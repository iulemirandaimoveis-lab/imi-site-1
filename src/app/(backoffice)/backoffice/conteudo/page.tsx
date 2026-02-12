'use client'

import { Sparkles, Calendar, PenTool, Hash, ImageIcon, Send } from 'lucide-react'

export default function ContentPage() {
    return (
        <div className="space-y-6 pb-24 animate-fade-in">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Sparkles size={64} />
                </div>
                <h2 className="text-xl font-display font-bold mb-2">Editorial AI Assistant</h2>
                <p className="text-sm text-purple-100 mb-4 max-w-xs">Gerando conteúdo estratégico para LinkedIn e Instagram com base em tendências de mercado.</p>
                <button className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 active:scale-95 transition-all flex items-center gap-2">
                    <Sparkles size={16} />
                    Gerar Novo Post
                </button>
            </div>

            <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-gray-900 dark:text-gray-100">Próximos Posts</h3>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">3 Agendados</span>
            </div>

            <div className="space-y-4">
                {/* Post 1 */}
                <div className="bg-white dark:bg-card-dark rounded-xl p-4 shadow-card border border-gray-100 dark:border-gray-800 relative group transition-transform active:scale-[0.98] cursor-pointer">
                    <div className="absolute top-4 right-4 flex gap-2">
                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">LinkedIn</span>
                    </div>
                    <div className="flex gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                            <ImageIcon size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                                <Calendar size={12} /> Amanhã, 09:00
                            </p>
                            <h4 className="font-bold text-gray-900 dark:text-white mt-0.5">Análise de Mercado Q1</h4>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                        O mercado de alto padrão em São Paulo cresceu 15% no último trimestre. Confira os dados exclusivos da IMI...
                    </p>
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                        <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-md flex items-center gap-1">
                            <Hash size={10} /> imobiliario
                        </span>
                        <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-md flex items-center gap-1">
                            <Hash size={10} /> investimento
                        </span>
                    </div>
                </div>

                {/* Post 2 */}
                <div className="bg-white dark:bg-card-dark rounded-xl p-4 shadow-card border border-gray-100 dark:border-gray-800 relative group transition-transform active:scale-[0.98] cursor-pointer">
                    <div className="absolute top-4 right-4 flex gap-2">
                        <span className="bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">Instagram</span>
                    </div>
                    <div className="flex gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                            <ImageIcon size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                                <Calendar size={12} /> 14 Fev, 18:00
                            </p>
                            <h4 className="font-bold text-gray-900 dark:text-white mt-0.5">Tour Virtual: Horizon</h4>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                        Explore cada detalhe deste empreendimento icônico sem sair de casa. O futuro da moradia está aqui. ✨
                    </p>
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                        <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-md flex items-center gap-1">
                            <Hash size={10} /> luxury
                        </span>
                        <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-md flex items-center gap-1">
                            <Hash size={10} /> design
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
