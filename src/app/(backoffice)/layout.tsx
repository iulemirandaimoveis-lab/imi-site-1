'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import BackofficeShell from '@/components/backoffice/Shell'
import Header from '@/components/backoffice/Header'

export default function BackofficeLayout({ children }: { children: React.ReactNode }) {
    const supabase = createClientComponentClient()
    const router = useRouter()
    const pathname = usePathname()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        checkUser()
    }, [])

    async function checkUser() {
        const { data: { session } } = await supabase.auth.getSession()

        if (!session && pathname !== '/login') {
            router.push('/login')
            return
        }

        setIsLoading(false)
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-navy-900 font-semibold animate-pulse">Carregando...</div>
            </div>
        )
    }

    return (
        <BackofficeShell>
            <div className="flex flex-col h-full">
                <Header />
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </div>
        </BackofficeShell>
    )
}
