"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  UserCheck,
  Lock,
  ArrowRight,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/Button";
import { Badge, BloodGroupBadge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { HemoStore, subscribeToStore } from "@/lib/data/store";
import { donorRegistrationSchema, DonorRegistrationFormData } from "@/lib/validation/schemas";
import { BloodGroup, DonorProfile } from "@/types";

export default function DonorsPage() {
  const { success, error } = useToast();
  const [donors, setDonors] = useState<DonorProfile[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registeredDonor, setRegisteredDonor] = useState<DonorProfile | null>(null);

  const [formData, setFormData] = useState<DonorRegistrationFormData>({
    fullName: "",
    email: "",
    phone: "",
    bloodGroup: "O+",
    city: "Chicago",
    state: "IL",
    preferredContact: "call",
    radiusKm: 25,
    consentEmergencyContact: true,
    medicalScreeningPassed: true,
    privacyShowPhonePublic: false,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const update = () => {
      setDonors(HemoStore.getDonors());
    };
    update();
    const unsub = subscribeToStore(update);
    return () => unsub();
  }, []);

  const handleChange = (field: keyof DonorRegistrationFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    setFormErrors({});

    const result = donorRegistrationSchema.safeParse(formData);

    if (!result.success) {
      setIsRegistering(false);
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        errors[path] = issue.message;
      });
      setFormErrors(errors);
      error("Validation Incomplete", "Please complete all required fields and confirm emergency consent.");
      return;
    }

    try {
      const newDonor = HemoStore.registerDonor(result.data);
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

      setRegisteredDonor(newDonor);
      success("Welcome to the Network!", `Registered as a voluntary ${newDonor.bloodGroup} donor.`);
    } catch {
      error("Registration Error", "Failed to complete donor onboarding.");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-[#701A32] to-[#B91C3C] text-white p-8 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-rose-100 border border-white/20">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Voluntary Donor Coordination</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Join the Voluntary Lifesaver Network
            </h1>
            <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
              When emergency blood shortages strike, voluntary donors make the difference between survival and tragedy. Register your availability with full privacy protection.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <Link href="/donors/dashboard">
              <Button size="md" className="bg-white text-[#B91C3C] hover:bg-rose-50 font-bold">
                Open Donor Portal
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 7 Cols: Registration Form */}
          <div className="lg:col-span-7">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold">
                  Volunteer Donor Registration
                </CardTitle>
                <CardDescription>
                  Enter your blood group and communication preferences. Your contact number remains private.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Blood Group */}
                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-2">
                      Your Blood Group <span className="text-[#B91C1C]">*</span>
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                      {(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as BloodGroup[]).map((bg) => (
                        <button
                          type="button"
                          key={bg}
                          onClick={() => handleChange("bloodGroup", bg)}
                          className={`py-2 px-2.5 rounded-xl font-bold text-sm border transition-all cursor-pointer ${
                            formData.bloodGroup === bg
                              ? "bg-[#B91C3C] text-white border-[#B91C3C] shadow-xs scale-105"
                              : "bg-zinc-50 text-zinc-800 border-zinc-200 hover:bg-zinc-100"
                          }`}
                        >
                          {bg}
                        </button>
                      ))}
                    </div>
                    {formErrors.bloodGroup && (
                      <p className="text-xs text-[#B91C1C] font-semibold mt-1">{formErrors.bloodGroup}</p>
                    )}
                  </div>

                  {/* Personal Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-zinc-700 block mb-1">
                        Full Name <span className="text-[#B91C1C]">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Jordan Miller"
                        value={formData.fullName}
                        onChange={(e) => handleChange("fullName", e.target.value)}
                        className={`w-full p-2.5 text-sm bg-zinc-50 border rounded-lg focus:ring-2 focus:ring-[#B91C3C] focus:bg-white ${
                          formErrors.fullName ? "border-[#B91C1C]" : "border-zinc-200"
                        }`}
                      />
                      {formErrors.fullName && (
                        <p className="text-xs text-[#B91C1C] font-semibold mt-1">{formErrors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-bold text-zinc-700 block mb-1">
                        Phone Number <span className="text-[#B91C1C]">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. (312) 555-0182"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className={`w-full p-2.5 text-sm bg-zinc-50 border rounded-lg focus:ring-2 focus:ring-[#B91C3C] focus:bg-white ${
                          formErrors.phone ? "border-[#B91C1C]" : "border-zinc-200"
                        }`}
                      />
                      {formErrors.phone && (
                        <p className="text-xs text-[#B91C1C] font-semibold mt-1">{formErrors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-bold text-zinc-700 block mb-1">
                        Email Address <span className="text-[#B91C1C]">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="jordan@example.com"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className={`w-full p-2.5 text-sm bg-zinc-50 border rounded-lg focus:ring-2 focus:ring-[#B91C3C] focus:bg-white ${
                          formErrors.email ? "border-[#B91C1C]" : "border-zinc-200"
                        }`}
                      />
                      {formErrors.email && (
                        <p className="text-xs text-[#B91C1C] font-semibold mt-1">{formErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-bold text-zinc-700 block mb-1">
                        Preferred Contact Method
                      </label>
                      <select
                        value={formData.preferredContact}
                        onChange={(e) => handleChange("preferredContact", e.target.value)}
                        className="w-full p-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-[#B91C3C]"
                      >
                        <option value="call">Phone Call (Emergency desk)</option>
                        <option value="sms">SMS Text Message</option>
                        <option value="whatsapp">WhatsApp Alert</option>
                        <option value="email">Email Notification</option>
                      </select>
                    </div>
                  </div>

                  {/* Location & Radius */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-zinc-700 block mb-1">
                        City <span className="text-[#B91C1C]">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Chicago"
                        value={formData.city}
                        onChange={(e) => handleChange("city", e.target.value)}
                        className="w-full p-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-[#B91C3C]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-zinc-700 block mb-1">
                        State <span className="text-[#B91C1C]">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. IL"
                        value={formData.state}
                        onChange={(e) => handleChange("state", e.target.value)}
                        className="w-full p-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-[#B91C3C]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-zinc-700 block mb-1">
                        Travel Radius (km)
                      </label>
                      <input
                        type="number"
                        min={5}
                        max={150}
                        value={formData.radiusKm}
                        onChange={(e) => handleChange("radiusKm", e.target.value)}
                        className="w-full p-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-[#B91C3C]"
                      />
                    </div>
                  </div>

                  {/* Consents & Privacy Checks */}
                  <div className="space-y-3 pt-2 border-t border-zinc-100 text-xs">
                    <label className="flex items-start gap-2.5 cursor-pointer p-3 bg-zinc-50 rounded-xl border border-zinc-200 hover:bg-zinc-100/60 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.consentEmergencyContact}
                        onChange={(e) => handleChange("consentEmergencyContact", e.target.checked)}
                        className="w-4 h-4 text-[#B91C3C] rounded border-zinc-300 focus:ring-[#B91C3C] mt-0.5"
                      />
                      <div className="text-zinc-700">
                        <span className="font-bold block">Consent to Emergency Contact:</span>
                        I consent to receive urgent shortage invitations when my blood group is critically required by regional hospitals.
                      </div>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer p-3 bg-zinc-50 rounded-xl border border-zinc-200 hover:bg-zinc-100/60 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.privacyShowPhonePublic}
                        onChange={(e) => handleChange("privacyShowPhonePublic", e.target.checked)}
                        className="w-4 h-4 text-[#B91C3C] rounded border-zinc-300 focus:ring-[#B91C3C] mt-0.5"
                      />
                      <div className="text-zinc-700">
                        <span className="font-bold flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5 text-zinc-500" />
                          <span>Direct Phone Display (Optional)</span>
                        </span>
                        Leave unchecked to keep phone number strictly protected behind platform dispatch.
                      </div>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    variant="primary"
                    isLoading={isRegistering}
                    className="w-full font-bold shadow-sm"
                  >
                    Register as Voluntary Blood Donor
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right 5 Cols: Active Donor Directory Preview */}
          <div className="lg:col-span-5 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold">
                    Voluntary Donor Community
                  </CardTitle>
                  <Badge variant="default" size="sm">{donors.length} Registered</Badge>
                </div>
                <CardDescription>
                  Anonymized profiles of active voluntary donors ready for emergency mobilization.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 space-y-3">
                {donors.map((donor) => {
                  const initials = `${donor.fullName.split(" ")[0]} ${
                    donor.fullName.split(" ")[1]?.[0] || ""
                  }.`;

                  return (
                    <div
                      key={donor.id}
                      className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <BloodGroupBadge bloodGroup={donor.bloodGroup} size="sm" />
                        <div>
                          <div className="text-xs font-bold text-zinc-900">{initials}</div>
                          <div className="text-[11px] text-zinc-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{donor.city}, {donor.state}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <Badge variant={donor.isAvailable ? "success" : "default"} size="sm">
                          {donor.isAvailable ? "Available" : "Paused"}
                        </Badge>
                        <div className="text-[10px] text-zinc-400 mt-1">
                          {donor.totalDonations} donation(s)
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Screening Eligibility Notice */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Medical Screening Integrity</span>
              </div>
              <p className="leading-relaxed text-[11px] text-emerald-800">
                Registration establishes communication readiness. Certified bedside hemoglobin screening and medical questionnaire completion remain mandatory prior to every whole blood or platelet collection.
              </p>
            </div>
          </div>
        </div>

        {/* Onboarding Confirmation Modal */}
        {registeredDonor && (
          <Modal
            isOpen={Boolean(registeredDonor)}
            onClose={() => setRegisteredDonor(null)}
            title="Donor Profile Active"
            description="Thank you for joining the HemoHealth voluntary blood registry!"
            maxWidth="sm"
          >
            <div className="text-center space-y-4 py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <UserCheck className="w-6 h-6" />
              </div>

              <div className="space-y-1 text-xs text-zinc-600">
                <p>
                  You are registered as an active <strong>{registeredDonor.bloodGroup}</strong> donor in <strong>{registeredDonor.city}</strong>.
                </p>
                <p className="text-[11px] text-zinc-500">
                  You can pause your availability anytime in your personal dashboard.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <Link href="/donors/dashboard" className="w-full">
                  <Button variant="primary" size="md" className="w-full font-bold">
                    Open Donor Dashboard
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={() => setRegisteredDonor(null)}>
                  Close
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
