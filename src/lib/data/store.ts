"use client";

import {
  AuditLog,
  BloodInventoryItem,
  BloodRequest,
  DonorProfile,
  Facility,
  NotificationItem,
  RequestResponse,
  UserRole,
} from "@/types";
import {
  INITIAL_AUDIT_LOGS,
  INITIAL_DONORS,
  INITIAL_FACILITIES,
  INITIAL_INVENTORY,
  INITIAL_NOTIFICATIONS,
  INITIAL_REQUESTS,
  INITIAL_RESPONSES,
} from "./mockData";
import { SYNTHETIC_INVENTORY } from "./syntheticDataset";
import { generateId } from "../utils";

const STORAGE_KEYS = {
  FACILITIES: "hemohealth_facilities_v2",
  INVENTORY: "hemohealth_inventory_v2",
  DONORS: "hemohealth_donors_v2",
  REQUESTS: "hemohealth_requests_v2",
  RESPONSES: "hemohealth_responses_v2",
  NOTIFICATIONS: "hemohealth_notifications_v2",
  AUDIT_LOGS: "hemohealth_audit_logs_v2",
  DEMO_ROLE: "hemohealth_current_role_v2",
};

// Listeners for in-memory React state updates
type Listener = () => void;
const listeners: Set<Listener> = new Set();

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch {
      // Ignore listener error
    }
  });
}

export function subscribeToStore(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || (Array.isArray(fallback) && !Array.isArray(parsed))) {
      // Corrupted data fallback
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return parsed;
  } catch {
    // Corrupted localStorage JSON safe recovery
    try {
      localStorage.setItem(key, JSON.stringify(fallback));
    } catch {
      // Ignore
    }
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifyListeners();
  } catch (e) {
    console.error("Storage error:", e);
  }
}

