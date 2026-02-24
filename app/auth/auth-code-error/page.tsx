"use client";

import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function AuthCodeErrorPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-md">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
                        <AlertTriangle size={24} className="text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Link inválido ou expirado</h1>
                    <p className="text-zinc-400 mb-8">
                        O link de redefinição de senha é inválido ou já expirou. Solicite um novo link para continuar.
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
