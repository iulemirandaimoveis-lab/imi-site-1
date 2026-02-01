// Script de teste de conexão com o banco
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
    log: ['query', 'error', 'warn'],
})

async function testConnection() {
    try {
        console.log('🔍 Testando conexão com o banco de dados...\n')

        // Testar conexão
        await prisma.$connect()
        console.log('✅ Conexão estabelecida com sucesso!\n')

        // Verificar se a tabela users existe
        console.log('🔍 Verificando tabela users...')
        const userCount = await prisma.user.count()
        console.log(`✅ Tabela users encontrada! Total de usuários: ${userCount}\n`)

        // Buscar usuário específico
        console.log('🔍 Buscando usuário iule@imi.com...')
        const user = await prisma.user.findUnique({
            where: { email: 'iule@imi.com' }
        })

        if (user) {
            console.log('✅ Usuário encontrado!')
            console.log('   Email:', user.email)
            console.log('   Nome:', user.name)
            console.log('   Role:', user.role)
            console.log('   Hash da senha:', user.passwordHash.substring(0, 20) + '...')
        } else {
            console.log('❌ Usuário NÃO encontrado!')
            console.log('\n📝 AÇÃO NECESSÁRIA:')
            console.log('   Execute o arquivo EXECUTAR-AGORA.sql no Supabase SQL Editor')
            console.log('   URL: https://supabase.com/dashboard/project/zocffccwjjyelwrgunhu/sql/new')
        }

    } catch (error) {
        console.error('❌ ERRO:', error.message)
        console.log('\n📝 POSSÍVEIS CAUSAS:')
        console.log('   1. As tabelas não foram criadas no Supabase')
        console.log('   2. A senha do banco de dados no .env está incorreta')
        console.log('   3. O Supabase está offline ou inacessível')
        console.log('\n📝 SOLUÇÃO:')
        console.log('   Execute o arquivo EXECUTAR-AGORA.sql no Supabase SQL Editor')
        console.log('   URL: https://supabase.com/dashboard/project/zocffccwjjyelwrgunhu/sql/new')
    } finally {
        await prisma.$disconnect()
    }
}

testConnection()
