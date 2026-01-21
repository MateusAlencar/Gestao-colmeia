"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { canAccessPath } from "@/lib/rbac";

const PUBLIC_ROUTES = ["/login", "/signup"];

export function AccessGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, role, loading } = useAuth();

  // While AuthProvider is still resolving the session/role, it already renders its own loader.
  // This is a safety net to avoid flashing protected content.
  if (loading) return null;

  // Public pages are always accessible.
  if (PUBLIC_ROUTES.includes(pathname)) return <>{children}</>;

  // Not authenticated: AuthProvider will redirect to /login (per requirement).
  // Avoid rendering protected content here.
  if (!user) return null;

  const allowed = canAccessPath(role, pathname);
  if (allowed) return <>{children}</>;

  return (
    <div className="mx-auto max-w-2xl py-16">
      <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-8">
        <h1 className="text-2xl font-bold text-white">Acesso negado</h1>
        <p className="mt-3 text-zinc-400">
          Você não tem permissão para acessar esta página com o seu perfil atual.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-black hover:bg-primary/90 transition-colors"
          >
            Ir para o Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

