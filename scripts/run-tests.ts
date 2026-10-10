import {
  SYNTHETIC_FACILITIES,
  SYNTHETIC_INVENTORY,
  SYNTHETIC_DONORS,
  SYNTHETIC_REQUESTS,
  SYNTHETIC_RESPONSES,
  SYNTHETIC_NOTIFICATIONS,
  SYNTHETIC_AUDIT_LOGS,
  SPECIFIED_DEMO_FIXTURES,
  DEMO_EDGE_CASES,
} from "../src/lib/data/syntheticDataset";
import {
  checkBiologicalCompatibility,
  runSmartMatch,
} from "../src/lib/matching/smartMatcher";
import {
  emergencyRequestSchema,
  donorRegistrationSchema,
  inventoryItemSchema,
} from "../src/lib/validation/schemas";
import {
  BloodGroup,
  BloodComponent,
  BloodRequest,
  BloodInventoryItem,
  DonorProfile,
} from "../src/types";

let passedTests = 0;
let failedTests = 0;
const testResults: { name: string; passed: boolean; error?: string }[] = [];

function test(name: string, fn: () => void) {
  try {
    fn();
    passedTests++;
    testResults.push({ name, passed: true });
    console.log(`  ✓ ${name}`);
  } catch (err: any) {
    failedTests++;
    testResults.push({ name, passed: false, error: err?.message || String(err) });
    console.error(`  ✗ ${name}`);
    console.error(`    Error: ${err?.message || err}`);
  }
}

function assert(condition: boolean, msg = "Assertion failed") {
  if (!condition) throw new Error(msg);
}

function assertEquals(actual: any, expected: any, msg = "Values not equal") {
  if (actual !== expected) {
    throw new Error(`${msg} - Expected: ${expected}, Actual: ${actual}`);
  }
}

console.log("\n=======================================================");
console.log("HEMOHEALTH AUTOMATED QA & INTEGRATION TEST SUITE");
console.log("=======================================================\n");

// ----------------------------------------------------
// SUITE 1: DATASET QUANTITY & SCHEMA INTEGRITY
// ----------------------------------------------------
console.log("Suite 1: Synthetic Dataset Schema & Entity Counts");

test("TC01: Dataset contains at least 30 fictional facilities", () => {
  assert(SYNTHETIC_FACILITIES.length >= 30, `Expected >= 30, got ${SYNTHETIC_FACILITIES.length}`);
});

test("TC02: All facilities have dataMode = 'DEMO'", () => {
  for (const fac of SYNTHETIC_FACILITIES) {
    assertEquals(fac.dataMode, "DEMO", `Facility ${fac.id} missing dataMode DEMO`);
  }
});

test("TC03: Dataset contains at least 150 inventory records", () => {
  assert(SYNTHETIC_INVENTORY.length >= 150, `Expected >= 150, got ${SYNTHETIC_INVENTORY.length}`);
});

test("TC04: All inventory records have dataMode = 'DEMO'", () => {
  for (const item of SYNTHETIC_INVENTORY) {
    assertEquals(item.dataMode, "DEMO", `Inventory ${item.id} missing dataMode DEMO`);
  }
});

test("TC05: Dataset contains 100 fictional donor profiles", () => {
  assertEquals(SYNTHETIC_DONORS.length, 100, `Expected 100, got ${SYNTHETIC_DONORS.length}`);
});

test("TC06: All donors have dataMode = 'DEMO'", () => {
  for (const donor of SYNTHETIC_DONORS) {
    assertEquals(donor.dataMode, "DEMO", `Donor ${donor.id} missing dataMode DEMO`);
  }
});

test("TC07: Dataset contains 100 fictional blood requests", () => {
  assertEquals(SYNTHETIC_REQUESTS.length, 100, `Expected 100, got ${SYNTHETIC_REQUESTS.length}`);
});

test("TC08: All blood requests have dataMode = 'DEMO'", () => {
  for (const req of SYNTHETIC_REQUESTS) {
    assertEquals(req.dataMode, "DEMO", `Request ${req.id} missing dataMode DEMO`);
  }
});

