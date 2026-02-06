import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '@/lib/supabase'

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const admins = [
            { email: 'iule@imi.com', name: 'Iule Miranda' },
            { email: 'admin@imi.com.br', name: 'Admin IMI' }
        ]
        const password = 'teste123'

        const summary = []

        for (const admin of admins) {
            const { email, name } = admin;
            // 1. Criar no Supabase Auth se o supabaseAdmin estiver disponível
            let authStatus = 'Pulado (supabaseAdmin não configurado)';
            if (supabaseAdmin) {
                const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
                    email,
                    password,
                    email_confirm: true,
                    user_metadata: { name }
                })

                if (authError) {
                    if (authError.message.includes('already registered')) {
                        authStatus = 'Já existe no Supabase Auth';
                        const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
                        const existingUser = listData.users.find(u => u.email === email);
                        if (existingUser) {
                            await supabaseAdmin.auth.admin.updateUserById(existingUser.id, { password });
                            authStatus += ' (senha atualizada)';
                        }
                    } else {
                        authStatus = `Erro: ${authError.message}`;
                    }
                } else {
                    authStatus = 'Criado com sucesso no Supabase Auth';
                }
            }

            // 2. Criar no Banco de Dados (Prisma)
            const hashedPassword = await bcrypt.hash(password, 10)
            const user = await prisma.user.upsert({
                where: { email },
                update: {
                    passwordHash: hashedPassword,
                    role: 'ADMIN',
                    updatedAt: new Date()
                },
                create: {
                    email,
                    name,
                    passwordHash: hashedPassword,
                    role: 'ADMIN'
                }
            })
            summary.push({ email, authStatus, prisma: 'Sincronizado' })
        }

        return NextResponse.json({
            success: true,
            message: 'Configuração concluída',
            results: summary
        })
    } catch (error: any) {
        console.error('❌ Erro no setup:', error)
        return NextResponse.json({
            success: false,
            error: 'Falha ao configurar admin',
            debug: error.message
        }, { status: 500 })
    }
}
