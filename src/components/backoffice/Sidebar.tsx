'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Users,
    Building2,
    Calendar,
    BarChart3,
    Settings,
    X,
    Menu
} from 'lucide-react';

const sidebarItems = [
    { label: 'Dashboard', href: '/backoffice/dashboard', icon: LayoutDashboard },
    { label: 'Leads', href: '/backoffice/leads', icon: Users },
    { label: 'Imóveis', href: '/backoffice/properties', icon: Building2 },
    { label: 'Consultorias', href: '/backoffice/consultorias', icon: Calendar },
    { label: 'Relatórios', href: '/backoffice/reports', icon: BarChart3 },
    { label: 'Configurações', href: '/backoffice/settings', icon: Settings },
];

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:border-r lg:border-gray-200 lg:bg-white/80 lg:backdrop-blur-xl lg:shadow-soft fixed inset-y-0 left-0 z-30 overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-navy-700 mb-12">IMI Admin</h2>
                    <nav className="space-y-2">
                        {sidebarItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-100/80 transition-all duration-300 text-gray-700 hover:text-navy-600 hover:shadow-soft"
                            >
                                <item.icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>
            </aside>

            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white/80 backdrop-blur-xl rounded-full shadow-soft hover:shadow-md transition-all duration-300"
            >
                <Menu size={24} />
            </button>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="lg:hidden fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Drawer */}
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="lg:hidden fixed inset-y-0 left-0 z-50 w-80 bg-white/95 backdrop-blur-xl shadow-2xl overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-12">
                                    <h2 className="text-2xl font-bold text-navy-700">IMI Admin</h2>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <nav className="space-y-2">
                                    {sidebarItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-4 px-4 py-4 rounded-xl hover:bg-gray-100/80 transition-all duration-300 text-gray-700 hover:text-navy-600 active:scale-95"
                                        >
                                            <item.icon size={24} />
                                            <span className="font-semibold text-lg">{item.label}</span>
                                        </Link>
                                    ))}
                                </nav>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
