# DreamVault - Colosseum Frontier Hackathon Submission

DreamVault is our official project for the Colosseum Frontier Hackathon.

We turn human dreams into cinematic, AI-inspired digital universes through a high-impact generation flow designed to feel magical, fast, and memorable for users and judges.

## Hackathon

This site is built to compete in Colosseum Frontier:
https://colosseum.com/frontier

## Live Product

Production (Vercel):
https://dreamvault.vercel.app

## Product Vision (Pitch)

DreamVault explores a simple but powerful idea: every dream can become a living digital world.

Users describe a dream, and the platform transforms it into a unique universe concept with cinematic reveal moments, rich lore, and rarity-driven identity.

Core user-facing highlights:

- Dream prompt to universe concept flow
- Cinematic reveal and immersive generation UX
- Dynamic lore, traits, and rarity generation
- Community-style gallery and live activity vibe
- Web3-inspired interaction layer (wallet-style flow)

## Technical Snapshot

Monorepo structure:

- `artifacts/dreamvault`: frontend (Vite + React + TypeScript + Framer Motion)
- `artifacts/api-server`: backend API layer
- `lib/`: shared packages (`api-client-react`, `api-zod`, `api-spec`)

## Integration Checklist (Git, Vercel, Supabase)

1. Git
- Main branch: `main`
- Keep production-triggering commits pushed to `origin/main`.

2. Vercel
- Production URL: https://dreamvault.vercel.app
- Vercel project should build from this repository and branch `main`.
- Expected output directory is configured in `vercel.json`.

3. Supabase
- Frontend auth expects `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- **Local setup**: Copy `artifacts/dreamvault/.env.example` to `.env.local` and fill in your values.
- **Vercel production**: 
  - Go to Vercel Project Settings > Environment Variables
  - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for **Production** environment
  - (Optional) Also add for Preview if testing)
  - **IMPORTANT: After adding variables, trigger a redeploy** (git push or manual redeploy from Vercel)
  - See `artifacts/dreamvault/.env.production.example` for step-by-step instructions
- Get API keys from Supabase Settings: https://app.supabase.com/project/YOUR_PROJECT_ID/settings/api

## Quick Verification

```bash
pnpm -w run typecheck
pnpm -w --filter @workspace/dreamvault build
curl -I https://dreamvault.vercel.app
```

Engineering focus for hackathon delivery:

- Fast production deployment on Vercel
- Type-safe frontend/backend integration patterns
- Polished interaction design with animated state transitions
- Iterative UX validation in production

## Current Status

- Live and accessible in production
- Built specifically for hackathon presentation and judging
