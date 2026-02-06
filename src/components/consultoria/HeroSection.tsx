'use client';

import { motion } from 'framer-motion';
import { CheckCircle, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
    return (
        <section className="relative min-h-[90dvh] flex items-center justify-center bg-gradient-to-br from-navy-700 via-navy-600 to-blue-700 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat" />
            </div>

            <div className="container-custom hero-padding relative z-10">
                <div className="max-w-4xl mx-auto text-center">

                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full text-white/90 text-sm font-medium mb-8"
                    >
                        <span className="w-2 h-2 bg-gold-500 rounded-full animate-pulse" />
                        Consultoria Estratégica Internacional
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
                    >
                        Renda em Dólar com<br />
                        <span className="text-gold-500">Imóveis Internacionais</span>
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed"
                    >
                        Estrutura jurídica sólida, gestão profissional e crédito inteligente para investidores brasileiros que querem proteger patrimônio e gerar renda previsível em USD.
                    </motion.p>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Link href="#simulator" className="bg-gold-500 hover:bg-gold-600 text-navy-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:scale-105 inline-block">
                            Simular Minha Estratégia
                        </Link>

                        <Link href="#cases" className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 border border-white/20 inline-block text-center">
                            Ver Cases de Sucesso
                        </Link>
                    </motion.div>

                    {/* Trust indicators */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mt-16 flex flex-wrap justify-center gap-8 text-white/60 text-sm"
                    >
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-gold-500" />
                            <span>+$50M Alocados</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-gold-500" />
                            <span>200+ Investidores</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-gold-500" />
                            <span>15 Anos Mercado</span>
                        </div>
                    </motion.div>

                </div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <ChevronDown className="w-8 h-8 text-white/40" />
            </motion.div>
        </section>
    );
}
