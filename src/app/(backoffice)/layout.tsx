'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/backoffice/Sidebar';
import Header from '@/components/backoffice/Header';
import BottomNav from '@/components/backoffice/BottomNav';
import { Toaster } from 'sonner';

export default function BackofficeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/backoffice';

    if (isLoginPage) {
        return (
            <div className="min-h-screen bg-imi-50 antialiased">
                {children}
                <Toaster position="top-right" richColors theme="light" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <Sidebar />

            <div className="lg:pl-72 flex flex-col min-h-screen transition-all duration-300">
                <Header />

                <main className="flex-1 p-4 pb-24 lg:p-8 lg:pb-8 animate-fade-in custom-scrollbar">
                    {children}
                </main>

                <BottomNav />
            </div>

            <Toaster position="top-right" richColors theme="light" />
        </div>
    );
}
