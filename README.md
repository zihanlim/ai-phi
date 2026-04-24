# AI-Phi: Digital Agora

A web application for engaging in intellectual dialogue with historical and contemporary thinkers - philosophers and financiers - from diverse cultural traditions worldwide.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-cyan)
![Supabase](https://img.shields.io/badge/Supabase-Database-green)

## Features

- **Arena** — Unified interface combining Dialogue (1-on-1) and Debate (multi-thinker) modes
- **Hub** — Central dashboard with drag-and-drop interface for selecting thinkers
- **Thinker Categories** — Filter by Philosophers, Macro, Risk, Value, Quant, or Behavioral investors
- **Philosopher Dossiers** — Explore biographies, major works, and key ideas from diverse traditions
- **Dialogue Interface** — Engage in deep, one-on-one conversations with individual thinkers
- **Debate Chamber** — Watch multiple thinkers debate on any topic
- **Conversation Archive** — Save, search, pin, and revisit your philosophical dialogues
- **Multi-Tradition Coverage** — Western, Eastern, African, Middle Eastern, Latin American, and Indigenous philosophies
- **Multi-AI Provider Support** — Works with OpenAI or Anthropic APIs

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS with custom design system
- **Database**: PostgreSQL via Supabase
- **ORM**: Prisma
- **AI Integration**: OpenAI / Anthropic APIs
- **Authentication**: Supabase Auth (prepared)

## Design System

The neon-socratic design language features:

- **Primary**: `#00FFA3` (neon cyan-green)
- **Secondary**: `#699CFF` (intellectual agreement blue)
- **Tertiary**: `#FF716A` (warm accent)
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

# Seed philosophers and financiers
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Architecture

```mermaid
flowchart TB
    subgraph Frontend["Frontend (Next.js App Router)"]
        Hub["Hub Page<br/>(/page.tsx)"]
        Arena["Arena Page<br/>(/arena)"]
        Dialogue["Dialogue Page<br/>(/dialogue)"]
        Debate["Debate Page<br/>(/debate)"]
        Dossier["Dossier Page<br/>(/dossier)"]
        Archive["Archive Page<br/>(/archive)"]
        Settings["Settings Page<br/>(/settings)"]
    end

    subgraph Components["Components"]
        Header["Header"]
        Navigation["Navigation"]
        Footer["Footer"]
        SidePanel["SidePanel"]
        HubClient["HubClient"]
        PhilosopherCard["PhilosopherCard"]
        ChatInterface["ChatInterface"]
        ComparisonView["ComparisonView"]
    end

    subgraph API["API Routes"]
        ChatAPI["/api/chat"]
        ConversationsAPI["/api/conversations"]
        PhilosophersAPI["/api/philosophers"]
    end

    subgraph Backend["Backend Services"]
        Prisma["Prisma ORM"]
        AI["AI Client<br/>(OpenAI/Anthropic)"]
    end

    subgraph Database["Database (PostgreSQL)"]
        PhilosopherTable["Philosopher"]
        ConversationTable["Conversation"]
        MessageTable["Message"]
    end

    subgraph External["External Services"]
        Supabase["Supabase<br/>(Auth & Database)"]
        OpenAI["OpenAI API"]
        Anthropic["Anthropic API"]
    end

    Frontend --> Components
    Components --> HubClient
    HubClient --> SidePanel
    
    Hub --> Arena
    Hub --> Dialogue
    Hub --> Debate
    Hub --> Dossier
    
    Dialogue --> ChatInterface
    Debate --> ComparisonView
    Debate --> ChatInterface
    Dossier --> PhilosopherCard
    
    Archive --> SidePanel
    Archive --> ChatInterface
    
    Dialogue --> API
    Debate --> API
    Arena --> API
    
    ChatAPI --> AI
    ConversationsAPI --> Prisma
    PhilosophersAPI --> Prisma
    
    Prisma --> Database
    AI --> OpenAI
    AI --> Anthropic
    
    Supabase --> Database
```

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant Prisma
    participant AI
    participant External

    User->>Frontend: Select Thinker(s)
    User->>Frontend: Enter Topic/Question
    
    Frontend->>API: POST /api/chat
    API->>AI: Send to AI Provider
    AI->>External: OpenAI/Anthropic
    
    External-->>AI: AI Response
    AI-->>API: Formatted Response
    API-->>Frontend: JSON Response
    
    Frontend->>Prisma: Save Conversation
    Prisma->>Database: Store in PostgreSQL
    
    User->>Frontend: Continue Conversation
    Frontend->>API: GET /api/chat?conversationId=xxx
    API->>Prisma: Fetch Messages
    Prisma->>Database: Query Messages
    Database-->>Prisma: Message History
    Prisma-->>API: Messages
    API-->>Frontend: Full Context
    
    Frontend-->>User: Display Response
```

## Data Model

```mermaid
erDiagram
    Philosopher {
        string id PK
        string name
        string era
        string tradition
        string bio
        string[] works
        string[] ideas
        string systemPrompt
        string imageUrl
        datetime createdAt
    }

    Conversation {
        string id PK
        string title
        string type "dialogue" "debate"
        string createdAt
        datetime updatedAt
    }

    Message {
        string id PK
        string conversationId FK
        string role "user" "assistant"
        string content
        datetime createdAt
    }

    Conversation ||--o{ Message : "has"
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Hub - Home/Dashboard with drag-and-drop
│   ├── arena/             # Arena - Dialogue & Debate interface
│   ├── dialogue/          # Dialogue Interface (single thinker)
│   ├── debate/            # Debate Chamber (multi-thinker)
│   ├── dossier/           # Thinker Dossiers
│   │   └── [id]/          # Individual dossier pages
│   ├── archive/           # Saved conversations
│   ├── settings/          # App settings
│   └── api/               # API routes
│       ├── chat/          # AI chat endpoint
│       ├── conversations/  # Conversation CRUD
│       └── philosophers/   # Thinker data
├── components/            # Reusable UI components
│   ├── Header.tsx         # Top header bar
│   ├── Navigation.tsx     # Bottom navigation bar
│   ├── Footer.tsx        # Page footer with links
│   ├── SidePanel.tsx      # Persistent archive/history sidebar
│   ├── HubClient.tsx      # Hub page client component
│   ├── PhilosopherCard.tsx
│   ├── ChatInterface.tsx
│   └── ComparisonView.tsx
└── lib/                   # Utilities
    ├── ai.ts              # OpenAI/Anthropic clients
    ├── db.ts              # Prisma client
    ├── philosopher-content.ts  # Extended content for thinkers
    └── supabase/          # Supabase helpers
```

## Thinkers Included

### Philosophers

| Name | Era | Tradition |
|------|-----|-----------|
| Socrates | 470-399 BCE | Western |
| Plato | 428-348 BCE | Western |
| Aristotle | 384-322 BCE | Western |
| Confucius | 551-479 BCE | Eastern |
| Lao Tzu | 6th century BCE | Eastern |
| Wang Yangming | 1472-1529 | Eastern |
| Nietzsche | 1844-1900 | Western |
| Simone de Beauvoir | 1908-1986 | Western |
| Frantz Fanon | 1925-1961 | African |

### Financiers

| Name | Category | Strategy |
|------|----------|----------|
| Warren Buffett | Value | Long-term value investing |
| Seth Klarman | Value | Deep value, activist investing |
| Ray Dalio | Macro | All-weather, principle-based |
| Stanley Druckenmiller | Macro | Global macro, currency trades |
| Jeff Gundlach | Macro | Bonds, fixed income |
| Nassim Taleb | Risk | Antifragility, tail risk |
| Howard Marks | Risk | Second-level thinking |
| Jim Simons | Quant | Mathematical trading systems |
| David Shaw | Quant | Computational finance |
| Morgan Housel | Behavioral | Psychology of money |

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | GET, POST | Fetch messages or send new chat |
| `/api/conversations` | GET, POST, DELETE, PATCH | List, create, delete, or rename conversations |
| `/api/philosophers` | GET | List all thinkers |

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
npm run db:push   # Push Prisma schema to database
npm run db:seed   # Seed database with thinkers
npm run db:studio # Open Prisma Studio
npm run test      # Run Playwright tests
```

## Roadmap

### Planned Features

- [ ] **User Authentication** — Sign up/login via Supabase Auth
- [ ] **User Profiles** — Save preferences and conversation history per user
- [ ] **More Thinkers** — Expand to include more philosophers and financiers
- [ ] **Conversation Export** — Export dialogues as PDF or Markdown
- [ ] **Mobile App** — React Native companion app
- [ ] **Rate Limiting** — Protect API endpoints from abuse
- [ ] **Caching** — Redis caching for thinker data
- [ ] **Analytics Dashboard** — Track usage and popular thinkers

### Known Limitations

- Currently single-user mode (no auth)
- Requires manual .env setup
- API responses depend on AI provider quality/quotas

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
