"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  ShieldCheck,
  Heart,
  Sparkles,
  Users,
  Building2,
  Lock,
  ArrowRight,
  Droplet,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { BloodGroupBadge } from "@/components/ui/Badge";
import { BloodGroup } from "@/types";

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<"mission" | "compatibility" | "architecture">("mission");

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF1F2] text-xs font-bold text-[#B91C3C] border border-[#FECDD3]">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>Healthcare Coordination Platform</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-zinc-900 tracking-tight">
            About HEMO<span className="text-[#B91C3C]">HEALTH</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 max-w-2xl mx-auto leading-relaxed">
            Eliminating critical blood shortages and logistical delays through real-time inventory discovery, transparent clinical compatibility matching, and voluntary donor mobilization.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center border-b border-zinc-200">
          <div className="flex gap-4 text-xs font-bold">
            <button
              onClick={() => setActiveTab("mission")}
              className={`pb-3 px-3 border-b-2 transition-all cursor-pointer ${
                activeTab === "mission"
                  ? "border-[#B91C3C] text-[#B91C3C]"
                  : "border-transparent text-zinc-500 hover:text-zinc-900"
              }`}
            >
              Our Mission & Principles
            </button>
            <button
              onClick={() => setActiveTab("compatibility")}
              className={`pb-3 px-3 border-b-2 transition-all cursor-pointer ${
                activeTab === "compatibility"
                  ? "border-[#B91C3C] text-[#B91C3C]"
                  : "border-transparent text-zinc-500 hover:text-zinc-900"
              }`}
            >
              Biological Compatibility
            </button>
            <button
              onClick={() => setActiveTab("architecture")}
              className={`pb-3 px-3 border-b-2 transition-all cursor-pointer ${
                activeTab === "architecture"
                  ? "border-[#B91C3C] text-[#B91C3C]"
                  : "border-transparent text-zinc-500 hover:text-zinc-900"
              }`}
            >
              Platform Architecture
            </button>
          </div>
        </div>

        {/* Tab Content: Mission */}
        {activeTab === "mission" && (
          <div className="space-y-8 animate-in fade-in-50 duration-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#B91C3C] flex items-center justify-center font-bold">
                    <Droplet className="w-5 h-5 fill-[#B91C3C]" />
                  </div>
                  <h3 className="text-base font-bold text-zinc-900">Zero Inventory Blindspots</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Hospitals frequently face localized shortages while neighboring blood centers have available supply. HemoHealth brings unified inventory visibility across licensed facilities.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-zinc-900">Deterministic Matching</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Our Smart Match engine avoids black-box approximations, applying rigorous component-specific ABO/Rh clinical compatibility rules with transparent breakdown scores.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-zinc-900">Strict Privacy By Design</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Patient medical diagnoses and volunteer donor personal contact information are strictly sequestered behind protected dispatch channels, never exposed publicly.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Tab Content: Compatibility Guide */}
        {activeTab === "compatibility" && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 space-y-4">
              <h3 className="text-lg font-bold text-zinc-900">
                Component-Specific Biological Compatibility Rules
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                A common misconception is that blood compatibility is universal across all components. In transfusion medicine, <strong>Red Blood Cells (PRBC)</strong> and <strong>Fresh Frozen Plasma (FFP)</strong> have inverted rules due to antibodies present in plasma versus antigens on erythrocytes.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-200 space-y-2 text-xs">
                  <h4 className="font-bold text-[#B91C3C]">Packed Red Blood Cells (PRBC)</h4>
                  <p className="text-zinc-600">
                    - <strong>O Negative (O-)</strong> is the Universal Red Cell Donor (no A, B, or Rh antigens).
                  </p>
                  <p className="text-zinc-600">
                    - <strong>AB Positive (AB+)</strong> is the Universal Red Cell Recipient (tolerates all RBC antigens).
                  </p>
                </div>

                <div className="p-4 bg-sky-50/50 rounded-xl border border-sky-200 space-y-2 text-xs">
                  <h4 className="font-bold text-sky-800">Fresh Frozen Plasma (FFP)</h4>
                  <p className="text-zinc-600">
                    - <strong>AB (AB+ / AB-)</strong> is the Universal Plasma Donor (plasma contains no anti-A or anti-B antibodies).
                  </p>
                  <p className="text-zinc-600">
                    - <strong>O (O+ / O-)</strong> is the Universal Plasma Recipient.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Architecture */}
        {activeTab === "architecture" && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 space-y-4 text-xs">
              <h3 className="text-lg font-bold text-zinc-900">
                Technical Stack & Infrastructure
              </h3>
              <p className="text-zinc-600 leading-relaxed">
                HemoHealth is constructed with modern Next.js App Router, TypeScript, Tailwind CSS, and Zod validation, backed by an abstracted repository pattern.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-zinc-700 pt-2">
                <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                  <span className="font-bold block text-zinc-900">Demonstration Mode Data Layer:</span>
                  Stateful reactive in-memory store with local persistence, pre-seeded with realistic clinical emergency records.
                </div>
                <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                  <span className="font-bold block text-zinc-900">Firebase & Firestore Integration:</span>
                  Production schema with role-based Firestore security rules and audit logging.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
