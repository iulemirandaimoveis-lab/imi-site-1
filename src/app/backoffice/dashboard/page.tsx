import { LayoutDashboard, Users, Building2, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Visão geral do sistema</p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    icon={<Users className="w-6 h-6 text-blue-600" />}
                    title="Total Leads"
                    value="124"
                    change="+12%"
                    trend="up"
                />
                <KPICard
                    icon={<Building2 className="w-6 h-6 text-green-600" />}
                    title="Imóveis Ativos"
                    value="45"
                    change="+5"
                    trend="up"
                />
                <KPICard
                    icon={<LayoutDashboard className="w-6 h-6 text-purple-600" />}
                    title="Consultorias"
                    value="18"
                    change="+8%"
                    trend="up"
                />
                <KPICard
                    icon={<TrendingUp className="w-6 h-6 text-orange-600" />}
                    title="Taxa Conversão"
                    value="24%"
                    change="+3%"
                    trend="up"
                />
            </div>

            {/* Gráfico placeholder */}
            <div className="bg-white/80 backdrop-blur-md shadow-soft rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Atividade Recente</h3>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                    <p className="text-gray-500">Gráfico em breve</p>
                </div>
            </div>
        </div>
    );
}

function KPICard({
    icon,
    title,
    value,
    change,
    trend,
}: {
    icon: React.ReactNode;
    title: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
}) {
    return (
        <div className="bg-white/80 backdrop-blur-md shadow-soft rounded-xl p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gray-100 rounded-lg">{icon}</div>
                <span
                    className={`text-sm font-semibold ${trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}
                >
                    {change}
                </span>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">{title}</h3>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    );
}
