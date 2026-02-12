'use client'

import { useState } from 'react'
import { ChevronRight, Building2, MapPin, Loader2 } from 'lucide-react'

export default function NewPropertyPage() {
    const [isLoading, setIsLoading] = useState(false)

    // Simple state for demonstration as per prompt design
    const [step, setStep] = useState(1)

    const handleNext = () => {
        setIsLoading(true)
        setTimeout(() => {
            setStep(step + 1)
            setIsLoading(false)
        }, 800)
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-24 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-display font-bold text-text-header-light dark:text-white">Adicionar Novo Imóvel</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Cadastre um novo empreendimento no sistema.</p>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">Rascunho</span>
                </div>
            </div>

            {/* Stepper */}
            <div className="flex items-center gap-2 mb-8 relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-800 -z-10"></div>

                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 transition-colors ${step >= i ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                        }`}>
                        {i}
                    </div>
                ))}
                <span className="ml-auto text-xs font-medium text-gray-500">Passo {step} de 4</span>
            </div>

            <div className="bg-white dark:bg-card-dark rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Building2 size={20} className="text-primary" />
                        Informações Básicas
                    </h3>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome do Empreendimento</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-gray-400"
                            placeholder="Ex: Residencial Horizon Lake"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Construtora</label>
                        <select className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none cursor-pointer">
                            <option value="">Selecione uma construtora...</option>
                            <option value="cyrela">Cyrela</option>
                            <option value="eztec">EZTEC</option>
                            <option value="gafisa">Gafisa</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de Imóvel</label>
                            <div className="grid grid-cols-2 gap-2">
                                <label className="cursor-pointer">
                                    <input type="radio" name="type" className="peer sr-only" defaultChecked />
                                    <div className="text-center px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark text-gray-600 dark:text-gray-400 peer-checked:bg-primary/10 peer-checked:text-primary peer-checked:border-primary peer-checked:font-bold transition-all hover:bg-gray-50 dark:hover:bg-gray-800">
                                        Residencial
                                    </div>
                                </label>
                                <label className="cursor-pointer">
                                    <input type="radio" name="type" className="peer sr-only" />
                                    <div className="text-center px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark text-gray-600 dark:text-gray-400 peer-checked:bg-primary/10 peer-checked:text-primary peer-checked:border-primary peer-checked:font-bold transition-all hover:bg-gray-50 dark:hover:bg-gray-800">
                                        Comercial
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status Comercial</label>
                            <select className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none cursor-pointer">
                                <option value="lancamento">Lançamento</option>
                                <option value="obras">Em Obras</option>
                                <option value="pronto">Pronto para Morar</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                    <button
                        onClick={handleNext}
                        disabled={isLoading}
                        className="px-6 py-3 bg-imi-dark-blue dark:bg-primary text-white rounded-lg font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <>
                                Próximo: Localização
                                <ChevronRight size={20} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
