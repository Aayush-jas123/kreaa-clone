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
  saveHistory: () => void;
  undo: () => void;
  redo: () => void;
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
  past: [],
  future: [],
  
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
    set((state) => {
      // Only save history for adds, removes, or dimension changes implicitly
      // Dragging nodes updates history on node drag stop inside the component instead of here to prevent huge arrays
      return { nodes: applyNodeChanges(changes, state.nodes) };
    });
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
  runPipeline: async () => {
    const state = get();
    // Find all target tool nodes
    const targetNodes = state.nodes.filter(n => ['image', 'video', 'enhancer'].includes(n.type || ''));
    
    // Set loading state
    targetNodes.forEach(node => {
      state.updateNodeData(node.id, { isLoading: true, imageUrl: undefined, error: undefined });
    });

    // Run generations in parallel
    await Promise.all(
      targetNodes.map(async (node) => {
        // Retrieve connected prompt nodes for this target
        const incomingEdges = state.edges.filter(e => e.target === node.id);
        const sourceNodes = state.nodes.filter(n => incomingEdges.some(e => e.source === n.id));
        const promptNode = sourceNodes.find(n => n.type === 'prompt');
        const promptText = promptNode?.data?.prompt || "A futuristic city skyline at sunset, cyberpunk aesthetic";
        
        try {
          const res = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: promptText, type: node.type })
          });
          
          const data = await res.json();
          if (data.success) {
            get().updateNodeData(node.id, { isLoading: false, imageUrl: data.imageUrl, error: undefined });
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
  partialize: (state) => ({ nodes: state.nodes, edges: state.edges }),
}
));
