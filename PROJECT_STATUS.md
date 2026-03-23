# Krea Clone - Project Status & Context

> **Note to AI Assistants:** This file serves as the single source of truth for the project's current state, architecture, and upcoming goals. You MUST read this file when starting a new conversation to immediately regain context without needing the user to explain everything from scratch.

## 1. Project Overview
A web-based Node Editor application inspired by Krea AI, allowing users to connect various AI tools (like Text-to-Image and Video generation) into processing pipelines.

## 2. Tech Stack
- **Framework:** Next.js (App Router), React 19
- **State Management:** Zustand (with `persist` middleware for local storage)
- **Canvas/Nodes:** React Flow (`@xyflow/react`)
- **Styling:** Tailwind CSS, Lucide React Icons

## 3. Current Completed Features (Phases 1-10)
✅ **Canvas & Nodes:** Fully working drag-and-drop React Flow canvas inside `src/app/editor/page.tsx`. Custom nodes (Prompt, Image/Video/Enhancer) with automatic visual handles.
✅ **State Persistence:** `src/store/editorStore.ts` automatically perists nodes and edges to localStorage.
✅ **Canvas Tools:** Bottom toolbar with Undo/Redo, Zoom In/Out, and Fit View. Canvas supports grid snapping.
✅ **Export/Import:** Workflows can be exported to JSON and re-imported via top navbar buttons.
✅ **Pipeline Execution:** A simulated backend `/api/generate` route takes target nodes and processes generations (currently returning dummy aesthetic images from Unsplash).

## 4. Current Architecture Notes
- **Store (`src/store/editorStore.ts`):** Manages the global state of the canvas. Contains custom history logic (`past`/`future` arrays) for undo/redo manually triggered on node drag stops and connections. Contains `runPipeline` behavior to iterate through nodes and trigger backend generation.
- **Node Components (`src/components/node-editor/nodes/`):** 
  - `PromptNode`: Captures text input.
  - `ImageNode`: Displays generated output, handles loading states, error states, and image downloading.
- **API (`src/app/api/generate/route.ts`):** The POST endpoint for triggering generations. Currently simulates a 2-second delay and returns a placeholder link.

## 5. Next Planned Phases
- **Real API Integration:** Swap out the dummy `/api/generate` logic with real Replicate/OpenAI SDKs once API keys are provided.
- **Advanced Nodes:** Build ControlNet, LoRA, and Image-to-Image nodes.
- **User Authentication & Cloud Sync:** Move away from `localStorage` to Supabase/Firebase for persistent user accounts and cloud project saves.
