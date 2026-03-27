"use client";

import { useCallback, useRef, useEffect, Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';
import { ReactFlow, Background, ReactFlowProvider, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useEditorStore } from '@/store/editorStore';
import PromptNode from '@/components/node-editor/nodes/PromptNode';
import ImageNode from '@/components/node-editor/nodes/ImageNode';
import ImageInputNode from '@/components/node-editor/nodes/ImageInputNode';
import SettingsNode from '@/components/node-editor/nodes/SettingsNode';
import LLMNode from '@/components/node-editor/nodes/LLMNode';
import Toolbar from '@/components/ui/Toolbar';
import { Play, Download, Upload, Zap, RotateCcw } from 'lucide-react';

const nodeTypes = {
  prompt: PromptNode,
  image: ImageNode,
  video: ImageNode,
  enhancer: ImageNode,
  image_input: ImageInputNode,
  settings: SettingsNode,
  llm: LLMNode,
};

function FlowCanvasInner() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('id');
  const loadProject = useEditorStore((state) => state.loadProject);

  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }
  }, [projectId, loadProject]);
  
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, setNodes } = useEditorStore(
    useShallow((state) => ({
      nodes: state.nodes,
      edges: state.edges,
      onNodesChange: state.onNodesChange,
      onEdgesChange: state.onEdgesChange,
      onConnect: state.onConnect,
      setNodes: state.setNodes,
    }))
  );

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onNodeDragStop = useCallback(() => {
    useEditorStore.getState().saveHistory();
  }, []);

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Simple heuristic: if it's not predefined, fallback to 'image' for visual display
      const nodeType = nodeTypes[type as keyof typeof nodeTypes] ? type : 'image';

      const newNode = {
        id: `node-${Date.now()}`,
        type: nodeType as any,
        position,
        data: { label: `${type} node` },
      };

      useEditorStore.getState().saveHistory();
      setNodes([...nodes, newNode]);
    },
    [nodes, setNodes, screenToFlowPosition]
  );

  return (
    <div className="flex-1 w-full bg-[#0e0e0e] relative" ref={reactFlowWrapper}>
      <ReactFlow 
        nodes={nodes} 
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes as any}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeDragStop={onNodeDragStop}
        snapToGrid={true}
        snapGrid={[20, 20]}
        fitView
        colorMode="dark"
        proOptions={{ hideAttribution: true }}
        minZoom={0.2}
      >
        <Background color="#333" gap={20} size={1.5} />
        <Toolbar />
      </ReactFlow>
    </div>
  );
}

function FlowCanvas() {
  return (
    <Suspense fallback={<div className="flex-1 w-full bg-[#0e0e0e] flex items-center justify-center text-zinc-500">Loading Canvas...</div>}>
      <FlowCanvasInner />
    </Suspense>
  );
}

export default function EditorPage() {
  const projectName = useEditorStore((state) => state.projectName);
  const setProjectName = useEditorStore((state) => state.setProjectName);
  const saveProject = useEditorStore((state) => state.saveProject);
  const [credits, setCredits] = useState<number | null>(null);

  const fetchCredits = useCallback(async () => {
    try {
      const res = await fetch('/api/user/credits');
      const data = await res.json();
      if (data.credits !== undefined) setCredits(data.credits);
    } catch (err) {}
  }, []);

  useEffect(() => {
    fetchCredits();
    const interval = setInterval(fetchCredits, 20000);
    return () => clearInterval(interval);
  }, [fetchCredits]);

  const handleExport = () => {
    const { nodes, edges } = useEditorStore.getState();
    const data = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projectName}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const { nodes, edges } = JSON.parse(content);
          if (nodes && edges) {
            useEditorStore.getState().setNodes(nodes);
            useEditorStore.getState().setEdges(edges);
          }
        } catch (error) {
          console.error("Failed to parse JSON", error);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Editor Header */}
      <div className="w-full h-20 border-b border-zinc-800 bg-[#111111] flex items-center px-8 justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 rounded bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-900/40">
             <Zap className="w-5 h-5 text-white" />
           </div>
           <div>
              <input 
                type="text" 
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="bg-transparent border-none text-xl font-bold text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 rounded px-1 -ml-1 w-full max-w-sm"
                placeholder="Untitled Project"
              />
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-[10px] text-zinc-500 flex items-center gap-1.5 font-medium uppercase tracking-wider">
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   Cloud Sync
                </p>
                <span className="text-zinc-700 text-[10px]">•</span>
                <div className="flex items-center gap-1.5 text-[10px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded border border-amber-500/20">
                   <Zap className="w-2.5 h-2.5 fill-current" />
                   <span className="font-bold">{credits !== null ? credits : '...'} Credits</span>
                </div>
              </div>
           </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => saveProject()}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all text-sm font-bold shadow-lg shadow-blue-900/20 active:scale-95"
          >
            Save to Cloud
          </button>

          <div className="h-8 w-px bg-zinc-800 mx-2" />
          
          <button onClick={handleImport} className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-full transition-colors flex items-center justify-center border border-zinc-700/50" title="Import Workflow">
            <Upload className="w-4 h-4" />
          </button>
          <button onClick={handleExport} className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-full transition-colors flex items-center justify-center border border-zinc-700/50" title="Export Workflow">
            <Download className="w-4 h-4" />
          </button>

          <div className="h-8 w-px bg-zinc-800 mx-2" />

          <button 
            onClick={() => useEditorStore.getState().runPipeline()}
            className="bg-zinc-100 hover:bg-white text-black px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 shadow-xl shadow-white/5 active:scale-95"
          >
             Run Pipeline <Play className="w-4 h-4 fill-current" />
          </button>
          
          <button 
            onClick={() => {
              if (confirm('Clear entire canvas?')) {
                useEditorStore.getState().setNodes([]);
                useEditorStore.getState().setEdges([]);
                useEditorStore.getState().setProjectName('Untitled Project');
              }
            }} 
            className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all border border-red-500/20 flex items-center justify-center"
            title="Clear Canvas"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Sub Header / Tabs */}
      <div className="w-full bg-[#111111] border-b border-zinc-800 px-8 py-3 flex gap-6 text-xs font-bold uppercase tracking-widest z-10">
         <button className="text-white border-b-2 border-blue-500 pb-3 -mb-3">Pipeline</button>
         <button className="text-zinc-500 hover:text-zinc-300">Outputs</button>
         <button className="text-zinc-500 hover:text-zinc-300">History</button>
         <button className="text-zinc-500 hover:text-zinc-300">Settings</button>
      </div>

      <ReactFlowProvider>
        <FlowCanvas />
      </ReactFlowProvider>
    </div>
  );
}
