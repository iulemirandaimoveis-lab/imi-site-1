import { createClient } from '@/lib/supabase/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

interface GenerateReportParams {
    tenant_id: string;
    report_type: 'weekly' | 'monthly' | 'quarterly';
    period_start: string;
    period_end: string;
    generated_by: string;
}

interface ExecutiveReport {
    id: string;
    summary: string;
    metrics: any;
    insights: string[];
    recommendations: string[];
    cost_breakdown: any;
}

/**
 * Gera relatório executivo com análise Claude
 */
export async function generateExecutiveReport(
    params: GenerateReportParams
): Promise<ExecutiveReport> {
    const { tenant_id, report_type, period_start, period_end, generated_by } = params;

    const supabase = await createClient();

    try {
        // 1. Busca tenant e playbook
        const { data: tenant } = await supabase
            .from('tenants')
            .select('*, playbook:niche_playbooks(*)')
            .eq('id', tenant_id)
            .single();

        if (!tenant) throw new Error('Tenant not found');

        // 2. Busca métricas do período
        const metrics = await fetchPeriodMetrics(tenant_id, period_start, period_end);

        // 3. Chama Claude para análise
        const analysis = await analyzeMetricsWithClaude(tenant, metrics, report_type);

        // 4. Calcula custos
        const costBreakdown = await calculateCostBreakdown(tenant_id, period_start, period_end);

        // 5. Salva relatório
        const { data: report, error } = await supabase
            .from('executive_reports')
            .insert({
                tenant_id,
                report_type,
                period_start,
                period_end,
                summary: analysis.summary,
                metrics,
                insights: analysis.insights,
                recommendations: analysis.recommendations,
                cost_breakdown: costBreakdown,
                generated_by,
                ai_request_id: analysis.ai_request_id,
            })
            .select()
            .single();

        if (error) throw error;

        return report as ExecutiveReport;
    } catch (error) {
        console.error('Error generating executive report:', error);
        throw error;
    }
}

/**
 * Busca métricas consolidadas do período
 */
async function fetchPeriodMetrics(tenant_id: string, start: string, end: string) {
    const supabase = await createClient();

    // Conteúdos
    const { data: contentMetrics } = await supabase
        .from('content_publications')
        .select('*')
        .eq('tenant_id', tenant_id)
        .gte('published_at', start)
        .lte('published_at', end);

    const postsPublished = contentMetrics?.length || 0;
    const totalReach = contentMetrics?.reduce((sum, p) => sum + (p.impressions || 0), 0) || 0;
    const totalEngagement = contentMetrics?.reduce((sum, p) => sum + (p.engagement || 0), 0) || 0;

    // Ads
    const { data: adsMetrics } = await supabase
        .from('ads_metrics')
        .select('*, campaign:ads_campaigns!inner(*)')
        .eq('campaign.tenant_id', tenant_id)
        .gte('date', start)
        .lte('date', end);

    const totalSpend = adsMetrics?.reduce((sum, m) => sum + (m.spend || 0), 0) || 0;
    const totalConversions = adsMetrics?.reduce((sum, m) => sum + (m.conversions || 0), 0) || 0;
    const avgCPA = totalConversions > 0 ? totalSpend / totalConversions : 0;

    // CRM
    const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .eq('tenant_id', tenant_id)
        .gte('created_at', start)
        .lte('created_at', end);

    const newLeads = leads?.length || 0;
    const qualifiedLeads = leads?.filter((l) => l.ai_score && l.ai_score >= 80).length || 0;
    const avgScore = leads?.reduce((sum, l) => sum + (l.ai_score || 0), 0) / newLeads || 0;

    return {
        content: {
            posts_published: postsPublished,
            total_reach: totalReach,
            total_engagement: totalEngagement,
            engagement_rate: totalReach > 0 ? (totalEngagement / totalReach) * 100 : 0,
        },
        ads: {
            total_spend: totalSpend,
            total_conversions: totalConversions,
            avg_cpa: avgCPA,
            roas: 0, // TODO: calcular se tiver receita
        },
        crm: {
            new_leads: newLeads,
            qualified_leads: qualifiedLeads,
            avg_score: avgScore,
            qualification_rate: newLeads > 0 ? (qualifiedLeads / newLeads) * 100 : 0,
        },
    };
}

