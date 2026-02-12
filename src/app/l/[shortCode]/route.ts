
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function GET(
    request: Request,
    { params }: { params: { shortCode: string } }
) {
    const shortCode = params.shortCode
    const supabase = await createClient()

    // 1. Buscar a URL original
    const { data: link, error } = await supabase
        .from('tracked_links')
        .select('*')
        .eq('short_code', shortCode)
        .single()

    if (error || !link) {
        return redirect('/')
    }

    // 2. Extrair UTMs da original_url para persistência secundária se necessário
    const url = new URL(link.original_url)
    const utms = {
        source: url.searchParams.get('utm_source'),
        medium: url.searchParams.get('utm_medium'),
        campaign: url.searchParams.get('utm_campaign'),
        content: url.searchParams.get('utm_content'),
        shortCode: shortCode
    }

    // 3. Incrementar cliques de forma assíncrona
    await supabase.rpc('increment_link_clicks', { link_id: link.id })

    // 4. Redirecionar com Cookies de Atribuição (Validade de 30 dias)
    const finalResponse = NextResponse.redirect(new URL(link.original_url))
    finalResponse.cookies.set('imi_attribution', JSON.stringify(utms), {
        maxAge: 60 * 60 * 24 * 30, // 30 dias
        path: '/',
    })

    return finalResponse
}

import { NextResponse } from 'next/server'
