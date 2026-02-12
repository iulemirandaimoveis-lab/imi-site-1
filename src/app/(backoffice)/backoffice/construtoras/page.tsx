'use client'

import { MapPin, Building2, Users, Star, ChevronRight, Search, Filter } from 'lucide-react'

export default function DevelopersPage() {
    return (
        <div className="space-y-6 pb-24 animate-fade-in">
            {/* Header is handled by Layout/Header component, but this page has specific filters in the prompt */}

            <div className="sticky top-0 z-30 bg-background-light dark:bg-background-dark pt-2 pb-2">
                <div className="relative mb-3">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                    </span>
                    <input
                        className="block w-full pl-10 pr-3 py-3 border-none rounded-xl leading-5 bg-white dark:bg-card-dark text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary shadow-soft"
                        placeholder="Buscar construtora..."
                        type="text"
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    <button className="px-4 py-1.5 rounded-full bg-imi-dark-blue dark:bg-primary text-white text-xs font-medium whitespace-nowrap shadow-md">Todas</button>
                    <button className="px-4 py-1.5 rounded-full bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium whitespace-nowrap hover:border-primary transition-colors">Alta Performance</button>
                    <button className="px-4 py-1.5 rounded-full bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium whitespace-nowrap hover:border-primary transition-colors">Residencial</button>
                    <button className="px-4 py-1.5 rounded-full bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium whitespace-nowrap hover:border-primary transition-colors">Comercial</button>
                </div>
            </div>

            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Parceiros Premium</h2>
                <span className="text-xs text-primary font-medium">12 encontrados</span>
            </div>

            <div className="space-y-4">
                {/* Cyrela Card */}
                <div className="bg-white dark:bg-card-dark rounded-xl p-4 shadow-card border border-gray-100 dark:border-gray-800 relative group transition-transform active:scale-[0.98] hover:shadow-card-hover cursor-pointer">
                    <div className="absolute top-4 right-4 bg-primary/10 text-primary px-2 py-1 rounded-md flex items-center gap-1">
                        <Star size={14} className="fill-current" />
                        <span className="text-[10px] font-bold uppercase tracking-wide">High Performance</span>
                    </div>
                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center p-2 text-2xl font-display font-bold text-imi-dark-blue dark:text-white">
                            Cy
                        </div>
                        <div className="pt-1">
                            <h3 className="text-lg font-bold text-text-header-light dark:text-white leading-tight">Cyrela</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                                <MapPin size={14} /> São Paulo, SP
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-500 uppercase font-medium">Imóveis Ativos</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <Building2 size={16} className="text-imi-dark-blue dark:text-gray-300" />
                                <span className="text-sm font-bold text-imi-dark-blue dark:text-white">42 Empreendimentos</span>
                            </div>
                        </div>
                        <div className="flex flex-col border-l border-gray-200 dark:border-gray-700 pl-3">
                            <span className="text-[10px] text-gray-500 uppercase font-medium">Leads Gerados</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <Users size={16} className="text-primary" />
                                <span className="text-sm font-bold text-imi-dark-blue dark:text-white">1,284</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* EZTEC Card */}
                <div className="bg-white dark:bg-card-dark rounded-xl p-4 shadow-card border border-gray-100 dark:border-gray-800 relative group transition-transform active:scale-[0.98] hover:shadow-card-hover cursor-pointer">
                    <div className="absolute top-4 right-4 bg-primary/10 text-primary px-2 py-1 rounded-md flex items-center gap-1">
                        <Star size={14} className="fill-current" />
                        <span className="text-[10px] font-bold uppercase tracking-wide">High Performance</span>
                    </div>
                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center p-2 text-2xl font-display font-bold text-imi-dark-blue dark:text-white">
                            Ez
                        </div>
                        <div className="pt-1">
                            <h3 className="text-lg font-bold text-text-header-light dark:text-white leading-tight">EZTEC</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                                <MapPin size={14} /> Zona Sul, SP
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-500 uppercase font-medium">Imóveis Ativos</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <Building2 size={16} className="text-imi-dark-blue dark:text-gray-300" />
                                <span className="text-sm font-bold text-imi-dark-blue dark:text-white">28 Empreendimentos</span>
                            </div>
                        </div>
                        <div className="flex flex-col border-l border-gray-200 dark:border-gray-700 pl-3">
                            <span className="text-[10px] text-gray-500 uppercase font-medium">Leads Gerados</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <Users size={16} className="text-primary" />
                                <span className="text-sm font-bold text-imi-dark-blue dark:text-white">892</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gafisa Card */}
                <div className="bg-white dark:bg-card-dark rounded-xl p-4 shadow-card border border-gray-100 dark:border-gray-800 relative group transition-transform active:scale-[0.98] hover:shadow-card-hover cursor-pointer">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center p-2 text-2xl font-display font-bold text-imi-dark-blue dark:text-white">
                            Ga
                        </div>
                        <div className="pt-1">
                            <h3 className="text-lg font-bold text-text-header-light dark:text-white leading-tight">Gafisa</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                                <MapPin size={14} /> Jardins, SP
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-500 uppercase font-medium">Imóveis Ativos</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <Building2 size={16} className="text-imi-dark-blue dark:text-gray-300" />
                                <span className="text-sm font-bold text-imi-dark-blue dark:text-white">15 Empreendimentos</span>
                            </div>
                        </div>
                        <div className="flex flex-col border-l border-gray-200 dark:border-gray-700 pl-3">
                            <span className="text-[10px] text-gray-500 uppercase font-medium">Leads Gerados</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <Users size={16} className="text-primary" />
                                <span className="text-sm font-bold text-imi-dark-blue dark:text-white">450</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