/**
 * Analisa métricas com Claude
 */
async function analyzeMetricsWithClaude(tenant: any, metrics: any, reportType: string) {
    const supabase = await createClient();

    const prompt = `
Você é um analista de marketing sênior especializado em ${tenant.niche}.

CONTEXTO DO CLIENTE:
- Nome: ${tenant.name}
- Nicho: ${tenant.niche}
- Público-alvo: ${tenant.target_audience?.join(', ')}

MÉTRICAS DO PERÍODO (${reportType}):

CONTEÚDO:
- Posts publicados: ${metrics.content.posts_published}
- Alcance total: ${metrics.content.total_reach.toLocaleString()}
- Engajamento total: ${metrics.content.total_engagement.toLocaleString()}
- Taxa de engajamento: ${metrics.content.engagement_rate.toFixed(2)}%

ANÚNCIOS:
- Investimento total: R$ ${metrics.ads.total_spend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- Conversões: ${metrics.ads.total_conversions}
- CPA médio: R$ ${metrics.ads.avg_cpa.toFixed(2)}

CRM:
- Novos leads: ${metrics.crm.new_leads}
- Leads qualificados: ${metrics.crm.qualified_leads}
- Score médio: ${metrics.crm.avg_score.toFixed(1)}/100
- Taxa de qualificação: ${metrics.crm.qualification_rate.toFixed(1)}%

TAREFA:
Gere um relatório executivo em linguagem clara e objetiva (não técnica).

Retorne JSON:
{
  "summary": "Resumo executivo em 3-5 frases destacando principais resultados",
  "insights": [
    "5-7 insights principais sobre o desempenho",
    "Foque em padrões, tendências e oportunidades"
  ],
  "recommendations": [
    "3-5 ações concretas recomendadas para o próximo período",
    "Seja específico e acionável"
  ]
}
`;

    const message = await anthropic.messages.create({
        model: tenant.ai_model || 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        temperature: 0.7,
        messages: [{ role: 'user', content: prompt }],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Extrai JSON
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    // Log AI request
    const { data: aiRequest } = await supabase
        .from('ai_requests')
        .insert({
            tenant_id: tenant.id,
            provider: 'anthropic',
            model: tenant.ai_model,
            prompt,
            response: responseText,
            tokens_input: message.usage.input_tokens,
            tokens_output: message.usage.output_tokens,
            tokens_total: message.usage.input_tokens + message.usage.output_tokens,
            cost_usd: calculateClaudeCost(message.usage),
            status: 'success',
            request_type: 'generate_report',
        })
        .select('id')
        .single();

    return {
        ...analysis,
        ai_request_id: aiRequest?.id,
    };
}

/**
 * Calcula breakdown de custos
 */
async function calculateCostBreakdown(tenant_id: string, start: string, end: string) {
    const supabase = await createClient();

    // Custos IA
    const { data: aiRequests } = await supabase
        .from('ai_requests')
        .select('cost_usd')
        .eq('tenant_id', tenant_id)
        .gte('created_at', start)
        .lte('created_at', end);

    const aiCosts = aiRequests?.reduce((sum, r) => sum + (r.cost_usd || 0), 0) || 0;

    // Investimento Ads
    const { data: adsMetrics } = await supabase
        .from('ads_metrics')
        .select('spend, campaign:ads_campaigns!inner(tenant_id)')
        .eq('campaign.tenant_id', tenant_id)
        .gte('date', start)
        .lte('date', end);

    const adsInvestment = adsMetrics?.reduce((sum, m) => sum + (m.spend || 0), 0) || 0;

    return {
        ai_costs: aiCosts,
        ads_investment: adsInvestment,
        total: aiCosts + adsInvestment,
    };
}

/**
 * Calcula custo Claude
 */
function calculateClaudeCost(usage: any): number {
    const inputCost = (usage.input_tokens / 1000000) * 3.0; // $3/1M tokens
    const outputCost = (usage.output_tokens / 1000000) * 15.0; // $15/1M tokens
    return inputCost + outputCost;
}
