'use client'

import { motion } from 'framer-motion'
import { slideUp, staggerContainer } from '@/lib/animations'
import { Target, Users, Award, TrendingUp, Linkedin, MessageCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Image from 'next/image'

export default function AboutPage() {
    const values = [
        {
            icon: Target,
            title: 'Missão',
            description: 'Fornecer inteligência imobiliária de alta qualidade, capacitando clientes a tomar decisões informadas e estratégicas no mercado imobiliário brasileiro e internacional.'
        },
        {
            icon: TrendingUp,
            title: 'Visão',
            description: 'Ser referência nacional em inteligência imobiliária, reconhecidos pela excelência técnica, inovação e compromisso com resultados mensuráveis.'
        },
        {
            icon: Award,
            title: 'Excelência',
            description: 'Compromisso inabalável com os mais altos padrões técnicos e metodológicos em todas as nossas entregas, seguindo normas ABNT e certificações profissionais.'
        },
        {
            icon: Users,
            title: 'Relacionamento',
            description: 'Construir parcerias duradouras baseadas em confiança, transparência e resultados consistentes, colocando o sucesso do cliente no centro de tudo.'
        }
    ]

    const stats = [
        { number: '15+', label: 'Anos de Experiência' },
        { number: '500+', label: 'Projetos Realizados' },
        { number: 'R$ 200M+', label: 'em Ativos Avaliados' },
        { number: '98%', label: 'Satisfação dos Clientes' }
    ]

    return (
        <>
            {/* HERO */}
            <section className="bg-navy-900 text-white section-padding relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gold-500/5 -skew-x-12 translate-x-1/4" />

                <div className="container-custom relative z-10">
                    <motion.div
                        className="max-w-3xl"
                        variants={slideUp}
                        initial="hidden"
                        animate="visible"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-px bg-gold-500" />
                            <span className="text-gold-500 font-semibold uppercase tracking-[0.2em] text-xs">
                                Sobre Nós
                            </span>
                        </div>

                        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
                            Inteligência Imobiliária para Decisões Assertivas
                        </h1>

                        <p className="text-slate-300 text-lg md:text-xl font-light leading-relaxed max-w-2xl">
                            Há mais de uma década transformando o mercado imobiliário brasileiro através de tecnologia, dados precisos e expertise especializada.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* VALORES */}
            <section className="section-padding">
                <div className="container-custom">
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-navy-900 mb-4 text-center">
                        Nossos Valores
                    </h2>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto text-center mb-12">
                        Princípios que guiam cada decisão e relacionamento com nossos clientes
                    </p>

                    <motion.div
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {values.map((item, index) => (
                            <motion.div
                                key={index}
                                variants={slideUp}
                                className="p-8 rounded-xl bg-white border border-slate-100 shadow-soft hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="w-12 h-12 bg-navy-900/10 text-navy-900 rounded-xl flex items-center justify-center mb-6">
                                    <item.icon className="w-5 h-5" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-xl font-bold text-navy-900 mb-3 font-display">
                                    {item.title}
                                </h3>
                                <p className="text-slate-600 leading-relaxed text-sm">
                                    {item.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* FUNDADOR */}
            <section className="section-padding bg-slate-50">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            className="relative aspect-[4/5] rounded-2xl overflow-hidden"
                            variants={slideUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            <Image
                                src="/images/profile/iule-miranda.jpg"
                                alt="Iule Miranda - Fundador IMI Inteligência Imobiliária"
                                fill
                                className="object-cover"
                                priority
                            />
                        </motion.div>

                        <motion.div
                            variants={slideUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            <h2 className="font-display text-3xl md:text-4xl font-bold text-navy-900 mb-6">
                                Iule Miranda
                            </h2>
                            <div className="space-y-4 text-slate-600 leading-relaxed">
                                <p>
                                    Engenheiro Civil e Avaliador Imobiliário certificado pelo CNAI (n° 53290),
                                    com mais de 15 anos de experiência no mercado imobiliário brasileiro e internacional.
                                </p>
                                <p>
                                    Especialista em inteligência de mercado, avaliações patrimoniais e consultoria
                                    para investimentos imobiliários de médio e alto padrão, com atuação destacada
                                    no mercado do Nordeste e assessoria para investidores brasileiros nos EUA.
                                </p>
                                <p>
                                    Formação técnica sólida aliada à visão estratégica de negócios, desenvolvendo
                                    soluções customizadas que agregam valor real aos projetos de nossos clientes
                                    através de análise de dados, inteligência de mercado e expertise regulatória.
                                </p>
                            </div>
                            <div className="mt-8">
                                <Button asChild variant="outline" size="lg">
                                    <a
                                        href="https://www.linkedin.com/in/iule-miranda"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Linkedin className="w-5 h-5 mr-3" />
                                        Conectar no LinkedIn
                                    </a>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* NÚMEROS */}
            <section className="section-padding">
                <div className="container-custom">
                    <motion.div
                        className="grid md:grid-cols-4 gap-8 text-center"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                variants={slideUp}
                            >
                                <div className="w-16 h-16 bg-navy-900 text-white rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-4">
                                    {index + 1}
                                </div>
                                <div className="font-display text-4xl font-bold text-navy-900 mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-slate-600">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA FINAL */}
            <section className="bg-navy-900 text-white section-padding text-center relative overflow-hidden">
                <div className="container-custom relative z-10">
                    <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                        Vamos Conversar?
                    </h2>
                    <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto font-light">
                        Conte-nos sobre seu projeto e descubra como podemos ajudar você a alcançar seus objetivos no mercado imobiliário.
                    </p>
                    <Button asChild size="lg" className="bg-white text-navy-900 hover:bg-slate-100">
                        <a href="/contato">
                            <MessageCircle className="w-5 h-5 mr-3" />
                            Entrar em Contato
                        </a>
                    </Button>
                </div>
            </section>
        </>
    )
}
