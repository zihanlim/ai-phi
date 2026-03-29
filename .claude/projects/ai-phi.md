# AI-Phi Project Context

## Project Overview
- **Type**: Next.js 15 web app (App Router)
- **Stack**: TypeScript, Tailwind CSS 4, Prisma ORM, Supabase, OpenAI/Anthropic APIs
- **Theme**: Neon-socratic dark theme with primary `#00FFA3`, secondary `#699CFF`

## Code Standards

### Before Every Commit — MANDATORY
1. Run `npm run lint` — fix all lint errors  
2. Run `npm run build` — fix all TypeScript/compilation errors
3. Only then: `git add -A && git commit && git push`

### File Patterns
- Client components: `"use client"` directive required
- Use `Link` from `next/link` instead of `<a>` tags
- Use Tailwind utility classes over custom CSS
- `Navigation.tsx` bottom nav: Hub, Debate, Dialogue, Dossier, Archive, Settings

### API Routes
- `POST /api/chat`: body = `{ philosopherIds: string[], message: string, conversationId?: string }`
  - Returns: `{ results: [{philosopherId, philosopherName, response, error}], conversationId }`
  - Creates conversation automatically if `conversationId` not provided
- `GET /api/conversations?userId=xxx`: returns transformed conversations with `philosopherIds`, `philosopherNames`, `type`, `lastMessage`
- `DELETE /api/conversations?id=xxx`

### Critical Fixes (do not repeat mistakes)
- ❌ Never use `value=""` locked on textarea — always bind to state  
- ❌ Never use `data.responses` — API returns `data.results`
- ❌ Never push code that fails `npm run build`
- ❌ Never use `useRouter` without importing from `next/navigation`
