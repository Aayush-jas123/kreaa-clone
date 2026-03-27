"use client";

import { useState } from "react";
import { Image as ImageIcon, Clock, Trash2, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/Toast";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    updatedAt: string | Date;
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [visible, setVisible] = useState(true);
  const { toast } = useToast();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm(`Delete project "${project.name}"?`)) return;
    
    setDeleting(true);
    try {
      const res = await fetch(`/api/projects?id=${project.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setVisible(false);
        toast("Project deleted", "success");
      }
    } catch (err) {
      toast("Delete failed", "error");
    } finally {
      setDeleting(false);
    }
  };

  if (!visible) return null;

  return (
    <Link 
      href={`/editor?id=${project.id}`}
      className="group bg-[#111111] border border-zinc-800 hover:border-blue-500/50 rounded-2xl p-5 transition-all hover:shadow-2xl hover:shadow-blue-900/10 flex flex-col gap-4 relative animate-in fade-in zoom-in-95 duration-300"
    >
      <div className="w-full aspect-video bg-zinc-900 rounded-lg overflow-hidden flex items-center justify-center border border-zinc-800 group-hover:bg-zinc-800 transition-colors">
         <ImageIcon className="w-8 h-8 text-zinc-700 group-hover:scale-110 transition-transform" />
      </div>
      
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="text-white font-semibold truncate group-hover:text-blue-400 transition-colors">{project.name}</h3>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
             <Clock className="w-3 h-3" />
             {new Date(project.updatedAt).toLocaleDateString()}
          </div>
        </div>
        
        <button 
          onClick={handleDelete}
          disabled={deleting}
          className="p-2 transition-all hover:bg-red-500/10 text-zinc-700 hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 disabled:opacity-50"
          title="Delete Project"
        >
          {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </button>
      </div>
    </Link>
  );
}
