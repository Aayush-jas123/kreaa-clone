"use client";

import { Type, Image as ImageIcon, Cpu, Settings, FileImage, Sparkles, Video } from "lucide-react";

const NODE_TYPES = [
  { type: 'prompt', label: 'Prompt', icon: Type, color: 'text-zinc-400' },
  { type: 'llm', label: 'LLM Block', icon: Cpu, color: 'text-purple-400' },
  { type: 'image', label: 'Image Output', icon: ImageIcon, color: 'text-emerald-400' },
  { type: 'image_input', label: 'Image Input', icon: FileImage, color: 'text-blue-400' },
  { type: 'settings', label: 'Settings', icon: Settings, color: 'text-zinc-500' },
];

export default function NodePalette() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 p-2 bg-[#1a1a1a]/80 backdrop-blur-md border border-zinc-800 rounded-2xl shadow-2xl z-50">
      <div className="px-2 py-2 mb-1">
        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest text-center">Nodes</p>
      </div>
      
      {NODE_TYPES.map((node) => (
        <div
          key={node.type}
          draggable
          onDragStart={(e) => onDragStart(e, node.type)}
          className="group relative flex items-center justify-center w-12 h-12 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-600 rounded-xl cursor-grab active:cursor-grabbing transition-all hover:scale-105 active:scale-95"
          title={node.label}
        >
          <node.icon className={`w-5 h-5 ${node.color} group-hover:text-white transition-colors`} />
          
          {/* Tooltip */}
          <div className="absolute left-full ml-3 px-2 py-1 bg-zinc-800 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl border border-zinc-700">
            {node.label}
          </div>
        </div>
      ))}
      
      <div className="mt-2 pt-2 border-t border-zinc-800 flex flex-col gap-2">
        <div
          draggable
          onDragStart={(e) => onDragStart(e, 'video')}
          className="group relative flex items-center justify-center w-12 h-12 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-600 rounded-xl cursor-grab transition-all"
        >
          <Video className="w-5 h-5 text-indigo-400" />
          <div className="absolute left-full ml-3 px-2 py-1 bg-zinc-800 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl border border-zinc-700">
            Video Output
          </div>
        </div>
      </div>
    </div>
  );
}
