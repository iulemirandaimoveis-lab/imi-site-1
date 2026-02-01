# 🚀 SETUP RÁPIDO - IMI PRODUÇÃO

## ⚡ **INÍCIO IMEDIATO**

### **1. Instalar Dependências**

```bash
cd /Users/lailamiranda/dev-imi
npm install
```

---

### **2. Criar Projeto Supabase**

1. Acesse: https://supabase.com
2. Clique em "New Project"
3. Preencha:
   - **Name**: `imi-platform`
   - **Database Password**: (crie uma senha forte)
   - **Region**: South America (São Paulo)
4. Aguarde ~2 minutos

---

### **3. Copiar Credenciais**

No painel do Supabase:

1. Vá em **Settings** → **API**
2. Copie:
   - **Project URL**
   - **anon public key**
   - **service_role key** (⚠️ secreta!)

3. Vá em **Settings** → **Database**
4. Copie:
   - **Connection string** → **URI**

---

### **4. Configurar Variáveis de Ambiente**

Crie o arquivo `.env`:

```bash
cp .env.example .env
```

Edite `.env` e adicione:

```env
# DATABASE
DATABASE_URL="postgresql://postgres:[SUA-SENHA]@db.[SEU-PROJETO].supabase.co:5432/postgres"

# SUPABASE
NEXT_PUBLIC_SUPABASE_URL="https://[SEU-PROJETO].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[SUA-ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[SUA-SERVICE-KEY]"

# AUTH
JWT_SECRET="sua-chave-secreta-aqui-mude-em-producao"
NEXTAUTH_SECRET="outra-chave-secreta-aqui"
NEXTAUTH_URL="http://localhost:3000"

# APP
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_NAME="IMI - Inteligência Imobiliária"
```

---

### **5. Criar Banco de Dados**

```bash
# Gerar Prisma Client
npm run prisma:generate

# Criar tabelas no Supabase
npm run prisma:push
```

Você verá:
```
✔ Generated Prisma Client
✔ The database is now in sync with your Prisma schema
```

---

### **6. Configurar Storage (Imagens)**

No painel do Supabase:

1. Vá em **Storage**
2. Clique em "New bucket"
3. Nome: `property-images`
4. **Public bucket**: ✅ Sim
5. Clique em "Create bucket"

#### Configurar Políticas:

1. Clique no bucket `property-images`
2. Vá em **Policies**
3. Clique em "New Policy"
4. Selecione "Enable read access for all users"
5. Salve

---

### **7. Testar Conexão**

```bash
# Abrir Prisma Studio
npm run prisma:studio
```

Abrirá em: http://localhost:5555

Você verá todas as tabelas:
- users
- clients
- properties
- property_images
- client_property_links
- property_access_logs
- notifications

---

### **8. Criar Usuário Admin (Opcional)**

No Prisma Studio:

1. Clique em **users**
2. Clique em "Add record"
3. Preencha:
   - **email**: `iulemiranda@imi.com`
   - **name**: `Iule Miranda`
   - **passwordHash**: `$2a$10$...` (use bcrypt)
   - **role**: `ADMIN`
4. Salve

---

### **9. Rodar em Desenvolvimento**

```bash
npm run dev
```

Abrirá em: http://localhost:3000

---

## ✅ **VERIFICAÇÃO**

### Banco de Dados:
- [ ] Projeto Supabase criado
- [ ] Variáveis de ambiente configuradas
- [ ] Prisma push executado
- [ ] Tabelas criadas
- [ ] Prisma Studio funcionando

### Storage:
- [ ] Bucket `property-images` criado
- [ ] Políticas de leitura pública configuradas

### Aplicação:
- [ ] Dependências instaladas
- [ ] Servidor rodando em dev
- [ ] Sem erros no console

---

## 🔧 **COMANDOS ÚTEIS**

```bash
# Ver logs do banco
npm run prisma:studio

# Resetar banco (⚠️ apaga tudo)
npm run prisma:push -- --force-reset

# Ver schema
cat prisma/schema.prisma

# Testar build
npm run build

# Rodar produção local
npm run build && npm start
```

---

## 🚨 **TROUBLESHOOTING**

### Erro: "Can't reach database server"
- Verifique `DATABASE_URL` no `.env`
- Confirme que o projeto Supabase está ativo
- Teste conexão no painel do Supabase

### Erro: "Invalid API key"
- Verifique `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Confirme que copiou a chave correta
- Não use a service_role key no frontend

### Erro: "Module not found"
- Execute: `npm install`
- Execute: `npm run prisma:generate`

---

## 📊 **PRÓXIMOS PASSOS**

Após setup completo:

1. ✅ Criar API Routes (Properties, Clients, Tracking)
2. ✅ Migrar backoffice para Next.js
3. ✅ Integrar site público
4. ✅ Implementar tracking frontend
5. ✅ Deploy no Vercel

---

## 🎯 **TEMPO ESTIMADO**

- Setup Supabase: **5 minutos**
- Configurar .env: **2 minutos**
- Prisma push: **1 minuto**
- Storage setup: **3 minutos**
- **Total: ~15 minutos**

---

**Status**: Pronto para começar! 🚀  
**Próximo**: Executar comandos acima

**Suporte**: Documentação completa em `IMPLEMENTACAO_PRODUCAO.md`
