import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🔐 Criando usuário admin...')

    const email = 'iule@imi.com'
    const password = 'teste123'
    const name = 'Iule Miranda'

    // Verifica se usuário já existe
    const existingUser = await prisma.user.findUnique({
        where: { email }
    })

    if (existingUser) {
        console.log('⚠️  Usuário já existe:', email)
        console.log('Atualizando senha...')

        const passwordHash = await bcrypt.hash(password, 10)

        await prisma.user.update({
            where: { email },
            data: { passwordHash }
        })

        console.log('✅ Senha atualizada com sucesso!')
    } else {
        // Cria hash da senha
        const passwordHash = await bcrypt.hash(password, 10)

        // Cria usuário
        const user = await prisma.user.create({
            data: {
                email,
                name,
                passwordHash,
                role: 'ADMIN'
            }
        })

        console.log('✅ Usuário criado com sucesso!')
        console.log('📧 Email:', user.email)
        console.log('👤 Nome:', user.name)
        console.log('🔑 Role:', user.role)
    }

    console.log('\n🎯 Credenciais de acesso:')
    console.log('Email:', email)
    console.log('Senha:', password)
}

main()
    .catch((e) => {
        console.error('❌ Erro:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
