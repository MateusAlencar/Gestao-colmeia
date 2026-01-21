import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const token_hash = requestUrl.searchParams.get('token_hash');
    const type = requestUrl.searchParams.get('type');
    const next = requestUrl.searchParams.get('next') || '/';

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    try {
        if (code) {
            await supabase.auth.exchangeCodeForSession(code);
        } else if (token_hash && type === 'recovery') {
            // Some Supabase recovery links return token_hash + type instead of a code
            await supabase.auth.verifyOtp({ token_hash, type: 'recovery' });
        }
    } catch (e) {
        // Best-effort: still redirect to next so UI can show a friendly message if needed
        console.error('Auth callback error:', e);
    }

    return NextResponse.redirect(`${requestUrl.origin}${next}`);
}
