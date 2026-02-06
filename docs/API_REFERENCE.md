# 📡 API REFERENCE - IMI PLATFORM

## ✅ **STATUS: API COMPLETA**

Todas as rotas estão implementadas e prontas para uso.

---

## 🏢 **PROPERTIES API**

### **GET /api/properties**
Lista todos os imóveis com filtros opcionais

**Query Params**:
- `status` - Filtrar por status (AVAILABLE, RESERVED, SOLD, ANALYSIS)
- `featured` - true/false - Apenas destaques
- `minPrice` - Preço mínimo
- `maxPrice` - Preço máximo
- `bedrooms` - Número de quartos
- `neighborhood` - Bairro (busca parcial)

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Apartamento Premium em Jardins",
      "slug": "apartamento-premium-jardins",
      "price": 850000,
      "area": 120,
      "bedrooms": 3,
      "bathrooms": 2,
      "parkingSpots": 2,
      "status": "AVAILABLE",
      "isFeatured": true,
      "images": [...],
      "_count": {
        "accessLogs": 45,
        "clientLinks": 12
      }
    }
  ],
  "count": 10
}
```

---

### **POST /api/properties**
Cria um novo imóvel

**Body**:
```json
{
  "title": "Apartamento Premium em Jardins",
  "description": "Descrição completa...",
  "price": 850000,
  "area": 120,
  "bedrooms": 3,
  "bathrooms": 2,
  "parkingSpots": 2,
  "address": "Rua Augusta, 1000",
  "neighborhood": "Jardins",
  "city": "São Paulo",
  "state": "SP",
  "zipCode": "01304-000",
  "latitude": -23.5505,
  "longitude": -46.6333,
  "status": "AVAILABLE",
  "isFeatured": true,
  "isExclusive": false,
  "hasAnalysis": true,
  "images": [
    {
      "url": "https://...",
      "alt": "Fachada"
    }
  ]
}
```

**Response**: Imóvel criado com slug único

---

### **GET /api/properties/[id]**
Busca um imóvel específico

**Response**: Imóvel completo com imagens e contadores

---

### **PUT /api/properties/[id]**
Atualiza um imóvel

**Body**: Mesmos campos do POST (todos opcionais)

---

### **DELETE /api/properties/[id]**
Deleta um imóvel

**Ação**: Remove imóvel e todas as imagens do Supabase Storage

---

## 👥 **CLIENTS API**

### **GET /api/clients**
Lista todos os clientes

**Query Params**:
- `search` - Busca por nome, email ou telefone

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Maria Silva",
      "email": "maria@example.com",
      "phone": "+55 11 99999-9999",
      "origin": "Formulário Site",
      "notes": "Interessada em apartamentos",
      "_count": {
        "propertyLinks": 5,
        "accessLogs": 12
      }
    }
  ],
  "count": 50
}
```

---

### **POST /api/clients**
Cria um novo cliente

**Body**:
```json
{
  "name": "Maria Silva",
  "email": "maria@example.com",
  "phone": "+55 11 99999-9999",
  "origin": "WhatsApp",
  "notes": "Cliente VIP"
}
```

**Validação**: Email único (retorna erro 409 se já existe)

**Ação**: Cria notificação automática de novo cliente

---

