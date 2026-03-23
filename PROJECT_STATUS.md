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

## 4. Known Bugs (Fix Next Session)

### Bug 1: Gemini LLM 404 Error
- **Symptom:** Clicking "Ask Gemini" shows 500 error in node
- **Cause:** Model name `gemini-2.0-flash` returns 404 — the API key may only have access to specific model versions
- **Fix:** In `src/app/api/llm/route.ts` line ~30, try these model names in order until one works:
  1. `gemini-2.0-flash-exp`
  2. `gemini-1.5-flash-latest`
  3. `gemini-1.5-flash`
  4. `gemini-pro`

### Bug 2: Image Node Shows "Generated result" (alt text) Instead of Image
- **Symptom:** After Run Pipeline, the ImageNode shows "Generated result" text (the `<img>` alt) instead of the actual image
- **Cause:** `isLoading` is set to `false` when `/api/generate` returns the proxy URL, but the image itself takes 15-20s to generate on Pollinations. The `<img>` tag shows alt text while loading.
- **Fix:** In `src/components/node-editor/nodes/ImageNode.tsx`, add local `useState` for `imgLoaded`. In the `<img>` tag, add `onLoad={() => setImgLoaded(true)}` and `onError={() => setImgError(true)}`. Show spinner until `imgLoaded` is true or there's an error.

## 5. Environment Variables
File: `d:\hola\.env.local` (git-ignored)
```
OPENAI_API_KEY=...      # Optional (DALL-E 3 is commented out in generate route)
GEMINI_API_KEY=...      # Required for Gemini LLM node
```

## 6. Next Steps (When Resuming)
1. Fix Bug 1 (Gemini model name) — ~5 min
2. Fix Bug 2 (ImageNode loading state) — ~15 min
3. Evaluate integrating Trigger.dev for background task execution (spec requirement)
4. Add Transloadit for file uploads on ImageInputNode
