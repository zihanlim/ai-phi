# AI-Phi: Digital Agora

A web application for engaging in intellectual dialogue with historical and contemporary philosophers from diverse cultural traditions worldwide.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-cyan)
![Supabase](https://img.shields.io/badge/Supabase-Database-green)

## Features

- **Debate Chamber** — Place multiple philosophers side-by-side and watch them debate on any topic
- **Dialogue Interface** — Engage in deep, one-on-one conversations with individual philosophers
- **Philosopher Dossiers** — Explore biographies, major works, and key ideas from diverse traditions
- **Multi-Tradition Coverage** — Western, Eastern, African, Middle Eastern, Latin American, and Indigenous philosophies
- **Conversation Archive** — Save and revisit your philosophical dialogues
- **Multi-AI Provider Support** — Works with OpenAI or Anthropic APIs

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4 with custom design system
- **Database**: PostgreSQL via Supabase
- **ORM**: Prisma
- **AI Integration**: OpenAI / Anthropic APIs
- **Authentication**: Supabase Auth (prepared)

## Design System

The neon-socratic design language features:

- **Primary**: `#00FFA3` (neon cyan-green)
- **Secondary**: `#699CFF` (intellectual agreement blue)
- **Error**: `#EF4444` (paradox/fallacy red)
- **Surface Hierarchy**: Deep abyss palette from `#000000` to `#1f1f22`
- **Typography**: Space Grotesk (headlines), Plus Jakarta Sans (body), JetBrains Mono (labels)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (Supabase free tier or local)
- OpenAI or Anthropic API key

### 1. Clone the Repository

```bash
git clone https://github.com/zihanlim/ai-phi.git
cd ai-phi
```

### 2. Set Up Supabase (Free Tier Works)

1. Create a project at [supabase.com](https://supabase.com)
2. Go to Settings > Database to find your connection string
3. Enable "Use connection pooling" and set Pool mode to "Transaction"
4. Copy the connection string in this format:
   ```
   postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Database (from Supabase)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"

# AI Providers (at least one required)
OPENAI_API_KEY="sk-..."
# or
ANTHROPIC_API_KEY="sk-ant-..."
```

### 4. Install and Initialize

```bash
# Install dependencies
npm install

# Push database schema
npm run db:push

# Seed philosophers
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Hub - Home/Dashboard
│   ├── debate/            # Debate Chamber
│   ├── dialogue/          # Dialogue Interface
│   ├── dossier/           # Philosopher Dossiers
│   │   └── [id]/          # Individual dossier pages
│   ├── archive/           # Saved conversations
│   ├── settings/          # App settings
│   └── api/               # API routes
│       ├── chat/          # AI chat endpoint
│       ├── conversations/  # Conversation CRUD
│       └── philosophers/   # Philosopher data
├── components/            # Reusable UI components
│   ├── Navigation.tsx     # Bottom navigation bar
│   ├── PhilosopherCard.tsx
│   ├── ChatInterface.tsx
│   └── ComparisonView.tsx
└── lib/                   # Utilities
    ├── ai.ts              # OpenAI/Anthropic clients
    ├── db.ts              # Prisma client
    └── supabase/          # Supabase helpers
prototypes/                # Original HTML prototypes (reference)
```

## Philosophers Included

| Name | Era | Tradition |
|------|-----|-----------|
| Socrates | 470-399 BCE | Western |
| Aristotle | 384-322 BCE | Western |
| Confucius | 551-479 BCE | Eastern |
| Lao Tzu | 6th century BCE | Eastern |
| Wang Yangming | 1472-1529 | Eastern |
| Nietzsche | 1844-1900 | Western |
| Simone de Beauvoir | 1908-1986 | Western |
| Frantz Fanon | 1925-1961 | African |

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | GET, POST | Fetch messages or send new chat |
| `/api/conversations` | GET, POST, DELETE | List, create, or delete conversations |
| `/api/philosophers` | GET | List all philosophers |

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
npm run db:push   # Push Prisma schema to database
npm run db:seed   # Seed database with philosophers
npm run db:studio # Open Prisma Studio
```

## Roadmap

### Planned Features

- [ ] **User Authentication** — Sign up/login via Supabase Auth
- [ ] **User Profiles** — Save preferences and conversation history per user
- [ ] **More Philosophers** — Expand to 20+ philosophers across all traditions
  - Eastern: Sun Tzu, Mencius, Zhuangzi, Shankara, Nagarjuna
  - Western: Plato, Kant, Kierkegaard, Sartre, Hannah Arendt
  - African: Cheikh Anta Diop, Kwame Nkrumah
  - Middle Eastern: Avicenna, Al-Ghazali, Averroes
  - Latin American: Enrique Dussel, Rodolfo Kusch
  - Indigenous: Chief Seattle, Vine Deloria Jr.
- [ ] **Conversation Export** — Export dialogues as PDF or Markdown
- [ ] **Philosopher Debate Mode** — AI-driven debates between selected philosophers
- [ ] **Mobile App** — React Native companion app
- [ ] **Rate Limiting** — Protect API endpoints from abuse
- [ ] **Caching** — Redis caching for philosopher data
- [ ] **Analytics Dashboard** — Track usage and popular philosophers

### Known Limitations

- Currently single-user mode (no auth)
- Requires manual .env setup
- API responses depend on AI provider quality/quotas

## License

MIT
