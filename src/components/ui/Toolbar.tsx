"use client";

import { useReactFlow } from '@xyflow/react';
import { ZoomIn, ZoomOut, Maximize, Undo2, Redo2 } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
import { useShallow } from 'zustand/react/shallow';

export default function Toolbar() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  
  const { undo, redo, pastCount, futureCount } = useEditorStore(
    useShallow((state) => ({
      undo: state.undo,
      redo: state.redo,
      pastCount: state.past.length,
      futureCount: state.future.length,
    }))
  );

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#1a1a1a] shadow-2xl border border-zinc-800 rounded-lg p-1.5 flex items-center gap-1 z-50">
      <button 
        onClick={() => undo()} 
        disabled={pastCount === 0} 
        className="p-2 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
        title="Undo"
      >
        <Undo2 className="w-4 h-4" />
      </button>
      <button 
        onClick={() => redo()} 
        disabled={futureCount === 0} 
        className="p-2 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
        title="Redo"
      >
        <Redo2 className="w-4 h-4" />
      </button>
      
      <div className="w-px h-6 bg-zinc-800 mx-1" />
      
      <button 
        onClick={() => zoomOut()} 
        className="p-2 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded transition-colors"
        title="Zoom Out"
      >
        <ZoomOut className="w-4 h-4" />
      </button>
      <button 
        onClick={() => zoomIn()} 
        className="p-2 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded transition-colors"
        title="Zoom In"
      >
        <ZoomIn className="w-4 h-4" />
      </button>
      <button 
        onClick={() => fitView({ duration: 800 })} 
        className="p-2 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded transition-colors"
        title="Fit View"
      >
        <Maximize className="w-4 h-4" />
      </button>
    </div>
  );
}
