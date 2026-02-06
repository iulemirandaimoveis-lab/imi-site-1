
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Carregar variáveis de ambiente do arquivo .env na raiz (assumindo execução da raiz)
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Erro: Credenciais do Supabase não encontradas no .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

const admins = [
    { email: 'iule@imi.com', password: 'teste123', name: 'Iule Miranda' },
    { email: 'admin@imi.com.br', password: 'teste123', name: 'Admin IMI' }
];

async function createAdmins() {
    console.log('🚀 Iniciando criação de administradores no Supabase Auth...');

    for (const admin of admins) {
        console.log(`\nProcessando: ${admin.email}`);

        // Tentar criar usuário
        const { data, error } = await supabase.auth.admin.createUser({
            email: admin.email,
            password: admin.password,
            email_confirm: true,
            user_metadata: { name: admin.name }
        });

        if (error) {
            if (error.message.includes('already registered')) {
                console.log(`⚠️ Usuário já existe. Resetando senha para "${admin.password}"...`);
                // Buscar ID do usuário
                const { data: listData } = await supabase.auth.admin.listUsers();
                const existingUser = listData.users.find(u => u.email === admin.email);

                if (existingUser) {
                    const { error: updateError } = await supabase.auth.admin.updateUserById(
                        existingUser.id,
                        { password: admin.password, email_confirm: true }
                    );

                    if (updateError) {
                        console.error(`❌ Erro ao atualizar senha: ${updateError.message}`);
                    } else {
                        console.log(`✅ Senha atualizada com sucesso!`);
                    }
                }
            } else {
                console.error(`❌ Erro ao criar usuário: ${error.message}`);
            }
        } else {
            console.log(`✅ Usuário criado com sucesso! ID: ${data.user.id}`);
        }
    }
}

createAdmins().catch(console.error);
