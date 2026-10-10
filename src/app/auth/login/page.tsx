"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  ShieldCheck,
  HeartHandshake,
  Building2,
  Lock,
  ArrowRight,
  Database,
  CheckCircle2,
  Key,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { HemoStore } from "@/lib/data/store";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { UserRole } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const { success } = useToast();
  const [activeTab, setActiveTab] = useState<"demo" | "firebase">("demo");
  const [email, setEmail] = useState("staff@apexcentral.org");
  const [password, setPassword] = useState("••••••••••••");

  const handleSimulateLogin = (role: UserRole, targetRoute: string, name: string) => {
    HemoStore.setCurrentRole(role);
    success("Demonstration Login Active", `Authenticated as ${name} (${role.toUpperCase()}).`);
    router.push(targetRoute);
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-12 flex items-center justify-center">
      <div className="max-w-xl w-full mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#701A32] to-[#B91C3C] flex items-center justify-center text-white mx-auto shadow-sm">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
            HemoHealth Portal Access
          </h1>
          <p className="text-xs text-zinc-500">
            Select a verified demonstration role or configure production Firebase Authentication.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-200 justify-center gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab("demo")}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === "demo"
                ? "border-[#B91C3C] text-[#B91C3C]"
                : "border-transparent text-zinc-500 hover:text-zinc-900"
            }`}
          >
            1-Click Demo Profiles
          </button>
          <button
            onClick={() => setActiveTab("firebase")}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === "firebase"
                ? "border-[#B91C3C] text-[#B91C3C]"
                : "border-transparent text-zinc-500 hover:text-zinc-900"
            }`}
          >
            Firebase Auth Config
          </button>
        </div>

        {activeTab === "demo" ? (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-bold">
                  Select Simulated Role & Portal
                </CardTitle>
                <CardDescription>
                  Instant one-click access with pre-configured permissions and audit access.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                {/* Role 1: Hospital Staff */}
                <button
                  onClick={() =>
                    handleSimulateLogin("hospital", "/hospitals/dashboard", "Dr. Sarah Klein (Apex Central)")
                  }
                  className="w-full p-4 rounded-xl border border-zinc-200 hover:border-[#B91C3C] hover:bg-rose-50/20 transition-all flex items-center justify-between text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-zinc-100 group-hover:bg-[#FFF1F2] text-zinc-700 group-hover:text-[#B91C3C] flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-900">Hospital Transfusion Staff</div>
                      <div className="text-[11px] text-zinc-500">Manage blood inventory, lot batching, and triage</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-[#B91C3C] group-hover:translate-x-1 transition-all" />
                </button>

                {/* Role 2: Volunteer Donor */}
                <button
                  onClick={() =>
                    handleSimulateLogin("donor", "/donors/dashboard", "Elena Rostova (O- Donor)")
                  }
                  className="w-full p-4 rounded-xl border border-zinc-200 hover:border-emerald-600 hover:bg-emerald-50/20 transition-all flex items-center justify-between text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-zinc-100 group-hover:bg-emerald-100 text-zinc-700 group-hover:text-emerald-700 flex items-center justify-center shrink-0">
                      <HeartHandshake className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-900">Voluntary Blood Donor</div>
                      <div className="text-[11px] text-zinc-500">Respond to emergency shortages & manage availability</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                </button>

                {/* Role 3: Patient / Requester */}
                <button
                  onClick={() =>
                    handleSimulateLogin("requester", "/track-request", "James Bennett Family")
                  }
                  className="w-full p-4 rounded-xl border border-zinc-200 hover:border-sky-600 hover:bg-sky-50/20 transition-all flex items-center justify-between text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-zinc-100 group-hover:bg-sky-100 text-zinc-700 group-hover:text-sky-700 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-900">Patient / Requester</div>
                      <div className="text-[11px] text-zinc-500">Track emergency requisitions and responses</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
                </button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold">
                Firebase Authentication & Cloud Firestore
              </CardTitle>
              <CardDescription>
                Live production credential status and configuration instructions.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-900">Live Firebase State:</span>
                  <Badge variant={isFirebaseConfigured() ? "success" : "default"} size="sm">
                    {isFirebaseConfigured() ? "Connected" : "Demonstration Mode Active"}
                  </Badge>
                </div>
                <p className="text-zinc-500 text-[11px]">
                  When environment variables in <code>.env.local</code> are configured, live Firebase auth and Firestore synchronization are automatically enabled.
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-zinc-700">Required Environment Variables:</span>
                <pre className="p-3 bg-zinc-900 text-zinc-100 rounded-lg text-[10px] font-mono overflow-x-auto">
{`NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id`}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
