"use client";

import { useMemo } from 'react';
import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  { 
    id: '1', 
    type: 'default',
    position: { x: 250, y: 150 }, 
    data: { label: 'Start connecting tools...' },
    style: { background: '#18181b', color: 'white', border: '1px solid #3f3f46', borderRadius: '8px', padding: '16px' }
  },
  { 
    id: '2', 
    type: 'default',
    position: { x: 500, y: 250 }, 
    data: { label: 'Generated Image' },
    style: { background: '#18181b', color: 'white', border: '1px solid #3f3f46', borderRadius: '8px', padding: '16px' }
  },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#6366f1' } }];

export default function EditorPage() {
  const nodes = useMemo(() => initialNodes, []);
  const edges = useMemo(() => initialEdges, []);

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
        <button className="bg-white hover:bg-zinc-200 text-black px-6 py-2.5 rounded-full text-sm font-semibold transition-colors flex items-center gap-2">
          New Workflow <span className="text-lg leading-none">&rarr;</span>
        </button>
      </div>
      
      <div className="w-full bg-[#111111] border-b border-zinc-800 px-8 py-3 flex gap-6 text-sm font-medium z-10">
         <button className="text-white">Projects</button>
         <button className="text-zinc-500 hover:text-zinc-300">Apps</button>
         <button className="text-zinc-500 hover:text-zinc-300">Examples</button>
         <button className="text-zinc-500 hover:text-zinc-300">Templates</button>
      </div>

      <div className="flex-1 w-full bg-[#0e0e0e] relative">
        <ReactFlow 
          nodes={nodes} 
          edges={edges}
          fitView
          colorMode="dark"
          proOptions={{ hideAttribution: true }}
          minZoom={0.2}
        >
          <Background color="#333" gap={20} size={1.5} />
          <Controls position="bottom-right" className="bg-zinc-900 border-zinc-800 fill-white" />
        </ReactFlow>
      </div>
    </div>
  );
}
