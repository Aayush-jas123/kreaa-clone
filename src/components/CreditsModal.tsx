"use client";

import { Zap, X, ArrowRight, Sparkles, Diamond } from "lucide-react";

interface CreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export default function CreditsModal({ isOpen, onClose, onUpgrade }: CreditsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in transition-all">
      <div className="w-full max-w-md bg-[#111111] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl relative animate-in zoom-in-95">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-zinc-800 rounded-full text-zinc-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
           <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 border border-amber-500/20 shadow-lg shadow-amber-900/10">
              <Zap className="w-8 h-8 text-amber-500 fill-amber-500" />
           </div>

           <h2 className="text-3xl font-black text-white mb-2">Out of Credits</h2>
           <p className="text-zinc-400 text-sm font-medium mb-8 leading-relaxed">
             You've used all your free credits. To continue generating high-resolution art and using advanced AI models, upgrade to a Pro plan.
           </p>

           <div className="space-y-3 mb-8">
              {[
                { icon: Sparkles, text: "Unlimited fast generations", color: "text-blue-400" },
                { icon: Diamond, text: "22K High-resolution upscaling", color: "text-purple-400" },
                { icon: Zap, text: "Access to all premium models", color: "text-emerald-400" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-xs font-semibold text-zinc-300">
                   <item.icon className={`w-4 h-4 ${item.color}`} />
                   {item.text}
                </div>
              ))}
           </div>

           <button 
             onClick={onUpgrade}
             className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2 active:scale-95 group"
           >
             Upgrade to Pro <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
           </button>
           
           <p className="mt-4 text-[10px] text-zinc-600 text-center font-bold uppercase tracking-widest">
             Starting at just $10/mo
           </p>
        </div>
      </div>
    </div>
  );
}
