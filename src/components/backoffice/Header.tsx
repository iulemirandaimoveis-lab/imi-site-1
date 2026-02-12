'use client'

import { usePathname } from 'next/navigation'
import { Bell, Search, Menu } from 'lucide-react'
import Image from 'next/image'

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
    const pathname = usePathname()

    const getTitle = () => {
        if (pathname.includes('/imoveis')) return 'Imóveis'
        if (pathname.includes('/leads')) return 'Leads'
        if (pathname.includes('/dashboard')) return 'Dashboard'
        if (pathname.includes('/conteudo')) return 'Conteúdo & IA'
        if (pathname.includes('/ads')) return 'Ads Performance'
        return 'IMI Dashboard'
    }

    return (
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-card-dark/90 backdrop-blur-md border-b border-gray-200 dark:border-white/10 h-16 px-4 flex items-center justify-between shadow-sm lg:px-8">
            <div className="flex items-center gap-3">
                {onMenuClick && (
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10 rounded-full transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                )}

                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-imi-dark-blue dark:bg-primary rounded-lg flex items-center justify-center text-white font-display font-bold text-lg shadow-sm">
                        I
                    </div>
                    <h1 className="font-display font-bold text-lg text-text-header-light dark:text-white tracking-wide">
                        {getTitle()} <span className="hidden sm:inline text-primary font-normal text-sm ml-1">Manager</span>
                    </h1>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button className="relative p-2 text-gray-500 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-background-dark"></span>
                </button>

                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden border border-gray-300 dark:border-white/20 relative">
                    {/* Placeholder for user profile */}
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                        IM
                    </div>
                </div>
            </div>
        </header>
    )
}
