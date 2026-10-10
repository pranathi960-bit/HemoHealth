"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Building2,
  ShieldCheck,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  Droplet,
  Flame,
  ArrowUpRight,
  TrendingDown,
  RefreshCw,
  PlusCircle,
  FileCheck,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/Button";
import { Badge, BloodGroupBadge, UrgencyBadge, VerifiedBadge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { HemoStore, subscribeToStore } from "@/lib/data/store";
import { formatDateTime, formatRelativeTime } from "@/lib/utils";
import {
  BloodComponent,
  BloodGroup,
  BloodInventoryItem,
  BloodRequest,
  Facility,
  InventoryStatus,
} from "@/types";

export default function HospitalDashboardPage() {
  const { success, error, info } = useToast();

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [activeFacility, setActiveFacility] = useState<Facility | null>(null);
  const [inventory, setInventory] = useState<BloodInventoryItem[]>([]);
  const [requests, setRequests] = useState<BloodRequest[]>([]);

  // Add Inventory Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBloodGroup, setNewBloodGroup] = useState<BloodGroup>("O-");
  const [newComponent, setNewComponent] = useState<BloodComponent>("Packed Red Blood Cells (PRBC)");
  const [newUnits, setNewUnits] = useState<number>(5);
  const [newStorageTemp, setNewStorageTemp] = useState<string>("2°C to 6°C");
  const [newBatchNumber, setNewBatchNumber] = useState<string>("LOT-2026-401");
  const [newExpiryDate, setNewExpiryDate] = useState<string>("2026-05-15");

  // Offer Units Modal State
  const [triageRequest, setTriageRequest] = useState<BloodRequest | null>(null);
  const [offerUnits, setOfferUnits] = useState<number>(2);
  const [offerNotes, setOfferNotes] = useState<string>("Units pre-tested and cleared for courier release.");

  useEffect(() => {
    const update = () => {
      const allFacs = HemoStore.getFacilities();
      const allInv = HemoStore.getInventory();
      const allReqs = HemoStore.getRequests();

      setFacilities(allFacs);
      setInventory(allInv);
      setRequests(allReqs);

      if (!activeFacility && allFacs.length > 0) {
        setActiveFacility(allFacs[0]);
      } else if (activeFacility) {
        const found = allFacs.find((f) => f.id === activeFacility.id);
        if (found) setActiveFacility(found);
      }
    };
    update();
    const unsub = subscribeToStore(update);
    return () => unsub();
  }, [activeFacility]);

  // Inventory filtered to active facility
  const facilityInventory = useMemo(() => {
    if (!activeFacility) return [];
    return inventory.filter((i) => i.facilityId === activeFacility.id);
  }, [inventory, activeFacility]);

  // Metrics
  const totalUnitsInStock = facilityInventory.reduce((acc, curr) => acc + curr.unitsAvailable, 0);
  const lowStockBatches = facilityInventory.filter((i) => i.unitsAvailable <= 3 && i.status === "available");
  const urgentInboundRequests = requests.filter((r) => r.status !== "fulfilled" && r.status !== "cancelled");

  const handleAddInventory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFacility) return;

    try {
      HemoStore.addInventoryItem(
        {
          facilityId: activeFacility.id,
          facilityName: activeFacility.name,
          city: activeFacility.city,
          bloodGroup: newBloodGroup,
          component: newComponent,
          unitsAvailable: Number(newUnits) || 1,
          unitsReserved: 0,
          storageTempCelsius: newStorageTemp,
          batchNumber: newBatchNumber,
          collectionDate: new Date().toISOString(),
          expiryDate: new Date(newExpiryDate).toISOString(),
          status: "available",
          isVerified: activeFacility.verified,
        },
        `${activeFacility.name} Staff`,
        "hospital"
      );

      success("Inventory Added", `Logged ${newUnits} units of ${newBloodGroup} ${newComponent}.`);
      setIsAddModalOpen(false);
      setNewBatchNumber(`LOT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
    } catch {
      error("Error", "Failed to add inventory record.");
    }
  };

  const handleAdjustQuantity = (itemId: string, delta: number) => {
    const item = facilityInventory.find((i) => i.id === itemId);
    if (!item || !activeFacility) return;

    const nextQty = Math.max(0, item.unitsAvailable + delta);
    const nextStatus: InventoryStatus = nextQty === 0 ? "depleted" : "available";

    HemoStore.updateInventoryItem(
      itemId,
      { unitsAvailable: nextQty, status: nextStatus },
      `${activeFacility.name} Staff`,
      "hospital"
    );

    success("Stock Updated", `${item.bloodGroup} ${item.component}: ${nextQty} unit(s).`);
  };

  const handleDeleteItem = (itemId: string) => {
    if (!activeFacility) return;
    if (confirm("Are you sure you want to retire this inventory batch?")) {
      HemoStore.deleteInventoryItem(itemId, `${activeFacility.name} Staff`, "hospital");
      info("Item Removed", "Inventory batch removed from active registry.");
    }
  };

  const handleConfirmOffer = () => {
    if (!triageRequest || !activeFacility) return;

    HemoStore.addResponse({
      requestId: triageRequest.id,
      responderType: "facility",
      responderId: activeFacility.id,
      responderName: activeFacility.name,
      responderContact: activeFacility.emergencyHotline,
      bloodGroup: triageRequest.bloodGroup,
      unitsOffered: offerUnits,
      status: "offered",
      estimatedArrival: "Within 1 hour via certified cold chain courier",
      notes: offerNotes,
    });

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#15803D", "#B91C3C", "#0284C7"],
      });
    } catch {
      // Ignore
    }

    success("Unit Offer Dispatched", `Offered ${offerUnits} unit(s) to Request ${triageRequest.requestNumber}.`);
    setTriageRequest(null);
  };

  if (!activeFacility) {
    return (
      <div className="min-h-screen py-12 text-center text-zinc-500">
        Loading Hospital Portal...
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Facility Selector & Header */}
        <div className="bg-white p-6 rounded-2xl border border-[#E4E4E7] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                Operating Facility:
              </span>
              <select
                value={activeFacility.id}
                onChange={(e) => {
                  const sel = facilities.find((f) => f.id === e.target.value);
                  if (sel) setActiveFacility(sel);
                }}
                className="text-sm font-bold bg-zinc-50 border border-zinc-200 rounded-lg p-1.5 focus:ring-2 focus:ring-[#B91C3C]"
              >
                {facilities.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.city})
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-zinc-500">
              {activeFacility.type} • License #{activeFacility.licenseNumber} • {activeFacility.operatingHours}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="md"
              variant="primary"
              onClick={() => setIsAddModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
              className="font-bold shadow-xs"
            >
              Add Inventory Batch
            </Button>
          </div>
        </div>

        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-5 space-y-1">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                Total Units In Stock
              </span>
              <div className="text-3xl font-black text-zinc-900">{totalUnitsInStock}</div>
              <div className="text-xs text-zinc-500">{facilityInventory.length} active batch lots</div>
            </CardContent>
          </Card>

          <Card className={lowStockBatches.length > 0 ? "border-amber-300 bg-amber-50/30" : ""}>
            <CardContent className="p-5 space-y-1">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Critical Shortage Alert</span>
              </span>
              <div className="text-3xl font-black text-amber-700">{lowStockBatches.length}</div>
              <div className="text-xs text-amber-800 font-medium">Batches with ≤ 3 units</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 space-y-1">
              <span className="text-xs font-bold text-[#B91C3C] uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-[#B91C3C]" />
                <span>Inbound Urgent Needs</span>
              </span>
              <div className="text-3xl font-black text-[#B91C3C]">{urgentInboundRequests.length}</div>
              <div className="text-xs text-zinc-500">Active regional requisitions</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 space-y-1">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verification State</span>
              </span>
              <div className="text-lg font-bold text-emerald-700 pt-1">
                {activeFacility.verified ? "FDA / AABB Certified" : "Audit Pending"}
              </div>
              <div className="text-xs text-zinc-500">Authorized Transfusion License</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Section 1: Active Blood Inventory Table */}
        <Card>
          <CardHeader className="bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-base font-bold">
                Facility Blood Inventory Management
              </CardTitle>
              <CardDescription>
                Live stock levels for {activeFacility.name}. Units are indexed in the public Smart Match engine.
              </CardDescription>
            </div>
            <Badge variant="default" size="sm">
              {facilityInventory.length} Lots
            </Badge>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            {facilityInventory.length === 0 ? (
              <div className="p-12 text-center text-xs text-zinc-400 space-y-2">
                <Droplet className="w-8 h-8 text-zinc-300 mx-auto" />
                <p>No inventory batches currently logged for this facility.</p>
                <Button size="sm" variant="outline" onClick={() => setIsAddModalOpen(true)}>
                  + Log First Batch
                </Button>
              </div>
            ) : (
              <table className="w-full text-left text-xs text-zinc-600 border-collapse">
                <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4 font-bold">Blood Group</th>
                    <th className="p-4 font-bold">Component</th>
                    <th className="p-4 font-bold">Available / Reserved</th>
                    <th className="p-4 font-bold">Lot ID & Storage</th>
                    <th className="p-4 font-bold">Expiry Date</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold text-right">Quick Stock Adjust</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {facilityInventory.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="p-4">
                        <BloodGroupBadge bloodGroup={item.bloodGroup} size="sm" />
                      </td>
                      <td className="p-4 font-semibold text-zinc-900">
                        {item.component}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-sm text-zinc-900">
                          {item.unitsAvailable} <span className="text-xs font-normal text-zinc-500">units</span>
                        </div>
                        {item.unitsReserved > 0 && (
                          <span className="text-[10px] text-amber-700 font-medium">
                            ({item.unitsReserved} reserved)
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="font-mono text-zinc-800">{item.batchNumber}</div>
                        <div className="text-[11px] text-zinc-400">{item.storageTempCelsius}</div>
                      </td>
                      <td className="p-4">
                        <div>{new Date(item.expiryDate).toLocaleDateString()}</div>
                        <div className="text-[10px] text-zinc-400">
                          Updated {formatRelativeTime(item.lastUpdated)}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            item.status === "available"
                              ? "success"
                              : item.status === "reserved"
                              ? "warning"
                              : "error"
                          }
                          size="sm"
                        >
                          {item.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleAdjustQuantity(item.id, -1)}
                            className="w-7 h-7 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold flex items-center justify-center transition-colors cursor-pointer"
                            title="Decrease available count by 1"
                          >
                            -
                          </button>
                          <button
                            onClick={() => handleAdjustQuantity(item.id, 1)}
                            className="w-7 h-7 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold flex items-center justify-center transition-colors cursor-pointer"
                            title="Increase available count by 1"
                          >
                            +
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1.5 text-zinc-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer ml-1"
                            title="Remove lot"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        {/* Main Section 2: Regional Requisitions Triage Feed */}
        <Card>
          <CardHeader className="bg-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">
                  Emergency Regional Requisitions (Inbound Triage)
                </CardTitle>
                <CardDescription>
                  Hospital requests requiring blood products. Review and offer available units.
                </CardDescription>
              </div>
              <Badge variant="crimson" size="sm">Live Triage</Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-3">
            {urgentInboundRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 hover:border-zinc-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <BloodGroupBadge bloodGroup={req.bloodGroup} size="sm" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-zinc-900">{req.hospitalName}</h4>
                      <UrgencyBadge urgency={req.urgency} />
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Seeking <strong>{req.unitsRequired} Units</strong> of <strong>{req.bloodGroup} {req.component}</strong> in {req.city}
                    </p>
                    {req.medicalReason && (
                      <p className="text-[11px] text-zinc-600 mt-1 italic">
                        &quot;{req.medicalReason}&quot;
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/track-request?id=${req.requestNumber}`}>
                    <Button size="sm" variant="outline" className="text-xs">
                      Inspect
                    </Button>
                  </Link>

                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      setTriageRequest(req);
                      setOfferUnits(Math.min(req.unitsRequired, 2));
                    }}
                    leftIcon={<Send className="w-3.5 h-3.5" />}
                    className="font-bold text-xs"
                  >
                    Offer Units
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Add Inventory Batch Modal */}
        {isAddModalOpen && (
          <Modal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            title="Log New Blood Inventory Batch"
            description={`Assign batch lot to ${activeFacility.name}.`}
          >
            <form onSubmit={handleAddInventory} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Blood Group</label>
                  <select
                    value={newBloodGroup}
                    onChange={(e) => setNewBloodGroup(e.target.value as BloodGroup)}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg font-bold"
                  >
                    {(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as BloodGroup[]).map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Component</label>
                  <select
                    value={newComponent}
                    onChange={(e) => setNewComponent(e.target.value as BloodComponent)}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg"
                  >
                    <option value="Packed Red Blood Cells (PRBC)">PRBC (Red Cells)</option>
                    <option value="Whole Blood">Whole Blood</option>
                    <option value="Platelets">Platelets</option>
                    <option value="Fresh Frozen Plasma (FFP)">Fresh Frozen Plasma</option>
                    <option value="Cryoprecipitate">Cryoprecipitate</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Units Available</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={newUnits}
                    onChange={(e) => setNewUnits(Number(e.target.value) || 1)}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Storage Temperature</label>
                  <input
                    type="text"
                    value={newStorageTemp}
                    onChange={(e) => setNewStorageTemp(e.target.value)}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Batch Lot Number</label>
                  <input
                    type="text"
                    value={newBatchNumber}
                    onChange={(e) => setNewBatchNumber(e.target.value)}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={newExpiryDate}
                    onChange={(e) => setNewExpiryDate(e.target.value)}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-2">
                <Button size="sm" variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" type="submit" className="font-bold">
                  Save Inventory Lot
                </Button>
              </div>
            </form>
          </Modal>
        )}

        {/* Offer Units Modal */}
        {triageRequest && (
          <Modal
            isOpen={Boolean(triageRequest)}
            onClose={() => setTriageRequest(null)}
            title="Dispatch Requisition Unit Commitment"
            description={`Offer blood units from ${activeFacility.name} for Request ${triageRequest.requestNumber}.`}
          >
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 space-y-1">
                <span className="font-bold text-zinc-900 block">
                  Requesting Hospital: {triageRequest.hospitalName} ({triageRequest.city})
                </span>
                <p className="text-zinc-600">
                  Requires {triageRequest.unitsRequired} units of {triageRequest.bloodGroup} {triageRequest.component}
                </p>
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">
                  Units to Commit and Dispatch:
                </label>
                <input
                  type="number"
                  min={1}
                  max={triageRequest.unitsRequired}
                  value={offerUnits}
                  onChange={(e) => setOfferUnits(Number(e.target.value) || 1)}
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">
                  Courier / Crossmatching Notes:
                </label>
                <textarea
                  rows={2}
                  value={offerNotes}
                  onChange={(e) => setOfferNotes(e.target.value)}
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => setTriageRequest(null)}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" onClick={handleConfirmOffer} className="font-bold">
                  Authorize Dispatch Offer
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
