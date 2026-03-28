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
- PostgreSQL database (Supabase or local)
- OpenAI or Anthropic API key

### Environment Variables

Create a `.env` file:

```env
# Database
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Supabase (for auth - optional)
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY="your-publishable-key"

# AI Providers
OPENAI_API_KEY="sk-..."
# or
ANTHROPIC_API_KEY="sk-ant-..."
```

### Installation

```bash
# Install dependencies
npm install

# Set up database
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
│   │   └── [id]/         # Individual dossier pages
│   ├── archive/           # Saved conversations
│   ├── settings/          # App settings
│   └── api/               # API routes
│       ├── chat/         # AI chat endpoint
│       ├── conversations/ # Conversation CRUD
│       └── philosophers/  # Philosopher data
├── components/            # Reusable UI components
│   ├── Navigation.tsx     # Bottom navigation bar
│   ├── PhilosopherCard.tsx
│   ├── ChatInterface.tsx
│   └── ComparisonView.tsx
└── lib/                   # Utilities
    ├── ai.ts             # OpenAI/Anthropic clients
    ├── db.ts             # Prisma client
    └── supabase/         # Supabase helpers
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
| `/api/chat` | POST | Send message, get AI responses from philosophers |
| `/api/conversations` | GET, POST | List or create conversations |
| `/api/philosophers` | GET | List all philosophers |

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run db:push  # Push Prisma schema to database
npm run db:seed  # Seed database with philosophers
npm run db:studio # Open Prisma Studio
```

## License

MIT
