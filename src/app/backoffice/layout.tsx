import { Metadata } from 'next';
import Sidebar from '@/components/backoffice/Sidebar';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
    title: 'Backoffice | IMI',
    description: 'Painel administrativo IMI',
};

export default function BackofficeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-offwhite">
            <Sidebar />
            <main className="lg:pl-72">
                <div className="p-6 lg:p-8">
                    {children}
                </div>
            </main>
            <Toaster position="top-right" richColors theme="light" />
        </div>
    );
}
