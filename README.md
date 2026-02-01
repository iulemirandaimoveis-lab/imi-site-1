# IMI – Inteligência Imobiliária

Site institucional e portal imobiliário premium focado em posicionamento estratégico, geração de receita e autoridade técnica.

## 🎯 Visão Geral

Este projeto é um site Next.js moderno que combina:
- **Institucional**: Apresentação da empresa, serviços e valores
- **Portal Imobiliário**: Listagem curada de imóveis com análise técnica
- **Geração de Leads**: Formulários estruturados para avaliações e consultoria

## 🚀 Tecnologias

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: TailwindCSS
- **Animações**: Framer Motion
- **Validação**: Zod
- **Fontes**: Google Fonts (Inter + Playfair Display)

## 📋 Pré-requisitos

Antes de começar, você precisa instalar:

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**

### Instalando Node.js no macOS

```bash
# Usando Homebrew (recomendado)
brew install node

# Ou baixe diretamente de https://nodejs.org
```

## 🛠️ Instalação

1. **Clone o repositório** (se aplicável) ou navegue até a pasta do projeto:

```bash
cd /Users/lailamiranda/dev-imi
```

2. **Instale as dependências**:

```bash
npm install
```

## 🏃 Executando o Projeto

### Modo de Desenvolvimento

```bash
npm run dev
```

O site estará disponível em: `http://localhost:3000`

### Build de Produção

```bash
npm run build
npm start
```

### Verificação de Tipos

```bash
npm run type-check
```

### Lint

```bash
npm run lint
```

## 📁 Estrutura do Projeto

```
dev-imi/
├── src/
│   ├── app/                    # Páginas e rotas (App Router)
│   │   ├── page.tsx           # Home
│   │   ├── avaliacoes/        # Avaliações Imobiliárias
│   │   ├── consultoria/       # Consultoria Estratégica
│   │   ├── imoveis/           # Portal de Imóveis
│   │   ├── sobre/             # Sobre a IMI
│   │   ├── conteudo/          # Artigos e Insights
│   │   ├── contato/           # Contato
│   │   ├── api/               # API Routes
│   │   └── layout.tsx         # Layout global
│   ├── components/
│   │   ├── ui/                # Componentes de UI reutilizáveis
│   │   ├── layout/            # Header, Footer
│   │   └── forms/             # Formulários
│   ├── lib/                   # Utilitários e helpers
│   ├── types/                 # TypeScript types
│   └── app/globals.css        # Estilos globais
├── public/                    # Arquivos estáticos
├── tailwind.config.ts         # Configuração do Tailwind
├── tsconfig.json              # Configuração do TypeScript
└── package.json               # Dependências
```

## 🎨 Design System

### Cores

- **Primary**: Tons de azul marinho/carvão (autoridade e confiança)
- **Accent**: Tons de bronze/dourado (destaque sutil)
- **Neutral**: Escala de cinzas sofisticados

### Tipografia

- **Sans-serif**: Inter (UI e corpo de texto)
- **Display**: Playfair Display (títulos e headings)

### Componentes

Todos os componentes UI estão em `src/components/ui/`:
- `Button`: Botões com variantes aprovadas
- `Card`: Cards para imóveis e conteúdo
- `Input`, `Select`, `Textarea`: Campos de formulário
- `Badge`: Tags e indicadores

## 📄 Páginas Implementadas

### ✅ Páginas Principais

- [x] **Home** (`/`) - Hero, serviços, trust indicators
- [x] **Avaliações** (`/avaliacoes`) - Tipos de avaliação + formulário
- [x] **Consultoria** (`/consultoria`) - Serviços de consultoria + formulário
- [x] **Imóveis** (`/imoveis`) - Listagem com filtros
- [x] **Sobre** (`/sobre`) - História, missão, perfil profissional
- [x] **Conteúdo** (`/conteudo`) - Em breve (estrutura preparada)
- [x] **Contato** (`/contato`) - Informações + formulário

### 🔧 Funcionalidades

- [x] Navegação responsiva com menu mobile
- [x] Animações suaves com Framer Motion
- [x] Formulários com validação
- [x] SEO otimizado (meta tags, structured data)
- [x] Design system consistente
- [x] Filtros de imóveis

## 🔌 Integrações Pendentes

### Email Service

Os formulários estão preparados para integração com serviços de email. Edite os arquivos em `src/app/api/`:

```typescript
// Exemplo com Resend
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: 'contato@imi.com.br',
  to: 'iule@imi.com.br',
  subject: 'Nova Solicitação',
  html: '<p>...</p>',
})
```

### CMS (Headless)

Recomendado: **Sanity.io**

1. Instale o Sanity:
```bash
npm install @sanity/client next-sanity
```

2. Configure em `src/lib/sanity.ts`
3. Crie schemas para: Properties, Builders, Articles
4. Substitua mock data por queries reais

### WhatsApp

Atualize o número em `src/app/contato/page.tsx`:

```typescript
// Linha 67
href="https://wa.me/5511999999999" // Substitua pelo número real
```

## 🌐 Deploy

### Vercel (Recomendado)

```bash
# Instale a CLI da Vercel
npm i -g vercel

# Deploy
vercel
```

### Outras Plataformas

O projeto é compatível com:
- Netlify
- AWS Amplify
- Railway
- Render

## 📝 Próximos Passos

1. **Instalar Node.js** (se ainda não tiver)
2. **Executar `npm install`**
3. **Testar com `npm run dev`**
4. **Configurar integrações**:
   - [ ] Serviço de email
   - [ ] CMS (Sanity/Strapi)
   - [ ] WhatsApp Business
   - [ ] Analytics (Google Analytics, Plausible)
5. **Adicionar imagens reais**:
   - Logo da IMI
   - Fotos de imóveis
   - Foto profissional
   - OG image
6. **Configurar domínio**
7. **Deploy em produção**

## 🎯 Credenciais

**Iule Miranda**
- CRECI: 17933
- CNAI: 53290

## 📞 Suporte

Para dúvidas sobre o código ou implementação, consulte a documentação:
- [Next.js](https://nextjs.org/docs)
- [TailwindCSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

## 📄 Licença

Projeto proprietário - IMI Inteligência Imobiliária © 2024
