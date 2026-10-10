"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Bell,
  Menu,
  X,
  Search,
  PlusCircle,
  Sparkles,
  HeartHandshake,
  Building2,
  FileSearch,
  User,
  ShieldCheck,
  Check,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { HemoStore, subscribeToStore } from "@/lib/data/store";
import { NotificationItem, UserRole } from "@/types";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [currentRole, setCurrentRole] = useState<UserRole>("requester");

  const notifRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      setNotifications(HemoStore.getNotifications());
      setCurrentRole(HemoStore.getCurrentRole());
    };
    update();
    const unsub = subscribeToStore(update);
    return () => unsub();
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifDropdownOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setRoleDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const navLinks = [
    { label: "Find Blood", href: "/find-blood", icon: <Search className="w-4 h-4" /> },
    { label: "Smart Match", href: "/smart-match", icon: <Sparkles className="w-4 h-4 text-[#B91C3C]" /> },
    { label: "Track Request", href: "/track-request", icon: <FileSearch className="w-4 h-4" /> },
    { label: "Donors", href: "/donors", icon: <HeartHandshake className="w-4 h-4" /> },
    { label: "Hospitals", href: "/hospitals", icon: <Building2 className="w-4 h-4" /> },
  ];

  const handleRoleChange = (role: UserRole) => {
    HemoStore.setCurrentRole(role);
    setCurrentRole(role);
    setRoleDropdownOpen(false);
  };

  const roleLabels: Record<UserRole, { label: string; desc: string }> = {
    requester: { label: "Patient / Requester", desc: "Emergency blood seeker view" },
    donor: { label: "Voluntary Donor", desc: "Active donor portal access" },
    hospital: { label: "Hospital Staff", desc: "Inventory & triage manager" },
    admin: { label: "Administrator", desc: "System audit & coordination" },
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E4E4E7] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#701A32] via-[#B91C3C] to-[#E11D48] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg text-[#18181B] tracking-tight">
                    HEMO<span className="text-[#B91C3C]">HEALTH</span>
                  </span>
                </div>
                <span className="text-[10px] text-[#71717A] tracking-wider uppercase font-semibold -mt-1 hidden sm:block">
                  Blood Coordination Platform
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                      isActive
                        ? "bg-[#FFF1F2] text-[#B91C3C] font-semibold"
                        : "text-[#71717A] hover:text-[#18181B] hover:bg-[#F4F4F5]"
                    )}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Bar */}
          <div className="hidden md:flex items-center gap-3">
            {/* Role Switcher */}
            <div className="relative" ref={roleRef}>
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-[#E4E4E7] bg-[#FAFAFA] hover:bg-white text-[#18181B] transition-colors cursor-pointer"
                title="Switch simulated view role"
              >
                <User className="w-3.5 h-3.5 text-[#B91C3C]" />
                <span>Role: {roleLabels[currentRole].label.split(" ")[0]}</span>
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#E4E4E7] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 border-b border-[#F4F4F5]">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                      Switch Role Simulation
                    </p>
                  </div>
                  {(Object.keys(roleLabels) as UserRole[]).map((role) => (
                    <button
                      key={role}
                      onClick={() => handleRoleChange(role)}
                      className={cn(
                        "w-full text-left px-3 py-2 text-xs flex items-start justify-between hover:bg-[#F4F4F5] transition-colors cursor-pointer",
                        currentRole === role && "bg-[#FFF1F2] text-[#B91C3C] font-semibold"
                      )}
                    >
                      <div>
                        <div className="font-semibold text-zinc-900">{roleLabels[role].label}</div>
                        <div className="text-[11px] text-zinc-500">{roleLabels[role].desc}</div>
                      </div>
                      {currentRole === role && <Check className="w-4 h-4 text-[#B91C3C] shrink-0 mt-0.5" />}
                    </button>
                  ))}
                  <div className="p-2 border-t border-[#F4F4F5] mt-1">
                    <Link
                      href={
                        currentRole === "hospital"
                          ? "/hospitals/dashboard"
                          : currentRole === "donor"
                          ? "/donors/dashboard"
                          : "/track-request"
                      }
                      className="block text-center text-[11px] font-semibold text-[#B91C3C] bg-[#FFF1F2] hover:bg-[#FFE4E6] py-1.5 rounded-md"
                    >
                      Open {roleLabels[currentRole].label} Portal
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 text-[#71717A] hover:text-[#18181B] hover:bg-[#F4F4F5] rounded-lg transition-colors cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#B91C1C] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-[#E4E4E7] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-[#F4F4F5] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#18181B]">Notifications</span>
                      {unreadCount > 0 && <Badge variant="crimson" size="sm">{unreadCount} New</Badge>}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => HemoStore.markAllNotificationsRead()}
                        className="text-xs text-[#B91C3C] hover:underline cursor-pointer"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-[#F4F4F5]">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-zinc-400">
                        No notifications at this time
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={cn(
                            "p-3.5 hover:bg-[#FAFAFA] transition-colors cursor-pointer",
                            !n.read && "bg-[#FFF1F2]/40"
                          )}
                          onClick={() => {
                            HemoStore.markNotificationAsRead(n.id);
                            setNotifDropdownOpen(false);
                          }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-bold text-[#18181B] leading-snug">
                              {n.title}
                            </span>
                            {!n.read && (
                              <span className="w-2 h-2 rounded-full bg-[#B91C3C] shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-xs text-[#71717A] mt-1 leading-relaxed">{n.message}</p>
                          {n.link && (
                            <Link
                              href={n.link}
                              className="text-[11px] font-semibold text-[#B91C3C] hover:underline mt-1.5 inline-block"
                            >
                              View details →
                            </Link>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Request Button */}
            <Link href="/request-blood">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<PlusCircle className="w-4 h-4" />}
                className="font-bold shadow-xs bg-[#B91C3C] hover:bg-[#9F1239]"
              >
                Request Blood
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link href="/request-blood">
              <Button variant="primary" size="sm" className="text-xs px-2.5">
                Request
              </Button>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#71717A] hover:text-[#18181B] hover:bg-[#F4F4F5] rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E4E4E7] bg-white px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-lg",
                  pathname === link.href
                    ? "bg-[#FFF1F2] text-[#B91C3C] font-bold"
                    : "text-[#18181B] hover:bg-[#F4F4F5]"
                )}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-[#F4F4F5] flex flex-col gap-2">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-1">
              Active Portals
            </p>
            <Link
              href="/hospitals/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm text-zinc-700 bg-zinc-50 rounded-lg hover:bg-zinc-100 flex items-center justify-between"
            >
              <span>Hospital Staff Portal</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </Link>
            <Link
              href="/donors/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm text-zinc-700 bg-zinc-50 rounded-lg hover:bg-zinc-100 flex items-center justify-between"
            >
              <span>Volunteer Donor Portal</span>
              <HeartHandshake className="w-4 h-4 text-[#B91C3C]" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
