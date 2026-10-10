import {
  BloodComponent,
  BloodGroup,
  BloodInventoryItem,
  DonorProfile,
  MatchScoreBreakdown,
  SmartMatchResult,
  UrgencyLevel,
} from "@/types";

/**
 * Packed Red Blood Cells & Whole Blood Compatibility Table
 * Key: Recipient Blood Group -> Compatible Donor Blood Groups
 */
const RBC_COMPATIBILITY: Record<BloodGroup, BloodGroup[]> = {
  "O-": ["O-"],
  "O+": ["O+", "O-"],
  "A-": ["A-", "O-"],
  "A+": ["A+", "A-", "O+", "O-"],
  "B-": ["B-", "O-"],
  "B+": ["B+", "B-", "O+", "O-"],
  "AB-": ["AB-", "A-", "B-", "O-"],
  "AB+": ["AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"],
};

/**
 * Fresh Frozen Plasma (FFP) Compatibility Table
 * Plasma compatibility is the reverse of RBC compatibility.
 * Key: Recipient Blood Group -> Compatible Plasma Donor Groups
 */
const PLASMA_COMPATIBILITY: Record<BloodGroup, BloodGroup[]> = {
  "AB+": ["AB+", "AB-"],
  "AB-": ["AB+", "AB-"],
  "A+": ["A+", "A-", "AB+", "AB-"],
  "A-": ["A+", "A-", "AB+", "AB-"],
  "B+": ["B+", "B-", "AB+", "AB-"],
  "B-": ["B+", "B-", "AB+", "AB-"],
  "O+": ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"],
  "O-": ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"],
};

/**
 * Check biological compatibility based on component type
 */
export function checkBiologicalCompatibility(
  recipientGroup: BloodGroup,
  donorGroup: BloodGroup,
  component: BloodComponent
): { isCompatible: boolean; score: number; reason: string } {
  const isExact = recipientGroup === donorGroup;

  if (component === "Packed Red Blood Cells (PRBC)" || component === "Whole Blood") {
    const compatibleList = RBC_COMPATIBILITY[recipientGroup] || [];
    const isCompatible = compatibleList.includes(donorGroup);

    if (isExact) {
      return {
        isCompatible: true,
        score: 100,
        reason: `Exact match: ${donorGroup} is 100% ABO/Rh identical for ${component}.`,
      };
    }
    if (isCompatible) {
      const isUniversalO = donorGroup === "O-" || donorGroup === "O+";
      return {
        isCompatible: true,
        score: isUniversalO ? 92 : 85,
        reason: `Compatible match: ${donorGroup} is clinically compatible for ${recipientGroup} recipient (${component}).`,
      };
    }
    return {
      isCompatible: false,
      score: 0,
      reason: `Incompatible: ${donorGroup} RBCs contain antigens incompatible with ${recipientGroup} antibodies.`,
    };
  }

  if (component === "Fresh Frozen Plasma (FFP)") {
    const compatibleList = PLASMA_COMPATIBILITY[recipientGroup] || [];
    const isCompatible = compatibleList.includes(donorGroup);

    if (isExact) {
      return {
        isCompatible: true,
        score: 100,
        reason: `Exact match: ${donorGroup} plasma is identical for ${recipientGroup}.`,
      };
    }
    if (isCompatible) {
      const isUniversalAB = donorGroup === "AB+" || donorGroup === "AB-";
      return {
        isCompatible: true,
        score: isUniversalAB ? 95 : 88,
        reason: `Compatible plasma: ${donorGroup} donor plasma is safe for ${recipientGroup} recipient.`,
      };
    }
    return {
      isCompatible: false,
      score: 0,
      reason: `Incompatible: ${donorGroup} plasma contains antibodies against ${recipientGroup} red cells.`,
    };
  }

  if (component === "Platelets") {
    if (isExact) {
      return {
        isCompatible: true,
        score: 100,
        reason: `ABO-identical platelets: Optimum recovery and minimal refractoriness.`,
      };
    }
    const rbcCompatible = RBC_COMPATIBILITY[recipientGroup]?.includes(donorGroup);
    if (rbcCompatible) {
      return {
        isCompatible: true,
        score: 82,
        reason: `ABO-compatible platelets: Acceptable cross-match match.`,
      };
    }
    return {
      isCompatible: false,
      score: 10,
      reason: `Out-of-group platelets: Higher risk of reduced platelet increment.`,
    };
  }

  // Cryoprecipitate / default
  if (isExact) {
    return {
      isCompatible: true,
      score: 100,
      reason: `Identical blood type match for ${component}.`,
    };
  }
  return {
    isCompatible: true,
    score: 85,
    reason: `ABO-compatible for ${component} replacement.`,
  };
}