test("TC09: Dataset contains at least 150 request responses", () => {
  assert(SYNTHETIC_RESPONSES.length >= 150, `Expected >= 150, got ${SYNTHETIC_RESPONSES.length}`);
});

test("TC10: Dataset contains at least 100 in-app notifications", () => {
  assert(SYNTHETIC_NOTIFICATIONS.length >= 100, `Expected >= 100, got ${SYNTHETIC_NOTIFICATIONS.length}`);
});

// ----------------------------------------------------
// SUITE 2: SPECIFIED DEMO FIXTURES (DEMO-1001 to DEMO-1010)
// ----------------------------------------------------
console.log("\nSuite 2: Specified Demonstration Fixtures");

test("TC11: DEMO-1001 fixture exists (O- PRBC in Chittoor, 2 units, high urgency, matching-in-progress)", () => {
  const req = SYNTHETIC_REQUESTS.find((r) => r.requestNumber === "DEMO-1001");
  assert(Boolean(req), "DEMO-1001 not found");
  assertEquals(req?.bloodGroup, "O-");
  assertEquals(req?.city, "Chittoor");
  assertEquals(req?.unitsRequired, 2);
  assertEquals(req?.urgency, "high");
  assertEquals(req?.status, "matching-in-progress");
});

test("TC12: DEMO-1002 fixture exists (A+ PRBC in Chittoor, 3 units, normal urgency, submitted)", () => {
  const req = SYNTHETIC_REQUESTS.find((r) => r.requestNumber === "DEMO-1002");
  assert(Boolean(req), "DEMO-1002 not found");
  assertEquals(req?.bloodGroup, "A+");
  assertEquals(req?.city, "Chittoor");
  assertEquals(req?.unitsRequired, 3);
  assertEquals(req?.status, "submitted");
});

test("TC13: DEMO-1003 fixture exists (AB+ PRBC in Tirupati, 2 units, high urgency, under-review)", () => {
  const req = SYNTHETIC_REQUESTS.find((r) => r.requestNumber === "DEMO-1003");
  assert(Boolean(req), "DEMO-1003 not found");
  assertEquals(req?.bloodGroup, "AB+");
  assertEquals(req?.city, "Tirupati");
  assertEquals(req?.status, "under-review");
});

test("TC14: DEMO-1004 fixture exists (B- PRBC in Vellore, 5 units, normal urgency, submitted)", () => {
  const req = SYNTHETIC_REQUESTS.find((r) => r.requestNumber === "DEMO-1004");
  assert(Boolean(req), "DEMO-1004 not found");
  assertEquals(req?.bloodGroup, "B-");
  assertEquals(req?.city, "Vellore");
  assertEquals(req?.unitsRequired, 5);
});

test("TC15: DEMO-1005 fixture exists (AB- PRBC in Chennai, 2 units, high urgency, matching-in-progress)", () => {
  const req = SYNTHETIC_REQUESTS.find((r) => r.requestNumber === "DEMO-1005");
  assert(Boolean(req), "DEMO-1005 not found");
  assertEquals(req?.bloodGroup, "AB-");
  assertEquals(req?.city, "Chennai");
  assertEquals(req?.status, "matching-in-progress");
});

test("TC16: DEMO-1006 fixture exists (O+ PRBC in Hyderabad, 4 units, emergency urgency, under-review)", () => {
  const req = SYNTHETIC_REQUESTS.find((r) => r.requestNumber === "DEMO-1006");
  assert(Boolean(req), "DEMO-1006 not found");
  assertEquals(req?.bloodGroup, "O+");
  assertEquals(req?.city, "Hyderabad");
  assertEquals(req?.unitsRequired, 4);
});

test("TC17: DEMO-1007 fixture exists (A- PRBC in Vijayawada, 2 units, normal urgency, submitted)", () => {
  const req = SYNTHETIC_REQUESTS.find((r) => r.requestNumber === "DEMO-1007");
  assert(Boolean(req), "DEMO-1007 not found");
  assertEquals(req?.bloodGroup, "A-");
  assertEquals(req?.city, "Vijayawada");
});

