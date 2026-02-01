'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import {
    HomeIcon,
    UsersIcon,
    BuildingOfficeIcon,
    ChartBarIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
    BellIcon
} from '@heroicons/react/24/outline'

const navigation = [
    { name: 'Dashboard', href: '/backoffice/dashboard', icon: HomeIcon },
    { name: 'Leads', href: '/backoffice/leads', icon: UsersIcon },
    { name: 'Imóveis', href: '/backoffice/properties', icon: BuildingOfficeIcon },
    { name: 'Relatórios', href: '/backoffice/reports', icon: ChartBarIcon },
    { name: 'Configurações', href: '/backoffice/settings', icon: Cog6ToothIcon },
]

export default function BackofficeSidebar() {
    const pathname = usePathname()

    const handleLogout = () => {
        // TODO: Implement logout logic
        window.location.href = '/backoffice'
    }

    return (
        <div className="flex h-screen w-64 flex-col bg-neutral-900 border-r border-neutral-800">
            {/* Logo */}
            <div className="flex h-16 items-center justify-center border-b border-neutral-800 bg-gradient-to-r from-primary-900 to-primary-800">
                <div className="text-center">
                    <h1 className="text-xl font-display font-bold text-white">IMI</h1>
                    <p className="text-xs text-primary-200">Backoffice</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`
                                group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                                ${isActive
                                    ? 'bg-primary-700 text-white shadow-lg'
                                    : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                                }
                            `}
                        >
                            <item.icon
                                className={`mr-3 h-5 w-5 flex-shrink-0 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'
                                    }`}
                            />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            {/* User Section */}
            <div className="border-t border-neutral-800 p-4">
                <div className="mb-3 flex items-center">
                    <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center text-white font-semibold">
                            IM
                        </div>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-white">Iule Miranda</p>
                        <p className="text-xs text-neutral-400">Administrador</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-3 py-2 text-sm font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white rounded-lg transition-all duration-200"
                >
                    <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
                    Sair
                </button>
            </div>

            {/* Professional Badges */}
            <div className="border-t border-neutral-800 p-4">
                <div className="flex items-center justify-center gap-3">
                    <Image
                        src="/creci-badge.png"
                        alt="CRECI"
                        width={30}
                        height={30}
                        className="opacity-70 hover:opacity-100 transition-opacity"
                    />
                    <Image
                        src="/cnai-badge.png"
                        alt="CNAI"
                        width={30}
                        height={30}
                        className="opacity-70 hover:opacity-100 transition-opacity"
                    />
                </div>
            </div>
        </div>
    )
}
