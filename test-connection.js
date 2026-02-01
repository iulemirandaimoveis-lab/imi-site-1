const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
})

async function testConnection() {
    try {
        console.log('🔍 Testando conexão com o banco de dados...')
        console.log('DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'))
        console.log('DIRECT_URL:', process.env.DIRECT_URL?.replace(/:[^:@]+@/, ':****@'))

        await prisma.$connect()
        console.log('✅ Conexão estabelecida com sucesso!')

        const result = await prisma.$queryRaw`SELECT 1 as test`
        console.log('✅ Query executada:', result)

    } catch (error) {
        console.error('❌ Erro ao conectar:', error.message)
        console.error('Detalhes:', error)
    } finally {
        await prisma.$disconnect()
    }
}

testConnection()
