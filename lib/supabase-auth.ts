import { supabase } from './supabase';

export interface AuthUser {
    id: string;
    email: string;
}

export interface AuthResponse {
    user: AuthUser | null;
    error: string | null;
}

function getBaseUrl(): string {
    if (typeof window !== 'undefined') {
        return window.location.origin;
    }
    if (process.env.NEXT_PUBLIC_SITE_URL) {
        return process.env.NEXT_PUBLIC_SITE_URL;
    }
    return 'http://localhost:3000';
}

export async function signUp(email: string, password: string): Promise<AuthResponse> {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            return { user: null, error: error.message };
        }

        if (data.user) {
            return {
                user: {
                    id: data.user.id,
                    email: data.user.email || '',
                },
                error: null,
            };
        }

        return { user: null, error: 'Failed to create user' };
    } catch {
        return { user: null, error: 'Ocorreu um erro inesperado' };
    }
}

export async function signIn(email: string, password: string): Promise<AuthResponse> {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return { user: null, error: error.message };
        }

        if (data.user) {
            return {
                user: {
                    id: data.user.id,
                    email: data.user.email || '',
                },
                error: null,
            };
        }

        return { user: null, error: 'Failed to sign in' };
    } catch {
        return { user: null, error: 'Ocorreu um erro inesperado' };
    }
}

export async function signOut(): Promise<{ error: string | null }> {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            return { error: error.message };
        }
        return { error: null };
    } catch {
        return { error: 'Ocorreu um erro inesperado' };
    }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
            if (error.message.includes('Refresh Token') || error.message.includes('refresh_token_not_found')) {
                await supabase.auth.signOut();
            }
            return null;
        }

        if (user) {
            return {
                id: user.id,
                email: user.email || '',
            };
        }

        return null;
    } catch (err) {
        console.error("Error in getCurrentUser:", err);
        return null;
    }
}

export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
            callback({
                id: session.user.id,
                email: session.user.email || '',
            });
        } else {
            callback(null);
        }
    });
}

export async function resetPasswordForEmail(
    email: string,
    redirectPath = '/auth/callback?next=/account/update-password',
): Promise<{ error: string | null }> {
    try {
        const baseUrl = getBaseUrl();
        const redirectTo = `${baseUrl}${redirectPath}`;

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo,
        });

        if (error) {
            return { error: 'Não foi possível enviar o email. Tente novamente.' };
        }
        return { error: null };
    } catch {
        return { error: 'Ocorreu um erro inesperado. Tente novamente.' };
    }
}

export async function updatePassword(password: string): Promise<{ error: string | null }> {
    try {
        const { error } = await supabase.auth.updateUser({
            password,
        });

        if (error) {
            if (error.message.toLowerCase().includes('session') || error.message.toLowerCase().includes('token')) {
                return { error: 'Seu link de redefinição expirou. Solicite um novo.' };
            }
            return { error: error.message };
        }
        return { error: null };
    } catch {
        return { error: 'Ocorreu um erro inesperado. Tente novamente.' };
    }
}
