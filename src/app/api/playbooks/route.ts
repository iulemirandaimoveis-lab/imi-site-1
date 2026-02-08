import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/playbooks - Lista todos playbooks
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        const { data: playbooks, error } = await supabase
            .from('niche_playbooks')
            .select('*')
            .eq('is_active', true)
            .order('name');

        if (error) throw error;

        return NextResponse.json({ playbooks });
    } catch (error: any) {
        console.error('Error in GET /api/playbooks:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

// POST /api/playbooks - Cria novo playbook
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Verifica autenticação
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        const { data: playbook, error } = await supabase
            .from('niche_playbooks')
            .insert({
                ...body,
                version: 1,
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ playbook }, { status: 201 });
    } catch (error: any) {
        console.error('Error in POST /api/playbooks:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
