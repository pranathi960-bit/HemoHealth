"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Activity,
  Search,
  PlusCircle,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Clock,
  Building2,
  CheckCircle2,
  ChevronRight,
  Droplet,
  Users,
  AlertTriangle,
  Zap,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge, BloodGroupBadge, UrgencyBadge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { HemoStore, subscribeToStore } from "@/lib/data/store";
import { BloodGroup, BloodRequest } from "@/types";

export default function HomePage() {
  const [activeRequests, setActiveRequests] = useState<BloodRequest[]>([]);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<BloodGroup>("O-");

  useEffect(() => {
    const update = () => {
      setActiveRequests(HemoStore.getRequests().filter((r) => r.status !== "fulfilled" && r.status !== "cancelled"));
    };
    update();
    const unsub = subscribeToStore(update);
    return () => unsub();
  }, []);

  const bloodCompatibilityInfo: Record<
    BloodGroup,
    { canDonateRBC: string[]; canReceiveRBC: string[]; plasmaDonates: string[]; plasmaReceives: string[]; notes: string }
  > = {
    "O-": {
      canDonateRBC: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
      canReceiveRBC: ["O-"],
      plasmaDonates: ["O-", "O+"],
      plasmaReceives: ["All Types"],
      notes: "Universal Red Cell Donor. Critically needed in emergency trauma resuscitation when blood type is unknown.",
    },
    "O+": {
      canDonateRBC: ["O+", "A+", "B+", "AB+"],
      canReceiveRBC: ["O+", "O-"],
      plasmaDonates: ["O-", "O+"],
      plasmaReceives: ["O", "A", "B", "AB"],
      notes: "Most common blood type in the general population. Vital for regular surgical transfusions.",
    },
    "A-": {
      canDonateRBC: ["A-", "A+", "AB-", "AB+"],
      canReceiveRBC: ["A-", "O-"],
      plasmaDonates: ["A", "O"],
      plasmaReceives: ["A", "AB"],
      notes: "Rare blood group. Critical for scheduled cardiothoracic and oncology patients.",
    },
    "A+": {
      canDonateRBC: ["A+", "AB+"],
      canReceiveRBC: ["A+", "A-", "O+", "O-"],
      plasmaDonates: ["A", "O"],
      plasmaReceives: ["A", "AB"],
      notes: "Second most common type. High platelet yield donors frequently needed.",
    },
    "B-": {
      canDonateRBC: ["B-", "B+", "AB-", "AB+"],
      canReceiveRBC: ["B-", "O-"],
      plasmaDonates: ["B", "O"],
      plasmaReceives: ["B", "AB"],
      notes: "Very rare (less than 2% of population). Emergency registries maintain high priority for B- donors.",
    },
    "B+": {
      canDonateRBC: ["B+", "AB+"],
      canReceiveRBC: ["B+", "B-", "O+", "O-"],
      plasmaDonates: ["B", "O"],
      plasmaReceives: ["B", "AB"],
      notes: "Highly valuable for sickle cell disease and thalassemia support treatments.",
    },
    "AB-": {
      canDonateRBC: ["AB-", "AB+"],
      canReceiveRBC: ["AB-", "A-", "B-", "O-"],
      plasmaDonates: ["All Types"],
      plasmaReceives: ["AB-", "AB+"],
      notes: "Rarest blood group. Universal Plasma Donor.",
    },
    "AB+": {
      canDonateRBC: ["AB+"],
      canReceiveRBC: ["All Types (Universal RBC Recipient)"],
      plasmaDonates: ["All Types (Universal Plasma Donor)"],
      plasmaReceives: ["AB+"],
      notes: "Universal Red Cell Recipient and Universal Plasma Donor.",
    },
  };

  const currentComp = bloodCompatibilityInfo[selectedBloodGroup];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF1F2]/60 via-white to-[#FAFAFA] border-b border-[#E4E4E7] pt-12 pb-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFF1F2] border border-[#FECDD3] text-xs font-bold text-[#B91C3C]">
                <Activity className="w-3.5 h-3.5 animate-pulse text-[#B91C3C]" />
                <span>Next-Gen Healthcare Blood Coordination</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#18181B] tracking-tight leading-[1.1]">
                Every Drop Counts. <br className="hidden sm:inline" />
                <span className="text-[#B91C3C]">Every Second Matters.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#71717A] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Connecting patients, voluntary donors, hospitals, and blood banks to coordinate real-time blood availability, accelerate emergency matching, and eliminate life-threatening delays.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link href="/find-blood" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="primary"
                    leftIcon={<Search className="w-5 h-5" />}
                    className="w-full sm:w-auto font-bold shadow-md hover:shadow-lg"
                  >
                    Find Available Blood
                  </Button>
                </Link>

                <Link href="/request-blood" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="soft"
                    leftIcon={<PlusCircle className="w-5 h-5" />}
                    className="w-full sm:w-auto font-bold"
                  >
                    Emergency Requisition
                  </Button>
                </Link>

                <Link href="/donors" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    leftIcon={<HeartHandshake className="w-5 h-5 text-[#B91C3C]" />}
                    className="w-full sm:w-auto font-semibold"
                  >
                    Become a Donor
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-[#E4E4E7]/80 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-[#18181B]">100%</div>
                  <div className="text-xs text-[#71717A]">Verified Hospitals & Depots</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-[#B91C3C]">&lt; 30s</div>
                  <div className="text-xs text-[#71717A]">Smart Match Calculation</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-[#15803D]">Zero</div>
                  <div className="text-xs text-[#71717A]">Public Contact Exposure</div>
                </div>
              </div>
            </div>

            {/* Right Interactive Graphic & Triage Panel */}
            <div className="lg:col-span-5">
              <div className="relative">
                {/* Decorative background glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#B91C3C] to-[#701A32] rounded-2xl blur-xl opacity-20 group-hover:opacity-100 transition duration-1000"></div>

                <div className="relative bg-white rounded-2xl border border-[#E4E4E7] shadow-xl p-6 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F4F4F5]">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                      <span className="text-xs font-bold uppercase tracking-wider text-[#18181B]">
                        Live Coordination Stream
                      </span>
                    </div>
                    <Badge variant="crimson" size="sm">
                      {activeRequests.length} Active Urgent Needs
                    </Badge>
                  </div>

                  {/* Sample Active Requests Stream */}
                  <div className="space-y-3">
                    {activeRequests.slice(0, 3).map((req) => (
                      <div
                        key={req.id}
                        className="p-3 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7] hover:border-[#FECDD3] transition-all hover:bg-white flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <BloodGroupBadge bloodGroup={req.bloodGroup} size="sm" />
                          <div>
                            <div className="text-xs font-bold text-[#18181B] line-clamp-1">
                              {req.hospitalName}
                            </div>
                            <div className="text-[11px] text-[#71717A]">
                              {req.component} • {req.unitsRequired} Units Required
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <UrgencyBadge urgency={req.urgency} />
                          <Link
                            href={`/track-request?id=${req.requestNumber}`}
                            className="text-[11px] font-bold text-[#B91C3C] hover:underline flex items-center gap-0.5"
                          >
                            <span>Track</span>
                            <ChevronRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Smart Match Teaser Card */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-[#FFF1F2] to-[#FFE4E6] border border-[#FECDD3] flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#B91C3C]">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Instant Compatibility Match</span>
                      </div>
                      <p className="text-[11px] text-[#701A32]">
                        Calculates ABO/Rh biological rules, location proximity & stock in real time.
                      </p>
                    </div>
                    <Link href="/smart-match">
                      <Button size="sm" variant="primary" className="text-xs shrink-0">
                        Run Engine
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Action Navigation Cards */}
      <section className="py-12 bg-white border-b border-[#E4E4E7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-[#18181B] tracking-tight">
              Essential Blood Services at Your Fingertips
            </h2>
            <p className="text-sm text-[#71717A] mt-1">
              Select your immediate role to access dedicated clinical tools and inventory pipelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Find Blood */}
            <Card className="hover:border-[#B91C3C]/50 transition-all group">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#FFF1F2] border border-[#FECDD3] flex items-center justify-center text-[#B91C3C] group-hover:scale-110 transition-transform">
                  <Search className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-[#18181B] group-hover:text-[#B91C3C] transition-colors">
                    Find Available Blood
                  </h3>
                  <p className="text-xs text-[#71717A] leading-relaxed">
                    Search certified hospital inventories, licensed blood centers, and component reserves by blood group and city.
                  </p>
                </div>
                <Link href="/find-blood" className="inline-block pt-2">
                  <span className="text-xs font-bold text-[#B91C3C] flex items-center gap-1 group-hover:gap-2 transition-all">
                    <span>Search Facilities</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </CardContent>
            </Card>

            {/* Card 2: Emergency Request */}
            <Card className="border-[#FECDD3] bg-gradient-to-b from-white to-[#FFF1F2]/20 hover:border-[#B91C3C] transition-all group">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#B91C3C] text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-[#18181B] group-hover:text-[#B91C3C] transition-colors">
                      Emergency Requisition
                    </h3>
                    <Badge variant="crimson" size="sm">Urgent</Badge>
                  </div>
                  <p className="text-xs text-[#71717A] leading-relaxed">
                    Submit a rapid clinical requisition with patient & hospital details to immediately trigger local multi-depot broadcast.
                  </p>
                </div>
                <Link href="/request-blood" className="inline-block pt-2">
                  <span className="text-xs font-bold text-[#B91C3C] flex items-center gap-1 group-hover:gap-2 transition-all">
                    <span>Create Request</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </CardContent>
            </Card>

            {/* Card 3: Voluntary Donors */}
            <Card className="hover:border-[#B91C3C]/50 transition-all group">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#DCFCE7] border border-[#BBF7D0] flex items-center justify-center text-[#15803D] group-hover:scale-110 transition-transform">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-[#18181B] group-hover:text-[#15803D] transition-colors">
                    Volunteer Donor Network
                  </h3>
                  <p className="text-xs text-[#71717A] leading-relaxed">
                    Register as a voluntary donor, manage privacy-protected availability, and receive urgent shortage alerts when lives are at risk.
                  </p>
                </div>
                <Link href="/donors" className="inline-block pt-2">
                  <span className="text-xs font-bold text-[#15803D] flex items-center gap-1 group-hover:gap-2 transition-all">
                    <span>Join Network</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-[#FAFAFA] border-b border-[#E4E4E7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B91C3C] bg-[#FFF1F2] px-2.5 py-1 rounded-full border border-[#FECDD3]">
              Streamlined Lifecycle
            </span>
            <h2 className="text-3xl font-extrabold text-[#18181B] tracking-tight mt-3">
              How HemoHealth Coordinates in 3 Steps
            </h2>
            <p className="text-sm text-[#71717A] mt-2">
              A transparent, deterministic workflow bridging hospital emergencies and ready supply.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-2xl border border-[#E4E4E7] shadow-xs relative">
              <div className="w-10 h-10 rounded-full bg-[#FFF1F2] text-[#B91C3C] font-black flex items-center justify-center text-sm border border-[#FECDD3] mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-[#18181B] mb-2">
                1. Requisition & Triage
              </h3>
              <p className="text-xs text-[#71717A] leading-relaxed">
                Hospital staff or authorized caregivers submit required blood group, component (PRBC, Platelets, FFP), units, and clinical urgency level.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-2xl border border-[#E4E4E7] shadow-xs relative">
              <div className="w-10 h-10 rounded-full bg-[#FFF1F2] text-[#B91C3C] font-black flex items-center justify-center text-sm border border-[#FECDD3] mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-[#18181B] mb-2">
                2. Multi-Factor Smart Match
              </h3>
              <p className="text-xs text-[#71717A] leading-relaxed">
                Our clinical engine evaluates component-specific compatibility rules, inventory freshness, facility accreditation, and proximity in seconds.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-2xl border border-[#E4E4E7] shadow-xs relative">
              <div className="w-10 h-10 rounded-full bg-[#FFF1F2] text-[#B91C3C] font-black flex items-center justify-center text-sm border border-[#FECDD3] mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-[#18181B] mb-2">
                3. Dispatch & Tracking
              </h3>
              <p className="text-xs text-[#71717A] leading-relaxed">
                Blood banks confirm physical stock release and volunteer donors receive secure invitations, while requesters track live stage updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Blood Compatibility Matrix Explorer */}
      <section className="py-16 bg-white border-b border-[#E4E4E7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B91C3C] bg-[#FFF1F2] px-2.5 py-1 rounded-full border border-[#FECDD3]">
                Clinical Reference Guide
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#18181B] tracking-tight">
                Interactive Blood Compatibility Matrix
              </h2>
              <p className="text-xs sm:text-sm text-[#71717A] leading-relaxed">
                Transfusion compatibility varies significantly by blood component. Red blood cells and blood plasma operate on reciprocal biological rules.
              </p>

              {/* Blood group selector chips */}
              <div className="pt-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                  Select Blood Group:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"] as BloodGroup[]).map((bg) => (
                    <button
                      key={bg}
                      onClick={() => setSelectedBloodGroup(bg)}
                      className={`py-2 px-3 rounded-xl font-bold text-sm border transition-all cursor-pointer ${
                        selectedBloodGroup === bg
                          ? "bg-[#B91C3C] text-white border-[#B91C3C] shadow-sm scale-105"
                          : "bg-zinc-50 text-zinc-800 border-zinc-200 hover:bg-zinc-100"
                      }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Matrix Display Card */}
            <div className="lg:col-span-7">
              <div className="bg-[#FAFAFA] rounded-2xl border border-[#E4E4E7] p-6 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#E4E4E7]">
                  <div className="flex items-center gap-3">
                    <BloodGroupBadge bloodGroup={selectedBloodGroup} size="lg" />
                    <div>
                      <h3 className="text-lg font-bold text-[#18181B]">
                        Blood Group {selectedBloodGroup} Profile
                      </h3>
                      <p className="text-xs text-[#71717A]">{currentComp.notes}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Red Blood Cells */}
                  <div className="p-4 rounded-xl bg-white border border-[#E4E4E7] space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#B91C3C]">
                      <Droplet className="w-4 h-4 fill-[#B91C3C]" />
                      <span>Red Blood Cells (PRBC)</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-zinc-500 block font-medium">Can Donate Red Cells To:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {currentComp.canDonateRBC.map((t) => (
                            <Badge key={t} variant="crimson" size="sm">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-zinc-500 block font-medium">Can Receive Red Cells From:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {currentComp.canReceiveRBC.map((t) => (
                            <Badge key={t} variant="success" size="sm">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Plasma */}
                  <div className="p-4 rounded-xl bg-white border border-[#E4E4E7] space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#0369A1]">
                      <Droplet className="w-4 h-4 fill-[#0369A1]" />
                      <span>Fresh Frozen Plasma (FFP)</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-zinc-500 block font-medium">Can Donate Plasma To:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {currentComp.plasmaDonates.map((t) => (
                            <Badge key={t} variant="info" size="sm">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-zinc-500 block font-medium">Can Receive Plasma From:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {currentComp.plasmaReceives.map((t) => (
                            <Badge key={t} variant="default" size="sm">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Clinical Disclaimer:</strong> Compatibility matrices assist preliminary coordination. Final transfusion administration requires mandatory bedside laboratory cross-matching by certified blood bank personnel.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-16 bg-[#FAFAFA] border-b border-[#E4E4E7]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#18181B] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-[#71717A] mt-1">
              Common questions about blood availability, privacy, and emergency matching.
            </p>
          </div>

          <div className="space-y-4">
            <Card>
              <CardContent className="p-5 space-y-1">
                <h4 className="text-sm font-bold text-[#18181B]">
                  How does HemoHealth verify hospital inventory records?
                </h4>
                <p className="text-xs text-[#71717A] leading-relaxed">
                  Accredited hospitals and licensed blood banks publish inventory batches with collection dates, cold-chain temperature logs, and lot identifiers. Records older than 24 hours are penalized in match rankings to prevent stale resource dispatches.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 space-y-1">
                <h4 className="text-sm font-bold text-[#18181B]">
                  Is donor contact information made public?
                </h4>
                <p className="text-xs text-[#71717A] leading-relaxed">
                  No. Donors register with full privacy safeguards. Personal phone numbers and home addresses are never published. Emergency invitations are relayed securely through platform dispatch or masked relay unless the donor explicitly opts in.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 space-y-1">
                <h4 className="text-sm font-bold text-[#18181B]">
                  Does HemoHealth replace 911 or emergency medical services?
                </h4>
                <p className="text-xs text-[#71717A] leading-relaxed">
                  No. HemoHealth is a specialized health coordination software tool. For acute life-threatening situations, emergency services (911/112) must always be summoned immediately.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 bg-gradient-to-tr from-[#701A32] to-[#B91C3C] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to Protect Lives in Your Community?
          </h2>
          <p className="text-sm sm:text-base text-rose-100 max-w-2xl mx-auto leading-relaxed">
            Whether you are a healthcare professional managing hospital reserves or a voluntary donor ready to step forward, your involvement saves lives.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/request-blood" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-white text-[#B91C3C] hover:bg-rose-50 font-bold">
                Submit Emergency Request
              </Button>
            </Link>
            <Link href="/donors" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-white/40 hover:bg-white/10 font-semibold">
                Register as Voluntary Donor
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
