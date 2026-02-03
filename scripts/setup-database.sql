-- =====================================================
-- SCRIPT: Criar Tabelas e Usuário Admin
-- Execute este SQL no Supabase SQL Editor
-- =====================================================

-- 1. CRIAR ENUM UserRole
DO $$ BEGIN
    CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'EDITOR', 'VIEWER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. CRIAR ENUM PropertyStatus
DO $$ BEGIN
    CREATE TYPE "PropertyStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'SOLD', 'ANALYSIS');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. CRIAR ENUM NotificationType
DO $$ BEGIN
    CREATE TYPE "NotificationType" AS ENUM ('PROPERTY_ACCESS', 'PROPERTY_REVISIT', 'HIGH_ENGAGEMENT', 'NEW_CLIENT', 'PROPERTY_SOLD');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 4. CRIAR TABELA users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    role "UserRole" DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- 5. CRIAR TABELA clients
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    origin TEXT,
    notes TEXT,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- 6. CRIAR TABELA properties
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    area INTEGER NOT NULL,
    bedrooms INTEGER NOT NULL,
    bathrooms INTEGER NOT NULL,
    "parkingSpots" INTEGER NOT NULL,
    address TEXT NOT NULL,
    neighborhood TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    "zipCode" TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    status "PropertyStatus" DEFAULT 'AVAILABLE',
    "isFeatured" BOOLEAN DEFAULT FALSE,
    "isExclusive" BOOLEAN DEFAULT FALSE,
    "hasAnalysis" BOOLEAN DEFAULT FALSE,
    "viewCount" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW(),
    "publishedAt" TIMESTAMP
);

-- 7. CRIAR TABELA property_images
CREATE TABLE IF NOT EXISTS property_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "propertyId" UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt TEXT,
    "order" INTEGER DEFAULT 0,
    "isPrimary" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

-- 8. CRIAR TABELA client_property_links
CREATE TABLE IF NOT EXISTS client_property_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "clientId" UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    "propertyId" UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    url TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "expiresAt" TIMESTAMP,
    UNIQUE("clientId", "propertyId")
);

-- 9. CRIAR TABELA property_access_logs
CREATE TABLE IF NOT EXISTS property_access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "clientId" UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    "propertyId" UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    "linkToken" TEXT NOT NULL,
    "accessedAt" TIMESTAMP DEFAULT NOW(),
    device TEXT,
    browser TEXT,
    os TEXT,
    "ipAddress" TEXT,
    "totalTimeSeconds" INTEGER,
    "galleryTimeSeconds" INTEGER,
    "descriptionTimeSeconds" INTEGER,
    "priceTimeSeconds" INTEGER,
    "ctaTimeSeconds" INTEGER,
    "scrollDepth" INTEGER,
    "clickedCta" BOOLEAN DEFAULT FALSE,
    "clickedWhatsApp" BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_access_logs_client_property ON property_access_logs("clientId", "propertyId");
CREATE INDEX IF NOT EXISTS idx_access_logs_token ON property_access_logs("linkToken");

-- 10. CRIAR TABELA notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type "NotificationType" NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    "isRead" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- CRIAR USUÁRIO ADMIN
-- =====================================================

-- Hash da senha "teste123" usando bcrypt (10 rounds)
INSERT INTO users (email, name, "passwordHash", role)
VALUES (
    'iule@imi.com',
    'Iule Miranda',
    '$2a$10$WJB2ndl63me/DBZ1PsdgfO54R9CLlWY0aUMI3208Pqo6OnRh78fRS',
    'ADMIN'
)
ON CONFLICT (email) DO UPDATE SET
    "passwordHash" = EXCLUDED."passwordHash",
    "updatedAt" = NOW();

-- =====================================================
-- VERIFICAR CRIAÇÃO
-- =====================================================

SELECT 
    email,
    name,
    role,
    "createdAt"
FROM users
WHERE email = 'iule@imi.com';