export const HemoStore = {
  // Facilities
  getFacilities(): Facility[] {
    return getItem<Facility[]>(STORAGE_KEYS.FACILITIES, INITIAL_FACILITIES);
  },
  getFacilityById(id: string): Facility | undefined {
    return this.getFacilities().find((f) => f.id === id || f.facilityId === id);
  },

  // Inventory
  getInventory(): BloodInventoryItem[] {
    return getItem<BloodInventoryItem[]>(STORAGE_KEYS.INVENTORY, INITIAL_INVENTORY);
  },
  getInventoryByFacility(facilityId: string): BloodInventoryItem[] {
    return this.getInventory().filter((i) => i.facilityId === facilityId);
  },
  addInventoryItem(
    item: Omit<BloodInventoryItem, "id" | "lastUpdated" | "dataMode">,
    actorName = "Hospital Staff",
    actorRole: UserRole = "hospital"
  ): BloodInventoryItem {
    const current = this.getInventory();
    const id = generateId("INV");
    const newItem: BloodInventoryItem = {
      ...item,
      id,
      inventoryId: id,
      lastUpdated: new Date().toISOString(),
      dataMode: "DEMO",
    };
    const updated = [newItem, ...current];
    setItem(STORAGE_KEYS.INVENTORY, updated);

    this.addAuditLog({
      action: "INVENTORY_ADDED",
      actorName,
      actorRole,
      entityType: "inventory",
      entityId: newItem.id,
      details: `Added ${newItem.unitsAvailable} units of ${newItem.bloodGroup} ${newItem.component} (${newItem.facilityName})`,
    });

    return newItem;
  },
  updateInventoryItem(
    id: string,
    updates: Partial<BloodInventoryItem>,
    actorName = "Hospital Staff",
    actorRole: UserRole = "hospital"
  ): BloodInventoryItem | null {
    const current = this.getInventory();
    const index = current.findIndex((i) => i.id === id || i.inventoryId === id);
    if (index === -1) return null;

    const updatedItem: BloodInventoryItem = {
      ...current[index],
      ...updates,
      lastUpdated: new Date().toISOString(),
      dataMode: "DEMO",
    };
    current[index] = updatedItem;
    setItem(STORAGE_KEYS.INVENTORY, [...current]);

    this.addAuditLog({
      action: "INVENTORY_UPDATED",
      actorName,
      actorRole,
      entityType: "inventory",
      entityId: id,
      details: `Updated stock: ${updatedItem.unitsAvailable} available, ${updatedItem.unitsReserved} reserved (${updatedItem.bloodGroup} ${updatedItem.component})`,
    });

    return updatedItem;
  },
  deleteInventoryItem(
    id: string,
    actorName = "Hospital Staff",
    actorRole: UserRole = "hospital"
  ): boolean {
    const current = this.getInventory();
    const target = current.find((i) => i.id === id || i.inventoryId === id);
    if (!target) return false;

    const filtered = current.filter((i) => i.id !== id && i.inventoryId !== id);
    setItem(STORAGE_KEYS.INVENTORY, filtered);

    this.addAuditLog({
      action: "INVENTORY_REMOVED",
      actorName,
      actorRole,
      entityType: "inventory",
      entityId: id,
      details: `Removed inventory batch ${target.batchNumber} (${target.bloodGroup} ${target.component})`,
    });

    return true;
  },

  // Donors
  getDonors(): DonorProfile[] {
    return getItem<DonorProfile[]>(STORAGE_KEYS.DONORS, INITIAL_DONORS);
  },
  getDonorById(id: string): DonorProfile | undefined {
    return this.getDonors().find((d) => d.id === id || d.donorId === id);
  },
  registerDonor(
    donor: Omit<DonorProfile, "id" | "registeredAt" | "totalDonations" | "isAvailable" | "dataMode"> & { isAvailable?: boolean }
  ): DonorProfile {
    const current = this.getDonors();
    const id = generateId("DON");
    const newDonor: DonorProfile = {
      ...donor,
      id,
      donorId: id,
      fullName: donor.fullName || donor.fictionalDisplayName || "Demo Donor",
      fictionalDisplayName: donor.fullName || donor.fictionalDisplayName || "Demo Donor",
      isAvailable: donor.isAvailable ?? true,
      availabilityStatus: (donor.isAvailable ?? true) ? "Available" : "Paused",
      consentStatus: "Active Consent",
      totalDonations: 0,
      registeredAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      dataMode: "DEMO",
    };
    const updated = [newDonor, ...current];
    setItem(STORAGE_KEYS.DONORS, updated);

    this.addAuditLog({
      action: "DONOR_REGISTERED",
      actorName: newDonor.fullName,
      actorRole: "donor",
      entityType: "donor",
      entityId: newDonor.id,
      details: `Voluntary donor registered with group ${newDonor.bloodGroup} in ${newDonor.city}`,
    });

    this.addNotification({
      recipientRole: "donor",
      title: "Welcome to HemoHealth Volunteer Network",
      message: `Thank you for registering as a ${newDonor.bloodGroup} blood donor. Your availability is active.`,
      type: "system",
      link: "/donors/dashboard",
    });

    return newDonor;
  },
  updateDonorAvailability(id: string, isAvailable: boolean): void {
    const current = this.getDonors();
    const index = current.findIndex((d) => d.id === id || d.donorId === id);
    if (index === -1) return;
    current[index] = {
      ...current[index],
      isAvailable,
      availabilityStatus: isAvailable ? "Available" : "Paused",
      lastUpdated: new Date().toISOString(),
    };
    setItem(STORAGE_KEYS.DONORS, [...current]);
  },
  updateDonorPrivacy(id: string, privacyShowPhonePublic: boolean): void {
    const current = this.getDonors();
    const index = current.findIndex((d) => d.id === id || d.donorId === id);
    if (index === -1) return;
    current[index] = { ...current[index], privacyShowPhonePublic, lastUpdated: new Date().toISOString() };
    setItem(STORAGE_KEYS.DONORS, [...current]);
  },

  // Requests
  getRequests(): BloodRequest[] {
    return getItem<BloodRequest[]>(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
  },
  getRequestById(id: string): BloodRequest | undefined {
    return this.getRequests().find(
      (r) => r.id === id || r.requestId === id || r.requestNumber.toLowerCase() === id.toLowerCase()
    );
  },
  createRequest(
    req: Omit<BloodRequest, "id" | "requestNumber" | "status" | "createdAt" | "updatedAt" | "dataMode">
  ): BloodRequest {
    const current = this.getRequests();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const requestNumber = `DEMO-${new Date().getFullYear()}-${randomNum}`;
    const id = generateId("REQ");
    const newReq: BloodRequest = {
      ...req,
      id,
      requestId: id,
      requestNumber,
      status: "matching-in-progress",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dataMode: "DEMO",
    };
    const updated = [newReq, ...current];
    setItem(STORAGE_KEYS.REQUESTS, updated);

    this.addAuditLog({
      action: "REQUEST_CREATED",
      actorName: newReq.requesterName,
      actorRole: "requester",
      entityType: "request",
      entityId: newReq.id,
      details: `Submitted emergency request ${newReq.requestNumber} for ${newReq.unitsRequired} units ${newReq.bloodGroup} (${newReq.hospitalName})`,
    });

    this.addNotification({
      recipientRole: "all",
      title: `Emergency Blood Request: ${newReq.bloodGroup} ${newReq.component}`,
      message: `${newReq.hospitalName} in ${newReq.city} requested ${newReq.unitsRequired} unit(s) (${newReq.urgency.toUpperCase()}).`,
      type: "emergency",
      link: `/track-request?id=${newReq.requestNumber}`,
    });

    return newReq;
  },
  updateRequestStatus(
    id: string,
    status: BloodRequest["status"],
    actorName = "System",
    actorRole: UserRole = "admin"
  ): void {
    const current = this.getRequests();
    const index = current.findIndex((r) => r.id === id || r.requestId === id || r.requestNumber === id);
    if (index === -1) return;

    const old = current[index];
    current[index] = {
      ...old,
      status,
      updatedAt: new Date().toISOString(),
      fulfilledAt: status === "fulfilled" ? new Date().toISOString() : old.fulfilledAt,
    };
    setItem(STORAGE_KEYS.REQUESTS, [...current]);

    this.addAuditLog({
      action: "REQUEST_STATUS_UPDATED",
      actorName,
      actorRole,
      entityType: "request",
      entityId: old.id,
      details: `Status of ${old.requestNumber} transitioned to ${status}`,
    });

    this.addNotification({
      recipientRole: "all",
      title: `Request ${old.requestNumber} Status Updated`,
      message: `Request for ${old.bloodGroup} ${old.component} is now marked as ${status.replace("-", " ").toUpperCase()}.`,
      type: "status",
      link: `/track-request?id=${old.requestNumber}`,
    });
  },
  cancelRequest(id: string, reason: string, actorName = "Requester"): void {
    const current = this.getRequests();
    const index = current.findIndex((r) => r.id === id || r.requestId === id || r.requestNumber === id);
    if (index === -1) return;

    const old = current[index];
    current[index] = {
      ...old,
      status: "cancelled",
      cancelledReason: reason,
      updatedAt: new Date().toISOString(),
    };
    setItem(STORAGE_KEYS.REQUESTS, [...current]);

    this.addAuditLog({
      action: "REQUEST_CANCELLED",
      actorName,
      actorRole: "requester",
      entityType: "request",
      entityId: old.id,
      details: `Cancelled ${old.requestNumber}: ${reason}`,
    });
  },

  // Responses
  getResponses(): RequestResponse[] {
    return getItem<RequestResponse[]>(STORAGE_KEYS.RESPONSES, INITIAL_RESPONSES);
  },
  getResponsesByRequestId(requestId: string): RequestResponse[] {
    const req = this.getRequestById(requestId);
    if (!req) return [];
    return this.getResponses().filter((r) => r.requestId === req.id || r.requestId === req.requestNumber);
  },
  addResponse(response: Omit<RequestResponse, "id" | "createdAt" | "dataMode">): RequestResponse {
    const current = this.getResponses();
    const id = generateId("RESP");
    const newResp: RequestResponse = {
      ...response,
      id,
      responseId: id,
      createdAt: new Date().toISOString(),
      dataMode: "DEMO",
    };
    setItem(STORAGE_KEYS.RESPONSES, [newResp, ...current]);

    // Transition request status if appropriate
    this.updateRequestStatus(response.requestId, "response-received", response.responderName, "hospital");

    return newResp;
  },

  // Notifications
  getNotifications(): NotificationItem[] {
    return getItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  },
  addNotification(notif: Omit<NotificationItem, "id" | "read" | "createdAt" | "dataMode">): void {
    const current = this.getNotifications();
    const id = generateId("NTF");
    const newNotif: NotificationItem = {
      ...notif,
      id,
      notificationId: id,
      read: false,
      createdAt: new Date().toISOString(),
      dataMode: "DEMO",
    };
    setItem(STORAGE_KEYS.NOTIFICATIONS, [newNotif, ...current]);
  },
  markNotificationAsRead(id: string): void {
    const current = this.getNotifications();
    const index = current.findIndex((n) => n.id === id || n.notificationId === id);
    if (index === -1) return;
    current[index] = { ...current[index], read: true, readStatus: "Read" };
    setItem(STORAGE_KEYS.NOTIFICATIONS, [...current]);
  },
  markAllNotificationsRead(): void {
    const current = this.getNotifications().map((n) => ({ ...n, read: true, readStatus: "Read" as const }));
    setItem(STORAGE_KEYS.NOTIFICATIONS, current);
  },

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    return getItem<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  },
  addAuditLog(log: Omit<AuditLog, "id" | "timestamp" | "dataMode">): void {
    const current = this.getAuditLogs();
    const newLog: AuditLog = {
      ...log,
      id: generateId("LOG"),
      timestamp: new Date().toISOString(),
      dataMode: "DEMO",
    };
    setItem(STORAGE_KEYS.AUDIT_LOGS, [newLog, ...current.slice(0, 49)]); // Keep last 50
  },

  // Current Demo Role
  getCurrentRole(): UserRole {
    return getItem<UserRole>(STORAGE_KEYS.DEMO_ROLE, "requester");
  },
  setCurrentRole(role: UserRole): void {
    setItem(STORAGE_KEYS.DEMO_ROLE, role);
  },

  // Reset Data to Factory Demonstrator with explicit user confirmation
  resetToDefault(): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.FACILITIES, JSON.stringify(INITIAL_FACILITIES));
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(SYNTHETIC_INVENTORY));
    localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(INITIAL_DONORS));
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
    localStorage.setItem(STORAGE_KEYS.RESPONSES, JSON.stringify(INITIAL_RESPONSES));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
    localStorage.setItem(STORAGE_KEYS.DEMO_ROLE, JSON.stringify("requester"));
    notifyListeners();
  },
};
