"use client";

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';
import { resetPasswordForEmail } from '@/lib/supabase-auth';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const submittingRef = useRef(false);

    const validateForm = (): boolean => {
        const trimmed = email.trim();
        if (!trimmed) {
            setError('Por favor, insira seu email');
            return false;
        }
        if (!EMAIL_REGEX.test(trimmed)) {
            setError('Por favor, insira um email válido');
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
        setLoading(true);

        const { error: authError } = await resetPasswordForEmail(email.trim());

        if (authError) {
            setError(authError);
            setLoading(false);
            submittingRef.current = false;
            return;
        }

        setSuccess(true);
        setLoading(false);
        submittingRef.current = false;
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-md">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8">
                    <Link
                        href="/login"
                        className="mb-6 inline-flex items-center text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                        <ArrowLeft size={16} className="mr-2" />
                        Voltar para login
                    </Link>

                    <h1 className="text-3xl font-bold text-center mb-2">Recuperar Senha</h1>
                    <p className="text-zinc-400 text-center mb-8">
                        Digite seu email para receber um link de redefinição de senha
                    </p>

                    {success ? (
                        <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-6 text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
                                <Mail size={24} className="text-green-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-green-500 mb-2">
                                Verifique seu email
                            </h3>
                            <p className="text-zinc-400 mb-6">
                                Se este email estiver cadastrado, você receberá um link para redefinir sua senha. Verifique também a pasta de spam.
                            </p>
                            <Link
                                href="/login"
                                className="inline-block w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors text-center"
                            >
                                Voltar para Login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
                                    <p className="text-sm text-red-500">{error}</p>
                                </div>
                            )}

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-2">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (error) setError('');
                                    }}
                                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-foreground placeholder-zinc-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                                    placeholder="seu@email.com"
                                    disabled={loading}
                                    autoComplete="email"
                                    autoFocus
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? 'Enviando...' : 'Enviar email de recuperação'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
