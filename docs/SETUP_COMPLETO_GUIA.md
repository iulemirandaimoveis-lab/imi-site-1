# 🚀 SETUP COMPLETO - GUIA PASSO A PASSO

## ⚠️ **PRÉ-REQUISITO: INSTALAR NODE.JS**

### **1. Instalar Node.js (se não tiver)**

#### **Opção A: Homebrew (Recomendado para Mac)**

```bash
# Instalar Homebrew (se não tiver)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instalar Node.js
brew install node

# Verificar instalação
node --version
npm --version
```

#### **Opção B: Download Direto**

1. Acesse: https://nodejs.org
2. Baixe a versão **LTS** (Long Term Support)
3. Instale o pacote `.pkg`
4. Reinicie o terminal
5. Verifique: `node --version`

---

## 📦 **PASSO 1: INSTALAR DEPENDÊNCIAS**

Após instalar o Node.js:

```bash
cd /Users/lailamiranda/dev-imi
npm install
```

**Tempo estimado**: 2-3 minutos

**O que será instalado**:
- Prisma (ORM)
- Supabase Client
- Next.js
- Todas as dependências de produção

---

## 🗄️ **PASSO 2: CRIAR PROJETO SUPABASE**

### **2.1. Acessar Supabase**

1. Abra: https://supabase.com
2. Clique em **"Start your project"**
3. Faça login com GitHub (ou crie conta)

### **2.2. Criar Novo Projeto**

1. Clique em **"New Project"**
2. Preencha:
   - **Name**: `imi-platform`
   - **Database Password**: (crie uma senha forte e **ANOTE**)
   - **Region**: `South America (São Paulo)`
   - **Pricing Plan**: `Free`
3. Clique em **"Create new project"**
4. Aguarde ~2 minutos (criação do banco)

---

## 🔑 **PASSO 3: COPIAR CREDENCIAIS**

### **3.1. API Keys**

No painel do Supabase:

1. Vá em **Settings** (⚙️) → **API**
2. Copie e anote:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJhbGc...` (chave pública)
   - **service_role**: `eyJhbGc...` (chave secreta - ⚠️ NÃO COMPARTILHAR)

### **3.2. Database URL**

1. Vá em **Settings** (⚙️) → **Database**
2. Role até **Connection string**
3. Selecione **URI**
4. Copie a string completa:
   ```
   postgresql://postgres.xxxxx:[SUA-SENHA]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres
   ```
5. **IMPORTANTE**: Substitua `[SUA-SENHA]` pela senha que você criou no passo 2.2

---

## ⚙️ **PASSO 4: CONFIGURAR VARIÁVEIS DE AMBIENTE**

### **4.1. Criar arquivo `.env`**

```bash
cd /Users/lailamiranda/dev-imi
cp .env.example .env
```

### **4.2. Editar `.env`**

Abra o arquivo `.env` e preencha com suas credenciais:

```env
# ===== DATABASE (Supabase PostgreSQL) =====
DATABASE_URL="postgresql://postgres.xxxxx:[SUA-SENHA]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres"

# ===== SUPABASE =====
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGc..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGc..."

# ===== AUTHENTICATION =====
JWT_SECRET="mude-esta-chave-secreta-em-producao-use-algo-aleatorio"
NEXTAUTH_SECRET="outra-chave-secreta-diferente-tambem-aleatoria"
NEXTAUTH_URL="http://localhost:3000"

# ===== APP CONFIG =====
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_NAME="IMI - Inteligência Imobiliária"
```

**⚠️ IMPORTANTE**:
- Substitua `xxxxx` pelos seus valores reais
- Substitua `[SUA-SENHA]` pela senha do banco
- Mude as chaves JWT para valores aleatórios

---

## 🗃️ **PASSO 5: CRIAR BANCO DE DADOS**

### **5.1. Gerar Prisma Client**

```bash
npm run prisma:generate
```

**Saída esperada**:
```
✔ Generated Prisma Client
```

### **5.2. Criar Tabelas no Supabase**

```bash
npm run prisma:push
```

**Saída esperada**:
```
✔ The database is now in sync with your Prisma schema
```

**O que foi criado**:
- ✅ Tabela `users`
- ✅ Tabela `clients`
- ✅ Tabela `properties`
- ✅ Tabela `property_images`
- ✅ Tabela `client_property_links`
- ✅ Tabela `property_access_logs`
- ✅ Tabela `notifications`

---

## 📦 **PASSO 6: CONFIGURAR STORAGE (IMAGENS)**

### **6.1. Criar Bucket**

No painel do Supabase:

1. Vá em **Storage** (🗄️)
2. Clique em **"New bucket"**
3. Preencha:
   - **Name**: `property-images`
   - **Public bucket**: ✅ **Marque esta opção**
4. Clique em **"Create bucket"**

### **6.2. Configurar Políticas de Acesso**

1. Clique no bucket `property-images`
2. Vá na aba **Policies**
3. Clique em **"New Policy"**
4. Selecione **"For full customization"**
5. Preencha:
   - **Policy name**: `Public Access`
   - **Allowed operation**: `SELECT`
   - **Target roles**: `public`
6. No editor SQL, cole:
   ```sql
   true
   ```
7. Clique em **"Review"** → **"Save policy"**

**Resultado**: Qualquer pessoa pode ver as imagens (leitura pública)

---

## ✅ **PASSO 7: VERIFICAR INSTALAÇÃO**

### **7.1. Abrir Prisma Studio**

```bash
npm run prisma:studio
```

**Abrirá em**: http://localhost:5555

**Você verá**:
- Lista de todas as tabelas
- Interface para visualizar/editar dados
- Tudo vazio (normal, ainda não tem dados)

### **7.2. Testar Conexão**

No Prisma Studio:
1. Clique em **clients**
2. Clique em **"Add record"**
3. Preencha:
   - **name**: `Teste`
   - **email**: `teste@example.com`
   - **phone**: `11999999999`
4. Clique em **"Save 1 change"**

**Se funcionou**: ✅ Banco conectado com sucesso!

---

## 🚀 **PASSO 8: RODAR APLICAÇÃO**

### **8.1. Modo Desenvolvimento**

```bash
npm run dev
```

**Abrirá em**: http://localhost:3000

### **8.2. Testar API**

Abra outro terminal e teste:

```bash
# Listar imóveis (deve retornar array vazio)
curl http://localhost:3000/api/properties

