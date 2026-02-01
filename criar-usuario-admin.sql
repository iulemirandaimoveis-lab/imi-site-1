-- ===== CRIAR USUÁRIO ADMIN - IMI =====
-- Execute este script no Supabase Dashboard > SQL Editor
-- https://supabase.com/dashboard/project/zocffccwjjyelwrgunhu/sql/new

-- Inserir usuário admin
INSERT INTO users (email, name, password_hash, role)
VALUES (
    'iule@imi.com',
    'Iule Miranda',
    '$2a$10$36dCTbpvpikJuJQ7bam5g.m9JQSWJ18a56ARTlUuzjKg2759nfeGm',
    'ADMIN'
)
ON CONFLICT (email) DO UPDATE SET
    password_hash = '$2a$10$36dCTbpvpikJuJQ7bam5g.m9JQSWJ18a56ARTlUuzjKg2759nfeGm',
    updated_at = CURRENT_TIMESTAMP;

-- Verificar se o usuário foi criado
SELECT id, email, name, role, created_at FROM users WHERE email = 'iule@imi.com';
