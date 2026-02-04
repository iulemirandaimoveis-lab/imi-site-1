'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const schema = z.object({
    name: z.string().min(3, 'Nome é obrigatório'),
    email: z.string().email('Email inválido'),
    phone: z.string().optional(),
    source: z.string().optional(),
    status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'LOST', 'WON']),
    notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function NewLead() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { status: 'NEW' },
    });

    const onSubmit = async (data: FormData) => {
        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Erro ao criar lead');
            }

            toast.success('Lead criado com sucesso!');
            router.push('/backoffice/leads');
            router.refresh();
        } catch (err: any) {
            toast.error(err.message || 'Erro ao criar lead. Tente novamente.');
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/backoffice/leads" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeftIcon className="h-6 w-6 text-gray-500" />
                </Link>
                <h1 className="text-2xl font-display font-bold text-gray-900">Novo Lead</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white rounded-xl border border-gray-200 shadow-sm p-6 lg:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
                        <input {...register('name')} className="form-input w-full rounded-lg border-gray-300 focus:ring-navy-500 focus:border-navy-500" placeholder="Ex: João Silva" />
                        {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input {...register('email')} type="email" className="form-input w-full rounded-lg border-gray-300 focus:ring-navy-500 focus:border-navy-500" placeholder="joao@exemplo.com" />
                        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                        <input {...register('phone')} className="form-input w-full rounded-lg border-gray-300 focus:ring-navy-500 focus:border-navy-500" placeholder="(11) 99999-9999" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fonte</label>
                        <input {...register('source')} className="form-input w-full rounded-lg border-gray-300 focus:ring-navy-500 focus:border-navy-500" placeholder="Ex: Site, WhatsApp" />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status Inicial</label>
                        <select {...register('status')} className="form-select w-full rounded-lg border-gray-300 focus:ring-navy-500 focus:border-navy-500">
                            <option value="NEW">Novo</option>
                            <option value="CONTACTED">Contato feito</option>
                            <option value="QUALIFIED">Qualificado</option>
                            <option value="LOST">Perdido</option>
                            <option value="WON">Ganho (Convertido)</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notas / Observações</label>
                        <textarea {...register('notes')} rows={4} className="form-textarea w-full rounded-lg border-gray-300 focus:ring-navy-500 focus:border-navy-500" placeholder="Detalhes adicionais sobre o lead..." />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button type="submit" disabled={isSubmitting} className="bg-navy-600 text-white px-8 py-3 rounded-xl hover:bg-navy-700 transition shadow-lg shadow-navy-600/20 font-medium disabled:opacity-50 min-w-[160px]">
                        {isSubmitting ? 'Salvando...' : 'Salvar Lead'}
                    </button>
                </div>
            </form>
        </div>
    );
}
