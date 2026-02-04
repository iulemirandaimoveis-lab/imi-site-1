'use client'

import Sidebar from '@/components/backoffice/Sidebar'

export default function BackofficeShell({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-[100dvh] bg-neutral-50 overflow-hidden">
            {/* Sidebar handles its own mobile state and responsiveness */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
