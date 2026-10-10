"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Building2,
  ShieldCheck,
  Search,
  Phone,
  Clock,
  MapPin,
  Mail,
  Droplet,
  ArrowRight,
  ExternalLink,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge, VerifiedBadge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { HemoStore, subscribeToStore } from "@/lib/data/store";
import { BloodInventoryItem, Facility } from "@/types";

export default function HospitalsPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [inventory, setInventory] = useState<BloodInventoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedCity, setSelectedCity] = useState("ALL");

  // Facility detail modal
  const [activeFacility, setActiveFacility] = useState<Facility | null>(null);

  useEffect(() => {
    const update = () => {
      setFacilities(HemoStore.getFacilities());
      setInventory(HemoStore.getInventory());
    };
    update();
    const unsub = subscribeToStore(update);
    return () => unsub();
  }, []);

  const cities = useMemo(() => {
    const set = new Set<string>();
    facilities.forEach((f) => set.add(f.city));
    return Array.from(set);
  }, [facilities]);

  const filteredFacilities = useMemo(() => {
    return facilities.filter((f) => {
      if (selectedType !== "ALL" && f.type !== selectedType) return false;
      if (selectedCity !== "ALL" && f.city.toLowerCase() !== selectedCity.toLowerCase()) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = f.name.toLowerCase().includes(q);
        const matchAddr = f.address.toLowerCase().includes(q);
        const matchLic = f.licenseNumber.toLowerCase().includes(q);
        if (!matchName && !matchAddr && !matchLic) return false;
      }
      return true;
    });
  }, [facilities, selectedType, selectedCity, searchQuery]);

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E4E4E7] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-[#18181B] tracking-tight">
                Hospital & Blood Center Directory
              </h1>
              <Badge variant="crimson" size="sm">Verified Network</Badge>
            </div>
            <p className="text-xs sm:text-sm text-[#71717A]">
              Explore accredited inpatient transfusion services, licensed blood centers, and trauma repositories.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/hospitals/dashboard">
              <Button size="md" variant="primary" className="font-bold">
                Hospital Staff Portal →
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-5 rounded-2xl border border-[#E4E4E7] shadow-xs flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search facility by name, address, or license number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-[#B91C3C] focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="p-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-[#B91C3C]"
            >
              <option value="ALL">All Facility Types</option>
              <option value="Hospital">Hospitals</option>
              <option value="Blood Bank">Blood Banks</option>
              <option value="Trauma Center">Trauma Centers</option>
            </select>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="p-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-[#B91C3C]"
            >
              <option value="ALL">All Locations</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFacilities.map((fac) => {
            const facInventory = inventory.filter((i) => i.facilityId === fac.id);
            const totalUnits = facInventory.reduce((acc, curr) => acc + curr.unitsAvailable, 0);

            return (
              <Card
                key={fac.id}
                className="hover:border-[#B91C3C]/50 transition-all flex flex-col justify-between"
              >
                <CardContent className="p-6 space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-bold text-zinc-900 leading-tight">
                        {fac.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {fac.verified ? (
                        <VerifiedBadge label="Verified Facility" />
                      ) : (
                        <Badge variant="warning" size="sm">Pending Audit</Badge>
                      )}
                      <span className="text-[11px] font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
                        {fac.type}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-zinc-600 border-t border-zinc-100 pt-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                      <span>{fac.address}, {fac.city}, {fac.state}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                      <span className="font-mono">{fac.emergencyHotline}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                      <span>{fac.operatingHours}</span>
                    </div>
                  </div>

                  {/* Stock Snapshot */}
                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 flex items-center justify-between text-xs">
                    <span className="text-zinc-500 font-medium">Reported Stock:</span>
                    <span className="font-bold text-[#B91C3C]">
                      {totalUnits} Units ({facInventory.length} Batches)
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs"
                      onClick={() => setActiveFacility(fac)}
                    >
                      Facility Info
                    </Button>
                    <Link
                      href={`/find-blood?city=${encodeURIComponent(fac.city)}`}
                      className="flex-1"
                    >
                      <Button size="sm" variant="primary" className="w-full text-xs font-bold">
                        View Stock
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Facility Details Modal */}
        {activeFacility && (
          <Modal
            isOpen={Boolean(activeFacility)}
            onClose={() => setActiveFacility(null)}
            title={activeFacility.name}
            description={`Certified ${activeFacility.type} • License: ${activeFacility.licenseNumber}`}
          >
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 text-rose-900 space-y-1">
                <span className="font-bold block">24/7 Emergency Transfusion Desk:</span>
                <div className="text-xl font-mono font-black text-[#B91C3C]">
                  {activeFacility.emergencyHotline}
                </div>
                <div className="text-[11px] text-rose-700">Main Switchboard: {activeFacility.phone}</div>
              </div>

              <div className="space-y-2 text-zinc-700">
                <div>
                  <span className="font-bold block">Physical Address:</span>
                  <span>{activeFacility.address}, {activeFacility.city}, {activeFacility.state}</span>
                </div>
                <div>
                  <span className="font-bold block">Operating Hours:</span>
                  <span>{activeFacility.operatingHours}</span>
                </div>
                <div>
                  <span className="font-bold block">Clinical Contact Email:</span>
                  <span>{activeFacility.email}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => setActiveFacility(null)}>
                  Close
                </Button>
                <Link
                  href={`/request-blood?city=${encodeURIComponent(activeFacility.city)}`}
                  onClick={() => setActiveFacility(null)}
                >
                  <Button size="sm" variant="primary" className="font-bold">
                    Create Requisition
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
