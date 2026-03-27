import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';

export type EditorState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  updateNodeData: (nodeId: string, data: any) => void;
  deleteNode: (nodeId: string) => void;
  runPipeline: () => void;
  past: { nodes: Node[]; edges: Edge[] }[];
  future: { nodes: Node[]; edges: Edge[] }[];
  projectName: string;
  projectId: string | null;
  setProjectName: (name: string) => void;
  saveHistory: () => void;
  undo: () => void;
  redo: () => void;
  saveProject: () => Promise<void>;
  loadProject: (id: string) => Promise<void>;
};

// Initial placeholder nodes
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'prompt',
    position: { x: 100, y: 200 },
    data: { prompt: 'A futuristic city skyline at sunset, cyberpunk aesthetic' },
  },
  {
    id: '2',
    type: 'image',
    position: { x: 500, y: 150 },
    data: {},
  },
];
const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#6366f1' } }
];

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      nodes: initialNodes,
      edges: initialEdges,
      projectName: 'Untitled Project',
      projectId: null,
      past: [],
      future: [],

      setProjectName: (name) => set({ projectName: name }),

      saveHistory: () => {
        set((state) => ({
          past: [...state.past, { nodes: state.nodes, edges: state.edges }],
          future: [],
        }));
      },

      undo: () => {
        set((state) => {
          if (state.past.length === 0) return state;
          const previous = state.past[state.past.length - 1];
          const newPast = state.past.slice(0, state.past.length - 1);
          return {
            past: newPast,
            future: [{ nodes: state.nodes, edges: state.edges }, ...state.future],
            nodes: previous.nodes,
            edges: previous.edges,
          };
        });
      },

      redo: () => {
        set((state) => {
          if (state.future.length === 0) return state;
          const next = state.future[0];
          const newFuture = state.future.slice(1);
          return {
            past: [...state.past, { nodes: state.nodes, edges: state.edges }],
            future: newFuture,
            nodes: next.nodes,
            edges: next.edges,
          };
        });
      },

      onNodesChange: (changes: NodeChange[]) => {
        set((state) => ({
          nodes: applyNodeChanges(changes, state.nodes),
        }));
      },
      onEdgesChange: (changes: EdgeChange[]) => {
        set((state) => ({
          edges: applyEdgeChanges(changes, state.edges),
        }));
      },
      onConnect: (connection: Connection) => {
        get().saveHistory();
        set((state) => ({
          edges: addEdge({ ...connection, animated: true, style: { stroke: '#6366f1' } }, state.edges),
        }));
      },
      setNodes: (nodes: Node[]) => {
        get().saveHistory();
        set({ nodes });
      },
      setEdges: (edges: Edge[]) => {
        get().saveHistory();
        set({ edges });
      },
      updateNodeData: (nodeId: string, data: any) => {
        get().saveHistory();
        set({
          nodes: get().nodes.map((node) =>
            node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
          ),
        });
      },
      deleteNode: (nodeId: string) => {
        get().saveHistory();
        set({
          nodes: get().nodes.filter((node) => node.id !== nodeId),
          edges: get().edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
        });
      },

      saveProject: async () => {
        const { projectId, projectName, nodes, edges } = get();
        try {
          const res = await fetch('/api/projects', {
            method: 'POST',
            body: JSON.stringify({ id: projectId, name: projectName, nodes, edges }),
          });
          if (res.ok) {
            const saved = await res.json();
            set({ projectId: saved.id });
          }
        } catch (err) {
          console.error('Cloud save failed:', err);
        }
      },

      loadProject: async (id: string) => {
        try {
          const res = await fetch(`/api/projects?id=${id}`);
          if (res.ok) {
            const data = await res.json();
            set({
              nodes: data.nodes,
              edges: data.edges,
              projectId: data.id,
              projectName: data.name
            });
          }
        } catch (err) {
          console.error('Load failed:', err);
        }
      },

      runPipeline: async () => {
        const state = get();
        // Find all generation target nodes
        const targetNodes = state.nodes.filter(n => ['image', 'video', 'enhancer'].includes(n.type || ''));

        // Set loading state on all target nodes
        targetNodes.forEach(node => {
          state.updateNodeData(node.id, { isLoading: true, imageUrl: undefined, error: undefined });
        });

        // Run generations in parallel
        await Promise.all(
          targetNodes.map(async (node) => {
            // Traverse all edges pointing to this node
            const incomingEdges = state.edges.filter(e => e.target === node.id);
            const sourceNodes = state.nodes.filter(n => incomingEdges.some(e => e.source === n.id));

            // Grab connected prompt text
            const promptNode = sourceNodes.find(n => n.type === 'prompt');
            const promptText = (promptNode?.data?.prompt as string) || "A futuristic city skyline at sunset, cyberpunk aesthetic";

            // Grab optional connected base image
            const imageInputNode = sourceNodes.find(n => n.type === 'image_input');
            const baseImageUrl = imageInputNode?.data?.baseImageUrl as string | undefined;

            // Grab optional connected settings
            const settingsNode = sourceNodes.find(n => n.type === 'settings');
            const guidance_scale = (settingsNode?.data?.guidance_scale as number) ?? 7.5;
            const steps = (settingsNode?.data?.steps as number) ?? 30;
            const width = (settingsNode?.data?.width as number) ?? 1024;
            const height = (settingsNode?.data?.height as number) ?? 1024;

            try {
              const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: promptText, type: node.type, baseImageUrl, guidance_scale, steps, width, height })
              });

              const data = await res.json();

              if (data.success) {
                if (data.isAsync) {
                  const pollRunStatus = async () => {
                    const maxAttempts = 60;
                    for (let i = 0; i < maxAttempts; i++) {
                      const statusRes = await fetch(`/api/run-status?runId=${data.runId}`);
                      const statusData = await statusRes.json();
                      if (statusData.status === "SUCCESS") {
                        get().updateNodeData(node.id, { isLoading: false, imageUrl: statusData.output.imageUrl });
                        return;
                      } else if (statusData.status === "FAILED" || statusData.status === "SYSTEM_FAILURE") {
                        get().updateNodeData(node.id, { isLoading: false, error: "Background task failed", imageUrl: undefined });
                        return;
                      }
                      await new Promise(r => setTimeout(r, 2000));
                    }
                    get().updateNodeData(node.id, { isLoading: false, error: "Timeout waiting for job", imageUrl: undefined });
                  };
                  pollRunStatus();
                } else {
                  get().updateNodeData(node.id, { isLoading: false, imageUrl: data.imageUrl, error: undefined });
                }
              } else {
                get().updateNodeData(node.id, { isLoading: false, error: data.error || "Generation failed", imageUrl: undefined });
              }
            } catch (error) {
              get().updateNodeData(node.id, { isLoading: false, error: "Network Error", imageUrl: undefined });
            }
          })
        );
      }
    }),
    {
      name: 'krea-editor-storage',
      partialize: (state) => ({ nodes: state.nodes, edges: state.edges, projectName: state.projectName, projectId: state.projectId }),
    }
  )
);