### **GET /api/clients/[id]**
Busca um cliente com histórico completo

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Maria Silva",
    "email": "maria@example.com",
    "propertyLinks": [
      {
        "id": "uuid",
        "url": "https://...",
        "token": "abc123",
        "property": {
          "title": "Apartamento Jardins",
          "images": [...]
        }
      }
    ],
    "accessLogs": [
      {
        "id": "uuid",
        "accessedAt": "2026-01-31T14:30:00Z",
        "device": "mobile",
        "totalTimeSeconds": 240,
        "property": {
          "title": "Apartamento Jardins"
        }
      }
    ]
  }
}
```

---

### **PUT /api/clients/[id]**
Atualiza um cliente

**Body**: Mesmos campos do POST (todos opcionais)

---

### **DELETE /api/clients/[id]**
Deleta um cliente

**Ação**: Remove cliente, links e logs (cascade)

---

## 📊 **TRACKING API**

### **POST /api/tracking/link**
Cria link exclusivo para cliente visualizar imóvel

**Body**:
```json
{
  "clientId": "uuid",
  "propertyId": "uuid",
  "expiresInDays": 30
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "url": "https://www.iulemirandaimoveis.com/imovel/apto-jardins?c=maria123&t=abc123xyz",
    "token": "abc123xyz",
    "expiresAt": "2026-02-28T14:30:00Z"
  }
}
```

**Regra**: Se já existe link para este cliente+imóvel, retorna o existente

---

### **POST /api/tracking/access**
Registra acesso ao imóvel via link

**Body**:
```json
{
  "token": "abc123xyz"
}
```

**Ação**:
- Detecta dispositivo (mobile/desktop)
- Detecta navegador e OS
- Captura IP
- Incrementa contador de views
- Cria notificação automática

**Response**:
```json
{
  "success": true,
  "data": {
    "logId": "uuid",
    "message": "Acesso registrado com sucesso"
  }
}
```

---

### **POST /api/tracking/time**
Atualiza tempo de permanência

**Body**:
```json
{
  "logId": "uuid",
  "totalTimeSeconds": 240,
  "galleryTimeSeconds": 60,
  "descriptionTimeSeconds": 90,
  "priceTimeSeconds": 40,
  "ctaTimeSeconds": 20,
  "scrollDepth": 85
}
```

**Uso**: Chamado periodicamente pelo frontend (ex: a cada 10 segundos)

---

### **POST /api/tracking/cta**
Registra clique em CTA

**Body**:
```json
{
  "logId": "uuid",
  "type": "cta"
}
```

**Types**: `"cta"` ou `"whatsapp"`

---

### **GET /api/tracking/stats/[propertyId]**
Busca estatísticas do imóvel

**Response**:
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalAccess": 45,
      "uniqueClients": 12,
      "avgTimeSeconds": 180,
      "ctaClicks": 8,
      "whatsappClicks": 5,
      "conversionRate": 17.78
    },
    "topClients": [
      {
        "client": {
          "id": "uuid",
          "name": "Maria Silva",
          "email": "maria@example.com"
        },
        "accessCount": 5,
        "avgTimeSeconds": 320
      }
    ]
  }
}
```

---

## 📤 **UPLOAD API**

### **POST /api/upload**
Upload de imagem para Supabase Storage

**Body**: FormData com campo `file`

**Query Params**:
- `folder` - Pasta no bucket (default: "properties")

**Validações**:
- Tipos permitidos: JPG, PNG, WebP
- Tamanho máximo: 5MB

**Response**:
```json
{
  "success": true,
  "data": {
    "fileName": "properties/abc123.jpg",
    "url": "https://xyz.supabase.co/storage/v1/object/public/property-images/properties/abc123.jpg",
    "size": 1024000,
    "type": "image/jpeg"
  }
}
```

**Exemplo de uso**:
```javascript
const formData = new FormData()
formData.append('file', file)

const response = await fetch('/api/upload?folder=properties', {
  method: 'POST',
  body: formData
})
```

---

### **DELETE /api/upload**
Deleta imagem do Supabase Storage

**Body**:
```json
{
  "fileName": "properties/abc123.jpg"
}
```

---

## 🔔 **NOTIFICATIONS API**

### **GET /api/notifications**
Lista notificações

