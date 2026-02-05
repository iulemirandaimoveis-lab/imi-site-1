'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { signIn } from '@/lib/supabase';

export default function BackofficeLoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data, error: signInError } = await signIn(email, password);

            if (signInError) {
                setError(signInError.message || 'Falha na autenticação. Verifique suas credenciais.');
                return;
            }

            if (data?.session) {
                router.push('/backoffice/dashboard');
                router.refresh();
            }
        } catch (err: any) {
            setError('Erro ao conectar com o serviço de autenticação.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 relative overflow-hidden">
            {/* Background elements for premium look */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary-50 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent-50 rounded-full blur-3xl opacity-50" />

            <div className="w-full max-w-md relative z-10">
                <div className="bg-white border border-neutral-200 rounded-2xl shadow-2xl p-8 md:p-10">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-display font-bold text-navy-900 mb-3 tracking-tight">
                            IMI Backoffice
                        </h1>
                        <div className="w-12 h-1 bg-accent-600 mx-auto rounded-full mb-4" />
                        <p className="text-sm text-neutral-500 font-medium">
                            Plataforma de Inteligência Imobiliária
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-2 px-1">
                                E-mail de Acesso
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-5 py-4 bg-neutral-50 border border-neutral-100 rounded-xl text-neutral-900 focus:bg-white focus:ring-2 focus:ring-accent-600/20 focus:border-accent-600 outline-none transition-all duration-200 placeholder-neutral-300"
                                placeholder="digite seu e-mail"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-2 px-1">
                                Senha
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-5 py-4 bg-neutral-50 border border-neutral-100 rounded-xl text-neutral-900 focus:bg-white focus:ring-2 focus:ring-accent-600/20 focus:border-accent-600 outline-none transition-all duration-200 placeholder-neutral-300"
                                    placeholder="••••••••"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-accent-600 transition-colors"
                                    disabled={loading}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse flex-shrink-0" />
                                <p className="text-xs text-red-600 font-semibold leading-relaxed">
                                    Falha na autenticação. Verifique suas credenciais e tente novamente.
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-navy-900/10 hover:shadow-navy-900/20 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 active:scale-[0.98]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Autenticando...</span>
                                </>
                            ) : (
                                <span>Entrar na Plataforma</span>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-neutral-100 text-center">
                        <p className="text-[10px] text-neutral-400 uppercase tracking-widest">
                            © {new Date().getFullYear()} IMI – Curadoria Técnica
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
