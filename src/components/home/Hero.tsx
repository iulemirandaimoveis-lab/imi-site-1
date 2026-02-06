'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import { slideUp, staggerContainer } from '@/lib/animations'

interface HeroProps {
    dict: {
        hero_title: string
        hero_subtitle: string
        cta_appraisal: string
        cta_whatsapp: string
    }
}

export default function Hero({ dict }: HeroProps) {
    return (
        <section className="relative min-h-[100dvh] lg:h-[90vh] -mt-16 lg:-mt-20 flex items-end lg:items-center overflow-hidden bg-navy-900">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/hero-bg.jpg')" }}
            >
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
                        className="text-white font-display font-bold text-4xl sm:text-5xl lg:text-7xl leading-[1.1] mb-6 drop-shadow-lg whitespace-pre-line"
                    >
                        {dict.hero_title}
                    </motion.h1>

                    <motion.p
                        variants={slideUp}
                        className="text-lg sm:text-xl text-slate-200 mb-8 max-w-lg font-light leading-relaxed drop-shadow-md whitespace-pre-line"
                    >
                        {dict.hero_subtitle}
                    </motion.p>

                    <motion.div
                        variants={slideUp}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <Button asChild size="lg" className="bg-white text-navy-900 hover:bg-slate-100 border-none shadow-xl">
                            <Link href="/avaliacoes#form">{dict.cta_appraisal}</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:border-white">
                            <a href="https://wa.me/5581997230455" target="_blank" rel="noopener noreferrer">
                                {dict.cta_whatsapp}
                            </a>
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
