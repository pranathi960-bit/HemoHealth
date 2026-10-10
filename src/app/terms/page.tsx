import React from "react";
import { ShieldAlert, FileText, CheckCircle2 } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="bg-[#FAFAFA] min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-xs font-bold text-rose-800 border border-rose-200">
            <ShieldAlert className="w-3.5 h-3.5 text-[#B91C3C]" />
            <span>Clinical & Legal Guidelines</span>
          </div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight">
            Terms of Clinical Use & Medical Disclaimer
          </h1>
          <p className="text-xs text-zinc-500">Effective Date: April 2026</p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-zinc-200 space-y-6 text-xs sm:text-sm text-zinc-700 leading-relaxed">
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-950 space-y-2">
            <h3 className="text-sm font-bold text-[#B91C3C] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              <span>Mandatory Medical Emergency Notice</span>
            </h3>
            <p className="text-xs leading-relaxed">
              HemoHealth is a specialized software coordination and blood resource visibility tool. It is <strong>NOT</strong> an emergency medical dispatch provider (EMS/911/112) and does not replace certified laboratory bedside crossmatching or licensed physician oversight.
            </p>
          </div>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900">1. Role & Purpose</h2>
            <p>
              The platform assists authorized hospital personnel, blood bank technicians, voluntary donors, and patient representatives in identifying blood inventory availability and coordinating voluntary donations.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900">2. Transfusion Crossmatching Responsibility</h2>
            <p>
              Smart Matching scores are algorithmic estimates calculated from component-specific ABO/Rh compatibility rules. Final transfusion suitability, viral screening, and biological safety must be independently verified by the recipient healthcare facility.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-zinc-900">3. Voluntary Donor Suitability</h2>
            <p>
              Registration as a voluntary donor does not confer automatic clinical eligibility. Every donation remains subject to standard medical screening (hemoglobin levels, blood pressure, recent travel, and health questionnaires).
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
