'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Calendar,
    Building2,
    Ticket,
    MessageSquare,
    FileText,
    Settings,
    Menu,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
    { name: 'Dashboard', href: '/backoffice', icon: LayoutDashboard },
    { name: 'Leads', href: '/backoffice/leads', icon: Users },
    { name: 'Consultorias', href: '/backoffice/consultations', icon: Calendar },
    { name: 'Imóveis', href: '/backoffice/properties', icon: Building2 },
    { name: 'Cupons', href: '/backoffice/coupons', icon: Ticket },
    { name: 'WhatsApp', href: '/backoffice/whatsapp', icon: MessageSquare },
    { name: 'Relatórios', href: '/backoffice/reports', icon: FileText },
    { name: 'Configurações', href: '/backoffice/settings', icon: Settings }
];

export default function Sidebar() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            {/* Mobile menu button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 bg-white border rounded-lg shadow-sm"
                >
                    {mobileMenuOpen ? (
                        <X className="w-6 h-6" />
                    ) : (
                        <Menu className="w-6 h-6" />
                    )}
                </button>
            </div>

            {/* Overlay (mobile) */}
            {mobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed lg:static inset-y-0 left-0 z-40",
                    "w-64 bg-white border-r",
                    "transform transition-transform duration-300 ease-in-out",
                    "lg:translate-x-0",
                    mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="h-full flex flex-col">

                    {/* Logo */}
                    <div className="p-6 border-b">
                        <h1 className="text-xl font-bold">Backoffice</h1>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg",
                                        "text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-gray-700 hover:bg-gray-100"
                                    )}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User section */}
                    <div className="p-4 border-t">
                        <div className="flex items-center gap-3 px-4 py-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                    Admin User
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    admin@example.com
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </aside>
        </>
    );
}
