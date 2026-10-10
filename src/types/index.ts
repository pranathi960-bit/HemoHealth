export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export type BloodComponent =
  | "Whole Blood"
  | "Packed Red Blood Cells (PRBC)"
  | "Platelets"
  | "Fresh Frozen Plasma (FFP)"
  | "Cryoprecipitate";

export type UrgencyLevel =
  | "immediate"
  | "within-24h"
  | "within-48h"
  | "elective"
  | "emergency"
  | "high"
  | "normal"
  | "low";

export type RequestStatus =
  | "submitted"
  | "under-review"
  | "matching-in-progress"
  | "response-received"
  | "fulfilled"
  | "cancelled"
  | "no-matches";

export type InventoryStatus =
  | "available"
  | "reserved"
  | "depleted"
  | "expired"
  | "quarantined";

export type FacilityType =
  | "Hospital"
  | "Blood Bank"
  | "Medical Centre"
  | "Trauma Center"
  | "Regional Depot";

export type UserRole = "requester" | "donor" | "hospital" | "admin";

export interface Facility {
  id: string;
  facilityId?: string;
  name: string;
  type: FacilityType;
  facilityType?: FacilityType;
  licenseNumber: string;
  address: string;
  generalAddressLabel?: string;
  city: string;
  state: string;
  phone: string;
  emergencyHotline: string;
  email: string;
  verified: boolean;
  demonstrationVerificationStatus?: "Verified" | "Unverified";
  supportedComponents?: BloodComponent[];
  contactDisplayPolicy?: "Masked" | "EmergencyDeskOnly" | "Public";
  verifiedAt?: string;
  operatingHours: string;
  latitude: number;
  longitude: number;
  createdAt?: string;
  updatedAt?: string;
  dataMode: "DEMO";
}

export interface BloodInventoryItem {
  id: string;
  inventoryId?: string;
  facilityId: string;
  facilityName: string;
  city: string;
  bloodGroup: BloodGroup;
  component: BloodComponent;
  unitsAvailable: number;
  quantity?: number;
  unit?: "units" | "bags" | "ml";
  unitsReserved: number;
  storageTempCelsius: string;
  batchNumber: string;
  collectionDate: string;
  expiryDate: string;
  status: InventoryStatus;
  isVerified: boolean;
  lastUpdated: string;
  dataMode: "DEMO";
}

export interface DonorProfile {
  id: string;
  donorId?: string;
  userId?: string;
  fullName: string;
  fictionalDisplayName?: string;
  bloodGroup: BloodGroup;
  city: string;
  state: string;
  phone: string;
  email: string;
  preferredContact: "call" | "sms" | "whatsapp" | "email";
  contactPreference?: "call" | "sms" | "whatsapp" | "email";
  isAvailable: boolean;
  availabilityStatus?: "Available" | "Temporarily Unavailable" | "Paused" | "Withdrawn";
  consentStatus?: "Active Consent" | "Withdrawn" | "Pending";
  lastDonationDate?: string;
  totalDonations: number;
  radiusKm: number;
  consentEmergencyContact: boolean;
  registeredAt: string;
  lastUpdated?: string;
  medicalScreeningPassed: boolean;
  privacyShowPhonePublic: boolean;
  dataMode: "DEMO";
}

export interface BloodRequest {
  id: string;
  requestId?: string;
  requestNumber: string; // e.g. DEMO-1001 or REQ-2026-8941
  requesterName: string;
  requesterDisplayName?: string;
  requesterPhone: string;
  requesterEmail: string;
  patientName: string;
  patientAge?: number;
  hospitalName: string;
  hospitalAddress?: string;
  city: string;
  bloodGroup: BloodGroup;
  component: BloodComponent;
  unitsRequired: number;
  quantity?: number;
  urgency: UrgencyLevel;
  requiredDate: string;
  medicalReason?: string;
  doctorName?: string;
  doctorContact?: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  fulfilledAt?: string;
  cancelledReason?: string;
  dataMode: "DEMO";
}

export interface RequestResponse {
  id: string;
  responseId?: string;
  requestId: string;
  responderType: "facility" | "donor";
  respondingEntityType?: "facility" | "donor";
  responderId: string;
  respondingEntityId?: string;
  responderName: string;
  responderContact: string;
  bloodGroup: BloodGroup;
  unitsOffered: number;
  status: "offered" | "accepted" | "declined" | "completed";
  responseStatus?: "Pending" | "Accepted" | "Declined" | "Needs More Information";
  estimatedArrival?: string;
  notes?: string;
  createdAt: string;
  dataMode: "DEMO";
}

export interface NotificationItem {
  id: string;
  notificationId?: string;
  userId?: string;
  recipientDemoUserId?: string;
  recipientRole?: UserRole | "all";
  title: string;
  message: string;
  type: "emergency" | "match" | "status" | "system";
  link?: string;
  read: boolean;
  readStatus?: "Read" | "Unread";
  createdAt: string;
  dataMode: "DEMO";
}

export interface AuditLog {
  id: string;
  action: string;
  actorName: string;
  actorRole: UserRole;
  entityType: "inventory" | "request" | "donor" | "facility" | "auth";
  entityId: string;
  details: string;
  timestamp: string;
  dataMode: "DEMO";
}

export interface MatchScoreBreakdown {
  bloodCompatibility: {
    score: number; // 0-100
    isCompatible: boolean;
    reason: string;
  };
  componentMatch: {
    score: number;
    reason: string;
  };
  locationProximity: {
    score: number;
    estimatedDistanceKm?: number;
    reason: string;
  };
  quantityCoverage: {
    score: number;
    unitsOfferedOrAvailable: number;
    reason: string;
  };
  dataFreshness: {
    score: number;
    lastUpdatedHoursAgo: number;
    reason: string;
  };
  verificationReliability: {
    score: number;
    isVerifiedFacility: boolean;
    reason: string;
  };
}

export interface SmartMatchResult {
  matchId: string;
  type: "verified_facility" | "unverified_facility" | "volunteer_donor";
  sourceName: string;
  facilityId?: string;
  donorId?: string;
  bloodGroup: BloodGroup;
  component: BloodComponent;
  city: string;
  availableUnits: number;
  contactNumber: string;
  isVerified: boolean;
  lastUpdated: string;
  overallScore: number; // 0-100
  urgencyAlignment: "Optimal" | "Good" | "Acceptable" | "Contingency";
  breakdown: MatchScoreBreakdown;
  recommendationAction: string;
  dataMode: "DEMO";
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  facilityId?: string;
  donorProfileId?: string;
  facilityName?: string;
  dataMode: "DEMO";
}
