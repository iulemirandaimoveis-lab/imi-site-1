'use client';

import { useState } from 'react';
import { Calendar, Clock, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    contentItemId: string;
    onScheduled: () => void;
}

export default function ScheduleModal({
    isOpen,
    onClose,
    contentItemId,
    onScheduled,
}: ScheduleModalProps) {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [scheduledDate, setScheduledDate] = useState(
        format(addDays(new Date(), 1), 'yyyy-MM-dd')
    );
    const [scheduledTime, setScheduledTime] = useState('10:00');

    const handleSchedule = async () => {
        setLoading(true);

        try {
            const scheduledFor = new Date(`${scheduledDate}T${scheduledTime}`);

            const { error } = await supabase
                .from('content_items')
                .update({
                    status: 'scheduled',
                    scheduled_for: scheduledFor.toISOString(),
                })
                .eq('id', contentItemId);

            if (error) throw error;

            toast.success('Post agendado!', {
                description: format(scheduledFor, "dd 'de' MMMM 'às' HH:mm", {
                    locale: ptBR,
                }),
            });

            onScheduled();
            onClose();
        } catch (error: any) {
            toast.error('Erro ao agendar', {
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-imi-900/20 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full mx-4">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-imi-900">Agendar Publicação</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-imi-50 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-imi-500" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-imi-700 mb-2">
                            Data
                        </label>
                        <div className="relative">
                            <Calendar
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-imi-400"
                                size={18}
                            />
                            <input
                                type="date"
                                value={scheduledDate}
                                onChange={(e) => setScheduledDate(e.target.value)}
                                min={format(new Date(), 'yyyy-MM-dd')}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border-imi-200 focus:ring-accent-500 focus:border-accent-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-imi-700 mb-2">
                            Horário
                        </label>
                        <div className="relative">
                            <Clock
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-imi-400"
                                size={18}
                            />
                            <input
                                type="time"
                                value={scheduledTime}
                                onChange={(e) => setScheduledTime(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border-imi-200 focus:ring-accent-500 focus:border-accent-500"
                            />
                        </div>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                        <p className="text-sm text-blue-800">
                            <span className="font-bold">Publicação agendada para:</span>
                            <br />
                            {format(
                                new Date(`${scheduledDate}T${scheduledTime}`),
                                "dd 'de' MMMM 'de' yyyy 'às' HH:mm",
                                { locale: ptBR }
                            )}
                        </p>
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <Button variant="outline" className="flex-1" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        className="flex-1 bg-accent-600 hover:bg-accent-700"
                        onClick={handleSchedule}
                        disabled={loading}
                    >
                        {loading ? 'Agendando...' : 'Confirmar'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
