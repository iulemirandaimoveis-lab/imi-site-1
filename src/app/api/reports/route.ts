import { NextRequest, NextResponse } from 'next/server'

// DEPRECATED: Migrar para Supabase
export async function GET(request: NextRequest) {
    return NextResponse.json(
        { error: 'API em migração para Supabase' },
        { status: 503 }
    )
}

export async function POST(request: NextRequest) {
    return NextResponse.json(
        { error: 'API em migração para Supabase' },
        { status: 503 }
    )
}

export async function PATCH(request: NextRequest) {
    return NextResponse.json(
        { error: 'API em migração para Supabase' },
        { status: 503 }
    )
}

export async function DELETE(request: NextRequest) {
    return NextResponse.json(
        { error: 'API em migração para Supabase' },
        { status: 503 }
    )
}
