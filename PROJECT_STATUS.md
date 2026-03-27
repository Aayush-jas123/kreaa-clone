# Krea Clone - Project Status & Context

> **Note to AI Assistants:** Read this file at the start of every session to immediately regain context. Do NOT ask the user to explain the current state.

## 1. Project Overview
A Next.js node-editor app inspired by Krea AI. Users connect AI tool nodes (Prompt, Generation, LLM, Settings, ImageInput) into pipelines and run them to generate real images.

- **Repo:** https://github.com/Aayush-jas123/kreaa-clone
- **Dev:** `npm run dev` → http://localhost:3000
- **Stack:** Next.js 16 (App Router), React 19, React Flow (`@xyflow/react`), Zustand (with `persist`), Tailwind CSS v4, Lucide Icons, `@google/generative-ai`, Zod

## 2. Architecture

### Routes
| Route | Purpose |
|---|---|
| `/` | Home / dashboard page |
| `/editor` | Node editor canvas page |
| `/api/generate` | POST – Image generation via Pollinations.ai |
| `/api/proxy-image` | GET – Server-side proxy that fetches Pollinations image and streams to browser |
| `/api/llm` | POST – Calls Google Gemini API for text generation |

### Key Files
| File | Purpose |
|---|---|
| `src/store/editorStore.ts` | Global Zustand store. Persists nodes+edges to localStorage. Has manual undo/redo (past/future arrays). `runPipeline()` traverses all generation nodes, finds connected Prompt/ImageInput/Settings nodes, calls `/api/generate` |
| `src/components/Sidebar.tsx` | Left sidebar with draggable tool items |
| `src/config/tools.ts` | Tool catalog array (Gemini LLM, Add Image, Generation, Video, Enhancer, Settings) |
| `src/app/editor/page.tsx` | Main editor page with ReactFlow canvas + nodeTypes registry |
| `src/components/ui/Toolbar.tsx` | Floating bottom toolbar with Undo, Redo, Zoom In/Out, Fit View |

### Node Types
| Node | File | Description |
|---|---|---|
| `prompt` | `PromptNode.tsx` | Text input for generation prompts |
| `image` / `video` / `enhancer` | `ImageNode.tsx` | Displays generated image, has download button, shows error state |
| `image_input` | `ImageInputNode.tsx` | Upload a base image for img2img tasks |
| `settings` | `SettingsNode.tsx` | Sliders for guidance_scale, steps, aspect ratio (1:1/16:9/9:16) |
| `llm` | `LLMNode.tsx` | Gemini LLM node with system prompt + user prompt + response display |

## 3. Completed Phases (1-13)
- ✅ Project setup, routing, layout, Sidebar
- ✅ Zustand store with persist + undo/redo history
- ✅ React Flow canvas with drag-and-drop node creation
- ✅ Custom nodes: Prompt, Image, ImageInput, Settings, Gemini LLM
- ✅ Canvas toolbar: Undo, Redo, Zoom, Fit View, grid snap
- ✅ Pipeline execution via `/api/generate` (Pollinations.ai)
- ✅ Export/Import workflow as JSON
- ✅ Image download from ImageNode
- ✅ `/api/llm` with `@google/generative-ai` + Zod validation
- ✅ `/api/proxy-image` server-side image proxy
- ✅ **Phase 14:** Clerk Authentication and Prisma PostgreSQL integrated.
- ✅ **Phase 15:** Cloud State Migration (Projects API, Home Dashboard, Editor Sync).

## 4. Known Bugs (Fixed ✅)
- ✅ **Gemini LLM 404 Error:** Fixed using a sequential model-fallback system.
- ✅ **Image Node Loading State:** Fixed by tracking actual DOM `onLoad` events for visual feedback.

## 5. Environment Variables
File: `d:\hola\.env.local` (git-ignored)
```
OPENAI_API_KEY=...      # Optional (DALL-E 3 is commented out in generate route)
GEMINI_API_KEY=...      # Required for Gemini LLM node

# New Integrations
TRIGGER_SECRET_KEY=...
NEXT_PUBLIC_TRANSLOADIT_AUTH_KEY=...
```

## 6. Project Roadmap: Phases 14-17 (Remaining Work)

> **Deep thought on Vercel & Database:** "Should we set up the database and Vercel now or later?"
> **Answer:** **Right now** is the optimal time for the Database & Auth, but **Vercel** can be done parallelly or right after. 
> - **Why Auth & DB now?** The core canvas and generation tools work perfectly. However, the next logical step for the app is saving workflows, managing images, and tracking limits. If we continue building purely on `localStorage`, we will waste time tearing it apart later. We should introduce Prisma and Clerk *now* to lock in the true cloud architecture.
> - **Why Vercel?** We should deploy early. Trigger.dev and external cloud webhooks thrive on having real verifiable endpoints.

### Phase 14: Database & Authentication
- [x] **Auth:** Configure Clerk (`@clerk/nextjs`) to protect the dashboard and editor routes.
- [x] **Database:** Setup Prisma ORM connected to a Postgres instance (Supabase or Neon).
- [x] **Schema Design:** `User` (credits), `Project` (JSON dump of React Flow nodes/edges), and `Generations` (history of images/text generated).

### Phase 15: Cloud State Migration
- ✅ Implement the `/` Dashboard layout to fetch the user's saved `Projects` from Prisma.
- ✅ Hook the "Save" function inside the Editor to push `editorStore` JSON to a new `/api/projects` endpoint.

### Phase 16: Credits & Generation Limits
- ✅ Sub-feature: Track generative actions (1 image = 1 credit). Deduct from `User` table recursively on `/api/generate` and `/api/llm`.
- ✅ Add UI badges to show the "Credits" count in the Sidebar and Editor header.
- [ ] Stripe integration for top-ups (Next phase). credits, including `stripe/webhooks` endpoint processing.

### Phase 17: Production Deployment & Polish
- [ ] Deploy to Vercel (link the GitHub repository).
- [ ] Configure all Vercel environment variables securely.
- [ ] *Optimization:* Thanks to our early `Trigger.dev` integration, standard Vercel 10s Serverless timeouts will not block any Pollinations or heavy AI requests in production!
