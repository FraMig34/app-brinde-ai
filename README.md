# 🍻 Brinde.AI - Jogos de Bebida Inteligentes

A plataforma definitiva para jogos de bebida e drinks personalizados com IA.

## 🚀 Como Iniciar o Projeto

### 1️⃣ Instalar Dependências

```bash
npm install
```

### 2️⃣ Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL="sua-url-do-supabase"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sua-chave-anon"
SUPABASE_SERVICE_ROLE_KEY="sua-chave-service-role"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID="price_..."
NEXT_PUBLIC_STRIPE_PREMIUM_YEARLY_PRICE_ID="price_..."
```

📖 **Guia completo de configuração**: Veja [STRIPE-SETUP.md](./STRIPE-SETUP.md)

### 3️⃣ Iniciar Servidor de Desenvolvimento

```bash
npm run dev
```

O site estará disponível em: **http://localhost:3000**

---

## 🔧 Comandos Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento (porta 3000)

# Produção
npm run build        # Cria build de produção
npm run start        # Inicia servidor de produção

# Qualidade de Código
npm run lint         # Verifica erros de código
```

---

## 📁 Estrutura do Projeto

```
brinde-ai/
├── src/
│   ├── app/                    # Páginas Next.js (App Router)
│   │   ├── page.tsx           # Página inicial
│   │   ├── layout.tsx         # Layout principal
│   │   ├── globals.css        # Estilos globais
│   │   ├── auth/              # Autenticação
│   │   ├── games/             # Jogos de bebida
│   │   ├── drinks/            # Drinks com IA
│   │   ├── premium/           # Página premium
│   │   └── api/               # API Routes
│   │       └── stripe/        # Integração Stripe
│   ├── components/            # Componentes React
│   │   ├── ui/               # Componentes UI (shadcn)
│   │   └── custom/           # Componentes customizados
│   └── lib/                   # Utilitários e configurações
│       ├── supabase.ts       # Cliente Supabase
│       ├── stripe.ts         # Cliente Stripe (server)
│       ├── stripe-client.ts  # Cliente Stripe (client)
│       └── auth-context.tsx  # Contexto de autenticação
├── public/                    # Arquivos estáticos
├── .env.local                 # Variáveis de ambiente (não commitado)
├── package.json              # Dependências
└── README.md                 # Este arquivo
```

---

## 🎮 Funcionalidades

### ✅ Implementadas

- 🎲 **10+ Jogos de Bebida**
  - Roleta Bebada
  - Batata Quente
  - Eu Nunca
  - Verdade ou Shot
  - E muito mais!

- 🍹 **Drinks com IA**
  - Reconhecimento por foto
  - Inventário inteligente
  - Receitas personalizadas

- 👤 **Autenticação Completa**
  - Login/Cadastro com Supabase
  - Verificação de idade
  - Perfil de usuário

- 💎 **Sistema Premium**
  - Pagamentos com Stripe
  - Assinaturas mensais/anuais
  - Acesso a jogos exclusivos

- 🎨 **Design Moderno**
  - Interface responsiva
  - Dark mode nativo
  - Animações suaves

### 🚧 Em Desenvolvimento

- 📊 Dashboard de estatísticas
- 🏆 Sistema de conquistas
- 👥 Modo multiplayer online
- 🎵 Integração com Spotify

---

## 🔐 Segurança

### Emails com Acesso Ilimitado

Os seguintes emails têm acesso premium vitalício e privilégios de admin:

- `ruylhaoprincipal@gmail.com` (Admin)
- `francisco.s.silva03@gmail.com` (Premium)
- `miguelbonvini@hotmail.com` (Premium)

### Boas Práticas

- ✅ Autenticação via Supabase Auth
- ✅ RLS (Row Level Security) ativado
- ✅ Validação de webhooks do Stripe
- ✅ Variáveis de ambiente protegidas
- ✅ HTTPS obrigatório em produção

---

## 🐛 Problemas Comuns

### Site não inicia (porta 3000)

**Problema**: "Recusa a ligar ao 3000"

**Soluções**:

1. **Verificar se a porta está em uso**:
```bash
# Linux/Mac
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

2. **Limpar cache do Next.js**:
```bash
rm -rf .next
npm run dev
```

3. **Reinstalar dependências**:
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

4. **Verificar variáveis de ambiente**:
   - Confirme que `.env.local` existe
   - Verifique se todas as variáveis estão preenchidas
   - Não use aspas duplas extras

### Erro de Stripe

**Problema**: "Stripe is not defined"

**Solução**: Verifique se `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` está configurado em `.env.local`

### Erro de Supabase

**Problema**: "Invalid API key"

**Solução**: 
1. Acesse: https://supabase.com/dashboard/project/_/settings/api
2. Copie as chaves corretas
3. Atualize `.env.local`

---

## 📚 Tecnologias

- **Framework**: Next.js 15 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS v4
- **UI Components**: shadcn/ui + Radix UI
- **Autenticação**: Supabase Auth
- **Banco de Dados**: Supabase (PostgreSQL)
- **Pagamentos**: Stripe
- **IA**: OpenAI GPT-4
- **Deploy**: Vercel

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é privado e proprietário.

---

## 📞 Suporte

Para dúvidas ou problemas:

- 📧 Email: suporte@brinde.ai
- 🐛 Issues: [GitHub Issues](https://github.com/seu-usuario/brinde-ai/issues)
- 📖 Documentação: [STRIPE-SETUP.md](./STRIPE-SETUP.md)

---

## 🎉 Agradecimentos

Desenvolvido com ❤️ pela equipe Brinde.AI

**Beba com responsabilidade! 🍻**
