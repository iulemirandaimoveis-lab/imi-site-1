# ✅ CHECKLIST DE SETUP - IMI PLATFORM

## 📋 **ACOMPANHE SEU PROGRESSO**

### **FASE 1: PRÉ-REQUISITOS**

- [ ] **Node.js instalado**
  - Comando: `node --version`
  - Deve retornar: `v18.x.x` ou superior
  - Se não tiver: Instalar via Homebrew ou nodejs.org

- [ ] **npm funcionando**
  - Comando: `npm --version`
  - Deve retornar: `9.x.x` ou superior

---

### **FASE 2: INSTALAÇÃO**

- [ ] **Dependências instaladas**
  - Comando: `npm install`
  - Tempo: ~2-3 minutos
  - Resultado: Pasta `node_modules` criada

---

### **FASE 3: SUPABASE**

- [ ] **Conta criada**
  - Site: https://supabase.com
  - Login com GitHub

- [ ] **Projeto criado**
  - Nome: `imi-platform`
  - Região: South America (São Paulo)
  - Senha do banco: **ANOTADA**

- [ ] **Credenciais copiadas**
  - [ ] Project URL
  - [ ] anon public key
  - [ ] service_role key
  - [ ] Database URL (Connection string → URI)

---

### **FASE 4: CONFIGURAÇÃO**

- [ ] **Arquivo `.env` criado**
  - Comando: `cp .env.example .env`

- [ ] **`.env` preenchido**
  - [ ] DATABASE_URL
  - [ ] NEXT_PUBLIC_SUPABASE_URL
  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
  - [ ] SUPABASE_SERVICE_ROLE_KEY
  - [ ] JWT_SECRET (mudado)
  - [ ] NEXTAUTH_SECRET (mudado)

---

### **FASE 5: BANCO DE DADOS**

- [ ] **Prisma Client gerado**
  - Comando: `npm run prisma:generate`
  - Resultado: ✔ Generated Prisma Client

- [ ] **Tabelas criadas**
  - Comando: `npm run prisma:push`
  - Resultado: ✔ The database is now in sync

- [ ] **Verificação no Supabase**
  - Ir em: Database → Tables
  - Deve ter 7 tabelas:
    - [ ] users
    - [ ] clients
    - [ ] properties
    - [ ] property_images
    - [ ] client_property_links
    - [ ] property_access_logs
    - [ ] notifications

---

### **FASE 6: STORAGE**

- [ ] **Bucket criado**
  - Nome: `property-images`
  - Tipo: Public bucket ✅

- [ ] **Política de acesso configurada**
  - Policy name: Public Access
  - Operation: SELECT
  - SQL: `true`

---

### **FASE 7: TESTES**

- [ ] **Prisma Studio funcionando**
  - Comando: `npm run prisma:studio`
  - Abre em: http://localhost:5555
  - Mostra todas as tabelas

- [ ] **Teste de escrita no banco**
  - Criar registro de teste no Prisma Studio
  - Salvar com sucesso

- [ ] **Servidor rodando**
  - Comando: `npm run dev`
  - Abre em: http://localhost:3000

- [ ] **API respondendo**
  - Testar: `curl http://localhost:3000/api/properties`
  - Retorna: `{"success":true,"data":[],"count":0}`

---

### **FASE 8: DADOS DE TESTE (OPCIONAL)**

- [ ] **Cliente de teste criado**
  - Via API ou Prisma Studio

- [ ] **Imóvel de teste criado**
  - Via API

- [ ] **Link de tracking gerado**
  - Via API `/api/tracking/link`

---

## 🎯 **STATUS GERAL**

**Progresso**: ___/25 itens completos

### **Quando estiver 100%**:

✅ Banco de dados PostgreSQL real  
✅ 7 tabelas funcionando  
✅ Storage configurado  
✅ APIs conectadas  
✅ Aplicação rodando  
✅ **PRONTO PARA DESENVOLVIMENTO!**

---

## 🚨 **SE ALGO DER ERRADO**

### **Node.js não instalado**
```bash
# Mac (Homebrew)
brew install node

# Ou baixe em: https://nodejs.org
```

### **Erro de conexão com banco**
1. Verifique DATABASE_URL no `.env`
2. Confirme que substituiu `[SUA-SENHA]`
3. Teste a senha no painel do Supabase

### **Prisma não gera client**
```bash
npm install @prisma/client prisma --save
npm run prisma:generate
```

### **API não responde**
1. Verifique se servidor está rodando (`npm run dev`)
2. Confirme que está em http://localhost:3000
3. Veja erros no console

---

## 📞 **PRECISA DE AJUDA?**

Se travar em algum passo:

1. Leia a mensagem de erro completa
2. Consulte `SETUP_COMPLETO_GUIA.md`
3. Verifique a seção Troubleshooting
4. Me avise qual passo está travado

---

## ⏭️ **PRÓXIMOS PASSOS**

Após completar este checklist:

1. ✅ Migrar backoffice HTML → Next.js
2. ✅ Integrar site público
3. ✅ Implementar tracking frontend
4. ✅ Deploy no Vercel
5. ✅ Configurar domínio

---

**Última atualização**: 31/01/2026  
**Versão**: 1.0  
**Status**: Pronto para uso

🚀 **Boa sorte com o setup!**
