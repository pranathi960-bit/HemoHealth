"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Heart,
  Calendar,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Phone,
  Mail,
  Lock,
  ArrowRight,
  Flame,
  Award,
  Check,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/Button";
import { Badge, BloodGroupBadge, UrgencyBadge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { HemoStore, subscribeToStore } from "@/lib/data/store";
import { BloodRequest, DonorProfile, RequestResponse } from "@/types";

export default function DonorDashboardPage() {
  const { success, info } = useToast();

  const [donors, setDonors] = useState<DonorProfile[]>([]);
  const [activeDonor, setActiveDonor] = useState<DonorProfile | null>(null);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [responses, setResponses] = useState<RequestResponse[]>([]);

  // Accept donation modal
  const [acceptTargetRequest, setAcceptTargetRequest] = useState<BloodRequest | null>(null);
  const [donationTime, setDonationTime] = useState<string>("Today, 15:00");
  const [donorNotes, setDonorNotes] = useState<string>("Ready for whole blood donation at inpatient clinic.");

  useEffect(() => {
    const update = () => {
      const allDonors = HemoStore.getDonors();
      const allReqs = HemoStore.getRequests();
      const allResp = HemoStore.getResponses();

      setDonors(allDonors);
      setRequests(allReqs);
      setResponses(allResp);

      if (!activeDonor && allDonors.length > 0) {
        setActiveDonor(allDonors[0]);
      } else if (activeDonor) {
        const refreshed = allDonors.find((d) => d.id === activeDonor.id);
        if (refreshed) setActiveDonor(refreshed);
      }
    };
    update();
    const unsub = subscribeToStore(update);
    return () => unsub();
  }, [activeDonor]);

  const handleToggleAvailability = () => {
    if (!activeDonor) return;
    const nextState = !activeDonor.isAvailable;
    HemoStore.updateDonorAvailability(activeDonor.id, nextState);
    setActiveDonor((prev) => (prev ? { ...prev, isAvailable: nextState } : null));

    if (nextState) {
      success("Availability Active", "You will receive urgent emergency shortage alerts.");
    } else {
      info("Availability Paused", "Notifications temporarily paused. You can reactivate anytime.");
    }
  };

  const handleTogglePrivacy = () => {
    if (!activeDonor) return;
    const nextVal = !activeDonor.privacyShowPhonePublic;
    HemoStore.updateDonorPrivacy(activeDonor.id, nextVal);
    setActiveDonor((prev) => (prev ? { ...prev, privacyShowPhonePublic: nextVal } : null));
    success("Privacy Setting Updated", nextVal ? "Phone visible on emergency cards." : "Phone protected behind dispatch.");
  };

  const handleConfirmAccept = () => {
    if (!acceptTargetRequest || !activeDonor) return;

    HemoStore.addResponse({
      requestId: acceptTargetRequest.id,
      responderType: "donor",
      responderId: activeDonor.id,
      responderName: `${activeDonor.fullName} (${activeDonor.bloodGroup} Donor)`,
      responderContact: activeDonor.phone,
      bloodGroup: activeDonor.bloodGroup,
      unitsOffered: 1,
      status: "accepted",
      estimatedArrival: donationTime,
      notes: donorNotes,
    });

    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#15803D", "#B91C3C", "#3B82F6"],
      });
    } catch {
      // Ignore
    }

    success("Donation Confirmed!", `Committed to Request ${acceptTargetRequest.requestNumber}. Thank you for saving a life!`);
    setAcceptTargetRequest(null);
  };

  if (!activeDonor) {
    return (
      <div className="min-h-screen py-12 text-center">
        <p className="text-zinc-500">Loading Donor Profile...</p>
      </div>
    );
  }

  // Filter urgent requests matching donor's city or compatible blood group
  const matchingUrgentRequests = requests.filter(
    (r) => r.status !== "fulfilled" && r.status !== "cancelled"
  );

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Donor Switcher Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E4E4E7]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              Simulated Donor:
            </span>
            <select
              value={activeDonor.id}
              onChange={(e) => {
                const sel = donors.find((d) => d.id === e.target.value);
                if (sel) setActiveDonor(sel);
              }}
              className="text-xs font-bold bg-zinc-50 border border-zinc-200 rounded-lg p-1.5 focus:ring-2 focus:ring-[#B91C3C]"
            >
              {donors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.fullName} ({d.bloodGroup} - {d.city})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/donors">
              <Button size="sm" variant="outline" className="text-xs">
                + Register New Donor
              </Button>
            </Link>
          </div>
        </div>

        {/* Profile Card & Metric Banners */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 4 Cols: Donor Profile Summary */}
          <div className="lg:col-span-4 space-y-6">
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <BloodGroupBadge bloodGroup={activeDonor.bloodGroup} size="lg" />
                    <div>
                      <h2 className="text-lg font-black text-zinc-900 leading-tight">
                        {activeDonor.fullName}
                      </h2>
                      <div className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span>{activeDonor.city}, {activeDonor.state}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Availability Toggle */}
                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-zinc-900 block">
                        Emergency Readiness
                      </span>
                      <span className="text-[11px] text-zinc-500">
                        {activeDonor.isAvailable ? "Active for emergency alerts" : "Temporarily paused"}
                      </span>
                    </div>

                    <button
                      onClick={handleToggleAvailability}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        activeDonor.isAvailable ? "bg-[#15803D]" : "bg-zinc-300"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          activeDonor.isAvailable ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Impact Metrics */}
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                    <div className="text-xl font-black text-[#B91C3C]">
                      {activeDonor.totalDonations}
                    </div>
                    <div className="text-[11px] text-zinc-500">Donations Logged</div>
                  </div>

                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                    <div className="text-xl font-black text-emerald-700">
                      {activeDonor.totalDonations * 3}
                    </div>
                    <div className="text-[11px] text-zinc-500">Lives Supported</div>
                  </div>
                </div>

                {/* Privacy & Contact Settings */}
                <div className="space-y-3 pt-2 border-t border-zinc-100 text-xs">
                  <span className="font-bold text-zinc-700 block uppercase tracking-wider text-[10px]">
                    Privacy & Communications
                  </span>

                  <div className="flex items-center justify-between text-zinc-600">
                    <span>Contact Channel:</span>
                    <Badge variant="default" size="sm">{activeDonor.preferredContact.toUpperCase()}</Badge>
                  </div>

                  <div className="flex items-center justify-between text-zinc-600">
                    <span>Travel Radius:</span>
                    <span className="font-semibold">{activeDonor.radiusKm} km</span>
                  </div>

                  <div className="flex items-center justify-between text-zinc-600 pt-1">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Phone Visibility:</span>
                    </span>
                    <button
                      onClick={handleTogglePrivacy}
                      className="text-[11px] font-bold text-[#B91C3C] hover:underline cursor-pointer"
                    >
                      {activeDonor.privacyShowPhonePublic ? "Public Desk" : "Masked / Protected"}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Health Checklist reminder */}
            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-xs text-rose-900 space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-[#B91C3C]">
                <ShieldCheck className="w-4 h-4" />
                <span>Pre-Donation Guidelines</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Stay well-hydrated (drink 500ml water before donation), eat a healthy iron-rich meal, and bring a valid photo ID to the collection hospital.
              </p>
            </div>
          </div>

          {/* Right 8 Cols: Incoming Invitations & Urgent Shortages */}
          <div className="lg:col-span-8 space-y-6">
            <Card>
              <CardHeader className="bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold">
                      Incoming Emergency Invitations & Community Shortages
                    </CardTitle>
                    <CardDescription>
                      Regional hospital requests currently seeking {activeDonor.bloodGroup} or compatible blood products.
                    </CardDescription>
                  </div>
                  <Badge variant="crimson" size="sm">
                    {matchingUrgentRequests.length} Open Needs
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                {matchingUrgentRequests.length === 0 ? (
                  <div className="p-12 text-center text-xs text-zinc-400">
                    No active emergency requests in your area at this moment.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {matchingUrgentRequests.map((req) => (
                      <div
                        key={req.id}
                        className="p-4 rounded-xl bg-white border border-zinc-200 hover:border-[#B91C3C]/50 transition-all shadow-xs space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <BloodGroupBadge bloodGroup={req.bloodGroup} size="sm" />
                            <div>
                              <div className="text-sm font-bold text-zinc-900">{req.hospitalName}</div>
                              <div className="text-xs text-zinc-500">
                                {req.city} • Required: {req.unitsRequired} Units {req.component}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <UrgencyBadge urgency={req.urgency} />
                          </div>
                        </div>

                        {req.medicalReason && (
                          <div className="p-2.5 bg-zinc-50 rounded-lg text-xs text-zinc-600 border border-zinc-100">
                            <strong>Clinical Context:</strong> {req.medicalReason}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-1 text-xs">
                          <span className="text-zinc-400 font-mono">ID: {req.requestNumber}</span>
                          <div className="flex items-center gap-2">
                            <Link href={`/track-request?id=${req.requestNumber}`}>
                              <Button size="sm" variant="outline" className="text-xs">
                                View Tracker
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => setAcceptTargetRequest(req)}
                              className="font-bold text-xs"
                            >
                              Accept & Commit Donation
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Response History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-bold">
                  Your Recent Response History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {responses.filter((r) => r.responderId === activeDonor.id).length === 0 ? (
                  <div className="p-6 text-center text-xs text-zinc-400">
                    No response commitments recorded yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {responses
                      .filter((r) => r.responderId === activeDonor.id)
                      .map((resp) => (
                        <div
                          key={resp.id}
                          className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-zinc-900 block">
                              Offered {resp.unitsOffered} Unit of {resp.bloodGroup}
                            </span>
                            <span className="text-zinc-500 text-[11px]">
                              {resp.estimatedArrival || "Dispatched"}
                            </span>
                          </div>
                          <Badge variant="success" size="sm">
                            Accepted & Logged
                          </Badge>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Accept Donation Modal */}
        {acceptTargetRequest && (
          <Modal
            isOpen={Boolean(acceptTargetRequest)}
            onClose={() => setAcceptTargetRequest(null)}
            title="Confirm Donation Commitment"
            description={`Commit 1 voluntary unit of ${activeDonor.bloodGroup} to ${acceptTargetRequest.hospitalName}.`}
          >
            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 space-y-1">
                <div className="font-bold">
                  Target Request: {acceptTargetRequest.requestNumber}
                </div>
                <p>
                  Required: {acceptTargetRequest.unitsRequired} units of {acceptTargetRequest.bloodGroup} {acceptTargetRequest.component} ({acceptTargetRequest.hospitalName})
                </p>
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">
                  Estimated Arrival Time at Hospital Blood Bank:
                </label>
                <input
                  type="text"
                  value={donationTime}
                  onChange={(e) => setDonationTime(e.target.value)}
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-[#B91C3C]"
                  placeholder="e.g. Today at 15:30 or Within 2 hours"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">
                  Donor Notes / Transportation Confirmation:
                </label>
                <textarea
                  rows={2}
                  value={donorNotes}
                  onChange={(e) => setDonorNotes(e.target.value)}
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-[#B91C3C]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
                <Button size="sm" variant="outline" onClick={() => setAcceptTargetRequest(null)}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" onClick={handleConfirmAccept} className="font-bold">
                  Confirm & Commit Donation
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
