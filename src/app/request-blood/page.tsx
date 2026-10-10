"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  AlertTriangle,
  Flame,
  Clock,
  ShieldAlert,
  Droplet,
  Building2,
  Phone,
  FileCheck,
  CheckCircle2,
  Sparkles,
  Info,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/Button";
import { Badge, BloodGroupBadge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { HemoStore } from "@/lib/data/store";
import { emergencyRequestSchema, EmergencyRequestFormData } from "@/lib/validation/schemas";
import { BloodComponent, BloodGroup, BloodRequest, UrgencyLevel } from "@/types";

function RequestBloodForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { success, error } = useToast();

  const [formData, setFormData] = useState<EmergencyRequestFormData>({
    requesterName: "",
    requesterPhone: "",
    requesterEmail: "",
    patientName: "",
    patientAge: undefined,
    hospitalName: "",
    hospitalAddress: "",
    city: "Chicago",
    bloodGroup: "O-",
    component: "Packed Red Blood Cells (PRBC)",
    unitsRequired: 2,
    urgency: "immediate",
    requiredDate: "2026-04-15",
    medicalReason: "",
    doctorName: "",
    doctorContact: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<BloodRequest | null>(null);

  // Prefill from search parameters if present
  useEffect(() => {
    const bgParam = searchParams.get("bloodGroup");
    const compParam = searchParams.get("component");
    const cityParam = searchParams.get("city");

    setFormData((prev) => ({
      ...prev,
      bloodGroup: (bgParam as BloodGroup) || prev.bloodGroup,
      component: (compParam as BloodComponent) || prev.component,
      city: cityParam || prev.city,
    }));
  }, [searchParams]);

  const handleChange = (field: keyof EmergencyRequestFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear specific field error on change
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
    setIsSubmitting(true);
    setFormErrors({});

    const result = emergencyRequestSchema.safeParse(formData);

    if (!result.success) {
      setIsSubmitting(false);
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        errors[path] = issue.message;
      });
      setFormErrors(errors);
      error("Validation Error", "Please review and complete all required highlighted fields.");
      return;
    }

    try {
      // Create request in data store
      const newReq = HemoStore.createRequest({
        requesterName: result.data.requesterName,
        requesterPhone: result.data.requesterPhone,
        requesterEmail: result.data.requesterEmail,
        patientName: result.data.patientName,
        patientAge: result.data.patientAge,
        hospitalName: result.data.hospitalName,
        hospitalAddress: result.data.hospitalAddress,
        city: result.data.city,
        bloodGroup: result.data.bloodGroup,
        component: result.data.component,
        unitsRequired: result.data.unitsRequired,
        urgency: result.data.urgency,
        requiredDate: result.data.requiredDate,
        medicalReason: result.data.medicalReason,
        doctorName: result.data.doctorName,
        doctorContact: result.data.doctorContact,
      });

      // Fire celebratory confetti on successful triage broadcast
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#B91C3C", "#701A32", "#15803D"],
        });
      } catch {
        // Ignore confetti error
      }

      setSubmittedRequest(newReq);
      success("Requisition Broadcast", `Assigned ID ${newReq.requestNumber}. Smart Matching is active.`);
    } catch (err) {
      error("Submission Failed", "An error occurred while creating request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Emergency Notice Banner */}
        <div className="bg-[#FFF1F2] border border-[#FECDD3] rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
          <ShieldAlert className="w-5 h-5 text-[#B91C3C] shrink-0 mt-0.5" />
          <div className="text-xs text-[#701A32] space-y-1">
            <h4 className="font-bold text-sm text-[#B91C3C]">
              Critical Blood Requisition Protocol
            </h4>
            <p className="leading-relaxed">
              Submissions directly alert regional hospital transfusion services and volunteer emergency donor networks. For extreme code-red emergencies, simultaneously contact your hospital’s inpatient blood bank directly.
            </p>
          </div>
        </div>

        {/* Main Form Card */}
        <Card className="shadow-sm">
          <CardHeader className="bg-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl sm:text-2xl font-black">
                  Submit Blood Requisition
                </CardTitle>
                <CardDescription>
                  Complete all clinical details to initiate multi-factor smart matching.
                </CardDescription>
              </div>
              <Badge variant="crimson" size="sm">
                Live Dispatch
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Section 1: Blood Specification */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
                  <Droplet className="w-4 h-4 text-[#B91C3C] fill-[#B91C3C]" />
                  <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
                    1. Blood Component & Urgency Specification
                  </h3>
                </div>

                {/* Blood Group Selection */}
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-2">
                    Patient Blood Group <span className="text-[#B91C1C]">*</span>
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as BloodGroup[]).map((bg) => (
                      <button
                        type="button"
                        key={bg}
                        onClick={() => handleChange("bloodGroup", bg)}
                        className={`py-2.5 px-3 rounded-xl font-bold text-sm border transition-all cursor-pointer ${
                          formData.bloodGroup === bg
                            ? "bg-[#B91C3C] text-white border-[#B91C3C] shadow-sm scale-105"
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

                {/* Component & Quantity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="component-field" className="text-xs font-bold text-zinc-700 block mb-1">
                      Required Blood Component <span className="text-[#B91C1C]">*</span>
                    </label>
                    <select
                      id="component-field"
                      aria-label="Required Blood Component"
                      value={formData.component}
                      onChange={(e) => handleChange("component", e.target.value as BloodComponent)}
                      className="w-full p-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-[#B91C3C] focus:bg-white"
                    >
                      <option value="Packed Red Blood Cells (PRBC)">Packed Red Blood Cells (PRBC)</option>
                      <option value="Whole Blood">Whole Blood</option>
                      <option value="Platelets">Platelets</option>
                      <option value="Fresh Frozen Plasma (FFP)">Fresh Frozen Plasma (FFP)</option>
                      <option value="Cryoprecipitate">Cryoprecipitate</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="units-field" className="text-xs font-bold text-zinc-700 block mb-1">
                      Units Required <span className="text-[#B91C1C]">*</span>
                    </label>
                    <input
                      id="units-field"
                      type="number"
                      min={1}
                      max={50}
                      value={formData.unitsRequired}
                      onChange={(e) => handleChange("unitsRequired", e.target.value)}
                      className="w-full p-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-[#B91C3C] focus:bg-white"
                    />
                    {formErrors.unitsRequired && (
                      <p className="text-xs text-[#B91C1C] font-semibold mt-1">{formErrors.unitsRequired}</p>
                    )}
                  </div>
                </div>

                {/* Urgency & Required Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-1">
                      Clinical Urgency Level <span className="text-[#B91C1C]">*</span>
                    </label>
                    <div className="space-y-2">
                      {[
                        { id: "immediate", label: "Immediate / Critical (Trauma/Hemorrhage)", icon: <Flame className="w-4 h-4 text-red-600" /> },
                        { id: "within-24h", label: "Within 24 Hours (Urgent Inpatient)", icon: <Clock className="w-4 h-4 text-amber-600" /> },
                        { id: "within-48h", label: "Within 48 Hours", icon: <Clock className="w-4 h-4 text-sky-600" /> },
                        { id: "elective", label: "Elective / Scheduled Procedure", icon: <Clock className="w-4 h-4 text-zinc-500" /> },
                      ].map((item) => (
                        <label
                          key={item.id}
                          className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                            formData.urgency === item.id
                              ? "bg-rose-50/80 border-[#B91C3C] text-[#B91C3C]"
                              : "bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                          }`}
                        >
                          <input
                            type="radio"
                            name="urgency"
                            value={item.id}
                            checked={formData.urgency === item.id}
                            onChange={() => handleChange("urgency", item.id as UrgencyLevel)}
                            className="sr-only"
                          />
                          {item.icon}
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="date-field" className="text-xs font-bold text-zinc-700 block mb-1">
                      Required Fulfillment Date <span className="text-[#B91C1C]">*</span>
                    </label>
                    <input
                      id="date-field"
                      type="date"
                      value={formData.requiredDate}
                      onChange={(e) => handleChange("requiredDate", e.target.value)}
                      className="w-full p-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-[#B91C3C] focus:bg-white"
                    />
                    <p className="text-[11px] text-zinc-500 mt-1">
                      Specify the target transfusion schedule date.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 2: Hospital & Location Context */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
                  <Building2 className="w-4 h-4 text-[#B91C3C]" />
                  <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
                    2. Hospital & Treatment Facility
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-1">
                      Hospital / Facility Name <span className="text-[#B91C1C]">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Central Trauma Center"
                      value={formData.hospitalName}
                      onChange={(e) => handleChange("hospitalName", e.target.value)}
                      className={`w-full p-2.5 text-sm bg-zinc-50 border rounded-lg focus:ring-2 focus:ring-[#B91C3C] focus:bg-white ${
                        formErrors.hospitalName ? "border-[#B91C1C]" : "border-zinc-200"
                      }`}
                    />
                    {formErrors.hospitalName && (
                      <p className="text-xs text-[#B91C1C] font-semibold mt-1">{formErrors.hospitalName}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-1">
                      City / Location <span className="text-[#B91C1C]">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Chicago"
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      className={`w-full p-2.5 text-sm bg-zinc-50 border rounded-lg focus:ring-2 focus:ring-[#B91C3C] focus:bg-white ${
                        formErrors.city ? "border-[#B91C1C]" : "border-zinc-200"
                      }`}
                    />
                    {formErrors.city && (
                      <p className="text-xs text-[#B91C1C] font-semibold mt-1">{formErrors.city}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-700 block mb-1">
                    Facility Address / Department (Ward / Room)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 742 Evergreen Terrace, ICU Unit Bed 4"
                    value={formData.hospitalAddress}
                    onChange={(e) => handleChange("hospitalAddress", e.target.value)}
                    className="w-full p-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-[#B91C3C] focus:bg-white"
                  />
                </div>
              </div>

              {/* Section 3: Patient & Clinical Reason */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
                  <FileCheck className="w-4 h-4 text-[#B91C3C]" />
                  <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
                    3. Patient Details & Clinical Context
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-zinc-700 block mb-1">
                      Patient Full Name <span className="text-[#B91C1C]">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. James Bennett"
                      value={formData.patientName}
                      onChange={(e) => handleChange("patientName", e.target.value)}
                      className={`w-full p-2.5 text-sm bg-zinc-50 border rounded-lg focus:ring-2 focus:ring-[#B91C3C] focus:bg-white ${
                        formErrors.patientName ? "border-[#B91C1C]" : "border-zinc-200"
                      }`}
                    />
                    {formErrors.patientName && (
                      <p className="text-xs text-[#B91C1C] font-semibold mt-1">{formErrors.patientName}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-medium text-zinc-700 block mb-1">
                      Patient Age (Optional)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 45"
                      value={formData.patientAge || ""}
                      onChange={(e) => handleChange("patientAge", e.target.value)}
                      className="w-full p-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-[#B91C3C] focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">
                    Clinical Diagnosis / Transfusion Reason <span className="text-[#B91C1C]">*</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe clinical situation (e.g., Acute surgical hemorrhage, oncology thrombocytopenia, severe anemia)..."
                    value={formData.medicalReason}
                    onChange={(e) => handleChange("medicalReason", e.target.value)}
                    className={`w-full p-2.5 text-sm bg-zinc-50 border rounded-lg focus:ring-2 focus:ring-[#B91C3C] focus:bg-white ${
                      formErrors.medicalReason ? "border-[#B91C1C]" : "border-zinc-200"
                    }`}
                  />
                  {formErrors.medicalReason && (
                    <p className="text-xs text-[#B91C1C] font-semibold mt-1">{formErrors.medicalReason}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-zinc-700 block mb-1">
                      Attending Physician Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Catherine Hayes, MD"
                      value={formData.doctorName}
                      onChange={(e) => handleChange("doctorName", e.target.value)}
                      className="w-full p-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-zinc-700 block mb-1">
                      Physician / Desk Contact
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. (312) 555-0988"
                      value={formData.doctorContact}
                      onChange={(e) => handleChange("doctorContact", e.target.value)}
                      className="w-full p-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Requester Contact Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
                  <Phone className="w-4 h-4 text-[#B91C3C]" />
                  <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
                    4. Requester Verification & Callback
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-1">
                      Requester Name <span className="text-[#B91C1C]">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Your full name"
                      value={formData.requesterName}
                      onChange={(e) => handleChange("requesterName", e.target.value)}
                      className={`w-full p-2.5 text-sm bg-zinc-50 border rounded-lg focus:ring-2 focus:ring-[#B91C3C] focus:bg-white ${
                        formErrors.requesterName ? "border-[#B91C1C]" : "border-zinc-200"
                      }`}
                    />
                    {formErrors.requesterName && (
                      <p className="text-xs text-[#B91C1C] font-semibold mt-1">{formErrors.requesterName}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-1">
                      Emergency Callback Phone <span className="text-[#B91C1C]">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. (312) 555-0199"
                      value={formData.requesterPhone}
                      onChange={(e) => handleChange("requesterPhone", e.target.value)}
                      className={`w-full p-2.5 text-sm bg-zinc-50 border rounded-lg focus:ring-2 focus:ring-[#B91C3C] focus:bg-white ${
                        formErrors.requesterPhone ? "border-[#B91C1C]" : "border-zinc-200"
                      }`}
                    />
                    {formErrors.requesterPhone && (
                      <p className="text-xs text-[#B91C1C] font-semibold mt-1">{formErrors.requesterPhone}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-1">
                      Email Address <span className="text-[#B91C1C]">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={formData.requesterEmail}
                      onChange={(e) => handleChange("requesterEmail", e.target.value)}
                      className={`w-full p-2.5 text-sm bg-zinc-50 border rounded-lg focus:ring-2 focus:ring-[#B91C3C] focus:bg-white ${
                        formErrors.requesterEmail ? "border-[#B91C1C]" : "border-zinc-200"
                      }`}
                    />
                    {formErrors.requesterEmail && (
                      <p className="text-xs text-[#B91C1C] font-semibold mt-1">{formErrors.requesterEmail}</p>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-xs text-zinc-600 flex items-start gap-2">
                  <Info className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Privacy & Non-Disclosure:</strong> Contact information is exclusively utilized to coordinate response offers and is never published in public directory feeds.
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-900">
                  ← Return to Home
                </Link>

                <Button
                  type="submit"
                  size="lg"
                  variant="primary"
                  isLoading={isSubmitting}
                  className="w-full sm:w-auto font-bold shadow-md"
                >
                  Broadcast Emergency Requisition
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Success Confirmation Modal */}
        {submittedRequest && (
          <Modal
            isOpen={Boolean(submittedRequest)}
            onClose={() => router.push(`/track-request?id=${submittedRequest.requestNumber}`)}
            title="Requisition Submitted Successfully"
            maxWidth="md"
          >
            <div className="text-center space-y-4 py-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Request Tracking Identifier
                </div>
                <div className="text-2xl font-mono font-black text-[#B91C3C]">
                  {submittedRequest.requestNumber}
                </div>
                <p className="text-xs text-zinc-600 max-w-sm mx-auto pt-1">
                  Your emergency requisition for <strong>{submittedRequest.unitsRequired} units of {submittedRequest.bloodGroup} {submittedRequest.component}</strong> has been registered and broadcast to regional facilities.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Hospital:</span>
                  <span className="font-semibold text-zinc-900">{submittedRequest.hospitalName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Status:</span>
                  <Badge variant="warning" size="sm">Matching in Progress</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Urgency:</span>
                  <Badge variant="crimson" size="sm">{submittedRequest.urgency.toUpperCase()}</Badge>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <Link href={`/track-request?id=${submittedRequest.requestNumber}`} className="w-full">
                  <Button variant="primary" size="md" className="w-full font-bold">
                    Open Live Tracking Timeline
                  </Button>
                </Link>
                <Link href={`/smart-match?reqId=${submittedRequest.requestNumber}`} className="w-full">
                  <Button variant="soft" size="md" className="w-full font-bold">
                    View Smart Match Candidates
                  </Button>
                </Link>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}

export default function RequestBloodPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-zinc-500">Loading Requisition Form...</div>}>
      <RequestBloodForm />
    </Suspense>
  );
}
