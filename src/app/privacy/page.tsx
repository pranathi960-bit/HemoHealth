import React from "react";
import { Lock, ShieldCheck, EyeOff, FileText, CheckCircle2 } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="bg-[#FAFAFA] min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-xs font-bold text-emerald-800 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Healthcare Data Protection Standards</span>
          </div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight">
            Privacy Policy & Data Rights
          </h1>
          <p className="text-xs text-zinc-500">Last updated: April 2026</p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-zinc-200 space-y-6 text-xs sm:text-sm text-zinc-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900">1. Commitment to Healthcare Confidentiality</h2>
            <p>
              HemoHealth operates on the fundamental principle that sensitive clinical and personal data must be protected with the highest technical and organizational safeguards. We never sell, monetize, or publicly broadcast private health information.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900">2. Volunteer Donor Privacy & Telephone Masking</h2>
            <p>
              When a voluntary donor registers on HemoHealth, their precise home address and personal telephone number are protected behind encrypted platform dispatch channels by default. Only certified hospital staff responding to verified shortage emergencies are granted authorized dispatch access.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900">3. Patient Requisition Data</h2>
            <p>
              Patient identifiers collected during emergency blood requisitions are utilized strictly for crossmatching verification and hospital department delivery coordination. Requisition slips do not index patient medical histories beyond necessary transfusion compatibility context.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900">4. Data Retention & Right to Erasure</h2>
            <p>
              Donors may pause their active availability status or request full account deletion at any time through their personal dashboard settings.
            </p>
          </section>

          <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 text-xs text-zinc-600 space-y-1">
            <span className="font-bold text-zinc-900 block">Privacy Compliance Inquiries:</span>
            <p>Direct all data rights questions to: privacy@hemohealth.org (Demonstration Contact)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
