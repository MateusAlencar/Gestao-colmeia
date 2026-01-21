import { supabase } from './supabase';

export interface AuthUser {
    id: string;
    email: string;
}

export interface AuthResponse {
    user: AuthUser | null;
    error: string | null;
}

/**
 * Sign up a new user with email and password
 */
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
    } catch (err) {
        return { user: null, error: 'An unexpected error occurred' };
    }
}

/**
 * Sign in an existing user with email and password
 */
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
    } catch (err) {
        return { user: null, error: 'An unexpected error occurred' };
    }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<{ error: string | null }> {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            return { error: error.message };
        }
        return { error: null };
    } catch (err) {
        return { error: 'An unexpected error occurred' };
    }
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
    try {
        const { data: { user } } = await supabase.auth.getUser();

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

/**
 * Listen to auth state changes
 */
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
