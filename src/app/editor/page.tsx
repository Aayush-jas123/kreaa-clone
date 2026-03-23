"use client";

import { useCallback, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { ReactFlow, Background, Controls, ReactFlowProvider, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useEditorStore } from '@/store/editorStore';
import PromptNode from '@/components/node-editor/nodes/PromptNode';
import ImageNode from '@/components/node-editor/nodes/ImageNode';
import Toolbar from '@/components/ui/Toolbar';

const nodeTypes = {
  prompt: PromptNode,
  image: ImageNode,
  video: ImageNode,
  enhancer: ImageNode,
};

function FlowCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  
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
        type: nodeType,
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
        nodeTypes={nodeTypes}
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

import { Play, Download, Upload } from 'lucide-react';

export default function EditorPage() {
  const handleExport = () => {
    const { nodes, edges } = useEditorStore.getState();
    const data = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `krea-workflow-${Date.now()}.json`;
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
      <div className="w-full h-20 border-b border-zinc-800 bg-[#111111] flex items-center px-8 justify-between shrink-0 shadow-sm z-10">
        <div>
           <h2 className="text-xl font-bold text-white flex items-center gap-2">
             <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center mr-2">
               <div className="w-3 h-3 bg-white rounded-full mx-0.5" />
               <div className="w-3 h-3 bg-white/50 rounded-full mx-0.5" />
             </div>
             Node Editor
           </h2>
           <p className="text-xs text-zinc-400 mt-1 pl-12 line-clamp-1">
             Nodes is the most powerful way to operate Krea. Connect every tool and model into complex automated pipelines.
           </p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleImport} className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full transition-colors flex items-center justify-center" title="Import Workflow">
            <Upload className="w-4 h-4" />
          </button>
          <button onClick={handleExport} className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full transition-colors flex items-center justify-center mr-2" title="Export Workflow">
            <Download className="w-4 h-4" />
          </button>

          <button 
            onClick={() => useEditorStore.getState().runPipeline()}
            className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-purple-900/20"
          >
            Run Pipeline <Play className="w-4 h-4" />
          </button>
          <button 
            onClick={() => {
              useEditorStore.getState().setNodes([]);
              useEditorStore.getState().setEdges([]);
            }} 
            className="bg-white hover:bg-zinc-200 text-black px-6 py-2.5 rounded-full text-sm font-semibold transition-colors flex items-center gap-2"
          >
            New Workflow <span className="text-lg leading-none">&rarr;</span>
          </button>
        </div>
      </div>
      
      <div className="w-full bg-[#111111] border-b border-zinc-800 px-8 py-3 flex gap-6 text-sm font-medium z-10">
         <button className="text-white">Projects</button>
         <button className="text-zinc-500 hover:text-zinc-300">Apps</button>
         <button className="text-zinc-500 hover:text-zinc-300">Examples</button>
         <button className="text-zinc-500 hover:text-zinc-300">Templates</button>
      </div>

      <ReactFlowProvider>
        <FlowCanvas />
      </ReactFlowProvider>
    </div>
  );
}
