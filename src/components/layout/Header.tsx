'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navigation = [
    { label: 'IMI - Apresentação', href: '/' },
    { label: 'Avaliações', href: '/avaliacoes' },
    { label: 'Imóveis', href: '/imoveis' },
    { label: 'Consultoria', href: '/consultoria' },
    { label: 'Inteligência', href: '/inteligencia' },
    { label: 'Projetos', href: '/projetos' },
    { label: 'Sobre', href: '/sobre' },
    { label: 'Contato', href: '/contato' },
];

const menuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
        opacity: 1,
        height: 'auto',
        transition: { duration: 0.4, ease: 'easeOut', staggerChildren: 0.08 },
    },
    exit: { opacity: 0, height: 0, transition: { duration: 0.3 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const logoVariants = {
    hover: { scale: 1.05, transition: { duration: 0.3 } },
};

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="fixed top-0 inset-x-0 z-50 bg-white/75 backdrop-blur-xl shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                <div className="flex items-center justify-between h-24">
                    <motion.div variants={logoVariants} whileHover="hover">
                        <Link href="/" className="flex items-center gap-4">
                            <span className="text-3xl font-black text-[#1E40AF] tracking-tight">IMI</span>
                            <span className="text-base font-semibold text-gray-600 tracking-wide">Inteligência Imobiliária</span>
                        </Link>
                    </motion.div>

                    <nav className="hidden md:flex items-center gap-12">
                        {navigation.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="relative text-gray-700 font-medium hover:text-[#1E40AF] transition-colors duration-300 group py-2"
                            >
                                {item.label}
                                <motion.span
                                    className="absolute inset-x-0 bottom-0 h-0.5 bg-[#D4AF37]"
                                    initial={{ scaleX: 0 }}
                                    whileHover={{ scaleX: 1 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    style={{ originX: 0 }}
                                />
                            </Link>
                        ))}
                    </nav>

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-4 rounded-lg hover:bg-gray-100/70 transition text-[#1E40AF]"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X size={32} strokeWidth={2} /> : <Menu size={32} strokeWidth={2} />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.nav
                        variants={menuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="md:hidden bg-gradient-to-b from-white to-gray-50/95 shadow-2xl overflow-hidden"
                    >
                        <div className="px-8 py-12 space-y-8">
                            {navigation.map((item) => (
                                <motion.div key={item.href} variants={itemVariants}>
                                    <Link
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className="block text-xl font-semibold text-gray-900 hover:text-[#1E40AF] transition duration-300 py-4 border-b border-gray-100/50 last:border-none"
                                    >
                                        {item.label}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </header>
    );
}