**Query Params**:
- `unreadOnly` - true/false - Apenas não lidas
- `limit` - Número de resultados (default: 50)
- `offset` - Paginação (default: 0)

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "PROPERTY_ACCESS",
      "title": "Novo Acesso ao Imóvel",
      "message": "Maria Silva acessou o imóvel 'Apartamento Jardins'",
      "data": {
        "clientId": "uuid",
        "clientName": "Maria Silva",
        "propertyId": "uuid",
        "propertyTitle": "Apartamento Jardins",
        "device": "mobile"
      },
      "isRead": false,
      "createdAt": "2026-01-31T14:30:00Z"
    }
  ],
  "meta": {
    "total": 150,
    "unreadCount": 12,
    "limit": 50,
    "offset": 0
  }
}
```

---

### **POST /api/notifications/mark-read**
Marca notificações como lidas

**Body (opção 1 - específicas)**:
```json
{
  "ids": ["uuid1", "uuid2", "uuid3"]
}
```

**Body (opção 2 - todas)**:
```json
{
  "all": true
}
```

---

## 🎯 **TIPOS DE NOTIFICAÇÃO**

- `PROPERTY_ACCESS` - Cliente acessou imóvel pela primeira vez
- `PROPERTY_REVISIT` - Cliente revisitou imóvel
- `HIGH_ENGAGEMENT` - Cliente com alto engajamento
- `NEW_CLIENT` - Novo cliente cadastrado
- `PROPERTY_SOLD` - Imóvel vendido

---

## 🔐 **AUTENTICAÇÃO**

**Status**: A implementar (próxima fase)

Todas as rotas de admin (`/api/properties`, `/api/clients`, etc) devem ser protegidas com JWT.

**Headers necessários**:
```
Authorization: Bearer <token>
```

---

## 🚨 **CÓDIGOS DE ERRO**

- `400` - Bad Request (dados inválidos)
- `401` - Unauthorized (não autenticado)
- `403` - Forbidden (sem permissão)
- `404` - Not Found (recurso não encontrado)
- `409` - Conflict (duplicata, ex: email já existe)
- `500` - Internal Server Error

**Formato de erro**:
```json
{
  "success": false,
  "error": "Mensagem de erro"
}
```

---

## 📝 **EXEMPLOS DE USO**

### Criar imóvel com imagens:

```javascript
// 1. Upload das imagens
const images = []
for (const file of files) {
  const formData = new FormData()
  formData.append('file', file)
  
  const uploadRes = await fetch('/api/upload?folder=properties', {
    method: 'POST',
    body: formData
  })
  const uploadData = await uploadRes.json()
  images.push({
    url: uploadData.data.url,
    alt: file.name
  })
}

// 2. Criar imóvel
const propertyRes = await fetch('/api/properties', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Apartamento Premium',
    description: '...',
    price: 850000,
    // ... outros campos
    images
  })
})
```

---

### Gerar link e rastrear acesso:

```javascript
// 1. Gerar link (backoffice)
const linkRes = await fetch('/api/tracking/link', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    clientId: 'uuid-cliente',
    propertyId: 'uuid-imovel'
  })
})
const { data } = await linkRes.json()
console.log('Link:', data.url)

// 2. Cliente acessa (frontend)
const accessRes = await fetch('/api/tracking/access', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    token: 'abc123xyz'
  })
})
const { data: accessData } = await accessRes.json()
const logId = accessData.logId

// 3. Atualizar tempo (a cada 10s)
setInterval(async () => {
  await fetch('/api/tracking/time', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      logId,
      totalTimeSeconds: getCurrentTime(),
      scrollDepth: getScrollDepth()
    })
  })
}, 10000)

// 4. Registrar clique em WhatsApp
await fetch('/api/tracking/cta', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    logId,
    type: 'whatsapp'
  })
})
```

---

## ✅ **CHECKLIST DE IMPLEMENTAÇÃO**

### APIs Criadas:
- [x] Properties (GET, POST, PUT, DELETE)
- [x] Clients (GET, POST, PUT, DELETE)
- [x] Upload (POST, DELETE)
- [x] Tracking Link (POST)
- [x] Tracking Access (POST)
- [x] Tracking Time (POST)
- [x] Tracking CTA (POST)
- [x] Tracking Stats (GET)
- [x] Notifications (GET, POST)

### Próximos Passos:
- [ ] Adicionar autenticação JWT
- [ ] Implementar rate limiting
- [ ] Adicionar validação com Zod
- [ ] Criar testes automatizados

---

**Status**: ✅ **API COMPLETA E FUNCIONAL**  
**Total de Endpoints**: 15  
**Pronto para**: Integração com frontend

🚀 **API pronta para uso!**
