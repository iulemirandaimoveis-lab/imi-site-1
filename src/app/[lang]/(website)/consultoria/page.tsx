import { HeroSection } from '@/components/consultoria/HeroSection';
import { ForWhom } from '@/components/consultoria/ForWhom';
import { LocationsSection } from '@/components/consultoria/LocationsSection';
import { InvestmentSimulator } from '@/components/consultoria/InvestmentSimulator';
import { LeverageCalculator } from '@/components/consultoria/LeverageCalculator';
import { StressTestCalculator } from '@/components/consultoria/StressTestCalculator';
import { QualificationCTA } from '@/components/consultoria/QualificationCTA';
import { LegalDisclaimer } from '@/components/consultoria/LegalDisclaimer';

export const metadata = {
    title: 'Consultoria - Renda Imobiliária Internacional | IMI',
    description: 'Gere renda em dólar com imóveis internacionais. Estrutura jurídica, gestão profissional e crédito inteligente.'
};

export default function ConsultoriaPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <HeroSection />

            {/* Para quem é / não é */}
            <ForWhom />

            {/* Localizações */}
            <LocationsSection />

            {/* Simulador principal */}
            <section className="section-padding bg-slate-50" id="simulator">
                <div className="container-custom">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <span className="text-gold-500 font-bold tracking-widest uppercase text-xs">Análise de Viabilidade</span>
                            <h2 className="text-3xl md:text-5xl font-display font-bold mt-4 mb-6 text-navy-900">
                                Simule seu Investimento em Tempo Real
                            </h2>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light">
                                Ajuste os parâmetros de entrada, taxas e projeções de yield para visualizar o potencial de retorno (Cash-on-Cash) e fluxo de caixa mensal.
                            </p>
                        </div>

                        <InvestmentSimulator />
                    </div>
                </div>
            </section>

            {/* Calculadoras avançadas */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <div className="max-w-6xl mx-auto space-y-20">

                        <div className="text-center">
                            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 text-navy-900 tracking-tight">
                                Robustez & Alavancagem
                            </h2>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
                                O investidor profissional trabalha com cenários, não com sorte. Entenda como o crédito inteligente potencializa seus ganhos e como sua operação se comporta sob estresse.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="h-full">
                                <LeverageCalculator />
                            </div>
                            <div className="h-full">
                                <StressTestCalculator />
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <QualificationCTA />

            {/* Disclaimer */}
            <section className="py-12 bg-slate-50">
                <div className="container-custom">
                    <div className="max-w-4xl mx-auto">
                        <LegalDisclaimer />
                    </div>
                </div>
            </section>
        </div>
    );
}
