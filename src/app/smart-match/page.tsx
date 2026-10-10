"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Search,
  ShieldCheck,
  AlertTriangle,
  Clock,
  MapPin,
  HeartHandshake,
  CheckCircle2,
  Droplet,
  ArrowRight,
  Info,
  ChevronDown,
  ChevronUp,
  Flame,
  Send,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/Button";
import { Badge, BloodGroupBadge, VerifiedBadge, UrgencyBadge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { HemoStore, subscribeToStore } from "@/lib/data/store";
import { runSmartMatch, SmartMatchInput } from "@/lib/matching/smartMatcher";
import {
  BloodComponent,
  BloodGroup,
  BloodInventoryItem,
  BloodRequest,
  DonorProfile,
  SmartMatchResult,
  UrgencyLevel,
} from "@/types";

function SmartMatchContent() {
  const searchParams = useSearchParams();
  const { success, info } = useToast();

  const [inventory, setInventory] = useState<BloodInventoryItem[]>([]);
  const [donors, setDonors] = useState<DonorProfile[]>([]);
  const [requests, setRequests] = useState<BloodRequest[]>([]);

  // Search input state
  const [matchInput, setMatchInput] = useState<SmartMatchInput>({
    bloodGroup: "O-",
    component: "Packed Red Blood Cells (PRBC)",
    city: "Chicago",
    unitsRequired: 3,
    urgency: "immediate",
  });

  const [selectedRequestId, setSelectedRequestId] = useState<string>("");
  const [expandedBreakdown, setExpandedBreakdown] = useState<Record<string, boolean>>({});

  // Dispatch offer modal
  const [dispatchTarget, setDispatchTarget] = useState<SmartMatchResult | null>(null);
  const [dispatchUnits, setDispatchUnits] = useState<number>(1);
  const [dispatchNotes, setDispatchNotes] = useState<string>("");

  useEffect(() => {
    const update = () => {
      const inv = HemoStore.getInventory();
      const don = HemoStore.getDonors();
      const req = HemoStore.getRequests();
      setInventory(inv);
      setDonors(don);
      setRequests(req);

      // Check URL query param for prefilled request
      const reqIdParam = searchParams.get("reqId");
      if (reqIdParam) {
        const found = req.find(
          (r) => r.requestNumber.toLowerCase() === reqIdParam.toLowerCase() || r.id === reqIdParam
        );
        if (found) {
          setSelectedRequestId(found.id);
          setMatchInput({
            bloodGroup: found.bloodGroup,
            component: found.component,
            city: found.city,
            unitsRequired: found.unitsRequired,
            urgency: found.urgency,
          });
        }
      }
    };
    update();
    const unsub = subscribeToStore(update);
    return () => unsub();
  }, [searchParams]);

  // Handle request dropdown change
  const handleSelectRequestChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const reqId = e.target.value;
    setSelectedRequestId(reqId);
    if (!reqId) return;

    const found = requests.find((r) => r.id === reqId || r.requestNumber === reqId);
    if (found) {
      setMatchInput({
        bloodGroup: found.bloodGroup,
        component: found.component,
        city: found.city,
        unitsRequired: found.unitsRequired,
        urgency: found.urgency,
      });
      info("Loaded Requisition Criteria", `Synced criteria for ${found.requestNumber}`);
    }
  };

  // Run Smart Match Engine
  const matchResults: SmartMatchResult[] = useMemo(() => {
    return runSmartMatch(matchInput, inventory, donors);
  }, [matchInput, inventory, donors]);

  const toggleBreakdown = (matchId: string) => {
    setExpandedBreakdown((prev) => ({
      ...prev,
      [matchId]: !prev[matchId],
    }));
  };

  const handleOpenDispatch = (res: SmartMatchResult) => {
    setDispatchTarget(res);
    setDispatchUnits(Math.min(res.availableUnits, matchInput.unitsRequired));
    setDispatchNotes(
      res.type === "volunteer_donor"
        ? "Volunteer donor invitation dispatched for immediate donation."
        : `Hospital unit transfer authorized from ${res.sourceName}.`
    );
  };

  const handleConfirmDispatch = () => {
    if (!dispatchTarget) return;

    const targetReq = requests.find((r) => r.id === selectedRequestId) || requests[0];
    if (targetReq) {
      HemoStore.addResponse({
        requestId: targetReq.id,
        responderType: dispatchTarget.type === "volunteer_donor" ? "donor" : "facility",
        responderId: dispatchTarget.facilityId || dispatchTarget.donorId || "resp-gen",
        responderName: dispatchTarget.sourceName,
        responderContact: dispatchTarget.contactNumber,
        bloodGroup: dispatchTarget.bloodGroup,
        unitsOffered: dispatchUnits,
        status: "offered",
        estimatedArrival: dispatchTarget.type === "volunteer_donor" ? "Within 2-3 hours" : "Within 1 hour via courier",
        notes: dispatchNotes,
      });

      try {
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#B91C3C", "#15803D", "#F59E0B"],
        });
      } catch {
        // Ignore
      }

      success(
        "Response Dispatched",
        `Offered ${dispatchUnits} unit(s) of ${dispatchTarget.bloodGroup} to Request ${targetReq.requestNumber}.`
      );
    } else {
      success(
        "Dispatch Dispatched",
        `Dispatched requisition to ${dispatchTarget.sourceName} for ${dispatchUnits} unit(s).`
      );
    }

    setDispatchTarget(null);
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-white via-white to-[#FFF1F2] p-6 sm:p-8 rounded-2xl border border-[#E4E4E7] shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF1F2] text-xs font-bold text-[#B91C3C] border border-[#FECDD3]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Signature Feature</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#18181B] tracking-tight">
                Smart Matching Engine
              </h1>
              <p className="text-xs sm:text-sm text-[#71717A] max-w-2xl">
                Deterministic clinical matching combining component-specific biological compatibility, facility accreditation, inventory freshness, quantity coverage, and geographic proximity.
              </p>
            </div>

            <div className="shrink-0">
              <Link href="/request-blood">
                <Button size="md" variant="primary" className="font-bold">
                  Create New Requisition
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Parameter Configuration Panel */}
        <Card>
          <CardHeader className="bg-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">
                  Matching Query Parameters
                </CardTitle>
                <CardDescription>
                  Select an active clinical requisition or customize criteria to evaluate compatibility.
                </CardDescription>
              </div>

              {selectedRequestId && (
                <Badge variant="crimson" size="sm">
                  Active Request Linked
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            {/* Sync from active requests dropdown */}
            <div>
              <label htmlFor="active-request-select" className="text-xs font-bold text-zinc-700 block mb-1">
                Link to Active Requisition (Optional):
              </label>
              <select
                id="active-request-select"
                aria-label="Link to Active Requisition"
                value={selectedRequestId}
                onChange={handleSelectRequestChange}
                className="w-full p-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-[#B91C3C] focus:bg-white"
              >
                <option value="">-- Custom Simulation Query (No Linked Request) --</option>
                {requests.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.requestNumber} • {r.bloodGroup} {r.component} • {r.hospitalName} ({r.unitsRequired} Units, {r.urgency.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            {/* Grid of Input Parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2 border-t border-zinc-100">
              {/* Blood Group */}
              <div>
                <label htmlFor="blood-group-select" className="text-xs font-bold text-zinc-600 block mb-1">Blood Group</label>
                <select
                  id="blood-group-select"
                  aria-label="Target Blood Group"
                  value={matchInput.bloodGroup}
                  onChange={(e) =>
                    setMatchInput((prev) => ({ ...prev, bloodGroup: e.target.value as BloodGroup }))
                  }
                  className="w-full p-2 text-xs font-bold bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-[#B91C3C]"
                >
                  {(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as BloodGroup[]).map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              {/* Component */}
              <div>
                <label htmlFor="component-select-input" className="text-xs font-bold text-zinc-600 block mb-1">Component</label>
                <select
                  id="component-select-input"
                  aria-label="Target Blood Component"
                  value={matchInput.component}
                  onChange={(e) =>
                    setMatchInput((prev) => ({ ...prev, component: e.target.value as BloodComponent }))
                  }
                  className="w-full p-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-[#B91C3C]"
                >
                  <option value="Packed Red Blood Cells (PRBC)">PRBC (Red Cells)</option>
                  <option value="Whole Blood">Whole Blood</option>
                  <option value="Platelets">Platelets</option>
                  <option value="Fresh Frozen Plasma (FFP)">Fresh Frozen Plasma (FFP)</option>
                  <option value="Cryoprecipitate">Cryoprecipitate</option>
                </select>
              </div>

              {/* City */}
              <div>
                <label htmlFor="target-city-input" className="text-xs font-bold text-zinc-600 block mb-1">Target City</label>
                <input
                  id="target-city-input"
                  type="text"
                  value={matchInput.city}
                  onChange={(e) => setMatchInput((prev) => ({ ...prev, city: e.target.value }))}
                  className="w-full p-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-[#B91C3C]"
                  placeholder="e.g. Chicago"
                />
              </div>

              {/* Units */}
              <div>
                <label htmlFor="required-units-input" className="text-xs font-bold text-zinc-600 block mb-1">Required Units</label>
                <input
                  id="required-units-input"
                  type="number"
                  min={1}
                  max={20}
                  value={matchInput.unitsRequired}
                  onChange={(e) =>
                    setMatchInput((prev) => ({ ...prev, unitsRequired: Number(e.target.value) || 1 }))
                  }
                  className="w-full p-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-[#B91C3C]"
                />
              </div>

              {/* Urgency */}
              <div>
                <label htmlFor="urgency-level-select" className="text-xs font-bold text-zinc-600 block mb-1">Urgency</label>
                <select
                  id="urgency-level-select"
                  aria-label="Target Urgency Level"
                  value={matchInput.urgency}
                  onChange={(e) =>
                    setMatchInput((prev) => ({ ...prev, urgency: e.target.value as UrgencyLevel }))
                  }
                  className="w-full p-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-[#B91C3C]"
                >
                  <option value="immediate">Immediate / Critical</option>
                  <option value="within-24h">Within 24 Hours</option>
                  <option value="within-48h">Within 48 Hours</option>
                  <option value="elective">Elective</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex items-center justify-between text-xs text-zinc-600 px-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-900 text-sm">
              Ranked Compatibility Candidates ({matchResults.length})
            </span>
            <span className="text-[11px] bg-zinc-200/70 px-2 py-0.5 rounded text-zinc-700">
              Evaluated for {matchInput.unitsRequired} units of {matchInput.bloodGroup} {matchInput.component}
            </span>
          </div>
          <span className="text-[11px] text-zinc-400 font-mono hidden sm:inline">
            Deterministic Engine V1
          </span>
        </div>

        {/* Ranked Matches List */}
        {matchResults.length === 0 ? (
          <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center space-y-3">
            <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
            <h3 className="text-base font-bold text-zinc-900">No Compatible Candidates Found</h3>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              No facility or registered voluntary donor matches the biological rules and availability for {matchInput.bloodGroup} {matchInput.component}.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {matchResults.map((result, rank) => {
              const isExpanded = Boolean(expandedBreakdown[result.matchId]);

              const alignmentStyles = {
                Optimal: "bg-emerald-50 text-emerald-700 border-emerald-200",
                Good: "bg-sky-50 text-sky-700 border-sky-200",
                Acceptable: "bg-amber-50 text-amber-700 border-amber-200",
                Contingency: "bg-rose-50 text-rose-700 border-rose-200",
              };

              return (
                <Card
                  key={result.matchId}
                  className={`hover:border-[#B91C3C]/50 transition-all ${
                    rank === 0 ? "border-[#B91C3C]/40 ring-1 ring-[#B91C3C]/20" : ""
                  }`}
                >
                  <CardContent className="p-6 space-y-4">
                    {/* Top Row: Rank, Source, Score */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        {/* Rank Badge */}
                        <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-700 flex items-center justify-center font-black text-xs shrink-0 border border-zinc-200">
                          #{rank + 1}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-bold text-zinc-900 leading-tight">
                              {result.sourceName}
                            </h3>
                            {result.type === "verified_facility" && (
                              <VerifiedBadge label="Verified Blood Depot" />
                            )}
                            {result.type === "volunteer_donor" && (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#B91C3C] bg-[#FFF1F2] px-2 py-0.5 rounded-full border border-[#FECDD3]">
                                <HeartHandshake className="w-3.5 h-3.5" />
                                <span>Voluntary Donor</span>
                              </span>
                            )}
                            {result.type === "unverified_facility" && (
                              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                Unverified Facility
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-zinc-500 flex items-center gap-2 mt-1">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{result.city}</span>
                            </span>
                            <span>•</span>
                            <span>
                              Stock: <strong>{result.availableUnits} unit(s)</strong>
                            </span>
                            <span>•</span>
                            <span className="font-semibold text-zinc-700">
                              Donor Group: {result.bloodGroup}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Overall Composite Score Pill */}
                      <div className="flex items-center sm:flex-col sm:items-end gap-2 shrink-0">
                        <div className="flex items-center gap-2">
                          <div className="text-2xl font-black text-[#B91C3C]">
                            {result.overallScore}%
                          </div>
                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                              alignmentStyles[result.urgencyAlignment]
                            }`}
                          >
                            {result.urgencyAlignment}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          Composite Score
                        </span>
                      </div>
                    </div>

                    {/* Recommendation Action & Biological Compatibility Note */}
                    <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-0.5">
                        <div className="font-semibold text-zinc-900 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{result.breakdown.bloodCompatibility.reason}</span>
                        </div>
                        <div className="text-zinc-500 text-[11px]">
                          {result.recommendationAction}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => toggleBreakdown(result.matchId)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-600 hover:text-zinc-900 px-2.5 py-1.5 bg-white border border-zinc-200 rounded-lg transition-colors cursor-pointer"
                        >
                          <span>{isExpanded ? "Hide Breakdown" : "View Breakdown"}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleOpenDispatch(result)}
                          leftIcon={<Send className="w-3.5 h-3.5" />}
                          className="font-bold text-xs"
                        >
                          Dispatch Requisition
                        </Button>
                      </div>
                    </div>

                    {/* Expandable Multi-Factor Score Breakdown */}
                    {isExpanded && (
                      <div className="p-4 bg-white rounded-xl border border-zinc-200 space-y-3 animate-in fade-in-50 duration-200">
                        <div className="text-xs font-bold uppercase tracking-wider text-zinc-500 pb-1 border-b border-zinc-100">
                          Deterministic Multi-Factor Scoring Breakdown
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                          {/* Factor 1: Biological Compatibility */}
                          <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-zinc-700">Biological ABO/Rh</span>
                              <Badge variant="crimson" size="sm">{result.breakdown.bloodCompatibility.score}%</Badge>
                            </div>
                            <p className="text-[11px] text-zinc-500">{result.breakdown.bloodCompatibility.reason}</p>
                          </div>

                          {/* Factor 2: Component Suitability */}
                          <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-zinc-700">Component Suitability</span>
                              <Badge variant="default" size="sm">{result.breakdown.componentMatch.score}%</Badge>
                            </div>
                            <p className="text-[11px] text-zinc-500">{result.breakdown.componentMatch.reason}</p>
                          </div>

                          {/* Factor 3: Proximity */}
                          <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-zinc-700">Location Proximity</span>
                              <Badge variant="info" size="sm">{result.breakdown.locationProximity.score}%</Badge>
                            </div>
                            <p className="text-[11px] text-zinc-500">{result.breakdown.locationProximity.reason}</p>
                          </div>

                          {/* Factor 4: Quantity Coverage */}
                          <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-zinc-700">Quantity Coverage</span>
                              <Badge variant="success" size="sm">{result.breakdown.quantityCoverage.score}%</Badge>
                            </div>
                            <p className="text-[11px] text-zinc-500">{result.breakdown.quantityCoverage.reason}</p>
                          </div>

                          {/* Factor 5: Freshness */}
                          <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-zinc-700">Data Freshness</span>
                              <Badge variant="default" size="sm">{result.breakdown.dataFreshness.score}%</Badge>
                            </div>
                            <p className="text-[11px] text-zinc-500">{result.breakdown.dataFreshness.reason}</p>
                          </div>

                          {/* Factor 6: Verification */}
                          <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-zinc-700">Facility Verification</span>
                              <Badge variant="success" size="sm">{result.breakdown.verificationReliability.score}%</Badge>
                            </div>
                            <p className="text-[11px] text-zinc-500">{result.breakdown.verificationReliability.reason}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Dispatch Requisition Confirmation Modal */}
        {dispatchTarget && (
          <Modal
            isOpen={Boolean(dispatchTarget)}
            onClose={() => setDispatchTarget(null)}
            title={`Coordinate Requisition with ${dispatchTarget.sourceName}`}
            description="Authorize emergency unit allocation and dispatch courier/volunteer coordination."
          >
            <div className="space-y-4">
              <div className="p-3.5 bg-[#FFF1F2] rounded-xl border border-[#FECDD3] text-xs text-[#701A32] space-y-1">
                <div className="font-bold text-[#B91C3C] text-sm">
                  Match Score: {dispatchTarget.overallScore}% ({dispatchTarget.urgencyAlignment})
                </div>
                <p>{dispatchTarget.breakdown.bloodCompatibility.reason}</p>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  Units to Requisition (Available: {dispatchTarget.availableUnits}):
                </label>
                <input
                  type="number"
                  min={1}
                  max={dispatchTarget.availableUnits}
                  value={dispatchUnits}
                  onChange={(e) => setDispatchUnits(Number(e.target.value) || 1)}
                  className="w-full p-2 text-sm bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-[#B91C3C]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  Requisition & Dispatch Instructions:
                </label>
                <textarea
                  rows={3}
                  value={dispatchNotes}
                  onChange={(e) => setDispatchNotes(e.target.value)}
                  className="w-full p-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-[#B91C3C]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
                <Button size="sm" variant="outline" onClick={() => setDispatchTarget(null)}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" onClick={handleConfirmDispatch} className="font-bold">
                  Confirm Dispatch Offer
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}

export default function SmartMatchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-zinc-500">Loading Smart Match Engine...</div>}>
      <SmartMatchContent />
    </Suspense>
  );
}
