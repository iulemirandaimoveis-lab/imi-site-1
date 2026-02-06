import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Proteger rotas do backoffice
    if (request.nextUrl.pathname.startsWith('/backoffice')) {
        // Permitir acesso a pagina de login
        if (request.nextUrl.pathname === '/backoffice') {
            if (user) {
                // Ja logado, redirecionar para dashboard
                return NextResponse.redirect(new URL('/backoffice/dashboard', request.url))
            }
            return supabaseResponse
        }

        // Todas as outras rotas do backoffice requerem autenticacao
        if (!user) {
            return NextResponse.redirect(new URL('/backoffice', request.url))
        }
    }

    return supabaseResponse
}
