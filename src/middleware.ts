import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(request: NextRequest) {
    const res = NextResponse.next();

    // Criar cliente Supabase
    const supabase = createMiddlewareClient({ req: request, res });

    // Verificar sessão
    const {
        data: { session },
    } = await supabase.auth.getSession();

    // Se rota é /backoffice/*
    if (request.nextUrl.pathname.startsWith('/backoffice')) {
        // Permitir acesso à página de login
        if (request.nextUrl.pathname === '/backoffice') {
            if (session) {
                // Se já está logado, redirecionar para dashboard
                return NextResponse.redirect(new URL('/backoffice/dashboard', request.url));
            }
            return res;
        }

        // Qualquer outra rota do backoffice requer autenticação
        if (!session) {
            return NextResponse.redirect(new URL('/backoffice', request.url));
        }
    }

    return res;
}

export const config = {
    matcher: [
        '/backoffice/:path*',
    ],
};
