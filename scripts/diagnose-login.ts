
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

// Debug logs
console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
// Check if key starts with ey to confirm it's JWT
console.log('Key valid format:', process.env.SUPABASE_SERVICE_ROLE_KEY?.startsWith('ey'));

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

async function diagnoseUser() {
    const email = 'iule@imi.com';
    console.log(`\n🕵️‍♂️ Diagnosticando usuário: ${email}...`);

    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
        console.error('❌ Erro ao listar usuários:', error.message);
        return;
    }

    const user = data.users.find(u => u.email === email);

    if (!user) {
        console.error('❌ Usuário NÃO encontrado no Supabase Auth!');
    } else {
        console.log('✅ Usuário ENCONTRADO!');
        console.log(`   ID: ${user.id}`);
        console.log(`   Status Email Confirmado: ${user.email_confirmed_at ? '✅ SIM (' + user.email_confirmed_at + ')' : '❌ NÃO'}`);
        console.log(`   Ultimo Sign In: ${user.last_sign_in_at || 'Nunca'}`);
        console.log(`   Metadata:`, user.user_metadata);

        // Forçar confirmação se necessário
        if (!user.email_confirmed_at) {
            console.log('⚠️ Email não confirmado. Forçando confirmação agora...');
            const { error: updateError } = await supabase.auth.admin.updateUserById(
                user.id,
                { email_confirm: true }
            );
            if (!updateError) console.log('✅ Email confirmado manualmente com sucesso!');
        }

        // Testar login via script para provar que a senha funciona
        console.log('\n🔐 Testando login com senha "teste123" via script...');
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email: email,
            password: 'teste123'
        });

        if (loginError) {
            console.error('❌ Login FALHOU no teste local:', loginError.message);
        } else {
            console.log('✅ Login SUCESSO no teste local! Token gerado.');
        }
    }
}

diagnoseUser();
