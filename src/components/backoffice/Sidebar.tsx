'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Building2,
    Calendar,
    Settings,
    LogOut,
    Sparkles,
    BarChart3,
    MousePointerClick,
    Zap,
    PieChart,
    Layers,
    FileText
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const sidebarItems = [
    { label: 'Dashboard', href: '/backoffice/dashboard', icon: LayoutDashboard },
    { label: 'Imoveis', href: '/backoffice/imoveis', icon: Building2 },
    { label: 'Leads', href: '/backoffice/leads', icon: Users },
    { label: 'Campanhas (Ads)', href: '/backoffice/ads', icon: BarChart3 },
    { label: 'Conteúdo & IA', href: '/backoffice/conteudo', icon: Sparkles, badge: 'IA' },
    { label: 'Tracking', href: '/backoffice/tracking', icon: MousePointerClick, badge: 'AUTO' },
    { label: 'Avaliações', href: '/backoffice/avaliacoes', icon: FileText },
    { label: 'Agenda', href: '/backoffice/agenda', icon: Calendar },
    { label: 'Automações', href: '/backoffice/automacoes', icon: Zap },
    { label: 'Relatórios', href: '/backoffice/reports', icon: PieChart },
    { label: 'Integrações', href: '/backoffice/integracoes', icon: Layers },
    // { label: 'Configurações', href: '/backoffice/settings', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/backoffice');
        router.refresh();
    };

    return (
        <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:border-r lg:border-gray-200 dark:lg:border-gray-800 lg:bg-white dark:lg:bg-card-dark fixed inset-y-0 left-0 z-30 transition-colors duration-300">
            <div className="p-6 flex flex-col h-full">
                <div className="mb-10 pl-2">
                    <div className="w-10 h-10 bg-imi-dark-blue dark:bg-primary rounded-xl flex items-center justify-center text-white font-display font-bold text-xl shadow-lg shadow-primary/20 mb-3">
                        I
                    </div>
                    <h2 className="text-2xl font-bold text-text-header-light dark:text-white font-display tracking-tight">IMI Admin</h2>
                    <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] mt-1">Inteligência Imobiliária</p>
                </div>

                <nav className="space-y-1 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${isActive
                                    ? 'bg-primary/10 text-primary font-semibold'
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                                    }`}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                                )}
                                <item.icon size={20} className={`transition-colors ${isActive ? 'text-primary' : 'group-hover:text-gray-900 dark:group-hover:text-white'}`} strokeWidth={isActive ? 2.5 : 2} />
                                <span className="">{item.label}</span>
                                {item.badge && (
                                    <span className={`ml-auto px-2 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider ${item.badge === 'IA'
                                            ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300'
                                            : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300'
                                        }`}>
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 mt-4 space-y-2">
                    <Link
                        href="/backoffice/settings"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${pathname === '/backoffice/settings'
                            ? 'bg-primary/10 text-primary font-semibold'
                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                    >
                        <Settings size={20} />
                        <span>Configurações</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-300"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Sair</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
