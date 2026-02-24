"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { updatePassword, getCurrentUser } from '@/lib/supabase-auth';

type PageState = 'loading' | 'ready' | 'no-session';

export default function UpdatePasswordPage() {
    const router = useRouter();
    const [pageState, setPageState] = useState<PageState>('loading');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const submittingRef = useRef(false);

    useEffect(() => {
        getCurrentUser().then((user) => {
            setPageState(user ? 'ready' : 'no-session');
        });
    }, []);

    const validateForm = (): boolean => {
        if (!password) {
            setError('Por favor, insira uma nova senha');
            return false;
        }
        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres');
            return false;
        }
        if (password !== confirmPassword) {
            setError('As senhas não coincidem');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (submittingRef.current) return;
        setError('');

        if (!validateForm()) return;

        submittingRef.current = true;
        setSubmitting(true);

        const { error: authError } = await updatePassword(password);

        if (authError) {
            setError(authError);
            setSubmitting(false);
            submittingRef.current = false;
            return;
        }

        setSuccess(true);
        setSubmitting(false);
        submittingRef.current = false;

        setTimeout(() => {
            router.push('/');
        }, 2000);
    };

    if (pageState === 'loading') {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background px-4">
                <div className="w-full max-w-md">
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center">
                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-zinc-600 border-t-primary" />
                        <p className="mt-4 text-zinc-400">Verificando sessão...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (pageState === 'no-session') {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background px-4">
                <div className="w-full max-w-md">
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
                            <AlertTriangle size={24} className="text-red-500" />
                        </div>
                        <h1 className="text-2xl font-bold mb-2">Link expirado</h1>
                        <p className="text-zinc-400 mb-8">
                            Seu link de redefinição de senha expirou ou é inválido. Solicite um novo link para continuar.
                        </p>
                        <div className="space-y-3">
                            <Link
                                href="/forgot-password"
                                className="block w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                            >
                                Solicitar novo link
                            </Link>
                            <Link
                                href="/login"
                                className="block w-full rounded-lg border border-zinc-700 px-4 py-3 font-semibold text-zinc-300 hover:bg-zinc-800 transition-colors"
                            >
                                Voltar para login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-md">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8">
                    <h1 className="text-3xl font-bold text-center mb-2">Nova Senha</h1>
                    <p className="text-zinc-400 text-center mb-8">
                        Digite sua nova senha abaixo
                    </p>

                    {success ? (
                        <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-6 text-center">
                            <h3 className="text-lg font-semibold text-green-500 mb-2">Senha atualizada!</h3>
                            <p className="text-zinc-400 mb-2">
                                Sua senha foi alterada com sucesso.
                            </p>
                            <p className="text-sm text-zinc-500">
                                Redirecionando para o painel...
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
                                    <p className="text-sm text-red-500">{error}</p>
                                    {error.includes('expirou') && (
                                        <Link
                                            href="/forgot-password"
                                            className="mt-2 inline-block text-sm text-primary hover:underline"
                                        >
                                            Solicitar novo link
                                        </Link>
                                    )}
                                </div>
                            )}

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium mb-2">
                                    Nova Senha
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            if (error) setError('');
                                        }}
                                        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 pr-12 text-foreground placeholder-zinc-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                                        placeholder="Min. 6 caracteres"
                                        disabled={submitting}
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                        disabled={submitting}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                                    Confirmar Senha
                                </label>
                                <input
                                    id="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        if (error) setError('');
                                    }}
                                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-foreground placeholder-zinc-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                                    placeholder="Repita a senha"
                                    disabled={submitting}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {submitting ? 'Atualizando...' : 'Atualizar Senha'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
