"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthUser, getCurrentUser, onAuthStateChange } from '@/lib/supabase-auth';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
    user: AuthUser | null;
    role: string | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    role: null,
    loading: true,
});

export function useAuth() {
    return useContext(AuthContext);
}

const PUBLIC_ROUTES = ['/login', '/signup', '/forgot-password', '/auth/callback'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const fetchUserRole = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('admin_users')
                .select('role')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error fetching user role for ID:', userId, error);
                // Try logging the session definition if available
                return null;
            }
            return data?.role || null;
        } catch (error) {
            console.error('Unexpected error fetching user role:', error);
            return null;
        }
    };

    useEffect(() => {
        // Check current user on mount
        getCurrentUser().then(async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const userRole = await fetchUserRole(currentUser.id);
                setRole(userRole);
            } else {
                setRole(null);
            }
            setLoading(false);
        });

        // Listen to auth changes
        const { data: { subscription } } = onAuthStateChange(async (authUser) => {
            setUser(authUser);
            if (authUser) {
                const userRole = await fetchUserRole(authUser.id);
                setRole(userRole);
            } else {
                setRole(null);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (!loading) {
            const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

            if (!user && !isPublicRoute) {
                // User not authenticated and trying to access protected route
                router.push('/login');
            } else if (user && isPublicRoute) {
                // User authenticated but on login/signup page
                router.push('/');
            }
        }
    }, [user, loading, pathname, router]);

    // Role-based route protection
    useEffect(() => {
        console.log('Route protection check:', { loading, user: !!user, role, pathname });

        if (!loading && user && role) {
            // REDIRECT LOGIC DISABLED BY USER REQUEST
            // Access is controlled only by UI visibility (Sidebar)

            /*
            // Comitê role: Dashboard, Denúncias, Sugestões/Elogios
            if (role === 'comitê' || role === 'comite') {
                const allowedRoutes = ['/', '/denuncias', '/sugestoes-elogios'];
                const isAllowedRoute = allowedRoutes.some(route =>
                    pathname === route || pathname.startsWith(route + '/')
                );

                if (!isAllowedRoute && !PUBLIC_ROUTES.includes(pathname)) {
                    // router.push('/');
                }
            }

            // Marketing role: Dashboard, Notícias, Cases
            if (role === 'marketing') {
                const allowedRoutes = ['/', '/news', '/cases'];
                const isAllowedRoute = allowedRoutes.some(route =>
                    pathname === route || pathname.startsWith(route + '/')
                );

                if (!isAllowedRoute && !PUBLIC_ROUTES.includes(pathname)) {
                    // router.push('/');
                }
            }
            */

            // Admin role has access to everything
        }
    }, [user, role, loading, pathname, router]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                    <p className="mt-4 text-zinc-400">Carregando...</p>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, role, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
