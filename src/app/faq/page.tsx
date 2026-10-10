"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HelpCircle, ChevronDown, ChevronUp, Search, PlusCircle, HeartHandshake, Building2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

interface FAQItem {
  q: string;
  a: string;
  category: "all" | "patients" | "donors" | "hospitals";
}

const FAQ_DATA: FAQItem[] = [
  {
    q: "How quickly does an emergency blood requisition reach donors and hospitals?",
    a: "Emergency requisitions marked 'Immediate / Critical' are broadcast instantly across the regional hospital dispatch network and notify active compatible voluntary donors within their specified travel radius within seconds.",
    category: "patients",
  },
  {
    q: "Why is O Negative (O-) called the universal red blood cell donor?",
    a: "O- red blood cells lack A, B, and Rh surface antigens, meaning they can be administered in extreme emergency trauma cases when the recipient's blood group has not yet been determined without triggering acute hemolytic transfusion reactions.",
    category: "patients",
  },
  {
    q: "How do you protect donor privacy from public web scrapers?",
    a: "Donor telephone numbers and residential coordinates are never displayed on public pages. All communication is routed through protected dispatch channels, and donors can pause their participation at any time.",
    category: "donors",
  },
  {
    q: "How frequently can I donate blood?",
    a: "Standard whole blood donations can typically occur every 56 days (8 weeks), while platelet pheresis donations can occur every 7 days (up to 24 times a year), subject to local healthcare guidelines and hemoglobin checks.",
    category: "donors",
  },
  {
    q: "Can hospital staff log batch lot numbers and cold-chain temperatures?",
    a: "Yes. The Hospital Portal provides full inventory management including batch lot identifiers, collection and expiration timestamps, storage temperature monitoring (e.g. 2-6°C for PRBC, -20°C for FFP), and quantity reservation controls.",
    category: "hospitals",
  },
  {
    q: "How does the Smart Match algorithm calculate component suitability?",
    a: "The engine uses clinical transfusion rules tailored to each specific blood component. For example, PRBC follows red cell antigen rules (O- is universal donor), while Fresh Frozen Plasma follows plasma antibody rules (AB is universal donor).",
    category: "hospitals",
  },
];

export default function FAQPage() {
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [openIndexes, setOpenIndexes] = useState<Record<number, boolean>>({ 0: true, 1: true });
  const [search, setSearch] = useState<string>("");

  const toggleIndex = (idx: number) => {
    setOpenIndexes((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const filtered = FAQ_DATA.filter((item) => {
    if (selectedCat !== "all" && item.category !== selectedCat) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!item.q.toLowerCase().includes(q) && !item.a.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF1F2] text-xs font-bold text-[#B91C3C] border border-[#FECDD3]">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Support & Knowledge Base</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 max-w-xl mx-auto">
            Everything you need to know about blood availability discovery, donor coordination, and clinical matching.
          </p>
        </div>

        {/* Search Bar & Category Buttons */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search questions or keywords (e.g., O-, privacy, courier)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#B91C3C] shadow-xs"
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { id: "all", label: "All Questions" },
              { id: "patients", label: "Patients & Requesters" },
              { id: "donors", label: "Voluntary Donors" },
              { id: "hospitals", label: "Hospitals & Blood Banks" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  selectedCat === cat.id
                    ? "bg-[#B91C3C] text-white border-[#B91C3C]"
                    : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-xs text-zinc-400">
              No questions matched your search query.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isOpen = Boolean(openIndexes[idx]);

              return (
                <Card key={idx} className="transition-all">
                  <div
                    onClick={() => toggleIndex(idx)}
                    className="p-5 flex items-center justify-between gap-4 cursor-pointer select-none hover:bg-zinc-50/80 transition-colors"
                  >
                    <h3 className="text-sm font-bold text-zinc-900 leading-snug">
                      {item.q}
                    </h3>
                    <button className="text-zinc-400 hover:text-zinc-700 p-1">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {isOpen && (
                    <CardContent className="px-5 pb-5 pt-0 text-xs text-zinc-600 leading-relaxed border-t border-zinc-100 mt-1">
                      <p className="pt-3">{item.a}</p>
                    </CardContent>
                  )}
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
