"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Newspaper, Briefcase, AlertTriangle, LogOut, MessageSquare } from "lucide-react";
import { clsx } from "clsx";
import { useAuth } from "./AuthProvider";
import { signOut } from "@/lib/supabase-auth";
import { filterNavigation } from "@/lib/rbac";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Notícias", href: "/news", icon: Newspaper },
  { name: "Cases", href: "/cases", icon: Briefcase },
  { name: "Denúncias", href: "/denuncias", icon: AlertTriangle },
  { name: "Sugestões/Elogios", href: "/sugestoes-elogios", icon: MessageSquare },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  // Don't show sidebar on auth pages
  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  const filteredNavigation = filterNavigation(role, navigation);

  return (
    <div className="flex h-screen w-64 flex-col bg-zinc-950 text-white border-r border-zinc-900">
      <div className="flex h-24 items-center border-b border-zinc-900 px-6">
        <div className="relative h-16 w-48">
          <Image
            src="/logo.png"
            alt="Colmeia Logo"
            fill
            className="object-contain object-left"
            priority
          />
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-6">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                isActive
                  ? "bg-zinc-900 text-primary"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              )}
            >
              <item.icon
                className={clsx(
                  "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-zinc-500 group-hover:text-white"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User info and logout */}
      <div className="border-t border-zinc-900 p-4">
        {user && (
          <div className="mb-3 px-3">
            <p className="text-xs text-zinc-500 mb-1">Conectado como</p>
            <p className="text-sm text-zinc-300 truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="group flex w-full items-center px-3 py-2.5 text-sm font-medium rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all duration-200"
        >
          <LogOut
            className="mr-3 h-5 w-5 flex-shrink-0 transition-colors text-zinc-500 group-hover:text-white"
            aria-hidden="true"
          />
          Sair
        </button>
      </div>
    </div>
  );
}
