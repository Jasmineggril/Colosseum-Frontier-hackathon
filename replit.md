# DreamVault

DreamVault transforms human dreams into AI-generated interactive digital universes powered by Solana — a cinematic, cyberpunk-themed Web3/AI demo experience.

## Run & Operate

- `pnpm --filter @workspace/dreamvault run dev` — run the frontend (port auto-assigned)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + TailwindCSS + Framer Motion
- Fonts: Orbitron (display/headings) + Inter (body)
- Routing: wouter
- No backend — fully frontend demo

## Where things live

- `artifacts/dreamvault/src/pages/Home.tsx` — main page assembling all sections
- `artifacts/dreamvault/src/components/` — all UI sections and components
- `artifacts/dreamvault/src/index.css` — dark cyberpunk theme + custom CSS classes
- `artifacts/dreamvault/public/nox-wolf.jpeg` — NOX wolf image (copied from attached_assets)

## Architecture decisions

- No backend — purely a frontend hackathon demo with simulated AI generation flow
- Wolf image copied to `public/` (not imported via @assets alias) due to emoji characters in filename
- Dark-only app — CSS variables set to dark cyberpunk palette for both `:root` and `.dark`
- Framer Motion handles all animations: hero entrance, scroll reveals, dream result stagger
- Dream generator uses local React state to simulate a 6-step AI loading sequence

## Product

- Hero section with cinematic animated background and slogan
- NOX AI Wolf spirit guide (floating bottom-right widget with typewriter chat)
- Dream Generator with textarea + category selection + loading animation cycling through 5 phrases
- Dream Result card revealing AI-generated dream with traits, rarity, lore, and "Mint Dream NFT" CTA
- Features, How It Works, AI Pipeline, Community Gallery, Testimonials, FAQ, Footer sections

## User preferences

- Hackathon-quality, premium, emotional, cinematic feel
- Dark cyberpunk: neon purple/blue gradients, glassmorphism, particles, parallax
- Framer Motion animations throughout
- No emojis in UI

## Gotchas

- Wolf image filename contains emoji — must be served from `public/` not imported via @assets
- Google Fonts @import must be the very first line in index.css
- This is frontend-only — no DATABASE_URL or API server needed

## Pointers

- See the `pnpm-workspace` skill for workspace structure
- See the `react-vite` skill for frontend conventions
