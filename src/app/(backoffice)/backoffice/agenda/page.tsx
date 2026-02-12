'use client'

import { ChevronLeft, ChevronRight, Calendar, MapPin, Clock } from 'lucide-react'

export default function AgendaPage() {
    return (
        <div className="space-y-6 pb-24 animate-fade-in">
            <div className="bg-white dark:bg-card-dark rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-display font-bold text-gray-900 dark:text-gray-100">Fevereiro 2026</h2>
                    <div className="flex gap-2">
                        <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"><ChevronLeft size={20} /></button>
                        <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"><ChevronRight size={20} /></button>
                    </div>
                </div>

                <div className="flex justify-between items-center text-center">
                    {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((day, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                            <span className="text-xs text-gray-400 font-medium">{day}</span>
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${i === 2 ? 'bg-primary text-white shadow-md shadow-primary/30' : 'text-gray-700 dark:text-gray-300'}`}>
                                {10 + i}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-display font-medium text-gray-500 uppercase tracking-widest text-xs px-2">Hoje, 12 Fev</h3>

                {/* Event 1 */}
                <div className="flex gap-4 group">
                    <div className="w-12 pt-2 flex flex-col items-center gap-1">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">10:00</span>
                        <div className="h-full w-0.5 bg-gray-200 dark:bg-gray-800 group-last:bg-transparent relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary ring-4 ring-white dark:ring-background-dark"></div>
                        </div>
                    </div>
                    <div className="flex-1 bg-white dark:bg-card-dark rounded-xl p-4 shadow-card border-l-4 border-primary hover:translate-x-1 transition-transform cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">Visita Técnica</span>
                            <button className="text-gray-400 hover:text-text-header-light dark:hover:text-white"><ChevronRight size={16} /></button>
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-1">Residencial Skyline</h4>
                        <p className="text-xs text-gray-500 flex items-center gap-2 mb-2">
                            <MapPin size={12} /> Av. Paulista, 1000 - SP
                        </p>
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                            <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px] font-bold">L</div>
                            <span className="text-xs text-gray-600 dark:text-gray-300">Cliente: Lucas Mendes</span>
                        </div>
                    </div>
                </div>

                {/* Event 2 */}
                <div className="flex gap-4 group">
                    <div className="w-12 pt-2 flex flex-col items-center gap-1">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">14:30</span>
                        <div className="h-full w-0.5 bg-gray-200 dark:bg-gray-800 group-last:bg-transparent relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-purple-500 ring-4 ring-white dark:ring-background-dark"></div>
                        </div>
                    </div>
                    <div className="flex-1 bg-white dark:bg-card-dark rounded-xl p-4 shadow-card border-l-4 border-purple-500 hover:translate-x-1 transition-transform cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                            <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">Reunião</span>
                            <button className="text-gray-400 hover:text-text-header-light dark:hover:text-white"><ChevronRight size={16} /></button>
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-1">Alinhamento Estratégico</h4>
                        <p className="text-xs text-gray-500 flex items-center gap-2 mb-2">
                            <Clock size={12} /> Google Meet
                        </p>
                        <div className="flex -space-x-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                            <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 flex items-center justify-center text-[10px] ring-2 ring-white dark:ring-card-dark">M</div>
                            <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 text-green-600 flex items-center justify-center text-[10px] ring-2 ring-white dark:ring-card-dark">D</div>
                            <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 flex items-center justify-center text-[10px] ring-2 ring-white dark:ring-card-dark">+3</div>
                        </div>
                    </div>
                </div>
            </div>

            <button className="fixed bottom-24 right-6 w-14 h-14 bg-primary rounded-full shadow-lg shadow-primary/30 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 lg:hidden">
                <Calendar size={24} />
            </button>
        </div>
    )
}
