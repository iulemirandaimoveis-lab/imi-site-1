'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { slideUp, staggerContainer } from '@/lib/animations'
import { Building2, Banknote, Calculator, TrendingUp, Shield, Clock, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'

const creditTypes = [
    {
        icon: Building2,
        title: 'Consórcio Imobiliário',
        description: 'Solução estratégica sem juros para aquisição de imóveis através de grupos de consórcio. Ideal para quem planeja o futuro com inteligência financeira.',
        benefits: [
            'Sem juros, apenas taxa de administração',
            'Parcelas que cabem no seu planejamento',
            'Possibilidade de antecipar com lances',
            'Uso do FGTS para lances ou amortização'
        ]
    },
    {
        icon: Banknote,
        title: 'Financiamento Bancário',
        description: 'Acesso imediato ao imóvel com as melhores taxas do mercado. Assessoria completa para aprovação de crédito junto aos principais bancos.',
        benefits: [
            'Posse imediata do imóvel',
            'Taxas competitivas e prazos longos',
            'Prazos de até 35 anos (420 meses)',
            'Parceria com Caixa, Bradesco, Itaú e Santander'
        ]
    }
]

const consortiumPlans = [
    { value: 150000, parcels: 180, monthly: 1050 },
    { value: 250000, parcels: 180, monthly: 1750 },
    { value: 400000, parcels: 200, monthly: 2600 },
    { value: 600000, parcels: 200, monthly: 3900 },
    { value: 800000, parcels: 220, monthly: 4800 },
    { value: 1000000, parcels: 220, monthly: 6000 }
]

const faqs = [
    {
        question: 'O que é consórcio imobiliário?',
        answer: 'O consórcio imobiliário é uma modalidade de compra coletiva onde um grupo de pessoas se une para formar uma poupança comum. Mensalmente, participantes são contemplados por sorteio ou lance e recebem a carta de crédito.'
    },
    {
        question: 'Quais as vantagens do consórcio?',
        answer: 'As principais vantagens são: ausência de juros, parcelas menores que financiamento, possibilidade de usar FGTS e flexibilidade para escolher o imóvel após a contemplação.'
    },
    {
        question: 'Quanto tempo demora para ser contemplado?',
        answer: 'A contemplação pode ocorrer desde o primeiro mês por sorteio. Com lances estratégicos, você pode acelerar significativamente esse processo.'
    }
]

export default function CreditPage() {
    const [loanAmount, setLoanAmount] = useState(500000)
    const [propertyValue, setPropertyValue] = useState(700000)
    const [years, setYears] = useState(20)
    const [interestRate] = useState(10.5)
    const [openFaq, setOpenFaq] = useState<number | null>(null)
    const [selectedConsortium, setSelectedConsortium] = useState(consortiumPlans[1])

    const calculateMonthlyPayment = () => {
        const monthlyRate = interestRate / 100 / 12
        const numberOfPayments = years * 12
        const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
            (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
        return monthlyPayment
    }

    const monthlyPayment = calculateMonthlyPayment()
    const totalPaid = monthlyPayment * years * 12
    const totalInterest = totalPaid - loanAmount
    const ltv = (loanAmount / propertyValue) * 100

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
                                Crédito Imobiliário
                            </span>
                        </div>

                        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
                            Financie o Imóvel dos Seus Sonhos
                        </h1>

                        <p className="text-slate-300 text-lg md:text-xl font-light leading-relaxed max-w-2xl mb-8">
                            Assessoria especializada para garantir as melhores condições de crédito imobiliário, seja consórcio ou financiamento bancário.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Button asChild size="lg" className="bg-white text-navy-900 hover:bg-slate-100">
                                <a href="#simulador">Simulador Online</a>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                                <a href="https://wa.me/5581997230455" target="_blank" rel="noopener noreferrer">Falar com Especialista</a>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* MODALIDADES */}
            <section className="section-padding">
                <div className="container-custom">
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-navy-900 mb-4 text-center">
                        Modalidades de Crédito
                    </h2>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto text-center mb-12">
                        Oferecemos as melhores opções do mercado para viabilizar seu investimento imobiliário
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {creditTypes.map((type, index) => (
                            <motion.div
                                key={index}
                                variants={slideUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="p-8 rounded-xl bg-white border border-slate-100 shadow-soft hover:shadow-card-hover transition-all duration-300"
                            >
                                <div className="w-12 h-12 bg-navy-900 text-white rounded-xl flex items-center justify-center mb-6">
                                    <type.icon className="w-5 h-5" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-2xl font-bold text-navy-900 mb-4 font-display">
                                    {type.title}
                                </h3>
                                <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                                    {type.description}
                                </p>
                                <ul className="space-y-3">
                                    {type.benefits.map((benefit, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                                            <div className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SIMULADOR DE FINANCIAMENTO */}
            <section id="simulador" className="section-padding bg-slate-50">
                <div className="container-custom">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-navy-900 mb-4 text-center">
                            Simulador de Financiamento
                        </h2>
                        <p className="text-slate-600 text-lg text-center mb-12">
                            Calcule sua parcela mensal e planeje sua aquisição (Sistema Price)
                        </p>

                        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-soft">
                            <div className="grid lg:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    {/* Valor do imóvel */}
                                    <div>
                                        <div className="flex justify-between mb-4">
                                            <label className="text-sm font-semibold text-navy-900">Valor do Imóvel</label>
                                            <span className="text-navy-900 font-bold">{formatCurrency(propertyValue)}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="100000"
                                            max="5000000"
                                            step="50000"
                                            value={propertyValue}
                                            onChange={(e) => {
                                                const val = Number(e.target.value)
                                                setPropertyValue(val)
                                                if (loanAmount > val * 0.8) setLoanAmount(val * 0.8)
                                            }}
                                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-navy-900"
                                        />
                                    </div>

                                    {/* Valor a financiar */}
                                    <div>
                                        <div className="flex justify-between mb-4">
                                            <label className="text-sm font-semibold text-navy-900">Valor a Financiar</label>
                                            <span className="text-navy-900 font-bold">{formatCurrency(loanAmount)}</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 mb-4">
                                            {[50, 70, 80].map((percent) => (
                                                <button
                                                    key={percent}
                                                    onClick={() => setLoanAmount((propertyValue * percent) / 100)}
                                                    className={`py-2 text-xs rounded-lg border transition-all ${Math.round((loanAmount / propertyValue) * 100) === percent
                                                            ? 'bg-navy-900 text-white border-navy-900'
                                                            : 'border-slate-200 text-slate-600 hover:border-navy-900'
                                                        }`}
                                                >
                                                    {percent}%
                                                </button>
                                            ))}
                                        </div>
                                        <input
                                            type="range"
                                            min="50000"
                                            max={propertyValue * 0.9}
                                            step="10000"
                                            value={loanAmount}
                                            onChange={(e) => setLoanAmount(Number(e.target.value))}
                                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-navy-900"
                                        />
                                    </div>

                                    {/* Prazo */}
                                    <div>
                                        <div className="flex justify-between mb-4">
                                            <label className="text-sm font-semibold text-navy-900">Prazo de Pagamento</label>
                                            <span className="text-navy-900 font-bold">{years} anos</span>
                                        </div>
                                        <div className="grid grid-cols-4 gap-2">
                                            {[10, 15, 20, 30].map((y) => (
                                                <button
                                                    key={y}
                                                    onClick={() => setYears(y)}
                                                    className={`py-2 text-xs rounded-lg border transition-all ${years === y
                                                            ? 'bg-navy-900 text-white border-navy-900'
                                                            : 'border-slate-200 text-slate-600 hover:border-navy-900'
                                                        }`}
                                                >
                                                    {y} anos
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* RESULTADO */}
                                <div className="bg-navy-900 text-white rounded-xl p-8 flex flex-col justify-between">
                                    <div>
                                        <div className="text-slate-400 text-sm mb-2 uppercase tracking-wider">Parcela Estimada</div>
                                        <div className="text-4xl font-bold mb-8">
                                            {formatCurrency(monthlyPayment)}
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex justify-between text-sm py-2 border-b border-white/10">
                                                <span className="text-slate-400">Total Financiado</span>
                                                <span className="font-semibold">{formatCurrency(loanAmount)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm py-2 border-b border-white/10">
                                                <span className="text-slate-400">Total de Juros</span>
                                                <span className="font-semibold">{formatCurrency(totalInterest)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm py-2 border-b border-white/10">
                                                <span className="text-slate-400">LTV (Comprometimento)</span>
                                                <span className="font-semibold">{ltv.toFixed(1)}%</span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-[10px] text-slate-500 mt-6 leading-tight">
                                        * Simulação baseada em taxa média de 10.5% a.a. Valores podem variar entre instituições financeiras e perfil do cliente.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* POR QUE ESCOLHER IMI */}
            <section className="section-padding">
                <div className="container-custom">
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-navy-900 mb-12 text-center">
                        Padrão de Excelência IMI
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            {
                                icon: TrendingUp,
                                title: 'Melhores Taxas',
                                description: 'Negociação direta com as principais instituições financeiras para garantir as menores taxas do mercado.'
                            },
                            {
                                icon: Shield,
                                title: 'Segurança Jurídica',
                                description: 'Análise documental rigorosa e assessoria completa em todas as etapas burocráticas do processo.'
                            },
                            {
                                icon: Clock,
                                title: 'Velocidade',
                                description: 'Processos otimizados para garantir a aprovação do seu crédito no menor tempo possível.'
                            }
                        ].map((item, index) => (
                            <div key={index} className="text-center group">
                                <div className="w-16 h-16 bg-navy-900/5 text-navy-900 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-navy-900 group-hover:text-white transition-all duration-300">
                                    <item.icon className="w-6 h-6" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-xl font-bold text-navy-900 mb-3 font-display">
                                    {item.title}
                                </h3>
                                <p className="text-slate-600 leading-relaxed text-sm">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="section-padding bg-slate-50">
                <div className="container-custom">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-navy-900 mb-12 text-center">
                            Dúvidas Frequentes
                        </h2>

                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div key={index} className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                                    <button
                                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                                    >
                                        <span className="font-bold text-navy-900">{faq.question}</span>
                                        {openFaq === index ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                    </button>
                                    <AnimatePresence>
                                        {openFaq === index && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="px-6 pb-4"
                                            >
                                                <p className="text-slate-600 text-sm leading-relaxed">{faq.answer}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA FINAL */}
            <section className="bg-navy-900 text-white section-padding text-center relative overflow-hidden">
                <div className="container-custom relative z-10">
                    <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                        Pronto para o Próximo Passo?
                    </h2>
                    <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto font-light">
                        Deixe nossa equipe de especialistas encontrar a melhor solução de crédito para você.
                    </p>
                    <Button asChild size="lg" className="bg-white text-navy-900 hover:bg-slate-100">
                        <a href="https://wa.me/5581997230455" target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="w-5 h-5 mr-3" />
                            Falar com Especialista
                        </a>
                    </Button>
                </div>
            </section>
        </>
    )
}
