# PROJECT STATUS: Krea Clone

## 1. Project Overview
A production-ready Krea AI clone with node-based image and text generation, user authentication, cloud state persistence, and a credits-based monetization system.

## 2. Core Features
- ✅ **Node Editor**: Drag-and-drop workflow with support for Prompt, Image, LLM, and Image Input nodes.
- ✅ **AI Integration**: Image generation (Pollinations.ai / Trigger.dev) and Text generation (Gemini API with model fallback).
- ✅ **Authentication**: Clerk-protected routes and user profile management.
- ✅ **Cloud Migration**: Neon PostgreSQL (via Prisma) for state persistence.
- ✅ **Dashboard**: Home page with a "Recent Projects" grid fetching from the cloud.
- ✅ **Credits System**: 50 starting credits per user. 1 credit deducted per AI action. Real-time balance UI in Sidebar and Editor.

## 3. Current Phase: Phase 15 & 16 (Cloud Migration & Credits) [COMPLETED]
- ✅ **Projects API**: Fully functional CRUD at `/api/projects`.
- ✅ **Editor Cloud Sync**: Redesigned Editor header with Project Renaming, "Save to Cloud" button, and automatic loading via `?id=...`.
- ✅ **User Synchronization**: Automated User creation in Prisma on first login via Clerk.
- ✅ **Credits UI**: Aesthetic credits badges in both the Sidebar and the Editor header.
- ✅ **API Protection**: Generation routes now verify and deduct 1 credit per success.
- ✅ **Production Setup**: `package.json` now includes `postinstall: prisma generate` for Vercel.

## 4. Known Blockers & Next Steps
- ⚠️ **Blocker: Local P1001 Error**: Currently, the local dev server cannot reach the Neon database (`Can't reach database server`). 
    *   *Remedy*: Code has been committed and **pushed to GitHub** (`212f87e`) for Vercel deployment.
    *   *Wait*: Deploying to Vercel (Step 566 instructions) often resolves local networking/proxy issues.
- 🚀 **Next Phase: Phase 16 (Stripe)**: Integrate Stripe Checkout for purchasing more credits.
- 🚀 **Phase 17**: Final production polish and Vercel deployment verification.

## 5. Technical Stack
- **Framework**: Next.js 16.2.1 (App Router + Turbopack)
- **Frontend**: React 19, Tailwind CSS, Lucide Icons, xyflow/react
- **Backend**: Next.js API Routes, Clerk (Auth), Prisma (ORM), Neon (PostgreSQL)
- **AI**: Google Generative AI (Gemini), Pollinations.ai, Trigger.dev
- **State**: Zustand (with Persist/Undo/Redo)

## 6. Last Activity Summary (2026-03-27 17:21)
Commited and Pushed all cloud-migration and credits-logic code. Provided instructions for Vercel import and Environment Variable setup (recommending `-pooler` URL with `pgbouncer=true` for Vercel). Deployment is pending user's dashboard action.
