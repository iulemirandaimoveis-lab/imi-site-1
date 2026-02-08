import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/playbooks/[id]/versions - Histórico de versões
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createClient();

        const { data: versions, error } = await supabase
            .from('playbook_versions')
            .select('*')
            .eq('playbook_id', id)
            .order('version', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ versions });
    } catch (error: any) {
        console.error('Error in GET /api/playbooks/[id]/versions:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
