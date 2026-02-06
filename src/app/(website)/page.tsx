'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FileText, TrendingUp, Home } from 'lucide-react'
import Button from '@/components/ui/Button'
import { slideUp, staggerContainer } from '@/lib/animations'

export default function HomePage() {
    return (
        <div className="bg-white">
            {/* Hero Section - Mobile First Authority */}
            <section className="relative min-h-[100dvh] lg:h-[90vh] -mt-16 lg:-mt-20 flex items-end lg:items-center overflow-hidden bg-navy-900">
                {/* Background Image (User Photo) */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/hero-bg.jpg')" }}
                >
                    {/* Modern Overlay - Gradient from bottom (Mobile) and left (Desktop) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/40 to-transparent lg:bg-gradient-to-r lg:from-navy-900 lg:via-navy-900/50 lg:to-transparent opacity-95 lg:opacity-90" />
                </div>

                <div className="container-custom relative z-10 hero-padding pb-32 lg:pb-0">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="max-w-2xl"
                    >
                        <motion.h1
                            variants={slideUp}
                            className="text-white font-display font-bold text-4xl sm:text-5xl lg:text-7xl leading-[1.1] mb-6 drop-shadow-lg"
                        >
                            Inteligência,<br />
                            método e segurança<br />
                            <span className="text-slate-300">em decisões imobiliárias</span>
                        </motion.h1>

                        <motion.p
                            variants={slideUp}
                            className="text-lg sm:text-xl text-slate-200 mb-8 max-w-lg font-light leading-relaxed drop-shadow-md"
                        >
                            Consultoria estratégica e avaliações técnicas.
                            Transformamos incerteza em capital seguro.
                        </motion.p>

                        <motion.div
                            variants={slideUp}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <Button asChild size="lg" className="bg-white text-navy-900 hover:bg-slate-100 border-none shadow-xl">
                                <Link href="/avaliacoes#form">Solicitar Avaliação</Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:border-white">
                                <a href="https://wa.me/5581997230455" target="_blank" rel="noopener noreferrer">
                                    Falar pelo WhatsApp
                                </a>
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Value Pillars - Stacked Cards */}
            <section className="section-padding bg-slate-50">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        {/* Card 1 */}
                        <div className="group p-8 rounded-xl bg-white border border-slate-100 shadow-soft hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1">
                            <div className="w-12 h-12 bg-navy-900 text-white rounded-xl flex items-center justify-center mb-6">
                                <FileText className='w-5 h-5' strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-bold text-navy-900 mb-3 font-display">Avaliações Técnicas</h3>
                            <p className="text-slate-600 leading-relaxed text-sm">
                                Laudos com rigor normativo (NBR 14653) para fins judiciais, garantia bancária e inventários. Precisão técnica acima de tudo.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="group p-8 rounded-xl bg-white border border-slate-100 shadow-soft hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1">
                            <div className="w-12 h-12 bg-navy-900 text-white rounded-xl flex items-center justify-center mb-6">
                                <TrendingUp className='w-5 h-5' strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-bold text-navy-900 mb-3 font-display">Consultoria Estratégica</h3>
                            <p className="text-slate-600 leading-relaxed text-sm">
                                Análise de viabilidade e inteligência de mercado para investidores. Decisões pautadas em dados, não em "feeling".
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="group p-8 rounded-xl bg-white border border-slate-100 shadow-soft hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1">
                            <div className="w-12 h-12 bg-navy-900 text-white rounded-xl flex items-center justify-center mb-6">
                                <Home className='w-5 h-5' strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-bold text-navy-900 mb-3 font-display">Corretagem Curada</h3>
                            <p className="text-slate-600 leading-relaxed text-sm">
                                Venda e aluguel de imóveis selecionados. Foco na qualidade do ativo e na segurança jurídica da transação.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Institutional / Authority Statement */}
            <section className="section-padding bg-navy-900 text-white text-center relative overflow-hidden">
                <div className="container-custom max-w-3xl relative z-10">
                    <div className="text-gold-600/20 text-[120px] leading-none font-display absolute -top-16 left-1/2 -translate-x-1/2 select-none pointer-events-none" aria-hidden="true">
                        &quot;
                    </div>
                    <p className="text-xs tracking-widest uppercase text-slate-400 mb-6 font-semibold">Método IMI</p>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium leading-tight mb-8 relative z-10">
                        O mercado imobiliário não aceita amadorismo. Transformamos dados complexos em decisões de capital seguras.
                    </h2>
                    <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:border-white">
                        <Link href="/sobre">Conheça Nossa Trajetória</Link>
                    </Button>
                </div>
            </section>

            {/* Final CTA */}
            <section className="section-padding bg-white border-t border-slate-100">
                <div className="container-custom text-center">
                    <h2 className="text-3xl font-display font-bold text-navy-900 mb-4">
                        Precisa de uma avaliação técnica?
                    </h2>
                    <p className="text-slate-600 mb-8 max-w-xl mx-auto">
                        Entre em contato hoje para agendar uma consulta inicial ou solicitar um orçamento de avaliação.
                    </p>
                    <Button asChild size="lg" className="h-14 px-10 text-lg">
                        <a href="https://wa.me/5581997230455" target="_blank" rel="noopener noreferrer">Falar pelo WhatsApp</a>
                    </Button>
                </div>
            </section>
        </div>
    )
}
