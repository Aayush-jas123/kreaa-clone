"use client";

import { useEffect, useState } from "react";
import { Clock, Image as ImageIcon, Type, Download, Trash2, Loader2, ExternalLink } from "lucide-react";
import Image from "next/image";

interface Generation {
  id: string;
  prompt: string;
  imageUrl: string;
  type: string;
  createdAt: string;
}

export default function GenerationHistory() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/generations");
      const data = await res.json();
      if (data.generations) {
        setGenerations(data.generations);
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this history item?")) return;
    try {
      const res = await fetch("/api/generations/delete", {
        method: "POST",
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setGenerations(prev => prev.filter(g => g.id !== id));
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        <p className="text-xs font-bold uppercase tracking-widest">Loading History...</p>
      </div>
    );
  }

  if (generations.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 gap-4">
        <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800">
          <Clock className="w-8 h-8 text-zinc-700" />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-white mb-1">No generations yet</p>
          <p className="text-xs text-zinc-500">Your AI outputs will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-zinc-400" />
            Recent Generations
          </h2>
          <button onClick={fetchHistory} className="text-[10px] font-bold text-zinc-400 hover:text-white uppercase tracking-widest px-3 py-1.5 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-all">
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {generations.map((gen) => (
            <div key={gen.id} className="group relative bg-zinc-900/50 border border-zinc-800 hover:border-zinc-600 rounded-xl overflow-hidden transition-all flex flex-col shadow-xl">
              {/* Type Badge */}
              <div className="absolute top-3 left-3 z-10">
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest backdrop-blur-md border ${
                  gen.type === 'image' 
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                    : 'bg-purple-500/10 text-purple-500 border-purple-500/20'
                }`}>
                  {gen.type === 'image' ? <ImageIcon className="w-3 h-3" /> : <Type className="w-3 h-3" />}
                  {gen.type}
                </div>
              </div>

              {/* Preview */}
              <div className="aspect-square relative flex items-center justify-center bg-black overflow-hidden group-hover:bg-zinc-950 transition-colors">
                {gen.type === 'image' ? (
                  <img
                    src={gen.imageUrl}
                    alt={gen.prompt}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="p-6 text-xs text-zinc-400 italic font-medium line-clamp-6 leading-relaxed">
                    "{gen.imageUrl}"
                  </div>
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                   <button className="flex items-center gap-2 px-4 py-2 bg-white text-black text-[10px] font-bold rounded-lg hover:scale-105 active:scale-95 transition-all">
                      <ExternalLink className="w-3 h-3" /> View Details
                   </button>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-zinc-800 flex-1">
                <p className="text-zinc-200 text-xs font-medium line-clamp-2 leading-relaxed mb-3">
                  {gen.prompt}
                </p>
                <div className="flex items-center justify-between mt-auto">
                   <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                      {new Date(gen.createdAt).toLocaleDateString()}
                   </p>
                   <button 
                     onClick={() => handleDelete(gen.id)}
                     className="p-1.5 hover:bg-red-500/10 text-zinc-600 hover:text-red-500 rounded transition-colors"
                     title="Delete"
                   >
                     <Trash2 className="w-3.5 h-3.5" />
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
