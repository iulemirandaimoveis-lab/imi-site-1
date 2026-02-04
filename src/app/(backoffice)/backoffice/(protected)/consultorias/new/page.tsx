'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const schema = z.object({
    clientName: z.string().min(3, 'Nome do cliente obrigatório'),
    date: z.string().min(1, 'Data obrigatória'),
    type: z.enum(['EUA', 'DUBAI', 'BR']), // Used for simulation logic only
    investment: z.number().positive('Investimento positivo'),
    notes: z.string().optional(),
    status: z.enum(['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED']),
});

type FormData = z.infer<typeof schema>;

export default function NewConsultoria() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { status: 'SCHEDULED', type: 'EUA', investment: 500000 },
    });

    const [roi, setRoi] = useState(0);

    // Watch values for live ROI update if we wanted to use useEffect, 
    // but using onChange handler attached to inputs is simpler for now as per snippet request.

    const calculateROI = (amount: number, region: string) => {
        let rate = 0.1; // Default EUA
        if (region === 'EUA') rate = 0.08; // Conservative 8%
        if (region === 'DUBAI') rate = 0.12; // 12%
        if (region === 'BR') rate = 0.09; // 9% FIIs/Rent

        const calculated = amount * rate;
        setRoi(calculated);
    };

    // Wrapper to handle events
    const handleInvestmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value || '0');
        const region = watch('type');
        calculateROI(val, region);
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const region = e.target.value;
        const val = watch('investment');
        calculateROI(val, region);
    };

    const onSubmit = async (data: FormData) => {
        try {
            const res = await fetch('/api/consultorias', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Erro ao agendar consultoria');
            }

            toast.success('Consultoria agendada com sucesso!');
            router.push('/backoffice/consultorias');
            router.refresh();
        } catch (err: any) {
            toast.error(err.message || 'Erro ao agendar consultoria');
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/backoffice/consultorias" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeftIcon className="h-6 w-6 text-gray-500" />
                </Link>
                <h1 className="text-2xl font-display font-bold text-gray-900">Nova Consultoria</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white rounded-xl border border-gray-200 shadow-sm p-6 lg:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Cliente *</label>
                        <input {...register('clientName')} className="form-input w-full rounded-lg border-gray-300 focus:ring-navy-500 focus:border-navy-500" placeholder="Ex: Maria Souza" />
                        {errors.clientName && <p className="text-red-600 text-sm mt-1">{errors.clientName.message}</p>}
                        <p className="text-xs text-gray-500 mt-1">Um Lead será criado automaticamente se não existir.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Data *</label>
                        <input {...register('date')} type="datetime-local" className="form-input w-full rounded-lg border-gray-300 focus:ring-navy-500 focus:border-navy-500" />
                        {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select {...register('status')} className="form-select w-full rounded-lg border-gray-300 focus:ring-navy-500 focus:border-navy-500">
                            <option value="SCHEDULED">Agendada</option>
                            <option value="CONFIRMED">Confirmada</option>
                            <option value="COMPLETED">Concluída</option>
                            <option value="CANCELLED">Cancelada</option>
                        </select>
                    </div>

                    <div className="md:col-span-2 pt-4 border-t border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">Simulação Rápida</h3>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Região de Interesse</label>
                        <select {...register('type')} onChange={handleTypeChange} className="form-select w-full rounded-lg border-gray-300 focus:ring-navy-500 focus:border-navy-500">
                            <option value="EUA">EUA (Miami/Orlando)</option>
                            <option value="DUBAI">Dubai</option>
                            <option value="BR">Brasil (SP)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Investimento Estimado (R$)</label>
                        <input type="number" {...register('investment', { valueAsNumber: true })} onChange={handleInvestmentChange} className="form-input w-full rounded-lg border-gray-300 focus:ring-navy-500 focus:border-navy-500" />
                        {errors.investment && <p className="text-red-600 text-sm mt-1">{errors.investment.message}</p>}
                    </div>

                    <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg flex justify-between items-center border border-gray-200">
                        <span className="text-sm text-gray-600 font-medium">ROI Anual Estimado:</span>
                        <span className="text-xl font-bold text-green-700">R$ {roi.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notas / Pauta</label>
                        <textarea {...register('notes')} rows={3} className="form-textarea w-full rounded-lg border-gray-300 focus:ring-navy-500 focus:border-navy-500" />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button type="submit" disabled={isSubmitting} className="bg-navy-600 text-white px-8 py-3 rounded-xl hover:bg-navy-700 transition shadow-lg shadow-navy-600/20 font-medium disabled:opacity-50 min-w-[160px]">
                        {isSubmitting ? 'Agendando...' : 'Agendar Consultoria'}
                    </button>
                </div>
            </form>
        </div>
    );
}
