import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateExecutiveReport } from '@/lib/reports/generator';

// GET /api/reports - Lista relatórios
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Busca tenant do usuário
        const { data: tenantUser } = await supabase
            .from('tenant_users')
            .select('tenant_id')
            .eq('user_id', user.id)
            .single();

        if (!tenantUser) {
            return NextResponse.json({ error: 'No tenant found' }, { status: 404 });
        }

        // Busca relatórios
        const { data: reports, error } = await supabase
            .from('executive_reports')
            .select('*')
            .eq('tenant_id', tenantUser.tenant_id)
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) throw error;

        return NextResponse.json({ reports });
    } catch (error: any) {
        console.error('Error in GET /api/reports:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

// POST /api/reports - Gera novo relatório
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { report_type, period_start, period_end } = body;

        if (!report_type || !period_start || !period_end) {
            return NextResponse.json(
                { error: 'report_type, period_start and period_end are required' },
                { status: 400 }
            );
        }

        // Busca tenant
        const { data: tenantUser } = await supabase
            .from('tenant_users')
            .select('tenant_id')
            .eq('user_id', user.id)
            .single();

        if (!tenantUser) {
            return NextResponse.json({ error: 'No tenant found' }, { status: 404 });
        }

        // Gera relatório
        const report = await generateExecutiveReport({
            tenant_id: tenantUser.tenant_id,
            report_type,
            period_start,
            period_end,
            generated_by: user.id,
        });

        return NextResponse.json({ report }, { status: 201 });
    } catch (error: any) {
        console.error('Error in POST /api/reports:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
