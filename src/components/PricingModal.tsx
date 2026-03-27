"use client";

import { useState } from "react";
import { Zap, X, Check, Loader2 } from "lucide-react";

const PACKAGES = [
  {
    id: "starter",
    name: "Starter",
    credits: 100,
    price: "$4.99",
    description: "Perfect for trying out",
    features: ["100 AI generations", "Image & text nodes", "Cloud save"],
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    credits: 500,
    price: "$19.99",
    description: "Best value for creators",
    features: ["500 AI generations", "Priority processing", "Cloud save", "Generation history"],
    highlight: true,
  },
  {
    id: "unlimited",
    name: "Power",
    credits: 2000,
    price: "$59.99",
    description: "For power users",
    features: ["2000 AI generations", "Priority processing", "Cloud save", "Generation history", "Early access to new models"],
    highlight: false,
  },
];

export default function PricingModal({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState<string | null>(null);

  const handlePurchase = async (packageId: string) => {
    setLoading(packageId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Something went wrong. Please try again.");
        setLoading(null);
      }
    } catch (err) {
      alert("Network error. Please try again.");
      setLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#111111] border border-zinc-800 rounded-2xl max-w-3xl w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-400 fill-current" />
              Top Up Credits
            </h2>
            <p className="text-zinc-500 text-sm mt-1">Choose a credit package to keep creating</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Packages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative rounded-xl border p-5 flex flex-col gap-4 transition-all ${
                pkg.highlight
                  ? "border-blue-500 bg-blue-600/5 shadow-lg shadow-blue-900/20"
                  : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
              }`}
            >
              {pkg.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  Most Popular
                </div>
              )}
              <div>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-1">{pkg.name}</p>
                <p className="text-3xl font-black text-white">{pkg.price}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400 fill-current" />
                  <span className="text-amber-400 font-bold text-sm">{pkg.credits} credits</span>
                </div>
                <p className="text-xs text-zinc-500 mt-1">{pkg.description}</p>
              </div>

              <ul className="space-y-2 flex-1">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-zinc-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePurchase(pkg.id)}
                disabled={!!loading}
                className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                  pkg.highlight
                    ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30"
                    : "bg-zinc-800 hover:bg-zinc-700 text-white"
                }`}
              >
                {loading === pkg.id ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                ) : (
                  `Buy ${pkg.credits} Credits`
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="px-6 pb-6 text-center text-xs text-zinc-600">
          Secure payment via Stripe · No subscription · One-time purchase
        </div>
      </div>
    </div>
  );
}
