# 🎯 MONITOR DO SISTEMA IMI

## Como Usar

### 1. Abra um NOVO terminal (separado do npm run dev)

### 2. Execute o monitor:
```bash
cd /Users/lailamiranda/dev-imi
node monitor-sistema.js
```

### 3. O que o monitor faz:

✅ Verifica a conexão com o banco de dados  
✅ Conta usuários, leads e imóveis  
✅ Verifica se o servidor Next.js está rodando  
✅ Testa a autenticação automaticamente  
✅ Atualiza a cada 10 segundos  

### 4. Saída Esperada:

**ANTES de executar o SQL:**
```
[11:53:30] ❌ Banco de Dados: ERRO - The table public.users does not exist
[11:53:30]    └─ Execute: EXECUTAR-AGORA.sql no Supabase
[11:53:30] ✅ Servidor Next.js: RODANDO (porta 3000)
```

**DEPOIS de executar o SQL:**
```
[11:53:30] ✅ Banco de Dados: CONECTADO
[11:53:30]    └─ Usuários: 1
[11:53:30]    └─ Leads: 0
[11:53:30]    └─ Imóveis: 0
[11:53:30] ✅ Usuário Admin: CONFIGURADO (Iule Miranda)
[11:53:30] ✅ Servidor Next.js: RODANDO (porta 3000)
[11:53:30] ✅ Autenticação: FUNCIONANDO
[11:53:30]    └─ Login disponível em: http://localhost:3000/backoffice
```

---

## 📋 CHECKLIST PARA VOCÊ:

### Passo 1: Executar SQL no Supabase
- [ ] Abrir: https://supabase.com/dashboard/project/zocffccwjjyelwrgunhu/sql/new
- [ ] Copiar TODO o conteúdo de: `EXECUTAR-AGORA.sql`
- [ ] Colar no SQL Editor
- [ ] Clicar em "Run"
- [ ] Aguardar mensagem de sucesso

### Passo 2: Iniciar o Monitor
- [ ] Abrir novo terminal
- [ ] Executar: `node monitor-sistema.js`
- [ ] Verificar se aparece "✅ Banco de Dados: CONECTADO"
- [ ] Verificar se aparece "✅ Autenticação: FUNCIONANDO"

### Passo 3: Testar Login
- [ ] Abrir: http://localhost:3000/backoffice
- [ ] Email: iule@imi.com
- [ ] Senha: teste123
- [ ] Clicar em "Entrar"
- [ ] Deve redirecionar para o dashboard

---

## 🚀 Vantagens do Monitor:

1. **Sem abrir abas** - Tudo no terminal
2. **Tempo real** - Atualiza a cada 10 segundos
3. **Diagnóstico automático** - Mostra exatamente o que está errado
4. **Colorido** - Fácil de ler (verde = ok, vermelho = erro)
5. **Não invasivo** - Roda em paralelo, não interfere no desenvolvimento

---

## 💡 Dica:

Deixe o monitor rodando enquanto trabalha. Assim você saberá imediatamente quando:
- O banco de dados for configurado ✅
- A autenticação começar a funcionar ✅
- Algum erro acontecer ❌

---

**Pressione Ctrl+C para parar o monitor**