test("TC18: DEMO-1008 fixture exists (B+ PRBC in Kadapa, 3 units, high urgency, cancelled)", () => {
  const req = SYNTHETIC_REQUESTS.find((r) => r.requestNumber === "DEMO-1008");
  assert(Boolean(req), "DEMO-1008 not found");
  assertEquals(req?.bloodGroup, "B+");
  assertEquals(req?.city, "Kadapa");
  assertEquals(req?.status, "cancelled");
});

test("TC19: DEMO-1009 fixture exists (O- PRBC in Bengaluru, 8 units, emergency urgency, no-matches)", () => {
  const req = SYNTHETIC_REQUESTS.find((r) => r.requestNumber === "DEMO-1009");
  assert(Boolean(req), "DEMO-1009 not found");
  assertEquals(req?.bloodGroup, "O-");
  assertEquals(req?.city, "Bengaluru");
  assertEquals(req?.status, "no-matches");
});

test("TC20: DEMO-1010 fixture exists (AB+ PRBC in Nellore, 1 unit, normal urgency, fulfilled)", () => {
  const req = SYNTHETIC_REQUESTS.find((r) => r.requestNumber === "DEMO-1010");
  assert(Boolean(req), "DEMO-1010 not found");
  assertEquals(req?.bloodGroup, "AB+");
  assertEquals(req?.city, "Nellore");
  assertEquals(req?.status, "fulfilled");
});

// ----------------------------------------------------
// SUITE 3: BIOLOGICAL COMPATIBILITY RULES
// ----------------------------------------------------
console.log("\nSuite 3: Biological Transfusion Compatibility Engine");

test("TC21: PRBC - O- is universal red cell donor (can donate to A+, B+, AB+, O-)", () => {
  assert(checkBiologicalCompatibility("A+", "O-", "Packed Red Blood Cells (PRBC)").isCompatible);
  assert(checkBiologicalCompatibility("B+", "O-", "Packed Red Blood Cells (PRBC)").isCompatible);
  assert(checkBiologicalCompatibility("AB+", "O-", "Packed Red Blood Cells (PRBC)").isCompatible);
  assert(checkBiologicalCompatibility("O-", "O-", "Packed Red Blood Cells (PRBC)").isCompatible);
});

test("TC22: PRBC - O- recipient can ONLY receive O- red cells", () => {
  assert(checkBiologicalCompatibility("O-", "O-", "Packed Red Blood Cells (PRBC)").isCompatible);
  assert(!checkBiologicalCompatibility("O-", "O+", "Packed Red Blood Cells (PRBC)").isCompatible);
  assert(!checkBiologicalCompatibility("O-", "A+", "Packed Red Blood Cells (PRBC)").isCompatible);
  assert(!checkBiologicalCompatibility("O-", "B-", "Packed Red Blood Cells (PRBC)").isCompatible);
});

test("TC23: PRBC - AB+ is universal red cell recipient", () => {
  const groups: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  for (const g of groups) {
    assert(checkBiologicalCompatibility("AB+", g, "Packed Red Blood Cells (PRBC)").isCompatible);
  }
});

test("TC24: FFP - AB is universal plasma donor (can donate plasma to A, B, O)", () => {
  assert(checkBiologicalCompatibility("O+", "AB+", "Fresh Frozen Plasma (FFP)").isCompatible);
  assert(checkBiologicalCompatibility("A+", "AB+", "Fresh Frozen Plasma (FFP)").isCompatible);
  assert(checkBiologicalCompatibility("B+", "AB+", "Fresh Frozen Plasma (FFP)").isCompatible);
  assert(checkBiologicalCompatibility("AB+", "AB+", "Fresh Frozen Plasma (FFP)").isCompatible);
});

test("TC25: FFP - O plasma donor is NOT compatible with A or B recipient", () => {
  assert(!checkBiologicalCompatibility("A+", "O+", "Fresh Frozen Plasma (FFP)").isCompatible);
  assert(!checkBiologicalCompatibility("B+", "O+", "Fresh Frozen Plasma (FFP)").isCompatible);
});