# Criar cliente de teste
curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Silva",
    "email": "maria@example.com",
    "phone": "+55 11 99999-9999"
  }'

# Listar clientes (deve retornar o cliente criado)
curl http://localhost:3000/api/clients
```

---

## 📊 **PASSO 9: POPULAR BANCO (OPCIONAL)**

### **9.1. Criar Usuário Admin**

No Prisma Studio:

1. Clique em **users**
2. Clique em **"Add record"**
3. Preencha:
   - **email**: `iulemiranda@imi.com`
   - **name**: `Iule Miranda`
   - **passwordHash**: `$2a$10$YourHashHere` (use bcrypt online)
   - **role**: `ADMIN`
4. Salve

### **9.2. Criar Imóvel de Teste**

```bash
curl -X POST http://localhost:3000/api/properties \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Apartamento Premium em Jardins",
    "description": "Apartamento de alto padrão com 3 suítes",
    "price": 850000,
    "area": 120,
    "bedrooms": 3,
    "bathrooms": 2,
    "parkingSpots": 2,
    "address": "Rua Augusta, 1000",
    "neighborhood": "Jardins",
    "city": "São Paulo",
    "state": "SP",
    "status": "AVAILABLE",
    "isFeatured": true
  }'
```

---

## 🎯 **CHECKLIST FINAL**

### Instalação:
- [ ] Node.js instalado (`node --version`)
- [ ] Dependências instaladas (`npm install`)

### Supabase:
- [ ] Projeto criado
- [ ] Credenciais copiadas
- [ ] `.env` configurado
- [ ] Bucket `property-images` criado
- [ ] Políticas de acesso configuradas

### Banco de Dados:
- [ ] Prisma Client gerado
- [ ] Tabelas criadas (`npm run prisma:push`)
- [ ] Prisma Studio funcionando
- [ ] Teste de conexão OK

### Aplicação:
- [ ] Servidor rodando (`npm run dev`)
- [ ] APIs respondendo
- [ ] Dados sendo salvos

---

## 🚨 **TROUBLESHOOTING**

### **Erro: "Can't reach database server"**

**Causa**: DATABASE_URL incorreta

**Solução**:
1. Verifique se copiou a URL completa
2. Confirme que substituiu `[SUA-SENHA]`
3. Teste a senha no painel do Supabase

---

### **Erro: "Invalid API key"**

**Causa**: Chaves Supabase incorretas

**Solução**:
1. Volte em Settings → API
2. Copie novamente as chaves
3. Cole no `.env` sem espaços extras

---

### **Erro: "Bucket not found"**

**Causa**: Bucket não criado ou nome errado

**Solução**:
1. Vá em Storage
2. Verifique se `property-images` existe
3. Nome deve ser exatamente `property-images`

---

### **Erro: "Module not found"**

**Causa**: Dependências não instaladas

**Solução**:
```bash
rm -rf node_modules
npm install
npm run prisma:generate
```

---

## ⏱️ **TEMPO TOTAL ESTIMADO**

- Instalar Node.js: **5 minutos**
- Instalar dependências: **3 minutos**
- Criar projeto Supabase: **2 minutos**
- Configurar .env: **2 minutos**
- Criar banco: **1 minuto**
- Configurar Storage: **2 minutos**
- **TOTAL: ~15 minutos**

---

## 📚 **PRÓXIMOS PASSOS**

Após completar o setup:

1. ✅ Migrar backoffice para Next.js
2. ✅ Integrar site público
3. ✅ Implementar tracking frontend
4. ✅ Deploy no Vercel

---

## 🎉 **RESULTADO ESPERADO**

Ao final deste setup, você terá:

✅ **Banco PostgreSQL real** rodando no Supabase  
✅ **7 tabelas** criadas e funcionando  
✅ **Storage** configurado para imagens  
✅ **APIs** conectadas ao banco  
✅ **Aplicação** rodando em desenvolvimento  
✅ **Dados persistentes** (não mais mock)

---

**Status**: Guia completo criado  
**Próximo**: Executar os passos acima  
**Suporte**: Qualquer dúvida, me avise!

🚀 **Vamos colocar em produção!**
