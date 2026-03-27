"use client";

import { Type, Image as ImageIcon, Cpu, Settings, FileImage, Sparkles, Video } from "lucide-react";

const NODE_TYPES = [
  { type: 'prompt', label: 'Prompt / Input', icon: Type, color: 'text-zinc-400' },
  { type: 'llm', label: 'Gemini / AI Text', icon: Cpu, color: 'text-purple-400' },
  { type: 'image', label: 'Image Output', icon: ImageIcon, color: 'text-emerald-400' },
  { type: 'video', label: 'Video Output', icon: Video, color: 'text-indigo-400' },
  { type: 'image_input', label: 'Upload Image', icon: FileImage, color: 'text-blue-400' },
  { type: 'enhancer', label: 'AI Enhancer', icon: Sparkles, color: 'text-amber-400' },
  { type: 'settings', label: 'Gen Settings', icon: Settings, color: 'text-zinc-500' },
];

export default function NodePalette() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 p-3 bg-[#111111] border border-zinc-800 rounded-3xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] z-[100] ring-1 ring-white/5">
      <div className="px-2 py-2 mb-2 border-b border-zinc-900">
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] text-center">Library</p>
      </div>
      
      <div className="flex flex-col gap-3">
        {NODE_TYPES.map((node) => (
          <div
            key={node.type}
            draggable
            onDragStart={(e) => onDragStart(e, node.type)}
            className="group relative flex items-center justify-center w-12 h-12 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-blue-500/50 rounded-2xl cursor-grab active:cursor-grabbing transition-all hover:scale-110 active:scale-95 shadow-lg"
            title={node.label}
          >
            <node.icon className={`w-5 h-5 ${node.color} group-hover:text-white transition-colors`} />
            
            {/* Tooltip */}
            <div className="absolute left-full ml-4 px-3 py-2 bg-zinc-900 text-white text-[10px] font-bold rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap shadow-2xl border border-zinc-800 z-[110]">
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${node.color.replace('text-', 'bg-')}`} />
                {node.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