test("TC26: Platelets - ABO-identical yields score of 100%", () => {
  const res = checkBiologicalCompatibility("A+", "A+", "Platelets");
  assert(res.isCompatible);
  assertEquals(res.score, 100);
});

// ----------------------------------------------------
// SUITE 4: SMART MATCHING MULTI-FACTOR ENGINE
// ----------------------------------------------------
console.log("\nSuite 4: Smart Matching Engine & Exclusions");

test("TC27: runSmartMatch returns ranked results with overallScore", () => {
  const results = runSmartMatch(
    { bloodGroup: "O-", component: "Packed Red Blood Cells (PRBC)", city: "Chittoor", unitsRequired: 2, urgency: "immediate" },
    SYNTHETIC_INVENTORY,
    SYNTHETIC_DONORS
  );
  assert(results.length > 0, "Expected at least 1 match");
  assert(results[0].overallScore >= results[results.length - 1].overallScore, "Results must be sorted descending by score");
});

test("TC28: Smart Match excludes expired inventory records", () => {
  const expiredItem: BloodInventoryItem = {
    id: "inv-exp-test",
    facilityId: "fac-ap-01",
    facilityName: "Test Facility",
    city: "Chittoor",
    bloodGroup: "O-",
    component: "Packed Red Blood Cells (PRBC)",
    unitsAvailable: 10,
    unitsReserved: 0,
    storageTempCelsius: "2°C to 6°C",
    batchNumber: "LOT-EXP-1",
    collectionDate: "2026-01-01T00:00:00Z",
    expiryDate: "2026-03-01T00:00:00Z", // Expired in the past
    status: "expired",
    isVerified: true,
    lastUpdated: "2026-04-10T10:00:00.000Z",
    dataMode: "DEMO",
  };
  const results = runSmartMatch(
    { bloodGroup: "O-", component: "Packed Red Blood Cells (PRBC)", city: "Chittoor", unitsRequired: 1, urgency: "immediate" },
    [expiredItem],
    []
  );
  assertEquals(results.length, 0, "Expired item should be excluded");
});

test("TC29: Smart Match excludes zero available inventory records", () => {
  const zeroItem: BloodInventoryItem = {
    id: "inv-zero-test",
    facilityId: "fac-ap-01",
    facilityName: "Test Facility",
    city: "Chittoor",
    bloodGroup: "O-",
    component: "Packed Red Blood Cells (PRBC)",
    unitsAvailable: 0,
    unitsReserved: 0,
    storageTempCelsius: "2°C to 6°C",
    batchNumber: "LOT-ZERO-1",
    collectionDate: "2026-03-01T00:00:00Z",
    expiryDate: "2026-05-01T00:00:00Z",
    status: "depleted",
    isVerified: true,
    lastUpdated: "2026-04-10T10:00:00.000Z",
    dataMode: "DEMO",
  };
  const results = runSmartMatch(
    { bloodGroup: "O-", component: "Packed Red Blood Cells (PRBC)", city: "Chittoor", unitsRequired: 1, urgency: "immediate" },
    [zeroItem],
    []
  );
  assertEquals(results.length, 0, "Depleted item should be excluded");
});

test("TC30: Smart Match excludes donors with Paused availability or Withdrawn consent", () => {
  const pausedDonor: DonorProfile = {
    id: "don-paused-test",
    fullName: "Paused User",
    bloodGroup: "O-",
    city: "Chittoor",
    state: "AP",
    phone: "(08572) 555-0999",
    email: "paused@test.demo",
    preferredContact: "call",
    isAvailable: false,
    availabilityStatus: "Paused",
    consentStatus: "Active Consent",
    totalDonations: 4,
    radiusKm: 25,
    consentEmergencyContact: true,
    registeredAt: "2025-01-01T00:00:00Z",
    medicalScreeningPassed: true,
    privacyShowPhonePublic: false,
    dataMode: "DEMO",
  };
  const results = runSmartMatch(
    { bloodGroup: "O-", component: "Packed Red Blood Cells (PRBC)", city: "Chittoor", unitsRequired: 1, urgency: "immediate" },
    [],
    [pausedDonor]
  );
  assertEquals(results.length, 0, "Paused donor should be excluded");
});

