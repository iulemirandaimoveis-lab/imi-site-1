-- =====================================================
-- SCRIPT: Verificar e Corrigir Tabela Users
-- Execute este SQL no Supabase SQL Editor
-- =====================================================

-- 1. VERIFICAR ESTRUTURA ATUAL DA TABELA
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- 2. DROPAR TABELA EXISTENTE (se necessário)
-- ATENÇÃO: Isso apagará todos os dados!
DROP TABLE IF EXISTS users CASCADE;

-- 3. CRIAR ENUM UserRole
DO $$ BEGIN
    CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'EDITOR', 'VIEWER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 4. CRIAR TABELA users COM ESTRUTURA CORRETA
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    role "UserRole" DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- 5. INSERIR USUÁRIO ADMIN
INSERT INTO users (email, name, "passwordHash", role)
VALUES (
    'iule@imi.com',
    'Iule Miranda',
    '$2a$10$WJB2ndl63me/DBZ1PsdgfO54R9CLlWY0aUMI3208Pqo6OnRh78fRS',
    'ADMIN'
);

-- 6. VERIFICAR CRIAÇÃO
SELECT 
    id,
    email,
    name,
    role,
    "createdAt"
FROM users;
