import { NextResponse } from 'next/server';
import { createLead } from '@/lib/actions';

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const result = await createLead(data);

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }

        return NextResponse.json({ success: true, data: result.data });
    } catch (error) {
        console.error('Error in API /leads:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
