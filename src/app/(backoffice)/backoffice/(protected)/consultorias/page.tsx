import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Suspense } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

async function ConsultoriasList() {
    const consultorias = await prisma.consultation.findMany({
        orderBy: { scheduledAt: 'desc' },
        select: {
            id: true,
            lead: { select: { name: true } },
            scheduledAt: true,
            status: true,
            price: true,
        },
    });

    if (consultorias.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CalendarDaysIcon className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Nenhuma consultoria</h3>
                <p className="mt-1 text-gray-500">Comece agendando uma nova consultoria.</p>
                <div className="mt-6">
                    <Link href="/backoffice/consultorias/new" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-navy-600 hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500">
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Nova Consultoria
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cliente</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Valor</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white/80 backdrop-blur-md shadow-soft divide-y divide-gray-200">
                        {consultorias.map((cons) => (
                            <tr key={cons.id} className="hover:bg-gray-50/80 transition-colors duration-150">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{cons.lead.name || 'Cliente sem nome'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(cons.scheduledAt).toLocaleDateString('pt-BR')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    R$ {Number(cons.price).toLocaleString('pt-BR')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                    ${cons.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                            cons.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                                                cons.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'}`}>
                                        {cons.status === 'SCHEDULED' ? 'Agendado' :
                                            cons.status === 'CONFIRMED' ? 'Confirmado' :
                                                cons.status === 'COMPLETED' ? 'Concluído' :
                                                    cons.status === 'CANCELLED' ? 'Cancelado' : cons.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end gap-3">
                                        <Link href={`/backoffice/consultorias/${cons.id}/edit`} className="text-navy-600 hover:text-navy-900 transition-colors">
                                            <PencilIcon className="h-5 w-5" />
                                        </Link>
                                        <button className="text-red-600 hover:text-red-900 transition-colors">
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default function ConsultoriasPage() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-display font-bold text-gray-900">Consultorias</h1>
                    <p className="text-sm text-gray-500 mt-1">Gerencie agendamentos e simulações</p>
                </div>
                <Link href="/backoffice/consultorias/new" className="bg-navy-600 text-white px-5 py-2.5 rounded-lg hover:bg-navy-700 transition shadow-sm flex items-center gap-2 font-medium">
                    <PlusIcon className="h-5 w-5" />
                    Nova Consultoria
                </Link>
            </div>

            <Suspense fallback={
                <div className="flex h-64 items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-600"></div>
                </div>
            }>
                <ConsultoriasList />
            </Suspense>
        </div>
    );
}
