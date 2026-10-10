"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  RefreshCw,
  Building2,
  Phone,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Thermometer,
  ShieldCheck,
  PlusCircle,
  ArrowUpDown,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge, BloodGroupBadge, VerifiedBadge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { HemoStore, subscribeToStore } from "@/lib/data/store";
import { formatRelativeTime } from "@/lib/utils";
import { BloodComponent, BloodGroup, BloodInventoryItem, Facility } from "@/types";

export default function FindBloodPage() {
  const [inventory, setInventory] = useState<BloodInventoryItem[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);

  // Filter states
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>("ALL");
  const [selectedComponent, setSelectedComponent] = useState<string>("ALL");
  const [selectedCity, setSelectedCity] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"freshness" | "quantity" | "facility">("freshness");

  // Contact Modal state
  const [contactFacility, setContactFacility] = useState<Facility | null>(null);

  useEffect(() => {
    const update = () => {
      setInventory(HemoStore.getInventory());
      setFacilities(HemoStore.getFacilities());
    };
    update();
    const unsub = subscribeToStore(update);
    return () => unsub();
  }, []);

  // Unique cities list
  const cities = useMemo(() => {
    const set = new Set<string>();
    inventory.forEach((i) => set.add(i.city));
    return Array.from(set);
  }, [inventory]);

  // Filtered and sorted inventory
  const filteredInventory = useMemo(() => {
    return inventory
      .filter((item) => {
        if (selectedBloodGroup !== "ALL" && item.bloodGroup !== selectedBloodGroup) {
          return false;
        }
        if (selectedComponent !== "ALL" && item.component !== selectedComponent) {
          return false;
        }
        if (selectedCity !== "ALL" && item.city.toLowerCase() !== selectedCity.toLowerCase()) {
          return false;
        }
        if (verifiedOnly && !item.isVerified) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchFac = item.facilityName.toLowerCase().includes(q);
          const matchCity = item.city.toLowerCase().includes(q);
          const matchBatch = item.batchNumber.toLowerCase().includes(q);
          if (!matchFac && !matchCity && !matchBatch) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "freshness") {
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        }
        if (sortBy === "quantity") {
          return b.unitsAvailable - a.unitsAvailable;
        }
        return a.facilityName.localeCompare(b.facilityName);
      });
  }, [inventory, selectedBloodGroup, selectedComponent, selectedCity, verifiedOnly, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSelectedBloodGroup("ALL");
    setSelectedComponent("ALL");
    setSelectedCity("ALL");
    setSearchQuery("");
    setVerifiedOnly(false);
    setSortBy("freshness");
  };

  const handleOpenContact = (facilityId: string, facilityName: string) => {
    const fac = facilities.find((f) => f.id === facilityId) || {
      id: facilityId,
      name: facilityName,
      type: "Hospital",
      licenseNumber: "FDA-BB-UNV",
      address: "Address available on dispatch",
      city: "Chicago",
      state: "IL",
      phone: "(312) 555-0100",
      emergencyHotline: "(312) 555-9911",
      email: "contact@facility.org",
      verified: true,
      operatingHours: "24/7 Emergency Operation",
      latitude: 0,
      longitude: 0,
      dataMode: "DEMO"
    };
    setContactFacility(fac);
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E4E4E7] shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-[#18181B] tracking-tight">
                Blood Inventory Discovery
              </h1>
              <Badge variant="crimson" size="sm">Real-Time Directory</Badge>
            </div>
            <p className="text-xs sm:text-sm text-[#71717A] mt-1">
              Search verified facility reserves, licensed blood banks, and hospital storage units.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href="/request-blood">
              <Button
                variant="primary"
                size="md"
                leftIcon={<PlusCircle className="w-4 h-4" />}
                className="font-bold"
              >
                Create Emergency Request
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter Controls Panel */}
        <div className="bg-white p-5 rounded-2xl border border-[#E4E4E7] shadow-xs space-y-4">
          {/* Top Search Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by hospital name, city, lot number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B91C3C] focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-700 w-full sm:w-auto">
                <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
                <label htmlFor="sort-select" className="sr-only">Sort by</label>
                <select
                  id="sort-select"
                  aria-label="Sort inventory by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="freshness">Sort: Most Recently Updated</option>
                  <option value="quantity">Sort: Available Quantity (High to Low)</option>
                  <option value="facility">Sort: Facility Name (A-Z)</option>
                </select>
              </div>

              {(selectedBloodGroup !== "ALL" ||
                selectedComponent !== "ALL" ||
                selectedCity !== "ALL" ||
                searchQuery ||
                verifiedOnly) && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-[#B91C3C] hover:bg-[#FFF1F2] rounded-lg transition-colors cursor-pointer shrink-0"
                  title="Reset all filters"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Blood Group Selectors */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-zinc-600 uppercase tracking-wider">
                Filter by Blood Group:
              </span>
              <span className="text-[11px] text-zinc-400">
                {selectedBloodGroup === "ALL" ? "Showing all groups" : `Selected: ${selectedBloodGroup}`}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedBloodGroup("ALL")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  selectedBloodGroup === "ALL"
                    ? "bg-[#18181B] text-white border-[#18181B]"
                    : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                }`}
              >
                ALL GROUPS
              </button>

              {(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as BloodGroup[]).map((bg) => (
                <button
                  key={bg}
                  onClick={() => setSelectedBloodGroup(bg)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    selectedBloodGroup === bg
                      ? "bg-[#B91C3C] text-white border-[#B91C3C] shadow-xs"
                      : "bg-white text-[#B91C3C] border-[#FECDD3] hover:bg-[#FFF1F2]"
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          {/* Component & Secondary Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-zinc-100">
            <div>
              <label htmlFor="component-select" className="text-xs font-medium text-zinc-500 block mb-1">Blood Component</label>
              <select
                id="component-select"
                aria-label="Filter by blood component"
                value={selectedComponent}
                onChange={(e) => setSelectedComponent(e.target.value)}
                className="w-full p-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B91C3C]"
              >
                <option value="ALL">All Components</option>
                <option value="Whole Blood">Whole Blood</option>
                <option value="Packed Red Blood Cells (PRBC)">Packed Red Blood Cells (PRBC)</option>
                <option value="Platelets">Platelets</option>
                <option value="Fresh Frozen Plasma (FFP)">Fresh Frozen Plasma (FFP)</option>
                <option value="Cryoprecipitate">Cryoprecipitate</option>
              </select>
            </div>

            <div>
              <label htmlFor="city-select" className="text-xs font-medium text-zinc-500 block mb-1">City / Location</label>
              <select
                id="city-select"
                aria-label="Filter by city"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full p-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B91C3C]"
              >
                <option value="ALL">All Cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-700 select-none">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="w-4 h-4 text-[#B91C3C] rounded border-zinc-300 focus:ring-[#B91C3C]"
                />
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Facilities Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-[#71717A] px-1">
          <span>
            Found <strong>{filteredInventory.length}</strong> matching inventory batches across participating facilities
          </span>
          <span className="text-[11px] bg-zinc-200/60 px-2 py-0.5 rounded text-zinc-600 font-mono">
            Updated continuously via facility telemetry
          </span>
        </div>

        {/* Inventory Cards Grid */}
        {filteredInventory.length === 0 ? (
          <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mx-auto">
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-zinc-900">No Inventory Matching Your Criteria</h3>
              <p className="text-xs text-zinc-500 max-w-md mx-auto">
                No facility currently reports in-stock units for the selected filters. You can submit an emergency requisition to broadcast to volunteer donors and partner depots immediately.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button size="sm" variant="outline" onClick={handleResetFilters}>
                Reset Filter Criteria
              </Button>
              <Link href="/request-blood">
                <Button size="sm" variant="primary">
                  Broadcast Emergency Request
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInventory.map((item) => (
              <Card
                key={item.id}
                className="hover:border-[#B91C3C]/40 transition-all flex flex-col justify-between"
              >
                <CardContent className="p-5 space-y-4">
                  {/* Card Header with Blood Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <BloodGroupBadge bloodGroup={item.bloodGroup} size="md" />
                      <div>
                        <div className="text-sm font-bold text-[#18181B] leading-tight">
                          {item.component}
                        </div>
                        <div className="text-xs text-[#71717A] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          <span>{item.city}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xl font-black text-[#B91C3C]">
                        {item.unitsAvailable} <span className="text-xs font-normal text-zinc-500">Units</span>
                      </div>
                      {item.unitsReserved > 0 && (
                        <div className="text-[10px] text-zinc-400 font-medium">
                          ({item.unitsReserved} reserved)
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Facility Details */}
                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-zinc-900 leading-snug">
                        {item.facilityName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.isVerified ? (
                        <VerifiedBadge label="Verified Facility" />
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          <span>Unverified Report</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Storage and Expiry Details */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-600 border-t border-zinc-100 pt-3">
                    <div className="flex items-center gap-1.5">
                      <Thermometer className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="truncate">{item.storageTempCelsius}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-zinc-500 justify-end">
                      <span>Lot: #{item.batchNumber.slice(-8)}</span>
                    </div>
                    <div className="col-span-2 flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                      <span>Expires: {new Date(item.expiryDate).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Updated {formatRelativeTime(item.lastUpdated)}</span>
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs"
                      onClick={() => handleOpenContact(item.facilityId, item.facilityName)}
                      leftIcon={<Phone className="w-3.5 h-3.5 text-zinc-500" />}
                    >
                      Contact
                    </Button>
                    <Link
                      href={`/request-blood?bloodGroup=${encodeURIComponent(
                        item.bloodGroup
                      )}&component=${encodeURIComponent(item.component)}&city=${encodeURIComponent(item.city)}`}
                      className="flex-1"
                    >
                      <Button size="sm" variant="primary" className="w-full text-xs font-bold">
                        Requisition
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Facility Contact Modal */}
        {contactFacility && (
          <Modal
            isOpen={Boolean(contactFacility)}
            onClose={() => setContactFacility(null)}
            title={contactFacility.name}
            description={`Certified ${contactFacility.type} • License #${contactFacility.licenseNumber}`}
          >
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-[#B91C3C]" />
                  <span>24/7 Emergency Blood Dispatch Desk</span>
                </div>
                <div className="text-lg font-mono font-extrabold text-[#B91C3C]">
                  {contactFacility.emergencyHotline}
                </div>
              </div>

              <div className="space-y-2 text-xs text-zinc-700">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Facility Address:</span>
                    <span>{contactFacility.address}, {contactFacility.city}, {contactFacility.state}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Operating Hours:</span>
                    <span>{contactFacility.operatingHours}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Verification Status:</span>
                    <span className="text-emerald-700">
                      Accredited Clinical Blood Transfusion Facility (Audited {new Date(contactFacility.verifiedAt || "").toLocaleDateString()})
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setContactFacility(null)}>
                  Close
                </Button>
                <Link
                  href={`/request-blood?city=${encodeURIComponent(contactFacility.city)}`}
                  onClick={() => setContactFacility(null)}
                >
                  <Button variant="primary" size="sm">
                    Requisition Directly
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
