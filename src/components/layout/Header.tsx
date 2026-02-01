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
    { name: 'Consultoria', href: '/consultoria' },
    { name: 'Imóveis', href: '/imoveis' },
    { name: 'Sobre', href: '/sobre' },
    { name: 'Conteúdo', href: '/conteudo' },
    { name: 'Contato', href: '/contato' },
]

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const pathname = usePathname()

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-neutral-200">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-3">
                            <div className="text-2xl font-display font-bold text-primary-900">
                                IMI
                            </div>
                            <div className="hidden sm:block text-sm text-neutral-600 border-l border-neutral-300 pl-3">
                                Inteligência Imobiliária
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex lg:items-center lg:space-x-8">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        'text-sm font-medium transition-colors duration-200 relative py-2',
                                        isActive
                                            ? 'text-primary-700'
                                            : 'text-neutral-600 hover:text-primary-700'
                                    )}
                                >
                                    {item.name}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeNav"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-700"
                                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            )
                        })}
                    </div>

                    {/* CTA Button */}
                    <div className="hidden lg:flex lg:items-center">
                        <Button asChild size="md">
                            <Link href="/avaliacoes#form">Solicitar Avaliação</Link>
                        </Button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex lg:hidden">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-md p-2 text-neutral-700 hover:bg-neutral-100"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <span className="sr-only">Abrir menu</span>
                            {mobileMenuOpen ? (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="lg:hidden border-t border-neutral-200"
                    >
                        <div className="space-y-1 px-4 pb-4 pt-2">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            'block rounded-md px-3 py-2 text-base font-medium transition-colors',
                                            isActive
                                                ? 'bg-primary-50 text-primary-700'
                                                : 'text-neutral-700 hover:bg-neutral-50'
                                        )}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                )
                            })}
                            <div className="pt-4">
                                <Button asChild fullWidth>
                                    <Link href="/avaliacoes#form">Solicitar Avaliação</Link>
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
