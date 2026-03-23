"use client";

import Link from 'next/link';
import { Home, Share2 } from 'lucide-react';
import { TOOL_CATALOG } from '@/config/tools';

export default function Sidebar() {
  return (
    <div className="w-64 h-full bg-[#111111] border-r border-zinc-800 flex flex-col justify-between py-6 px-4 shrink-0">
      <div className="space-y-8">
        <div className="px-2 flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <div className="w-4 h-4 bg-black rounded-sm" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-widest">KREA</h1>
        </div>
        
        <nav className="space-y-1">
          <Link href="/" className="flex items-center gap-3 px-2 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors">
            <Home className="w-5 h-5" />
            <span className="font-medium">Home</span>
          </Link>
          <Link href="/editor" className="flex items-center gap-3 px-2 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors">
            <Share2 className="w-5 h-5" />
            <span className="font-medium">Node Editor</span>
          </Link>
        </nav>
        
        <div className="pt-4">
          <h2 className="px-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Tools</h2>
          <nav className="space-y-1">
            {TOOL_CATALOG.map((tool) => (
              <button 
                key={tool.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/reactflow', tool.type);
                  e.dataTransfer.effectAllowed = 'move';
                }}
                className="w-full flex items-center gap-3 px-2 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors cursor-grab active:cursor-grabbing"
                title={tool.description}
              >
                <tool.icon className="w-5 h-5" />
                <span>{tool.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="px-2">
          <p className="text-xs text-zinc-500 mb-2">Earn 3,000 Credits</p>
          <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20">
            Upgrade
          </button>
        </div>
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-semibold text-white">
            JD
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">Jane Doe</span>
            <span className="text-xs text-zinc-500">Free</span>
          </div>
        </div>
      </div>
    </div>
  );
}
