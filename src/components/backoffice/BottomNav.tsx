'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Building2, Calendar, FileBarChart, Plus } from 'lucide-react'

export default function BottomNav() {
    const pathname = usePathname()

    const navItems = [
        { label: 'Home', href: '/backoffice/dashboard', icon: LayoutDashboard },
        { label: 'Leads', href: '/backoffice/leads', icon: Users },
        { label: 'Novo', href: '/backoffice/leads/novo', icon: Plus, variant: 'primary' },
        { label: 'Imóveis', href: '/backoffice/imoveis', icon: Building2 },
        { label: 'Reports', href: '/backoffice/reports', icon: FileBarChart },
    ]

    return (
        <nav className="fixed bottom-0 w-full bg-white dark:bg-card-dark border-t border-gray-200 dark:border-white/5 pb-safe pt-2 px-6 flex justify-between items-center z-50 h-[80px] lg:hidden animate-slide-up shadow-elevated">
            {navItems.map((item) => {
                const isActive = pathname === item.href

                if (item.variant === 'primary') {
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative -top-5 flex flex-col items-center justify-center w-14 h-14 bg-primary rounded-full shadow-lg shadow-primary/30 text-white hover:scale-110 active:scale-95 transition-all duration-300 border-4 border-white dark:border-card-dark"
                        >
                            <item.icon size={28} strokeWidth={2.5} />
                        </Link>
                    )
                }

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive
                                ? 'text-primary scale-110'
                                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                            }`}
                    >
                        <item.icon size={24} className={isActive ? 'fill-current' : ''} strokeWidth={isActive ? 2.5 : 2} />
                        <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
                    </Link>
                )
            })}
        </nav>
    )
}
