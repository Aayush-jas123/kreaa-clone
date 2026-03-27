"use client";

import { UserButton, SignInButton, useAuth } from "@clerk/nextjs";
import Link from 'next/link';
import { Home, Share2, Zap } from 'lucide-react';
import { useCallback, useEffect, useState } from "react";
import PricingModal from './PricingModal';

export default function Sidebar() {
  const { isSignedIn } = useAuth();
  const [credits, setCredits] = useState<number | null>(null);
  const [showPricing, setShowPricing] = useState(false);

  const fetchCredits = useCallback(async () => {
    if (!isSignedIn) return;
    try {
      const res = await fetch('/api/user/credits');
      const data = await res.json();
      if (data.credits !== undefined) setCredits(data.credits);
    } catch (err) {}
  }, [isSignedIn]);

  useEffect(() => {
    fetchCredits();
    const interval = setInterval(fetchCredits, 30000);
    return () => clearInterval(interval);
  }, [fetchCredits]);

  if (!isSignedIn) {
    return (
      <div className="w-64 h-full bg-[#111111] border-r border-zinc-800 flex flex-col justify-center items-center py-6 px-4 shrink-0">
        <div className="px-2 flex flex-col items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-zinc-500" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-widest">KREA</h1>
        </div>
        <SignInButton mode="modal">
          <button className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all active:scale-95 shadow-xl shadow-white/10">
            Get Started
          </button>
        </SignInButton>
      </div>
    );
  }

  return (
    <>
      <div className="w-64 h-full bg-[#111111] border-r border-zinc-800 flex flex-col justify-between py-6 px-4 shrink-0">
        <div className="space-y-8 flex-1 flex flex-col">
          <div className="px-2 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <Zap className="w-5 h-5 text-white fill-current" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-widest">KREA</h1>
          </div>

          <nav className="flex-1 space-y-1">
            <Link href="/" className="flex items-center gap-3 px-2 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors">
              <Home className="w-5 h-5" />
              <span className="font-medium text-sm">Home</span>
            </Link>
            <Link href="/editor" className="flex items-center gap-3 px-2 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors">
              <Share2 className="w-5 h-5" />
              <span className="font-medium text-sm">Node Editor</span>
            </Link>
          </nav>

          <div className="py-4 border-t border-zinc-800/50">
            <div className="flex items-center justify-between mb-3 px-2">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Plan</span>
              <span className="text-[10px] font-bold text-amber-500 uppercase bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">Free</span>
            </div>
            <div className="bg-zinc-900/40 rounded-xl p-4 border border-zinc-800/50 shadow-inner">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-lg shadow-amber-900/10">
                  <Zap className="w-4 h-4 text-amber-500 fill-current" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-none mb-1">{credits !== null ? credits : '...'} Credits</p>
                  <p className="text-[10px] text-zinc-500 font-medium">Available balance</p>
                </div>
              </div>
              <button onClick={() => setShowPricing(true)} className="w-full py-2 bg-zinc-100 hover:bg-white text-black text-[10px] font-bold rounded-lg transition-all uppercase tracking-wider active:scale-95 shadow-lg shadow-white/5">
                Upgrade Pro
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-800">
          <div className="flex items-center gap-3 px-2 py-1 hover:bg-zinc-800/30 rounded-lg transition-colors group cursor-pointer">
            <UserButton />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate leading-none mb-1">Account</p>
              <p className="text-[10px] text-zinc-500 truncate">Manage settings</p>
            </div>
          </div>
        </div>
      </div>
      {showPricing && <PricingModal onClose={() => setShowPricing(false)} />}
    </>
  );
}

