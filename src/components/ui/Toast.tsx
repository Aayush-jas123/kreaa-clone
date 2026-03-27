"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { CheckCircle2, AlertCircle, Info, X, Loader2 } from "lucide-react";

type ToastType = "success" | "error" | "info" | "loading";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type: ToastType) => string;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    if (type !== "loading") {
      setTimeout(() => {
        removeToast(id);
      }, 5000);
    }
    
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 min-w-[320px]">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="bg-[#1a1a1a] border border-zinc-800 p-4 rounded-xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-10 fade-in transition-all"
          >
            <div className="shrink-0">
              {t.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
              {t.type === "error" && <AlertCircle className="w-5 h-5 text-red-500" />}
              {t.type === "info" && <Info className="w-5 h-5 text-blue-500" />}
              {t.type === "loading" && <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />}
            </div>
            
            <p className="text-sm font-medium text-white flex-1">{t.message}</p>
            
            <button
              onClick={() => removeToast(t.id)}
              className="p-1 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};