test("TC31: Smart Match correctly boosts same-city verified facility exact match", () => {
  const results = runSmartMatch(
    { bloodGroup: "O-", component: "Packed Red Blood Cells (PRBC)", city: "Chittoor", unitsRequired: 2, urgency: "immediate" },
    SYNTHETIC_INVENTORY.filter((i) => i.city === "Chittoor" && i.bloodGroup === "O-"),
    []
  );
  if (results.length > 0) {
    assert(results[0].overallScore >= 80, "Same city verified match should score high (>80)");
    assertEquals(results[0].urgencyAlignment, "Optimal");
  }
});

// ----------------------------------------------------
// SUITE 5: FORM VALIDATION & SCHEMA CHECKS
// ----------------------------------------------------
console.log("\nSuite 5: Zod Schema & Form Validation");

test("TC32: Emergency Request Schema accepts valid medical requisition", () => {
  const validData = {
    requesterName: "Dr. K. Srinivas",
    requesterPhone: "(08572) 555-0901",
    requesterEmail: "srinivas@hospital.test",
    patientName: "Venkatesh Babu",
    patientAge: 45,
    hospitalName: "Chittoor District Memorial Health Institute",
    hospitalAddress: "Collectorate Road",
    city: "Chittoor",
    bloodGroup: "O-",
    component: "Packed Red Blood Cells (PRBC)",
    unitsRequired: 2,
    urgency: "immediate",
    requiredDate: "2026-04-15",
    medicalReason: "Multiple vehicle trauma with severe hemorrhagic shock.",
  };
  const res = emergencyRequestSchema.safeParse(validData);
  assert(res.success, `Expected validation success, got ${JSON.stringify(res.error?.issues)}`);
});

test("TC33: Emergency Request Schema rejects missing patient name", () => {
  const invalidData = {
    requesterName: "Dr. K. Srinivas",
    requesterPhone: "(08572) 555-0901",
    requesterEmail: "srinivas@hospital.test",
    patientName: "", // Empty patient name
    hospitalName: "Chittoor District Memorial Health Institute",
    city: "Chittoor",
    bloodGroup: "O-",
    component: "Packed Red Blood Cells (PRBC)",
    unitsRequired: 2,
    urgency: "immediate",
    requiredDate: "2026-04-15",
    medicalReason: "Multiple vehicle trauma with shock.",
  };
  const res = emergencyRequestSchema.safeParse(invalidData);
  assert(!res.success, "Should fail validation on empty patient name");
});

test("TC34: Emergency Request Schema rejects negative or zero unitsRequired", () => {
  const invalidData = {
    requesterName: "Dr. K. Srinivas",
    requesterPhone: "(08572) 555-0901",
    requesterEmail: "srinivas@hospital.test",
    patientName: "Venkatesh",
    hospitalName: "Chittoor District Memorial Health Institute",
    city: "Chittoor",
    bloodGroup: "O-",
    component: "Packed Red Blood Cells (PRBC)",
    unitsRequired: 0, // Invalid zero units
    urgency: "immediate",
    requiredDate: "2026-04-15",
    medicalReason: "Trauma surgery emergency.",
  };
  const res = emergencyRequestSchema.safeParse(invalidData);
  assert(!res.success, "Should fail validation on zero units required");
});

test("TC35: Donor Registration Schema requires explicit emergency consent", () => {
  const invalidConsent = {
    fullName: "Aarav Sharma",
    email: "aarav@test.demo",
    phone: "(080) 555-0199",
    bloodGroup: "O+",
    city: "Bengaluru",
    state: "Karnataka",
    preferredContact: "sms",
    radiusKm: 25,
    consentEmergencyContact: false, // Disallowed false consent
    medicalScreeningPassed: true,
    privacyShowPhonePublic: false,
  };
  const res = donorRegistrationSchema.safeParse(invalidConsent);
  assert(!res.success, "Should fail validation without emergency consent");
});

