"use client";

import { useEffect, useState } from "react";
import { Image as ImageIcon, Download, Trash2, Loader2, Maximize2, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface Generation {
  id: string;
  prompt: string;
  imageUrl: string;
  type: string;
  createdAt: string;
}

export default function OutputsGallery() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOutputs = async () => {
    try {
      const res = await fetch("/api/generations");
      const data = await res.json();
      if (data.generations) {
        // Filter to only show images for the Gallery view
        setGenerations(data.generations.filter((g: any) => g.type === 'image'));
      }
    } catch (err) {
      console.error("Failed to fetch outputs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutputs();
  }, []);

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename || 'krea-output.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast("Image download started", "success");
    } catch (err) {
      toast("Download failed", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this output?")) return;
    try {
      const res = await fetch("/api/generations/delete", {
        method: "POST",
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setGenerations(prev => prev.filter(g => g.id !== id));
        toast("Output deleted", "success");
      }
    } catch (err) {
      toast("Delete failed", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center text-zinc-500 gap-3 bg-[#0e0e0e]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-[10px] font-black uppercase tracking-widest">Loading Gallery...</p>
      </div>
    );
  }

  if (generations.length === 0) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center text-zinc-500 gap-6 bg-[#0e0e0e]">
        <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center border border-zinc-800 shadow-2xl">
          <ImageIcon className="w-10 h-10 text-zinc-700" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-white mb-2">Your gallery is empty</h3>
          <p className="text-sm text-zinc-500 max-w-xs mx-auto">Generate images in the Pipeline to see them appear here in high definition.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full overflow-y-auto p-10 custom-scrollbar bg-[#0e0e0e]">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-10">
           <div>
             <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Outputs</h2>
             <p className="text-sm text-zinc-500 font-medium">Manage and export your high-resolution generations.</p>
           </div>
           <button onClick={fetchOutputs} className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 rounded-xl text-xs font-bold transition-all uppercase tracking-widest">
             Sync Gallery
           </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
          {generations.map((gen) => (
            <div key={gen.id} className="group relative aspect-square bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-blue-500/50 transition-all shadow-2xl">
              {/* Image */}
              <img
                src={gen.imageUrl}
                alt={gen.prompt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-6">
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => handleDownload(gen.imageUrl, `krea-${gen.id}.png`)}
                    className="p-2.5 bg-white/10 hover:bg-white text-white hover:text-black rounded-xl backdrop-blur-md transition-all border border-white/10"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-xs text-zinc-300 line-clamp-3 leading-relaxed font-medium">
                    {gen.prompt}
                  </p>
                  <div className="flex items-center gap-3">
                     <button className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                       <Maximize2 className="w-3 h-3" /> Enhance
                     </button>
                     <button 
                       onClick={() => handleDelete(gen.id)}
                       className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all border border-red-500/20"
                     >
                       <Trash2 className="w-4 h-4" />
                     </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
