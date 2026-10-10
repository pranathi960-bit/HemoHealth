"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  Phone,
  Sparkles,
  Printer,
  XCircle,
  Flame,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/Button";
import { Badge, BloodGroupBadge, RequestStatusBadge, UrgencyBadge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { HemoStore, subscribeToStore } from "@/lib/data/store";
import { formatDateTime, formatRelativeTime } from "@/lib/utils";
import { BloodRequest, RequestResponse, RequestStatus } from "@/types";

function TrackRequestContent() {
  const searchParams = useSearchParams();
  const { success, info } = useToast();

  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [responses, setResponses] = useState<RequestResponse[]>([]);
  const [searchId, setSearchId] = useState<string>("");
  const [activeRequest, setActiveRequest] = useState<BloodRequest | null>(null);

  // Cancellation modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    const update = () => {
      const allReqs = HemoStore.getRequests();
      setRequests(allReqs);
      setResponses(HemoStore.getResponses());

      // Check query param
      const idParam = searchParams.get("id");
      if (idParam) {
        const found = allReqs.find(
          (r) => r.requestNumber.toLowerCase() === idParam.toLowerCase() || r.id === idParam
        );
        if (found) {
          setActiveRequest(found);
          setSearchId(found.requestNumber);
        } else if (allReqs.length > 0 && !activeRequest) {
          setActiveRequest(allReqs[0]);
          setSearchId(allReqs[0].requestNumber);
        }
      } else if (allReqs.length > 0 && !activeRequest) {
        setActiveRequest(allReqs[0]);
        setSearchId(allReqs[0].requestNumber);
      }
    };
    update();
    const unsub = subscribeToStore(update);
    return () => unsub();
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    const found = requests.find(
      (r) =>
        r.requestNumber.toLowerCase() === searchId.trim().toLowerCase() ||
        r.id.toLowerCase() === searchId.trim().toLowerCase()
    );

    if (found) {
      setActiveRequest(found);
      info("Request Loaded", `Viewing tracker for ${found.requestNumber}`);
    } else {
      info("Request Not Found", `No requisition matching ID '${searchId}' was found.`);
    }
  };

  const handleSelectRequest = (req: BloodRequest) => {
    setActiveRequest(req);
    setSearchId(req.requestNumber);
  };

  // Status transitions for interactive testing
  const handleTransitionStatus = (newStatus: RequestStatus) => {
    if (!activeRequest) return;
    HemoStore.updateRequestStatus(activeRequest.id, newStatus, "Operator Simulator", "admin");
    const updated = HemoStore.getRequestById(activeRequest.id);
    if (updated) setActiveRequest(updated);

    if (newStatus === "fulfilled") {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#15803D", "#B91C3C", "#3B82F6"],
        });
      } catch {
        // Ignore
      }
      success("Requisition Fulfilled", `Request ${activeRequest.requestNumber} is marked as completely fulfilled!`);
    } else {
      success("Status Updated", `Transitioned to ${newStatus.replace("-", " ").toUpperCase()}`);
    }
  };

  const handleCancelSubmit = () => {
    if (!activeRequest) return;
    HemoStore.cancelRequest(activeRequest.id, cancelReason || "Cancelled by clinical team");
    const updated = HemoStore.getRequestById(activeRequest.id);
    if (updated) setActiveRequest(updated);
    setCancelModalOpen(false);
    setCancelReason("");
    info("Request Cancelled", `Request ${activeRequest.requestNumber} has been marked cancelled.`);
  };

  const currentResponses = activeRequest
    ? responses.filter(
        (r) => r.requestId === activeRequest.id || r.requestId === activeRequest.requestNumber
      )
    : [];

  const timelineSteps: { key: RequestStatus; label: string; desc: string }[] = [
    { key: "submitted", label: "1. Requisition Submitted", desc: "Request logged and validated" },
    { key: "under-review", label: "2. Under Clinical Review", desc: "Verifying urgency and component availability" },
    { key: "matching-in-progress", label: "3. Matching Active", desc: "Broadcasting to regional depots & donors" },
    { key: "response-received", label: "4. Response Offered", desc: "Facility or donor committed units" },
    { key: "fulfilled", label: "5. Fulfilled & Dispatched", desc: "Units delivered / cross-match ready" },
  ];

  const getStepIndex = (status: RequestStatus) => {
    if (status === "cancelled") return -1;
    return timelineSteps.findIndex((s) => s.key === status);
  };

  const activeIndex = activeRequest ? getStepIndex(activeRequest.status) : 0;

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E4E4E7] shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-[#18181B] tracking-tight">
                Live Requisition Tracking
              </h1>
              <Badge variant="crimson" size="sm">Active Telemetry</Badge>
            </div>
            <p className="text-xs sm:text-sm text-[#71717A] mt-1">
              Real-time fulfillment stages, incoming unit offers, and clinical dispatch status.
            </p>
          </div>

          {/* Search ID Form */}
          <form onSubmit={handleSearch} className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter REQ-2026-XXXX..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-[#B91C3C] focus:bg-white font-mono"
              />
            </div>
            <Button type="submit" size="md" variant="primary" className="font-bold shrink-0">
              Track
            </Button>
          </form>
        </div>

        {/* Quick-Select Request Tabs */}
        <div className="bg-white p-4 rounded-2xl border border-[#E4E4E7] shadow-xs space-y-2">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
            Select Active Requisition to Inspect:
          </span>
          <div className="flex flex-wrap gap-2">
            {requests.map((req) => (
              <button
                key={req.id}
                onClick={() => handleSelectRequest(req)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  activeRequest?.id === req.id
                    ? "bg-[#FFF1F2] border-[#B91C3C] text-[#B91C3C] shadow-xs ring-1 ring-[#B91C3C]"
                    : "bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                <BloodGroupBadge bloodGroup={req.bloodGroup} size="sm" />
                <div className="text-left">
                  <div className="font-mono font-bold text-[11px]">{req.requestNumber}</div>
                  <div className="text-[10px] text-zinc-500 line-clamp-1">{req.hospitalName}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {activeRequest ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 8 Cols: Timeline and Requisition Details */}
            <div className="lg:col-span-8 space-y-6">
              {/* Timeline Card */}
              <Card>
                <CardHeader className="bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <BloodGroupBadge bloodGroup={activeRequest.bloodGroup} size="md" />
                      <div>
                        <CardTitle className="text-lg sm:text-xl font-black font-mono">
                          {activeRequest.requestNumber}
                        </CardTitle>
                        <CardDescription>
                          {activeRequest.unitsRequired} Unit(s) {activeRequest.bloodGroup} {activeRequest.component}
                        </CardDescription>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <UrgencyBadge urgency={activeRequest.urgency} />
                    <RequestStatusBadge status={activeRequest.status} />
                  </div>
                </CardHeader>

                <CardContent className="p-6 sm:p-8 space-y-8">
                  {/* Visual Step Timeline */}
                  {activeRequest.status === "cancelled" ? (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold">This Requisition Has Been Cancelled</h4>
                        <p className="text-xs mt-0.5">
                          Reason: {activeRequest.cancelledReason || "Cancelled by authorized requester"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      {/* Timeline steps */}
                      <div className="space-y-6">
                        {timelineSteps.map((step, idx) => {
                          const isCompleted = idx <= activeIndex;
                          const isCurrent = idx === activeIndex;

                          return (
                            <div key={step.key} className="flex items-start gap-4 relative">
                              {/* Step circle */}
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 z-10 transition-all ${
                                  isCurrent
                                    ? "bg-[#B91C3C] text-white ring-4 ring-[#FFF1F2]"
                                    : isCompleted
                                    ? "bg-emerald-600 text-white"
                                    : "bg-zinc-100 text-zinc-400 border border-zinc-200"
                                }`}
                              >
                                {isCompleted && !isCurrent ? (
                                  <CheckCircle2 className="w-4 h-4" />
                                ) : (
                                  idx + 1
                                )}
                              </div>

                              {/* Connecting vertical line */}
                              {idx < timelineSteps.length - 1 && (
                                <div
                                  className={`absolute left-4 top-8 w-0.5 h-10 -ml-[1px] ${
                                    idx < activeIndex ? "bg-emerald-600" : "bg-zinc-200"
                                  }`}
                                />
                              )}

                              <div className="flex-1 min-w-0 pt-0.5">
                                <div className="flex items-center justify-between">
                                  <h4
                                    className={`text-sm font-bold ${
                                      isCurrent
                                        ? "text-[#B91C3C]"
                                        : isCompleted
                                        ? "text-zinc-900"
                                        : "text-zinc-400"
                                    }`}
                                  >
                                    {step.label}
                                  </h4>
                                  {isCurrent && (
                                    <span className="text-[11px] font-semibold text-[#B91C3C] bg-[#FFF1F2] px-2 py-0.5 rounded-full border border-[#FECDD3]">
                                      Current Stage
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-zinc-500 mt-0.5">{step.desc}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Simulator Controls Widget */}
                  <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-700">
                        <Sparkles className="w-3.5 h-3.5 text-[#B91C3C]" />
                        <span>Interactive Stage Simulator (Demo Testing)</span>
                      </div>
                      <span className="text-[10px] text-zinc-500">Test lifecycle transitions</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={() => handleTransitionStatus("under-review")}
                      >
                        Set Under Review
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={() => handleTransitionStatus("matching-in-progress")}
                      >
                        Set Matching
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={() => handleTransitionStatus("response-received")}
                      >
                        Set Response Received
                      </Button>
                      <Button
                        size="sm"
                        variant="success"
                        className="text-xs font-bold"
                        onClick={() => handleTransitionStatus("fulfilled")}
                      >
                        Mark as Fulfilled
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Requisition Clinical Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-bold">
                    Clinical Requisition Specification
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 space-y-1">
                      <span className="text-zinc-400 block uppercase text-[10px] font-bold tracking-wider">
                        Patient Information
                      </span>
                      <div className="font-bold text-zinc-900 text-sm">{activeRequest.patientName}</div>
                      <div className="text-zinc-600">
                        Age: {activeRequest.patientAge ? `${activeRequest.patientAge} years` : "Not specified"}
                      </div>
                      <div className="text-zinc-600">
                        Diagnosis: {activeRequest.medicalReason || "Emergency surgical transfusion"}
                      </div>
                    </div>

                    <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 space-y-1">
                      <span className="text-zinc-400 block uppercase text-[10px] font-bold tracking-wider">
                        Hospital & Department
                      </span>
                      <div className="font-bold text-zinc-900 text-sm">{activeRequest.hospitalName}</div>
                      <div className="text-zinc-600">{activeRequest.hospitalAddress || activeRequest.city}</div>
                      <div className="text-zinc-600">
                        Physician: {activeRequest.doctorName || "Emergency Trauma Team"} ({activeRequest.doctorContact || "On Call"})
                      </div>
                    </div>

                    <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 space-y-1">
                      <span className="text-zinc-400 block uppercase text-[10px] font-bold tracking-wider">
                        Requisition Target
                      </span>
                      <div className="font-bold text-zinc-900">
                        {activeRequest.unitsRequired} Unit(s) of {activeRequest.bloodGroup} {activeRequest.component}
                      </div>
                      <div className="text-zinc-600">
                        Target Date: {new Date(activeRequest.requiredDate).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 space-y-1">
                      <span className="text-zinc-400 block uppercase text-[10px] font-bold tracking-wider">
                        Requester Audit Record
                      </span>
                      <div className="font-bold text-zinc-900">{activeRequest.requesterName}</div>
                      <div className="text-zinc-600">Logged: {formatDateTime(activeRequest.createdAt)}</div>
                      <div className="text-zinc-600">Last Update: {formatRelativeTime(activeRequest.updatedAt)}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100">
                    <button
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-700 hover:text-zinc-900 px-3 py-2 bg-zinc-100 rounded-lg cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Requisition Slip</span>
                    </button>

                    {activeRequest.status !== "fulfilled" && activeRequest.status !== "cancelled" && (
                      <button
                        onClick={() => setCancelModalOpen(true)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel Requisition</span>
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right 4 Cols: Responses, Smart Match Link, Emergency Desk */}
            <div className="lg:col-span-4 space-y-6">
              {/* Smart Match CTA Card */}
              <Card className="bg-gradient-to-br from-[#FFF1F2] to-[#FFE4E6] border-[#FECDD3]">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-[#B91C3C] font-bold text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>Run Smart Match Engine</span>
                  </div>
                  <p className="text-xs text-[#701A32] leading-relaxed">
                    Instantly evaluate regional inventory and voluntary donor compatibility for this exact requisition.
                  </p>
                  <Link href={`/smart-match?reqId=${activeRequest.requestNumber}`}>
                    <Button variant="primary" size="sm" className="w-full font-bold mt-1">
                      Inspect Matched Candidates →
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Responses & Offers Received */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold">Responses & Unit Offers</CardTitle>
                    <Badge variant="default" size="sm">{currentResponses.length} Offered</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {currentResponses.length === 0 ? (
                    <div className="p-6 text-center text-xs text-zinc-400 space-y-1">
                      <Clock className="w-6 h-6 text-zinc-300 mx-auto" />
                      <p>Broadcasting to regional depots...</p>
                      <p className="text-[11px] text-zinc-400">Offers will appear here once confirmed.</p>
                    </div>
                  ) : (
                    currentResponses.map((resp) => (
                      <div
                        key={resp.id}
                        className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-xs font-bold text-zinc-900 block leading-tight">
                              {resp.responderName}
                            </span>
                            <span className="text-[11px] text-zinc-500">
                              {resp.responderType === "facility" ? "Certified Facility" : "Voluntary Donor"}
                            </span>
                          </div>
                          <Badge variant="success" size="sm">
                            {resp.unitsOffered} Unit(s) Offered
                          </Badge>
                        </div>

                        {resp.notes && (
                          <p className="text-[11px] text-zinc-600 bg-white p-2 rounded-md border border-zinc-100">
                            {resp.notes}
                          </p>
                        )}

                        <div className="text-[10px] text-zinc-400 flex items-center justify-between">
                          <span>Est. Arrival: {resp.estimatedArrival || "Pending Dispatch"}</span>
                          <span>{formatRelativeTime(resp.createdAt)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Emergency Hotline Assistance Card */}
              <Card className="bg-[#18181B] text-white">
                <CardContent className="p-5 space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-rose-400 font-bold">
                    <Phone className="w-4 h-4" />
                    <span>Emergency Transfusion Assistance</span>
                  </div>
                  <p className="text-zinc-300 leading-relaxed text-[11px]">
                    Need immediate blood depot intervention or cold-chain courier dispatch?
                  </p>
                  <div className="p-2.5 bg-zinc-800 rounded-lg font-mono text-center text-sm font-extrabold text-emerald-400">
                    1-800-555-HEMO (4366)
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center text-zinc-400">No requisition loaded.</div>
        )}

        {/* Cancel Modal */}
        {cancelModalOpen && (
          <Modal
            isOpen={cancelModalOpen}
            onClose={() => setCancelModalOpen(false)}
            title="Cancel Blood Requisition"
            description="Are you sure you want to cancel this emergency request? This will withdraw alerts from all facilities."
            maxWidth="sm"
          >
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  Reason for Cancellation:
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Patient stabilized, units secured from alternate source, or procedure rescheduled..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full p-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-[#B91C3C]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => setCancelModalOpen(false)}>
                  Keep Active
                </Button>
                <Button size="sm" variant="danger" onClick={handleCancelSubmit}>
                  Confirm Cancellation
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}

export default function TrackRequestPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-zinc-500">Loading Request Tracker...</div>}>
      <TrackRequestContent />
    </Suspense>
  );
}
