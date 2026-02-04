import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Suspense } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default async function LeadsPage() {
    const leads = await prisma.lead.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            leadSource: true, // Corrected from 'source'
            leadStage: true,  // Corrected from 'status'
            createdAt: true,
        },
    });

    return (
        <Suspense fallback={<div className="flex h-96 items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-600"></div></div>}>
            <div className="p-6 lg:p-8 space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-gray-900">Leads</h1>
                        <p className="text-sm text-gray-500 mt-1">Gerencie seus potenciais clientes</p>
                    </div>
                    <Link href="/backoffice/leads/new" className="bg-navy-600 text-white px-5 py-2.5 rounded-lg hover:bg-navy-700 transition shadow-sm flex items-center gap-2 font-medium">
                        <PlusIcon className="h-5 w-5" />
                        Novo Lead
                    </Link>
                </div>

                <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Telefone</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fonte</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {leads.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lead.name || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.phone || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.leadSource || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${lead.leadStage === 'NEW' ? 'bg-blue-100 text-blue-800' :
                                                    lead.leadStage === 'CONVERTED' ? 'bg-green-100 text-green-800' :
                                                        lead.leadStage === 'LOST' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'}`}>
                                                {lead.leadStage}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-3">
                                                <Link href={`/backoffice/leads/${lead.id}/edit`} className="text-navy-600 hover:text-navy-900 transition-colors">
                                                    <PencilIcon className="h-5 w-5" />
                                                </Link>
                                                {/* Note: In a real app, use a client component for delete to handle the method properly */}
                                                <button className="text-red-600 hover:text-red-900 transition-colors">
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {leads.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <p className="text-lg font-medium text-gray-900">Nenhum lead encontrado</p>
                                                <p className="text-sm text-gray-500">Comece adicionando seu primeiro contato.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Suspense>
    );
}
