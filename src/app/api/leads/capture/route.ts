
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { qualifyLeadWithClaude } from '@/lib/ai/lead-qualifier'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, email, phone, interest, development_id, attribution } = body
        const supabase = await createClient()

        if (!name || (!email && !phone)) {
            return NextResponse.json({ error: 'Identificação básica obrigatória' }, { status: 400 })
        }

        // 1. Persistir Lead no Banco (Automação de Captura)
        const { data: lead, error: leadError } = await supabase
            .from('leads')
            .insert({
                name,
                email,
                phone,
                interest,
                development_id,
                source: attribution?.source || 'site_direto',
                campaign: attribution?.campaign || null,
                status: 'new',
                notes: attribution ? `Origem: ${attribution.source} | Meio: ${attribution.medium} | Campanha: ${attribution.campaign}` : 'Captura direta pelo site'
            })
            .select()
            .single()

        if (leadError) throw leadError

        // 2. Automação: Qualificação IA Imediata
        // Disparamos a qualificação em background para não travar a resposta do usuário
        // O qualifyLeadWithClaude já faz o update no registro do lead
        try {
            await qualifyLeadWithClaude({
                lead_id: lead.id,
                lead_data: lead,
                requested_by: 'system_automation'
            })
        } catch (aiError) {
            console.error('Falha na automação de qualificação IA:', aiError)
            // Não falhamos o request principal se a IA falhar
        }

        return NextResponse.json({
            success: true,
            lead_id: lead.id,
            message: 'Lead capturado e qualificação IA iniciada'
        })

    } catch (err: any) {
        console.error('Lead Automation Error:', err)
        return NextResponse.json({ error: 'Erro interno na automação' }, { status: 500 })
    }
}
