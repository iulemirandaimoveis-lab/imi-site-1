# GUIA RÁPIDO: EXECUTAR MIGRAÇÃO SQL

## ⚡ AÇÃO OBRIGATÓRIA

Para que os empreendimentos internacionais funcionem corretamente, você **DEVE** executar a migração SQL no Supabase.

---

## 📋 PASSO A PASSO

### 1. Acessar Supabase Dashboard
🔗 https://supabase.com/dashboard

### 2. Selecionar o Projeto
- Projeto: **IMI Atlantis** (ou nome do seu projeto)

### 3. Abrir SQL Editor
- Menu lateral → **SQL Editor**
- Clique em **New Query**

### 4. Copiar e Colar o SQL
Abra o arquivo:
```
supabase/migrations/003_international_media.sql
```

Copie **TODO O CONTEÚDO** e cole no editor SQL do Supabase.

### 5. Executar
- Clique no botão **Run** (ou pressione Ctrl+Enter)
- Aguarde a execução (deve levar ~2 segundos)

### 6. Verificar Sucesso
Você deve ver a mensagem:
```
Success. No rows returned
```

---

## ✅ VALIDAÇÃO

Execute este SQL para confirmar que funcionou:

```sql
-- Verificar se as colunas foram adicionadas
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'developments' 
  AND column_name IN ('country', 'virtual_tour_url')
ORDER BY column_name;
```

**Resultado esperado:**
```
column_name       | data_type | is_nullable
------------------+-----------+-------------
country           | text      | YES
virtual_tour_url  | text      | YES
```

---

## 🔧 SE DER ERRO

### Erro: "relation developments does not exist"
**Causa:** A tabela developments ainda não foi criada.  
**Solução:** Execute primeiro a migração `001_backoffice.sql`

### Erro: "column country already exists"
**Causa:** A migração já foi executada antes.  
**Solução:** Nada a fazer, está tudo OK! ✅

### Erro: "constraint developments_region_check already exists"
**Causa:** Constraint antiga ainda existe.  
**Solução:** Execute este SQL antes:
```sql
ALTER TABLE developments DROP CONSTRAINT IF EXISTS developments_region_check;
```
Depois execute a migração 003 novamente.

---

## 📊 O QUE ESTA MIGRAÇÃO FAZ

1. ✅ Adiciona coluna `country` (país do empreendimento)
2. ✅ Adiciona coluna `virtual_tour_url` (tours 360°)
3. ✅ Atualiza constraint de `region` para aceitar 'internacional'
4. ✅ Cria índices de performance
5. ✅ Atualiza empreendimentos brasileiros com country='Brasil'

---

## ⏱️ TEMPO ESTIMADO

**Total:** 2-3 minutos
- Acessar Supabase: 30s
- Copiar SQL: 30s
- Executar: 5s
- Validar: 30s

---

## 🆘 PRECISA DE AJUDA?

Se encontrar qualquer problema:
1. Tire um print do erro
2. Verifique se está no projeto correto
3. Confirme que tem permissões de admin no Supabase

---

**Após executar esta migração, o sistema estará 100% funcional!** ✅
