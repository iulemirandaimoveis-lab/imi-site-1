// Script para executar fix de RLS diretamente no PostgreSQL
// Execute com: node scripts/apply-fixes.mjs

import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Usar connection string do .env se possível, ou a que está no script migrate.mjs
const DATABASE_URL = 'postgresql://postgres.zocffccwjjyelwrgunhu:eusouumlobo@aws-0-us-west-2.pooler.supabase.com:6543/postgres';

async function runFix() {
    console.log('🚀 Conectando ao banco de dados para aplicar correções...\n');

    const client = new pg.Client({
        connectionString: DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('✅ Conectado ao PostgreSQL!\n');

        // Ler arquivo de migração
        const migrationPath = path.join(__dirname, '../supabase/migrations/FIX_RLS_RECURSION_FINAL.sql');
        const sql = fs.readFileSync(migrationPath, 'utf-8');

        console.log('📋 Executando FIX_RLS_RECURSION_FINAL.sql...\n');

        // Executar SQL
        await client.query(sql);

        console.log('✅ Correções RLS aplicadas com sucesso!\n');

    } catch (error) {
        console.error('❌ Erro na aplicação do fix:', error.message);
    } finally {
        await client.end();
        console.log('\n🔌 Conexão encerrada.');
    }
}

runFix();
