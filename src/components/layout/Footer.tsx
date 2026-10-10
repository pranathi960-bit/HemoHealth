"use client";

import React from "react";
import Link from "next/link";
import { Activity, ShieldAlert, Heart, PhoneCall, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#18181B] text-zinc-300 border-t border-zinc-800 mt-auto">
      {/* Clinical & Emergency Notice Banner */}
      <div className="bg-[#701A32] text-rose-100 py-3 px-4 border-b border-[#581427]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <ShieldAlert className="w-4 h-4 text-rose-300 shrink-0" />
            <span>
              <strong>Emergency Medical Notice:</strong> HemoHealth facilitates clinical blood availability discovery & volunteer coordination. In immediate life-threatening crises, immediately call <strong>911 / 112</strong> or your local emergency medical service.
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] bg-black/25 px-2.5 py-1 rounded shrink-0">
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
            <span>National Blood Helpline: 1-800-RED-CROSS</span>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#701A32] to-[#B91C3C] flex items-center justify-center text-white shadow-sm">
                <Activity className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                HEMO<span className="text-[#E11D48]">HEALTH</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Real-time blood availability discovery, emergency donor matching, and multi-facility inventory coordination platform designed to eliminate critical delays when every second counts.
            </p>
            <div className="pt-2 text-[11px] text-zinc-500 space-y-1">
              <p>Certified Platform Architecture • HIPAA/GDPR Aligned Security</p>
              <p>Zero Public Disclosure of Private Patient/Donor Records</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Blood Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/find-blood" className="hover:text-white transition-colors">
                  Find Blood Inventory
                </Link>
              </li>
              <li>
                <Link href="/request-blood" className="hover:text-white transition-colors font-medium text-rose-300">
                  Emergency Requisition
                </Link>
              </li>
              <li>
                <Link href="/smart-match" className="hover:text-white transition-colors">
                  Smart Match Engine
                </Link>
              </li>
              <li>
                <Link href="/track-request" className="hover:text-white transition-colors">
                  Live Request Tracking
                </Link>
              </li>
              <li>
                <Link href="/hospitals" className="hover:text-white transition-colors">
                  Hospital & Blood Bank Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* For Donors & Hospitals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Stakeholder Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/donors" className="hover:text-white transition-colors">
                  Register as Volunteer Donor
                </Link>
              </li>
              <li>
                <Link href="/donors/dashboard" className="hover:text-white transition-colors">
                  Donor Dashboard
                </Link>
              </li>
              <li>
                <Link href="/hospitals/dashboard" className="hover:text-white transition-colors">
                  Hospital Inventory Portal
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Compatibility Matrix Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Institutional & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Platform & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About HemoHealth
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy & Data Rights
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Clinical Use
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© 2026 HemoHealth Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Platform Status: Operational (Demonstration Build)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
