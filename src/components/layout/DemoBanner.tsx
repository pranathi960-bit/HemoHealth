"use client";

import React, { useState } from "react";
import { AlertCircle, Database, RefreshCw, X } from "lucide-react";
import { HemoStore } from "@/lib/data/store";
import { useToast } from "@/components/ui/Toast";

export function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const { success } = useToast();

  if (!isVisible) return null;

  const handleReset = () => {
    if (confirm("Reset all demonstration data to factory defaults? This resets any added requests or inventory.")) {
      HemoStore.resetToDefault();
      success("Demo Data Reset", "Restored realistic default clinical records.");
    }
  };

  return (
    <div className="bg-[#701A32] text-white text-xs py-2 px-4 border-b border-[#581427] relative z-40">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold tracking-wide uppercase text-[10px] bg-white/20 px-1.5 py-0.5 rounded">
            DEMONSTRATION MODE
          </span>
          <p className="text-zinc-200 text-center sm:text-left font-medium">
            All records are synthetic and do not represent real hospitals, donors, or actual blood availability.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded transition-colors text-[11px] cursor-pointer"
            title="Reset demonstration records to original state"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Demo Records</span>
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-zinc-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