export interface SmartMatchInput {
  bloodGroup: BloodGroup;
  component: BloodComponent;
  city: string;
  unitsRequired: number;
  urgency: UrgencyLevel;
}

export function runSmartMatch(
  input: SmartMatchInput,
  inventory: BloodInventoryItem[],
  donors: DonorProfile[]
): SmartMatchResult[] {
  const results: SmartMatchResult[] = [];
  const now = new Date("2026-04-10T12:00:00.000Z").getTime();

  // 1. Process Facility Inventory
  for (const item of inventory) {
    // Exclude unavailable, depleted, quarantined, or zero quantity
    if (item.status !== "available" || item.unitsAvailable <= 0) continue;

    // Exclude expired inventory
    if (item.expiryDate && new Date(item.expiryDate).getTime() < now) continue;

    // Check biological compatibility
    const bioComp = checkBiologicalCompatibility(input.bloodGroup, item.bloodGroup, input.component);
    if (!bioComp.isCompatible) continue;

    // Component exact match check
    const compScore = item.component === input.component ? 100 : item.component === "Whole Blood" ? 70 : 40;
    const compReason =
      item.component === input.component
        ? `Exact component match (${item.component})`
        : `Alternative component (${item.component}) - requires processing`;

    // Location scoring
    const isSameCity = item.city.toLowerCase().trim() === input.city.toLowerCase().trim();
    const locScore = isSameCity ? 100 : 55;
    const locReason = isSameCity ? `Located within requested city (${item.city})` : `Located in nearby city (${item.city})`;

    // Quantity coverage
    const quantityFraction = Math.min(item.unitsAvailable / Math.max(1, input.unitsRequired), 1.2);
    const quantityScore = Math.min(Math.round(quantityFraction * 100), 100);
    const quantityReason = `${item.unitsAvailable} unit(s) in stock (Requested: ${input.unitsRequired})`;

    // Data freshness
    const updatedTime = new Date(item.lastUpdated).getTime();
    const hoursAgo = Math.max(0, Math.round((now - updatedTime) / (1000 * 60 * 60)));
    let freshnessScore = 100;
    if (hoursAgo > 48) freshnessScore = 20;
    else if (hoursAgo > 24) freshnessScore = 50;
    else if (hoursAgo > 12) freshnessScore = 75;
    else if (hoursAgo > 4) freshnessScore = 90;

    const freshnessReason = `Inventory record updated ${hoursAgo === 0 ? "recently (<1h)" : `${hoursAgo}h ago`}`;

    // Verification
    const verifScore = item.isVerified ? 100 : 50;
    const verifReason = item.isVerified
      ? `Verified medical facility with verified blood storage protocol`
      : `Unverified facility report - requires phone confirmation`;

    // Calculate overall composite score
    // Weightings: Compatibility 35%, Location 20%, Quantity 15%, Freshness 15%, Verification 15%
    let overallScore = Math.round(
      bioComp.score * 0.35 +
        locScore * 0.20 +
        quantityScore * 0.15 +
        freshnessScore * 0.15 +
        verifScore * 0.15
    );

    // Boost if urgent and in same city with exact match
    if ((input.urgency === "immediate" || input.urgency === "emergency" || input.urgency === "high") && isSameCity && bioComp.score === 100) {
      overallScore = Math.min(100, overallScore + 5);
    }

    const breakdown: MatchScoreBreakdown = {
      bloodCompatibility: bioComp,
      componentMatch: { score: compScore, reason: compReason },
      locationProximity: { score: locScore, estimatedDistanceKm: isSameCity ? 4.5 : 35, reason: locReason },
      quantityCoverage: { score: quantityScore, unitsOfferedOrAvailable: item.unitsAvailable, reason: quantityReason },
      dataFreshness: { score: freshnessScore, lastUpdatedHoursAgo: hoursAgo, reason: freshnessReason },
      verificationReliability: { score: verifScore, isVerifiedFacility: item.isVerified, reason: verifReason },
    };

    let urgencyAlignment: "Optimal" | "Good" | "Acceptable" | "Contingency" = "Acceptable";
    if (overallScore >= 90) urgencyAlignment = "Optimal";
    else if (overallScore >= 75) urgencyAlignment = "Good";
    else if (overallScore < 60) urgencyAlignment = "Contingency";

    results.push({
      matchId: `FAC-${item.id}`,
      type: item.isVerified ? "verified_facility" : "unverified_facility",
      sourceName: item.facilityName,
      facilityId: item.facilityId,
      bloodGroup: item.bloodGroup,
      component: item.component,
      city: item.city,
      availableUnits: item.unitsAvailable,
      contactNumber: "Emergency Desk Available via Platform",
      isVerified: item.isVerified,
      lastUpdated: item.lastUpdated,
      overallScore,
      urgencyAlignment,
      breakdown,
      recommendationAction: item.isVerified
        ? "Priority 1: Direct requisition from verified blood bank"
        : "Priority 2: Call facility to verify physical unit presence before dispatch",
      dataMode: "DEMO",
    });
  }

  // 2. Process Volunteer Donors
  for (const donor of donors) {
    if (!donor.isAvailable || !donor.consentEmergencyContact || donor.consentStatus === "Withdrawn" || donor.availabilityStatus === "Paused") {
      continue;
    }

    const bioComp = checkBiologicalCompatibility(input.bloodGroup, donor.bloodGroup, input.component);
    if (!bioComp.isCompatible) continue;

    const isSameCity = donor.city.toLowerCase().trim() === input.city.toLowerCase().trim();
    const locScore = isSameCity ? 95 : 45;
    const locReason = isSameCity
      ? `Donor resides in requested city (${donor.city}) within ${donor.radiusKm}km radius`
      : `Donor in neighboring city (${donor.city})`;

    // Donor single donation yields 1 unit
    const quantityScore = Math.min(Math.round((1 / Math.max(1, input.unitsRequired)) * 100), 100);
    const quantityReason = `Single voluntary donor (1 donation yield)`;

    // Donor readiness/screening status
    const verifScore = donor.medicalScreeningPassed ? 85 : 60;
    const verifReason = donor.medicalScreeningPassed
      ? `Active registered donor with preliminary health checklist passed`
      : `Registered voluntary donor (pre-screening required on site)`;

    const overallScore = Math.round(
      bioComp.score * 0.35 +
        locScore * 0.25 +
        quantityScore * 0.15 +
        85 * 0.10 +
        verifScore * 0.15
    );

    let urgencyAlignment: "Optimal" | "Good" | "Acceptable" | "Contingency" = "Good";
    if (overallScore >= 85) urgencyAlignment = "Optimal";
    else if (overallScore < 65) urgencyAlignment = "Acceptable";

    const breakdown: MatchScoreBreakdown = {
      bloodCompatibility: bioComp,
      componentMatch: { score: 90, reason: "Whole Blood / Apheresis donor ready for hospital collection" },
      locationProximity: { score: locScore, estimatedDistanceKm: isSameCity ? 6.2 : 45, reason: locReason },
      quantityCoverage: { score: quantityScore, unitsOfferedOrAvailable: 1, reason: quantityReason },
      dataFreshness: { score: 90, lastUpdatedHoursAgo: 1, reason: "Active donor profile" },
      verificationReliability: { score: verifScore, isVerifiedFacility: false, reason: verifReason },
    };

    results.push({
      matchId: `DON-${donor.id}`,
      type: "volunteer_donor",
      sourceName: `Volunteer Donor (${donor.fullName.split(" ")[0]} ${donor.fullName.split(" ")[1]?.[0] || ""}. - ID: #${donor.id.slice(-4)})`,
      donorId: donor.id,
      bloodGroup: donor.bloodGroup,
      component: input.component,
      city: donor.city,
      availableUnits: 1,
      contactNumber: donor.privacyShowPhonePublic ? donor.phone : "Protected (Contact via HemoHealth Dispatch)",
      isVerified: donor.medicalScreeningPassed,
      lastUpdated: donor.registeredAt,
      overallScore,
      urgencyAlignment,
      breakdown,
      recommendationAction: "Dispatch emergency donation alert to donor's preferred contact channel",
      dataMode: "DEMO",
    });
  }

  // Sort descending by overallScore
  return results.sort((a, b) => b.overallScore - a.overallScore);
}
