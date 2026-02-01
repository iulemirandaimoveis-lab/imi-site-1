import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export function middleware(request: NextRequest) {
    // Verificar se é rota do backoffice (exceto login)
    if (request.nextUrl.pathname.startsWith('/backoffice') &&
        request.nextUrl.pathname !== '/backoffice') {

        const token = request.cookies.get('auth-token')?.value

        if (!token) {
            // Redirecionar para login se não autenticado
            return NextResponse.redirect(new URL('/backoffice', request.url))
        }

        try {
            // Verificar se o token é válido
            jwt.verify(
                token,
                process.env.JWT_SECRET || 'imi-super-secret-jwt-key-production-2026'
            )

            // Token válido, permitir acesso
            return NextResponse.next()
        } catch (error) {
            // Token inválido, redirecionar para login
            return NextResponse.redirect(new URL('/backoffice', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/backoffice/:path*'],
}
