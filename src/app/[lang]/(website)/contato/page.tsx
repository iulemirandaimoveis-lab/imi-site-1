'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { slideUp, staggerContainer } from '@/lib/animations'
import { MapPin, Phone, Mail, MessageCircle, Send } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Formatar mensagem para WhatsApp
        const whatsappMessage = `
*Contato via Site IMI*

*Nome:* ${formData.name}
*Email:* ${formData.email}
*Telefone:* ${formData.phone}
*Assunto:* ${formData.subject}

*Mensagem:*
${formData.message}
    `.trim()

        const whatsappUrl = `https://wa.me/5581997230455?text=${encodeURIComponent(whatsappMessage)}`

        // Abrir WhatsApp em nova aba
        window.open(whatsappUrl, '_blank')

        // Reset form
        setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
        })

        setIsSubmitting(false)
    }

    const contactInfo = [
        {
            icon: MapPin,
            title: 'Endereço',
            content: 'João Pessoa, Paraíba - Brasil',
            link: null
        },
        {
            icon: Phone,
            title: 'Telefone',
            content: '+55 (81) 99723-0455',
            link: 'tel:+5581997230455'
        },
        {
            icon: Mail,
            title: 'Email',
            content: 'contato@iulemirandaimoveis.com.br',
            link: 'mailto:contato@iulemirandaimoveis.com.br'
        }
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
                                Contato
                            </span>
                        </div>

                        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
                            Vamos Conversar Sobre Seu Projeto
                        </h1>

                        <p className="text-slate-300 text-lg md:text-xl font-light leading-relaxed max-w-2xl">
                            Entre em contato conosco e descubra como podemos ajudar a alcançar seus objetivos no mercado imobiliário.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* INFORMAÇÕES DE CONTATO */}
            <section className="section-padding bg-slate-50">
                <div className="container-custom">
                    <motion.div
                        className="grid md:grid-cols-3 gap-8 mb-16"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {contactInfo.map((item, index) => (
                            <motion.div
                                key={index}
                                variants={slideUp}
                                className="p-8 rounded-xl bg-white border border-slate-100 shadow-soft text-center hover:shadow-card-hover transition-all duration-300"
                            >
                                <div className="w-12 h-12 bg-navy-900/10 text-navy-900 rounded-xl flex items-center justify-center mb-6 mx-auto">
                                    <item.icon className="w-5 h-5" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-xl font-bold text-navy-900 mb-3 font-display">
                                    {item.title}
                                </h3>
                                {item.link ? (
                                    <a
                                        href={item.link}
                                        className="text-slate-600 leading-relaxed text-sm hover:text-navy-900 transition-colors"
                                    >
                                        {item.content}
                                    </a>
                                ) : (
                                    <p className="text-slate-600 leading-relaxed text-sm">
                                        {item.content}
                                    </p>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* FORMULÁRIO */}
            <section className="section-padding">
                <div className="container-custom">
                    <div className="max-w-2xl mx-auto">
                        <motion.div
                            variants={slideUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            <h2 className="font-display text-3xl md:text-4xl font-bold text-navy-900 mb-4 text-center">
                                Envie sua Mensagem
                            </h2>
                            <p className="text-slate-600 text-lg text-center mb-12">
                                Preencha o formulário abaixo e entraremos em contato em breve
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <Input
                                        label="Nome Completo"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        disabled={isSubmitting}
                                    />
                                    <Input
                                        label="Email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <Input
                                        label="Telefone"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        required
                                        disabled={isSubmitting}
                                    />
                                    <Input
                                        label="Assunto"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <Textarea
                                    label="Mensagem"
                                    rows={6}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    required
                                    disabled={isSubmitting}
                                />

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>Enviando...</>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5 mr-3" />
                                            Enviar Mensagem
                                        </>
                                    )}
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA WHATSAPP */}
            <section className="bg-navy-900 text-white section-padding text-center relative overflow-hidden">
                <div className="container-custom relative z-10">
                    <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                        Prefere WhatsApp?
                    </h2>
                    <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto font-light">
                        Fale diretamente com nossos especialistas pelo WhatsApp para respostas imediatas
                    </p>
                    <Button asChild size="lg" className="bg-white text-navy-900 hover:bg-slate-100">
                        <a href="https://wa.me/5581997230455" target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="w-5 h-5 mr-3" />
                            Abrir WhatsApp
                        </a>
                    </Button>
                </div>
            </section>
        </>
    )
}
