'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'

const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Avaliações', href: '/avaliacoes' },
    { name: 'Inteligência', href: '/inteligencia' },
    { name: 'Consultoria', href: '/consultoria' },
    { name: 'Imóveis', href: '/imoveis' },
    { name: 'Sobre', href: '/sobre' },
    { name: 'Conteúdo', href: '/conteudo' },
    { name: 'Contato', href: '/contato' },
]

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const pathname = usePathname()

    // Lock body scroll when menu is open
    if (typeof window !== 'undefined') {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
    }

    return (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-100">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="z-50 relative flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                        <div className="text-2xl font-display font-bold text-primary-900 tracking-tight">
                            IMI
                        </div>
                        <div className="hidden sm:block text-sm text-neutral-500 border-l border-neutral-300 pl-3 leading-none">
                            Inteligência<br />Imobiliária
                        </div>
                    </Link>

                    {/* Desktop Navigation (Minimal) */}
                    <div className="hidden lg:flex lg:items-center lg:space-x-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    'text-sm font-medium transition-colors duration-200',
                                    pathname === item.href
                                        ? 'text-primary-900'
                                        : 'text-neutral-500 hover:text-primary-900'
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <Button asChild size="sm" className="ml-4">
                            <Link href="/avaliacoes#form">Avaliação</Link>
                        </Button>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        type="button"
                        className="lg:hidden z-50 relative p-2 -mr-2 text-primary-900"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <span className="sr-only">Menu</span>
                        {mobileMenuOpen ? (
                            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                            </svg>
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile Full Screen Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 bg-white flex flex-col pt-24 px-6 lg:hidden min-h-[100dvh]"
                    >
                        <div className="flex flex-col gap-6 text-center">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-2xl font-display font-medium text-neutral-900 hover:text-primary-700 transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <Link
                                href="/inteligencia"
                                className="text-2xl font-display font-bold text-primary-700 hover:text-primary-900 transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Inteligência
                            </Link>

                            <div className="mt-8">
                                <Button asChild size="lg" fullWidth>
                                    <Link href="/avaliacoes#form" onClick={() => setMobileMenuOpen(false)}>
                                        Solicitar Avaliação
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
