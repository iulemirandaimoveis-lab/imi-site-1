
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const body = await request.json()
        const { name, type, neighborhood, city, features, selling_points } = body

        const prompt = `Você é um redator imobiliário de luxo. Escreva uma descrição curta, magnética e profissional para o seguinte empreendimento:

Nome: ${name}
Tipo: ${type}
Localização: ${neighborhood}, ${city}
Características: ${features?.join(', ') || 'Não especificado'}
Diferenciais (Selling Points): ${selling_points?.join(', ') || 'Não especificado'}

REGRAS:
1. Use um tom sofisticado, focado em retorno sobre investimento ou qualidade de vida premium.
2. Seja conciso (máximo 4 parágrafos pequenos).
3. Destaque a localização e o potencial do ativo.
4. Retorne APENAS o texto da descrição, sem introduções ou observações.
5. Não use emojis.`

        const message = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1000,
            temperature: 0.7,
            messages: [{ role: 'user', content: prompt }]
        })

        const description = message.content[0].type === 'text' ? message.content[0].text : ''

        return NextResponse.json({ description })

    } catch (err: any) {
        console.error('AI Description Error:', err)
        return NextResponse.json({ error: 'Falha na geração IA' }, { status: 500 })
    }
}
