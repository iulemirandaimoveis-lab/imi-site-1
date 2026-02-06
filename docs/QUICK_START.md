# IMI Website - Quick Start Guide

## 🚀 Começando Agora

### 1. Instalar Node.js (OBRIGATÓRIO)

Você precisa instalar o Node.js primeiro. No macOS:

```bash
# Opção 1: Usando Homebrew (recomendado)
brew install node

# Opção 2: Download direto
# Acesse: https://nodejs.org e baixe a versão LTS
```

Verifique a instalação:
```bash
node --version  # Deve mostrar v18.x.x ou superior
npm --version   # Deve mostrar 9.x.x ou superior
```

### 2. Instalar Dependências

```bash
cd /Users/lailamiranda/dev-imi
npm install
```

### 3. Executar o Site

```bash
npm run dev
```

Abra no navegador: **http://localhost:3000**

## 📋 Comandos Principais

```bash
npm run dev        # Inicia servidor de desenvolvimento
npm run build      # Cria versão de produção
npm start          # Executa versão de produção
npm run lint       # Verifica erros de código
npm run type-check # Verifica erros de TypeScript
```

## 🎨 Páginas Criadas

| Página | URL | Descrição |
|--------|-----|-----------|
| Home | `/` | Página inicial com hero e serviços |
| Avaliações | `/avaliacoes` | Serviço de avaliações + formulário |
| Consultoria | `/consultoria` | Serviço de consultoria + formulário |
| Imóveis | `/imoveis` | Listagem de imóveis com filtros |
| Sobre | `/sobre` | História e perfil profissional |
| Conteúdo | `/conteudo` | Blog/artigos (em breve) |
| Contato | `/contato` | Informações de contato + formulário |

## 🔧 Configurações Importantes

### 1. WhatsApp

Edite: `src/app/contato/page.tsx` (linha ~67)
```typescript
href="https://wa.me/5511999999999" // Coloque seu número aqui
```

### 2. Email de Contato

Edite: `src/app/contato/page.tsx` (linha ~56)
```typescript
href="mailto:contato@imi.com.br" // Seu email aqui
```

### 3. LinkedIn

Edite: `src/components/layout/Footer.tsx` (linha ~76)
```typescript
href="https://linkedin.com/in/iule-miranda" // Seu perfil
```

### 4. Domínio do Site

Edite: `src/lib/seo.ts` (linha ~5)
```typescript
const SITE_URL = 'https://imi.com.br' // Seu domínio
```

## 📧 Configurar Email (Formulários)

Os formulários precisam de um serviço de email. Recomendado: **Resend**

1. Crie conta em: https://resend.com
2. Copie sua API key
3. Crie arquivo `.env.local`:
```bash
RESEND_API_KEY=re_sua_chave_aqui
CONTACT_EMAIL=contato@imi.com.br
```

4. Instale o Resend:
```bash
npm install resend
```

5. Edite os arquivos em `src/app/api/` para usar o Resend

## 🖼️ Adicionar Imagens

Coloque suas imagens em `public/`:

```
public/
├── logo.png          # Logo da IMI
├── og-image.jpg      # Imagem para redes sociais (1200x630px)
└── properties/       # Fotos de imóveis
    ├── apt-1-1.jpg
    ├── house-1-1.jpg
    └── ...
```

## 🎯 Dados dos Imóveis

Atualmente usando dados de exemplo em: `src/lib/mock-data.ts`

Para adicionar imóveis reais:
1. Edite `src/lib/mock-data.ts`
2. Ou configure um CMS (Sanity/Strapi)

## 🚀 Deploy (Publicar o Site)

### Opção 1: Vercel (Mais Fácil)

1. Crie conta em: https://vercel.com
2. Conecte seu repositório GitHub
3. Deploy automático!

### Opção 2: Netlify

1. Crie conta em: https://netlify.com
2. Arraste a pasta do projeto
3. Pronto!

## ❓ Problemas Comuns

### "command not found: npm"
→ Você precisa instalar o Node.js primeiro

### "Module not found"
→ Execute: `npm install`

### Porta 3000 já em uso
→ Execute: `npm run dev -- -p 3001` (usa porta 3001)

### Erro ao fazer build
→ Execute: `npm run type-check` para ver erros

## 📞 Próximos Passos

- [ ] Instalar Node.js
- [ ] Executar `npm install`
- [ ] Testar com `npm run dev`
- [ ] Adicionar suas imagens
- [ ] Configurar WhatsApp e emails
- [ ] Configurar serviço de email
- [ ] Adicionar imóveis reais
- [ ] Fazer deploy

## 🎨 Personalização

Todas as cores e estilos estão em:
- `tailwind.config.ts` - Cores e design tokens
- `src/app/globals.css` - Estilos globais

## 📚 Documentação

- Next.js: https://nextjs.org/docs
- TailwindCSS: https://tailwindcss.com/docs
- TypeScript: https://www.typescriptlang.org/docs

---

**Dúvidas?** Consulte o README.md completo ou a documentação oficial do Next.js.
