#!/usr/bin/env node

/**
 * MONITOR DO SISTEMA IMI
 * Execute este script em um terminal separado para acompanhar o status em tempo real
 * 
 * Uso: node monitor-sistema.js
 */

const { PrismaClient } = require('@prisma/client')
const https = require('https')

const prisma = new PrismaClient()

// Cores para o terminal
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
    const timestamp = new Date().toLocaleTimeString('pt-BR')
    console.log(`${colors.cyan}[${timestamp}]${colors.reset} ${colors[color]}${message}${colors.reset}`)
}

function clearScreen() {
    console.clear()
    console.log(`${colors.bright}${colors.blue}
╔════════════════════════════════════════════════════════════╗
║           MONITOR DO SISTEMA IMI - TEMPO REAL              ║
╚════════════════════════════════════════════════════════════╝
${colors.reset}`)
}

async function checkDatabase() {
    try {
        await prisma.$connect()

        // Verificar tabelas
        const users = await prisma.user.count()
        const clients = await prisma.client.count()
        const properties = await prisma.property.count()

        log(`✅ Banco de Dados: CONECTADO`, 'green')
        log(`   └─ Usuários: ${users}`, 'cyan')
        log(`   └─ Leads: ${clients}`, 'cyan')
        log(`   └─ Imóveis: ${properties}`, 'cyan')

        // Verificar usuário admin
        const admin = await prisma.user.findUnique({
            where: { email: 'iule@imi.com' }
        })

        if (admin) {
            log(`✅ Usuário Admin: CONFIGURADO (${admin.name})`, 'green')
        } else {
            log(`⚠️  Usuário Admin: NÃO ENCONTRADO`, 'yellow')
        }

        return true
    } catch (error) {
        log(`❌ Banco de Dados: ERRO - ${error.message}`, 'red')
        log(`   └─ Execute: EXECUTAR-AGORA.sql no Supabase`, 'yellow')
        return false
    }
}

async function checkServer() {
    return new Promise((resolve) => {
        const req = https.get('http://localhost:3000/api/health', (res) => {
            if (res.statusCode === 200 || res.statusCode === 404) {
                log(`✅ Servidor Next.js: RODANDO (porta 3000)`, 'green')
                resolve(true)
            } else {
                log(`⚠️  Servidor Next.js: STATUS ${res.statusCode}`, 'yellow')
                resolve(false)
            }
        })

        req.on('error', () => {
            log(`❌ Servidor Next.js: OFFLINE`, 'red')
            log(`   └─ Execute: npm run dev`, 'yellow')
            resolve(false)
        })

        req.setTimeout(2000, () => {
            req.destroy()
            log(`⚠️  Servidor Next.js: TIMEOUT`, 'yellow')
            resolve(false)
        })
    })
}

async function checkAuth() {
    return new Promise((resolve) => {
        const postData = JSON.stringify({
            email: 'iule@imi.com',
            password: 'teste123'
        })

        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/auth/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        }

        const req = https.request(options, (res) => {
            let data = ''

            res.on('data', (chunk) => {
                data += chunk
            })

            res.on('end', () => {
                if (res.statusCode === 200) {
                    log(`✅ Autenticação: FUNCIONANDO`, 'green')
                    log(`   └─ Login disponível em: http://localhost:3000/backoffice`, 'cyan')
                    resolve(true)
                } else {
                    log(`❌ Autenticação: ERRO (${res.statusCode})`, 'red')
                    try {
                        const response = JSON.parse(data)
                        log(`   └─ ${response.error}`, 'yellow')
                    } catch (e) {
                        log(`   └─ Resposta inválida`, 'yellow')
                    }
                    resolve(false)
                }
            })
        })

        req.on('error', () => {
            log(`❌ Autenticação: NÃO TESTADA (servidor offline)`, 'red')
            resolve(false)
        })

        req.setTimeout(3000, () => {
            req.destroy()
            log(`⚠️  Autenticação: TIMEOUT`, 'yellow')
            resolve(false)
        })

        req.write(postData)
        req.end()
    })
}

async function monitor() {
    clearScreen()

    log('Iniciando verificações...', 'bright')
    console.log('')

    const dbOk = await checkDatabase()
    await checkServer()

    if (dbOk) {
        console.log('')
        await checkAuth()
    }

    console.log('')
    log('─'.repeat(60), 'cyan')
    log('Próxima verificação em 10 segundos...', 'bright')
    log('Pressione Ctrl+C para sair', 'yellow')
    console.log('')
}

// Executar a cada 10 segundos
monitor()
setInterval(monitor, 10000)

// Tratamento de saída
process.on('SIGINT', async () => {
    console.log('\n')
    log('Encerrando monitor...', 'yellow')
    await prisma.$disconnect()
    process.exit(0)
})