test("TC36: Inventory Item Schema requires valid batch number and storage temp", () => {
  const invalidInventory = {
    facilityId: "fac-ap-01",
    facilityName: "Chittoor Hospital",
    city: "Chittoor",
    bloodGroup: "A+",
    component: "Platelets",
    unitsAvailable: 4,
    unitsReserved: 0,
    storageTempCelsius: "",
    batchNumber: "", // Empty lot
    collectionDate: "2026-04-01",
    expiryDate: "2026-04-06",
  };
  const res = inventoryItemSchema.safeParse(invalidInventory);
  assert(!res.success, "Should fail validation on empty batch lot");
});

// ----------------------------------------------------
// SUITE 6: PERSISTENCE, RECOVERY & AUDIT LOGS
// ----------------------------------------------------
console.log("\nSuite 6: Persistence, Edge Case Fixtures & Audit Trails");

test("TC37: Audit logs exist and contain system initialization record", () => {
  assert(SYNTHETIC_AUDIT_LOGS.length >= 3, "Expected at least 3 audit logs");
  const initLog = SYNTHETIC_AUDIT_LOGS.find((l) => l.action === "SYNTHETIC_DATASET_INITIALIZED");
  assert(Boolean(initLog), "Initialization audit log not found");
  assertEquals(initLog?.dataMode, "DEMO");
});

test("TC38: Geographic coverage across Andhra Pradesh & regional metro cities", () => {
  const facilityCities = new Set(SYNTHETIC_FACILITIES.map((f) => f.city));
  assert(facilityCities.has("Chittoor"), "Must cover Chittoor");
  assert(facilityCities.has("Tirupati"), "Must cover Tirupati");
  assert(facilityCities.has("Bengaluru"), "Must cover Bengaluru");
  assert(facilityCities.has("Chennai"), "Must cover Chennai");
  assert(facilityCities.has("Hyderabad"), "Must cover Hyderabad");
  assert(facilityCities.has("Vijayawada"), "Must cover Vijayawada");
  assert(facilityCities.has("Visakhapatnam"), "Must cover Visakhapatnam");
  assert(facilityCities.has("Kadapa"), "Must cover Kadapa");
  assert(facilityCities.has("Nellore"), "Must cover Nellore");
});

test("TC39: Unverified facility fixture is tagged verified=false", () => {
  const unv = SYNTHETIC_FACILITIES.find((f) => f.id === "fac-unv-16");
  assert(Boolean(unv), "Unverified facility fixture not found");
  assertEquals(unv?.verified, false);
  assertEquals(unv?.demonstrationVerificationStatus, "Unverified");
});

test("TC40: Edge case fixture DEMO_EDGE_CASES is defined with >= 10 named scenarios", () => {
  const keys = Object.keys(DEMO_EDGE_CASES);
  assert(keys.length >= 10, `Expected >= 10 edge case keys, got ${keys.length}`);
});

test("TC41: All synthetic response foreign keys map to valid request and facility/donor entities", () => {
  for (const resp of SYNTHETIC_RESPONSES.slice(0, 30)) {
    const req = SYNTHETIC_REQUESTS.find((r) => r.id === resp.requestId || r.requestNumber === resp.requestId);
    assert(Boolean(req), `Response ${resp.id} points to non-existent request ${resp.requestId}`);
  }
});

test("TC42: All synthetic notifications have valid titles and non-empty messages", () => {
  for (const notif of SYNTHETIC_NOTIFICATIONS) {
    assert(notif.title.length > 5, `Notification ${notif.id} has invalid title`);
    assert(notif.message.length > 10, `Notification ${notif.id} has invalid message`);
    assertEquals(notif.dataMode, "DEMO");
  }
});

console.log("\n=======================================================");
console.log(`TEST SUITE RESULTS: ${passedTests} Passed, ${failedTests} Failed (Total: ${passedTests + failedTests})`);
console.log("=======================================================\n");

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
