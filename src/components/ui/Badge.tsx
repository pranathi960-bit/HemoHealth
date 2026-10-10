import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, Clock, ShieldCheck, Flame } from "lucide-react";
import { BloodGroup, RequestStatus, UrgencyLevel } from "@/types";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info" | "outline" | "crimson";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const sizeStyles = {
    sm: "text-[11px] font-semibold px-2 py-0.5 rounded-md",
    md: "text-xs font-semibold px-2.5 py-1 rounded-md",
  };

  const variantStyles = {
    default: "bg-[#F4F4F5] text-[#18181B] border border-[#E4E4E7]",
    crimson: "bg-[#FFF1F2] text-[#B91C3C] border border-[#FECDD3]",
    success: "bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]",
    warning: "bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]",
    error: "bg-[#FEE2E2] text-[#B91C1C] border border-[#FECACA]",
    info: "bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD]",
    outline: "bg-transparent text-[#71717A] border border-[#E4E4E7]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 leading-none tracking-tight",
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function BloodGroupBadge({
  bloodGroup,
  size = "md",
}: {
  bloodGroup: BloodGroup;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "w-7 h-7 text-xs font-bold",
    md: "w-9 h-9 text-sm font-bold",
    lg: "w-12 h-12 text-base font-extrabold",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-xl bg-gradient-to-b from-[#FFF1F2] to-[#FFE4E6] text-[#B91C3C] border border-[#FECDD3] shadow-xs shrink-0 select-none",
        sizeClasses[size]
      )}
      title={`Blood Group ${bloodGroup}`}
    >
      {bloodGroup}
    </div>
  );
}

export function VerifiedBadge({ label = "Verified Facility" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-full border border-[#BBF7D0]">
      <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
      <span>{label}</span>
    </span>
  );
}

export function UrgencyBadge({ urgency }: { urgency: UrgencyLevel }) {
  if (urgency === "immediate") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#B91C1C] bg-[#FEE2E2] px-2.5 py-1 rounded-md border border-[#FECACA] animate-emergency-pulse">
        <Flame className="w-3.5 h-3.5 text-[#B91C1C]" />
        <span>CRITICAL / IMMEDIATE</span>
      </span>
    );
  }
  if (urgency === "within-24h") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#B45309] bg-[#FEF3C7] px-2.5 py-1 rounded-md border border-[#FDE68A]">
        <Clock className="w-3.5 h-3.5 text-[#B45309]" />
        <span>Within 24 Hours</span>
      </span>
    );
  }
  if (urgency === "within-48h") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-[#0369A1] bg-[#E0F2FE] px-2.5 py-1 rounded-md border border-[#BAE6FD]">
        <Clock className="w-3.5 h-3.5 text-[#0369A1]" />
        <span>Within 48 Hours</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-[#71717A] bg-[#F4F4F5] px-2.5 py-1 rounded-md border border-[#E4E4E7]">
      <span>Elective / Scheduled</span>
    </span>
  );
}

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  const map: Record<
    RequestStatus,
    { label: string; variant: BadgeProps["variant"]; icon: React.ReactNode }
  > = {
    submitted: {
      label: "Submitted",
      variant: "default",
      icon: <Clock className="w-3.5 h-3.5 text-zinc-500" />,
    },
    "under-review": {
      label: "Under Review",
      variant: "info",
      icon: <Clock className="w-3.5 h-3.5 text-sky-600" />,
    },
    "matching-in-progress": {
      label: "Matching in Progress",
      variant: "warning",
      icon: <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />,
    },
    "no-matches": {
      label: "No Matches",
      variant: "outline",
      icon: <Clock className="w-3.5 h-3.5 text-gray-500" />,
    },
    "response-received": {
      label: "Response Received",
      variant: "crimson",
      icon: <AlertCircle className="w-3.5 h-3.5 text-[#B91C3C]" />,
    },
    fulfilled: {
      label: "Fulfilled",
      variant: "success",
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
    },
    cancelled: {
      label: "Cancelled",
      variant: "error",
      icon: <AlertCircle className="w-3.5 h-3.5 text-rose-600" />,
    },
  };

  const item = map[status] || map.submitted;

  return (
    <Badge variant={item.variant} size="md" className="gap-1.5">
      {item.icon}
      <span>{item.label}</span>
    </Badge>
  );
}
