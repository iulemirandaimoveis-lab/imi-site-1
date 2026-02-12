'use client'

import { FileText, AlertTriangle, CheckCircle, Search } from 'lucide-react'

export default function LogsPage() {
    return (
        <div className="space-y-6 pb-24 animate-fade-in">
            <div className="bg-white dark:bg-card-dark p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="relative mb-3">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                    </span>
                    <input
                        className="block w-full pl-10 pr-3 py-2 border-none rounded-lg leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Pesquisar logs..."
                        type="text"
                    />
                </div>

                <div className="flex gap-2">
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">Todos</span>
                    <span className="text-xs font-medium text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md hover:bg-red-100 cursor-pointer">Erros</span>
                    <span className="text-xs font-medium text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md hover:bg-blue-100 cursor-pointer">Logins</span>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex text-xs font-medium text-gray-400 px-4 uppercase tracking-wider">
                    <span className="w-16">Data</span>
                    <span className="flex-1 ml-2">Ação</span>
                    <span className="w-16 text-right">Status</span>
                </div>

                {/* Log 1 */}
                <div className="bg-white dark:bg-card-dark rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-center gap-3 flex-1 overflow-hidden">
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] text-gray-400 font-bold">12 Fev</span>
                            <span className="text-xs font-medium text-gray-900 dark:text-gray-200">14:32</span>
                        </div>
                        <div className="w-px h-8 bg-gray-100 dark:bg-gray-700 mx-1"></div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">Login Admin</p>
                            <p className="text-xs text-gray-500 truncate">IP: 192.168.1.1</p>
                        </div>
                    </div>
                    <div className="text-green-500 bg-green-50 dark:bg-green-900/20 p-1.5 rounded-full">
                        <CheckCircle size={16} />
                    </div>
                </div>

                {/* Log 2 */}
                <div className="bg-white dark:bg-card-dark rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-center gap-3 flex-1 overflow-hidden">
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] text-gray-400 font-bold">12 Fev</span>
                            <span className="text-xs font-medium text-gray-900 dark:text-gray-200">12:05</span>
                        </div>
                        <div className="w-px h-8 bg-gray-100 dark:bg-gray-700 mx-1"></div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">Update Property #42</p>
                            <p className="text-xs text-gray-500 truncate">User: admin@imi.com</p>
                        </div>
                    </div>
                    <div className="text-blue-500 bg-blue-50 dark:bg-blue-900/20 p-1.5 rounded-full">
                        <FileText size={16} />
                    </div>
                </div>

                {/* Log 3 */}
                <div className="bg-white dark:bg-card-dark rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-l-4 border-red-500">
                    <div className="flex items-center gap-3 flex-1 overflow-hidden">
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] text-gray-400 font-bold">11 Fev</span>
                            <span className="text-xs font-medium text-gray-900 dark:text-gray-200">09:15</span>
                        </div>
                        <div className="w-px h-8 bg-gray-100 dark:bg-gray-700 mx-1"></div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">Sync Error</p>
                            <p className="text-xs text-red-500 truncate">API Timeout: Leads</p>
                        </div>
                    </div>
                    <div className="text-red-500 bg-red-50 dark:bg-red-900/20 p-1.5 rounded-full">
                        <AlertTriangle size={16} />
                    </div>
                </div>
            </div>
        </div>
    )
}
