
'use client'

import { useState } from 'react'
import { X, Send, Check, Loader2, MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { getAttribution } from '@/lib/utils/attribution'

interface LeadCaptureModalProps {
    propertyName?: string
    propertyId?: string
    title?: string
    description?: string
    customInterest?: string
    onClose: () => void
    onSuccess: () => void
}

export default function LeadCaptureModal({
    propertyName,
    propertyId,
    title = "Consultoria Técnica",
    description,
    customInterest,
    onClose,
    onSuccess
}: LeadCaptureModalProps) {
    const [step, setStep] = useState<'form' | 'success'>('form')
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    })

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)

        const attribution = getAttribution()

        try {
            const interest = customInterest || (propertyName ? `Interesse no empreendimento: ${propertyName}` : 'Interesse Geral')

            const response = await fetch('/api/leads/capture', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    interest,
                    development_id: propertyId,
                    attribution
                })
            })

            if (!response.ok) throw new Error('Falha no envio')

            setStep('success')
            setTimeout(() => {
                onSuccess()
            }, 2000)
        } catch (err) {
            alert('Ocorreu um erro ao processar seu contato. Por favor, tente novamente.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-imi-900/60 backdrop-blur-lg"
            />

            <AnimatePresence mode="wait">
                {step === 'form' ? (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl relative overflow-hidden p-8 md:p-12"
                    >
                        <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-imi-900 transition-colors">
                            <X size={24} />
                        </button>

                        <div className="mb-10 text-center">
                            <div className="inline-flex items-center gap-2 mb-4">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse" />
                                <span className="text-[10px] font-black text-imi-400 uppercase tracking-[0.3em]">Atendimento VIP</span>
                            </div>
                            <h3 className="font-display text-3xl md:text-4xl font-bold text-imi-900 mb-4 tracking-tight">
                                {title === "Consultoria Técnica" ? (
                                    <>Consultoria <span className="text-accent-500 italic">Técnica</span></>
                                ) : title}
                            </h3>
                            <p className="text-imi-500 text-lg">
                                {description || (propertyName ? (
                                    <>Registre seu interesse no <span className="font-bold text-imi-900">{propertyName}</span> e fale com um especialista em instantes.</>
                                ) : "Preencha seus dados para receber um atendimento especializado.")}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                label="Nome Completo"
                                value={formData.name}
                                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Como podemos chamar você?"
                                required
                                className="h-14 rounded-2xl border-imi-100"
                            />

                            <div className="grid md:grid-cols-2 gap-6">
                                <Input
                                    label="E-mail"
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    placeholder="seu@email.com"
                                    className="h-14 rounded-2xl border-imi-100"
                                />
                                <Input
                                    label="WhatsApp"
                                    value={formData.phone}
                                    onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                    placeholder="(00) 00000-0000"
                                    required
                                    className="h-14 rounded-2xl border-imi-100"
                                />
                            </div>

                            <Button
                                type="submit"
                                fullWidth
                                size="lg"
                                disabled={isLoading}
                                className="h-16 bg-imi-900 text-white rounded-2xl shadow-elevated font-bold uppercase tracking-[0.2em] text-xs mt-4"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                        Iniciando IA...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5 mr-3" />
                                        Solicitar Atendimento
                                    </>
                                )}
                            </Button>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative overflow-hidden p-12 text-center"
                    >
                        <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                            <Check size={40} strokeWidth={3} />
                        </div>
                        <h3 className="font-display text-3xl font-bold text-imi-900 mb-4 tracking-tight">Solicitação Recebida!</h3>
                        <p className="text-imi-600 mb-10 text-lg leading-relaxed">
                            Nossa Inteligência de Atendimento já está processando sua solicitação e um especialista entrará em contato em instantes via WhatsApp.
                        </p>
                        <div className="flex items-center justify-center gap-3 text-[10px] font-black text-imi-400 uppercase tracking-widest bg-slate-50 py-4 rounded-2xl">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            Redirecionando para WhatsApp...
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
