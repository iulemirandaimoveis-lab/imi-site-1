// DEPRECATED: Prisma removido do projeto
// Este arquivo será deletado após migração completa para Supabase

/*
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
        datasources: {
            db: {
                url: process.env.DATABASE_URL,
            },
        },
    })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
*/

// Placeholder vazio para evitar erros de import
export const prisma = null as any
export default prisma
