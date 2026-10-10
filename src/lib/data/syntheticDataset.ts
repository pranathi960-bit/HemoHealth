import {
  AuditLog,
  BloodComponent,
  BloodGroup,
  BloodInventoryItem,
  BloodRequest,
  DonorProfile,
  Facility,
  FacilityType,
  InventoryStatus,
  NotificationItem,
  RequestResponse,
  RequestStatus,
  UrgencyLevel,
} from "@/types";

// ==========================================
// 1. 30 FICTIONAL FACILITIES
// ==========================================
export const SYNTHETIC_FACILITIES: Facility[] = [
  {
    id: "fac-ap-01",
    facilityId: "fac-ap-01",
    name: "Chittoor District Memorial Health Institute",
    type: "Hospital",
    facilityType: "Hospital",
    licenseNumber: "DEMO-AP-MED-2026-01",
    address: "Collectorate Road, Civil Station Area",
    generalAddressLabel: "Civil Station Area, Chittoor",
    city: "Chittoor",
    state: "Andhra Pradesh",
    phone: "(08572) 555-0101",
    emergencyHotline: "(08572) 555-9901",
    email: "bloodbank@chittoordistrict.demo",
    verified: true,
    demonstrationVerificationStatus: "Verified",
    supportedComponents: ["Whole Blood", "Packed Red Blood Cells (PRBC)", "Fresh Frozen Plasma (FFP)", "Platelets"],
    contactDisplayPolicy: "EmergencyDeskOnly",
    verifiedAt: "2025-01-10T08:00:00Z",
    operatingHours: "24/7 Emergency Operation",
    latitude: 13.2172,
    longitude: 79.1003,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    dataMode: "DEMO",
  },
  {
    id: "fac-ap-02",
    facilityId: "fac-ap-02",
    name: "Tirupati Regional Blood Center & Research Trust",
    type: "Blood Bank",
    facilityType: "Blood Bank",
    licenseNumber: "DEMO-AP-BB-2026-02",
    address: "Alipiri Bypass Road, Royal Enclave",
    generalAddressLabel: "Alipiri Bypass, Tirupati",
    city: "Tirupati",
    state: "Andhra Pradesh",
    phone: "(0877) 555-0102",
    emergencyHotline: "(0877) 555-9902",
    email: "dispatch@tirupatibloodcenter.demo",
    verified: true,
    demonstrationVerificationStatus: "Verified",
    supportedComponents: ["Packed Red Blood Cells (PRBC)", "Platelets", "Fresh Frozen Plasma (FFP)", "Cryoprecipitate"],
    contactDisplayPolicy: "EmergencyDeskOnly",
    verifiedAt: "2024-11-15T10:00:00Z",
    operatingHours: "24/7 Dispatch Desk",
    latitude: 13.6288,
    longitude: 79.4192,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    dataMode: "DEMO",
  },
  {
    id: "fac-tn-03",
    facilityId: "fac-tn-03",
    name: "Vellore Apex Medical Pavilion & Blood Depot",
    type: "Trauma Center",
    facilityType: "Trauma Center",
    licenseNumber: "DEMO-TN-TC-2026-03",
    address: "Arcot Road, Sathuvachari Sector",
    generalAddressLabel: "Sathuvachari, Vellore",
    city: "Vellore",
    state: "Tamil Nadu",
    phone: "(0416) 555-0103",
    emergencyHotline: "(0416) 555-9903",
    email: "transfusion@velloreapex.demo",
    verified: true,
    demonstrationVerificationStatus: "Verified",
    supportedComponents: ["Whole Blood", "Packed Red Blood Cells (PRBC)", "Platelets", "Fresh Frozen Plasma (FFP)"],
    contactDisplayPolicy: "EmergencyDeskOnly",
    verifiedAt: "2025-02-01T09:00:00Z",
    operatingHours: "24/7 Acute Transfusion Service",
    latitude: 12.9165,
    longitude: 79.1325,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    dataMode: "DEMO",
  },
  {
    id: "fac-ka-04",
    facilityId: "fac-ka-04",
    name: "Bengaluru Metropolitan Hematology Institute",
    type: "Hospital",
    facilityType: "Hospital",
    licenseNumber: "DEMO-KA-HOSP-2026-04",
    address: "Outer Ring Road, Marathahalli Corridor",
    generalAddressLabel: "Marathahalli, Bengaluru",
    city: "Bengaluru",
    state: "Karnataka",
    phone: "(080) 555-0104",
    emergencyHotline: "(080) 555-9904",
    email: "bloodops@bengalurumetro.demo",
    verified: true,
    demonstrationVerificationStatus: "Verified",
    supportedComponents: ["Packed Red Blood Cells (PRBC)", "Platelets", "Fresh Frozen Plasma (FFP)", "Cryoprecipitate"],
    contactDisplayPolicy: "EmergencyDeskOnly",
    verifiedAt: "2024-10-12T14:00:00Z",
    operatingHours: "24/7 Inpatient Transfusion",
    latitude: 12.9591,
    longitude: 77.6974,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    dataMode: "DEMO",
  },
  {
    id: "fac-tn-05",
    facilityId: "fac-tn-05",
    name: "Chennai Central Red Cross Regional Depot",
    type: "Regional Depot",
    facilityType: "Regional Depot",
    licenseNumber: "DEMO-TN-DEP-2026-05",
    address: "Poonamallee High Road, Kilpauk",
    generalAddressLabel: "Kilpauk, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    phone: "(044) 555-0105",
    emergencyHotline: "(044) 555-9905",
    email: "dispatch@chennairedcross.demo",
    verified: true,
    demonstrationVerificationStatus: "Verified",
    supportedComponents: ["Whole Blood", "Packed Red Blood Cells (PRBC)", "Platelets", "Fresh Frozen Plasma (FFP)", "Cryoprecipitate"],
    contactDisplayPolicy: "EmergencyDeskOnly",
    verifiedAt: "2025-03-01T11:00:00Z",
    operatingHours: "24/7 Cold Chain Distribution",
    latitude: 13.0827,
    longitude: 80.2707,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    dataMode: "DEMO",
  },
  {
    id: "fac-ts-06",
    facilityId: "fac-ts-06",
    name: "Hyderabad Premier Trauma & Life Care Hospital",
    type: "Hospital",
    facilityType: "Hospital",
    licenseNumber: "DEMO-TS-HOSP-2026-06",
    address: "Banjara Hills Road No. 2",
    generalAddressLabel: "Banjara Hills, Hyderabad",
    city: "Hyderabad",
    state: "Telangana",
    phone: "(040) 555-0106",
    emergencyHotline: "(040) 555-9906",
    email: "emergency@hyderabadpremier.demo",
    verified: true,
    demonstrationVerificationStatus: "Verified",
    supportedComponents: ["Packed Red Blood Cells (PRBC)", "Platelets", "Fresh Frozen Plasma (FFP)"],
    contactDisplayPolicy: "EmergencyDeskOnly",
    verifiedAt: "2024-09-20T08:00:00Z",
    operatingHours: "24/7 Acute Care",
    latitude: 17.4123,
    longitude: 78.4354,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    dataMode: "DEMO",
  },
  {
    id: "fac-ap-07",
    facilityId: "fac-ap-07",
    name: "Vijayawada Government General Transfusion Wing",
    type: "Hospital",
    facilityType: "Hospital",
    licenseNumber: "DEMO-AP-GGH-2026-07",
    address: "MG Road, Governorpet",
    generalAddressLabel: "Governorpet, Vijayawada",
    city: "Vijayawada",
    state: "Andhra Pradesh",
    phone: "(0866) 555-0107",
    emergencyHotline: "(0866) 555-9907",
    email: "transfusion@vijayawadaggh.demo",
    verified: true,
    demonstrationVerificationStatus: "Verified",
    supportedComponents: ["Whole Blood", "Packed Red Blood Cells (PRBC)", "Fresh Frozen Plasma (FFP)"],
    contactDisplayPolicy: "EmergencyDeskOnly",
    verifiedAt: "2024-12-10T10:00:00Z",
    operatingHours: "24/7 Emergency Operation",
    latitude: 16.5062,
    longitude: 80.6480,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    dataMode: "DEMO",
  },
  {
    id: "fac-ap-08",
    facilityId: "fac-ap-08",
    name: "Visakhapatnam Harbor City Blood Institute",
    type: "Blood Bank",
    facilityType: "Blood Bank",
    licenseNumber: "DEMO-AP-BB-2026-08",
    address: "Beach Road, Maharanipeta",
    generalAddressLabel: "Maharanipeta, Visakhapatnam",
    city: "Visakhapatnam",
    state: "Andhra Pradesh",
    phone: "(0891) 555-0108",
    emergencyHotline: "(0891) 555-9908",
    email: "ops@vizagbloodinstitute.demo",
    verified: true,
    demonstrationVerificationStatus: "Verified",
    supportedComponents: ["Packed Red Blood Cells (PRBC)", "Platelets", "Fresh Frozen Plasma (FFP)", "Cryoprecipitate"],
    contactDisplayPolicy: "EmergencyDeskOnly",
    verifiedAt: "2025-01-18T10:00:00Z",
    operatingHours: "24/7 Dispatch Desk",
    latitude: 17.7041,
    longitude: 83.3077,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    dataMode: "DEMO",
  },
  {
    id: "fac-ap-09",
    facilityId: "fac-ap-09",
    name: "Kadapa Rayalaseema Regional Transfusion Centre",
    type: "Medical Centre",
    facilityType: "Medical Centre",
    licenseNumber: "DEMO-AP-RC-2026-09",
    address: "Seven Roads Junction, Nagarajupeta",
    generalAddressLabel: "Seven Roads, Kadapa",
    city: "Kadapa",
    state: "Andhra Pradesh",
    phone: "(08562) 555-0109",
    emergencyHotline: "(08562) 555-9909",
    email: "rayalaseema@kadapablood.demo",
    verified: true,
    demonstrationVerificationStatus: "Verified",
    supportedComponents: ["Whole Blood", "Packed Red Blood Cells (PRBC)", "Fresh Frozen Plasma (FFP)"],
    contactDisplayPolicy: "EmergencyDeskOnly",
    verifiedAt: "2024-08-11T09:00:00Z",
    operatingHours: "24/7 On-Call Blood Service",
    latitude: 14.4673,
    longitude: 78.8242,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    dataMode: "DEMO",
  },
  {
    id: "fac-ap-10",
    facilityId: "fac-ap-10",
    name: "Nellore Coastal LifeSource Blood Bank",
    type: "Blood Bank",
    licenseNumber: "DEMO-AP-BB-2026-10",
    address: "Trunk Road, Stonehousepet",
    generalAddressLabel: "Trunk Road, Nellore",
    city: "Nellore",
    state: "Andhra Pradesh",
    phone: "(0861) 555-0110",
    emergencyHotline: "(0861) 555-9910",
    email: "supply@nellorelifesource.demo",
    verified: true,
    demonstrationVerificationStatus: "Verified",
    supportedComponents: ["Packed Red Blood Cells (PRBC)", "Platelets", "Fresh Frozen Plasma (FFP)"],
    contactDisplayPolicy: "EmergencyDeskOnly",
    verifiedAt: "2024-11-28T12:00:00Z",
    operatingHours: "6:00 AM - 10:00 PM (24/7 Emergency on call)",
    latitude: 14.4426,
    longitude: 79.9865,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    dataMode: "DEMO",
  },
  {
    id: "fac-ap-11",
    facilityId: "fac-ap-11",
    name: "Guntur Amaravati Superspeciality Blood Unit",
    type: "Hospital",
    facilityType: "Hospital",
    licenseNumber: "DEMO-AP-HOSP-2026-11",
    address: "Kanna Vari Thota, GT Road",
    generalAddressLabel: "GT Road, Guntur",
    city: "Guntur",
    state: "Andhra Pradesh",
    phone: "(0863) 555-0111",
    emergencyHotline: "(0863) 555-9911",
    email: "blooddesk@gunturamaravati.demo",
    verified: true,
    demonstrationVerificationStatus: "Verified",
    supportedComponents: ["Whole Blood", "Packed Red Blood Cells (PRBC)", "Platelets", "Fresh Frozen Plasma (FFP)"],
    contactDisplayPolicy: "EmergencyDeskOnly",
    verifiedAt: "2025-02-14T08:00:00Z",
    operatingHours: "24/7 Surgical Support",
    latitude: 16.3067,
    longitude: 80.4365,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    dataMode: "DEMO",
  },
  {
    id: "fac-ap-12",
    facilityId: "fac-ap-12",
    name: "Kurnool Royal Fort Emergency Blood Repository",
    type: "Trauma Center",
    facilityType: "Trauma Center",
    licenseNumber: "DEMO-AP-TC-2026-12",
    address: "Budhawara Peta, Old Bus Stand Road",
    generalAddressLabel: "Budhawara Peta, Kurnool",
    city: "Kurnool",
    state: "Andhra Pradesh",
    phone: "(08518) 555-0112",
    emergencyHotline: "(08518) 555-9912",
    email: "emergency@kurnoolfort.demo",
    verified: true,
    demonstrationVerificationStatus: "Verified",
    supportedComponents: ["Whole Blood", "Packed Red Blood Cells (PRBC)", "Fresh Frozen Plasma (FFP)"],
    contactDisplayPolicy: "EmergencyDeskOnly",
    verifiedAt: "2024-10-05T14:00:00Z",
    operatingHours: "24/7 Trauma Service",
    latitude: 15.8281,
    longitude: 78.0373,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    dataMode: "DEMO",
  },
  {
    id: "fac-ap-13",
    facilityId: "fac-ap-13",
    name: "Anantapur Sri Sathya Sai Community Blood Depot",
    type: "Blood Bank",
    facilityType: "Blood Bank",
    licenseNumber: "DEMO-AP-BB-2026-13",
    address: "Subhash Road, Maruthi Nagar",
    generalAddressLabel: "Subhash Road, Anantapur",
    city: "Anantapur",
    state: "Andhra Pradesh",
    phone: "(08554) 555-0113",
    emergencyHotline: "(08554) 555-9913",
    email: "bloodservice@anantapursai.demo",
    verified: true,
    demonstrationVerificationStatus: "Verified",
    supportedComponents: ["Packed Red Blood Cells (PRBC)", "Fresh Frozen Plasma (FFP)"],
    contactDisplayPolicy: "EmergencyDeskOnly",
    verifiedAt: "2024-07-22T10:00:00Z",
    operatingHours: "8:00 AM - 10:00 PM (Emergency on-call)",
    latitude: 14.6819,
    longitude: 77.6006,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    dataMode: "DEMO",
  },
  {
    id: "fac-ap-14",
    facilityId: "fac-ap-14",
    name: "Rajahmundry Godavari Delta Blood Care",
    type: "Medical Centre",
    facilityType: "Medical Centre",
    licenseNumber: "DEMO-AP-MC-2026-14",
    address: "Danavaipeta, Main Road",
    generalAddressLabel: "Danavaipeta, Rajahmundry",
    city: "Rajahmundry",
    state: "Andhra Pradesh",
    phone: "(0883) 555-0114",
    emergencyHotline: "(0883) 555-9914",
    email: "godavari@rajahmundryblood.demo",
    verified: true,
    demonstrationVerificationStatus: "Verified",
    supportedComponents: ["Whole Blood", "Packed Red Blood Cells (PRBC)", "Fresh Frozen Plasma (FFP)", "Platelets"],
    contactDisplayPolicy: "EmergencyDeskOnly",
    verifiedAt: "2024-12-05T09:00:00Z",
    operatingHours: "24/7 Regional Referral Support",
    latitude: 17.0005,
    longitude: 81.8040,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    dataMode: "DEMO",
  },
  {
    id: "fac-ap-15",
    facilityId: "fac-ap-15",
    name: "Kakinada Port City Blood Trust",
    type: "Blood Bank",
    licenseNumber: "DEMO-AP-BB-2026-15",
    address: "Cinema Road, Suryaraopeta",
    generalAddressLabel: "Suryaraopeta, Kakinada",
    city: "Kakinada",
    state: "Andhra Pradesh",
    phone: "(0884) 555-0115",
    emergencyHotline: "(0884) 555-9915",
    email: "trust@kakinadablood.demo",
    verified: true,
    demonstrationVerificationStatus: "Verified",
    supportedComponents: ["Packed Red Blood Cells (PRBC)", "Platelets", "Fresh Frozen Plasma (FFP)"],
    contactDisplayPolicy: "EmergencyDeskOnly",
    verifiedAt: "2025-01-20T11:00:00Z",
    operatingHours: "24/7 Dispatch Desk",
    latitude: 16.9891,
    longitude: 82.2475,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    dataMode: "DEMO",
  },
  {
    id: "fac-unv-16",
    facilityId: "fac-unv-16",
    name: "Chittoor Community Voluntary Blood Center",
    type: "Blood Bank",
    facilityType: "Blood Bank",
    licenseNumber: "DEMO-AP-UNV-2026-16",
    address: "Kongareddy Palli Road",
    generalAddressLabel: "Kongareddy Palli, Chittoor",
    city: "Chittoor",
    state: "Andhra Pradesh",
    phone: "(08572) 555-0116",
    emergencyHotline: "(08572) 555-9916",
    email: "community@chittoorvolunteers.demo",
    verified: false, // Intentional unverified fixture
    demonstrationVerificationStatus: "Unverified",
    supportedComponents: ["Whole Blood", "Packed Red Blood Cells (PRBC)"],
    contactDisplayPolicy: "EmergencyDeskOnly",
    operatingHours: "9:00 AM - 6:00 PM",
    latitude: 13.2200,
    longitude: 79.1100,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    dataMode: "DEMO",
  },
  {
    id: "fac-ap-17",
    facilityId: "fac-ap-17",
    name: "Tirupati Balaji Multispeciality Blood Ward",
    type: "Hospital",
    facilityType: "Hospital",
    licenseNumber: "DEMO-AP-HOSP-2026-17",
    address: "Renigunta Road, Korlagunta",
    generalAddressLabel: "Korlagunta, Tirupati",
    city: "Tirupati",
    state: "Andhra Pradesh",
    phone: "(0877) 555-0117",
    emergencyHotline: "(0877) 555-9917",
    email: "inpatient@balajiblood.demo",
    verified: true,
    demonstrationVerificationStatus: "Verified",
    supportedComponents: ["Packed Red Blood Cells (PRBC)", "Platelets", "Fresh Frozen Plasma (FFP)"],
    contactDisplayPolicy: "EmergencyDeskOnly",
    verifiedAt: "2024-06-19T08:00:00Z",
    operatingHours: "24/7 Inpatient Transfusion",
    latitude: 13.6300,
    longitude: 79.4300,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    dataMode: "DEMO",
  },
  {
    id: "fac-ka-18",
    facilityId: "fac-ka-18",
    name: "Bengaluru Whitefield Lifeline Blood Depot",
    type: "Blood Bank",
    facilityType: "Blood Bank",
    licenseNumber: "DEMO-KA-BB-2026-18",
    address: "ITPL Main Road, Whitefield",
    generalAddressLabel: "Whitefield, Bengaluru",
    city: "Bengaluru",
    state: "Karnataka",
    phone: "(080) 555-0118",
    emergencyHotline: "(080) 555-9918",
    email: "whitefield@bengalurulifeline.demo",
    verified: true,
    demonstrationVerificationStatus: "Verified",
    supportedComponents: ["Whole Blood", "Packed Red Blood Cells (PRBC)", "Platelets", "Fresh Frozen Plasma (FFP)", "Cryoprecipitate"],
    contactDisplayPolicy: "EmergencyDeskOnly",
    verifiedAt: "2025-02-10T10:00:00Z",
    operatingHours: "24/7 Regional Logistics",
    latitude: 12.9698,
    longitude: 77.7500,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    dataMode: "DEMO",
  },
  {
    id: "fac-ts-19",
    facilityId: "fac-ts-19",
    name: "Hyderabad Secunderabad Armed Forces Reserve",
    type: "Regional Depot",
    facilityType: "Regional Depot",
    licenseNumber: "DEMO-TS-DEP-2026-19",
    address: "Sardar Patel Road, Secunderabad",
    generalAddressLabel: "Secunderabad, Hyderabad",
    city: "Hyderabad",
    state: "Telangana",
    phone: "(040) 555-0119",
    emergencyHotline: "(040) 555-9919",
    email: "depot@secunderabadblood.demo",
    verified: true,
    demonstrationVerificationStatus: "Verified",
    supportedComponents: ["Whole Blood", "Packed Red Blood Cells (PRBC)", "Fresh Frozen Plasma (FFP)"],
    contactDisplayPolicy: "EmergencyDeskOnly",
    verifiedAt: "2024-05-15T09:00:00Z",
    operatingHours: "24/7 Reserve Logistics",
    latitude: 17.4399,
    longitude: 78.4983,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    dataMode: "DEMO",
  },
  {
    id: "fac-tn-20",
    facilityId: "fac-tn-20",
    name: "Chennai Adyar Specialty Cancer & Platelet Depot",
    type: "Hospital",
    facilityType: "Hospital",
    licenseNumber: "DEMO-TN-HOSP-2026-20",
    address: "Sardar Patel Road, Adyar",
    generalAddressLabel: "Adyar, Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    phone: "(044) 555-0120",
    emergencyHotline: "(044) 555-9920",
    email: "platelets@chennaiadyar.demo",
    verified: true,
    demonstrationVerificationStatus: "Verified",
    supportedComponents: ["Platelets", "Packed Red Blood Cells (PRBC)", "Fresh Frozen Plasma (FFP)"],
    contactDisplayPolicy: "EmergencyDeskOnly",
    verifiedAt: "2024-11-01T12:00:00Z",
    operatingHours: "24/7 Apheresis & Inpatient Care",
    latitude: 13.0012,
    longitude: 80.2565,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    dataMode: "DEMO",
  },
  {
    id: "fac-ap-21",
    facilityId: "fac-ap-21",
    name: "Eluru West Godavari Transfusion Centre",
    type: "Blood Bank",
    facilityType: "Blood Bank",
    licenseNumber: "DEMO-AP-BB-2026-21",
    address: "NR Peta, Hospital Road",
    generalAddressLabel: "NR Peta, Eluru",
    city: "Eluru",
    state: "Andhra Pradesh",
    phone: "(08812) 555-0121",
    emergencyHotline: "(08812) 555-9921",
    email: "eluru@westgodavariblood.demo",
    verified: true,
    demonstrationVerificationStatus: "Verified",
    supportedComponents: ["Whole Blood", "Packed Red Blood Cells (PRBC)", "Fresh Frozen Plasma (FFP)"],
    contactDisplayPolicy: "EmergencyDeskOnly",
    verifiedAt: "2024-08-30T09:00:00Z",
    operatingHours: "24/7 Emergency Operation",
    latitude: 16.7107,
    longitude: 81.0952,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    dataMode: "DEMO",
  },
  {
    id: "fac-ap-22",
    facilityId: "fac-ap-22",
    name: "Ongole Prakasam District Blood Institute",
    type: "Hospital",
    facilityType: "Hospital",
    licenseNumber: "DEMO-AP-HOSP-2026-22",
    address: "Kurnool Road, Lawyerpet",
    generalAddressLabel: "Lawyerpet, Ongole",
    city: "Ongole",
    state: "Andhra Pradesh",
    phone: "(08592) 555-0122",
    emergencyHotline: "(08592) 555-9922",
    email: "bloodunit@ongoleprakasam.demo",
    verified: true,
    demonstrationVerificationStatus: "Verified",
    supportedComponents: ["Packed Red Blood Cells (PRBC)", "Fresh Frozen Plasma (FFP)"],
    contactDisplayPolicy: "EmergencyDeskOnly",
    verifiedAt: "2024-09-15T11:00:00Z",
    operatingHours: "24/7 Inpatient Services",
    latitude: 15.5057,
    longitude: 80.0499,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    dataMode: "DEMO",
  },
  {
    id: "fac-ap-23",
    facilityId: "fac-ap-23",
    name: "Srikakulam Kalinga LifeSource Blood Bank",
    type: "Blood Bank",
    licenseNumber: "DEMO-AP-BB-2026-23",
    address: "GT Road, Palakonda Road Junction",
    generalAddressLabel: "GT Road, Srikakulam",
    city: "Srikakulam",
    state: "Andhra Pradesh",
    phone: "(08942) 555-0123",
    emergencyHotline: "(08942) 555-9923",
    email: "contact@srikakulamblood.demo",
    verified: true,
    demonstrationVerificationStatus: "Verified",
    supportedComponents: ["Whole Blood", "Packed Red Blood Cells (PRBC)"],
    contactDisplayPolicy: "EmergencyDeskOnly",
    verifiedAt: "2024-10-18T10:00:00Z",
    operatingHours: "8:00 AM - 9:00 PM (Emergency on-call)",
    latitude: 18.2969,
    longitude: 83.8967,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    dataMode: "DEMO",
  },
  {
    id: "fac-ap-24",
    facilityId: "fac-ap-24",
    name: "Vizianagaram Fort City Medical Care & Transfusion",
    type: "Medical Centre",
    facilityType: "Medical Centre",
    licenseNumber: "DEMO-AP-MC-2026-24",
    address: "Cantonment Area, Railway Station Road",
    generalAddressLabel: "Cantonment, Vizianagaram",
    city: "Vizianagaram",
    state: "Andhra Pradesh",
    phone: "(08922) 555-0124",
    emergencyHotline: "(08922) 555-9924",
    email: "transfusion@vizianagaramfort.demo",
    verified: true,
    demonstrationVerificationStatus: "Verified",
    supportedComponents: ["Packed Red Blood Cells (PRBC)", "Fresh Frozen Plasma (FFP)"],
    contactDisplayPolicy: "EmergencyDeskOnly",
    verifiedAt: "2024-12-20T14:00:00Z",
    operatingHours: "24/7 Regional Referral Care",
    latitude: 18.1124,
    longitude: 83.3978,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    dataMode: "DEMO",
  },
  {
    id: "fac-ap-25",
    facilityId: "fac-ap-25",
    name: "Machilipatnam Krishna Coast Blood Bank",
    type: "Blood Bank",
    licenseNumber: "DEMO-AP-BB-2026-25",
    address: "Noble College Road, Buttaipeta",
    generalAddressLabel: "Buttaipeta, Machilipatnam",
    city: "Machilipatnam",
    state: "Andhra Pradesh",
    phone: "(08672) 555-0125",
    emergencyHotline: "(08672) 555-9925",
    email: "krishnacoast@machilipatnam.demo",
    verified: true,
    demonstrationVerificationStatus: "Verified",
    supportedComponents: ["Whole Blood", "Packed Red Blood Cells (PRBC)", "Fresh Frozen Plasma (FFP)"],
    contactDisplayPolicy: "EmergencyDeskOnly",
    verifiedAt: "2024-06-10T12:00:00Z",
    operatingHours: "24/7 Cold Storage",
    latitude: 16.1875,
    longitude: 81.1389,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    dataMode: "DEMO",
  },
  {
    id: "fac-ap-26",
    facilityId: "fac-ap-26",
    name: "Nandyal Golden Nandi Hospital Blood Wing",
    type: "Hospital",
    facilityType: "Hospital",
    licenseNumber: "DEMO-AP-HOSP-2026-26",
    address: "Sanjeeva Nagar, Near Flyover",
    generalAddressLabel: "Sanjeeva Nagar, Nandyal",
    city: "Nandyal",
    state: "Andhra Pradesh",
    phone: "(08514) 555-0126",
    emergencyHotline: "(08514) 555-9926",
    email: "blooddesk@nandyalnandi.demo",
    verified: true,
    demonstrationVerificationStatus: "Verified",
    supportedComponents: ["Packed Red Blood Cells (PRBC)", "Fresh Frozen Plasma (FFP)"],
    contactDisplayPolicy: "EmergencyDeskOnly",
    verifiedAt: "2024-09-02T10:00:00Z",
    operatingHours: "24/7 Acute Inpatient",
    latitude: 15.4882,
    longitude: 78.4836,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    dataMode: "DEMO",
  },
  {
    id: "fac-ap-27",
    facilityId: "fac-ap-27",
    name: "Madanapalle Horsley Hills Life Care Depot",
    type: "Blood Bank",
    facilityType: "Blood Bank",
    licenseNumber: "DEMO-AP-BB-2026-27",
    address: "CBR Road, Patel Road Corner",
    generalAddressLabel: "Patel Road, Madanapalle",
    city: "Madanapalle",
    state: "Andhra Pradesh",
    phone: "(08571) 555-0127",
    emergencyHotline: "(08571) 555-9927",
    email: "horsley@madanapalleblood.demo",
    verified: true,
    demonstrationVerificationStatus: "Verified",
    supportedComponents: ["Whole Blood", "Packed Red Blood Cells (PRBC)"],
    contactDisplayPolicy: "EmergencyDeskOnly",
    verifiedAt: "2024-08-14T08:00:00Z",
    operatingHours: "8:00 AM - 8:00 PM (Emergency on-call)",
    latitude: 13.5500,
    longitude: 78.5000,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    dataMode: "DEMO",
  },
  {
    id: "fac-ap-28",
    facilityId: "fac-ap-28",
    name: "Hindupur Lepakshi Regional Blood Unit",
    type: "Medical Centre",
    facilityType: "Medical Centre",
    licenseNumber: "DEMO-AP-MC-2026-28",
    address: "Penukonda Road, MF Colony",
    generalAddressLabel: "Penukonda Road, Hindupur",
    city: "Hindupur",
    state: "Andhra Pradesh",
    phone: "(08556) 555-0128",
    emergencyHotline: "(08556) 555-9928",
    email: "lepakshi@hindupurblood.demo",
    verified: true,
    demonstrationVerificationStatus: "Verified",
    supportedComponents: ["Whole Blood", "Packed Red Blood Cells (PRBC)", "Fresh Frozen Plasma (FFP)"],
    contactDisplayPolicy: "EmergencyDeskOnly",
    verifiedAt: "2024-11-19T10:00:00Z",
    operatingHours: "24/7 Regional Dispatch",
    latitude: 13.8299,
    longitude: 77.4930,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    dataMode: "DEMO",
  },
  {
    id: "fac-ap-29",
    facilityId: "fac-ap-29",
    name: "Gudivada Coastal Rural Blood Bank",
    type: "Blood Bank",
    licenseNumber: "DEMO-AP-BB-2026-29",
    address: "Eluru Road, Satyanarayanapuram",
    generalAddressLabel: "Satyanarayanapuram, Gudivada",
    city: "Gudivada",
    state: "Andhra Pradesh",
    phone: "(08674) 555-0129",
    emergencyHotline: "(08674) 555-9929",
    email: "rural@gudivadablood.demo",
    verified: true,
    demonstrationVerificationStatus: "Verified",
    supportedComponents: ["Whole Blood", "Packed Red Blood Cells (PRBC)"],
    contactDisplayPolicy: "EmergencyDeskOnly",
    verifiedAt: "2024-07-08T11:00:00Z",
    operatingHours: "24/7 Dispatch",
    latitude: 16.4410,
    longitude: 80.9926,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    dataMode: "DEMO",
  },
  {
    id: "fac-ap-30",
    facilityId: "fac-ap-30",
    name: "Tadepalligudem Delta Transfusion Research Wing",
    type: "Hospital",
    facilityType: "Hospital",
    licenseNumber: "DEMO-AP-HOSP-2026-30",
    address: "KN Road, Near Market Complex",
    generalAddressLabel: "KN Road, Tadepalligudem",
    city: "Tadepalligudem",
    state: "Andhra Pradesh",
    phone: "(08818) 555-0130",
    emergencyHotline: "(08818) 555-9930",
    email: "delta@tadepalligudemblood.demo",
    verified: true,
    demonstrationVerificationStatus: "Verified",
    supportedComponents: ["Packed Red Blood Cells (PRBC)", "Platelets", "Fresh Frozen Plasma (FFP)"],
    contactDisplayPolicy: "EmergencyDeskOnly",
    verifiedAt: "2025-01-05T09:00:00Z",
    operatingHours: "24/7 Inpatient Surgical Wing",
    latitude: 16.8143,
    longitude: 81.5269,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
    dataMode: "DEMO",
  },
];

// Helper: Seeded pseudo-random generator
class SeededRandom {
  private seed: number;
  constructor(seed = 123456789) {
    this.seed = seed;
  }
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
  choice<T>(arr: T[]): T {
    return arr[Math.floor(this.next() * arr.length)];
  }
  intBetween(min: number, max: number): number {
    return Math.floor(min + this.next() * (max - min + 1));
  }
}

const rng = new SeededRandom(42);

const BLOOD_GROUPS: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const COMPONENTS: BloodComponent[] = [
  "Packed Red Blood Cells (PRBC)",
  "Whole Blood",
  "Platelets",
  "Fresh Frozen Plasma (FFP)",
  "Cryoprecipitate",
];
const CITIES = [
  "Chittoor", "Tirupati", "Vellore", "Bengaluru", "Chennai",
  "Hyderabad", "Vijayawada", "Visakhapatnam", "Kadapa", "Nellore",
  "Guntur", "Kurnool", "Anantapur", "Rajahmundry", "Kakinada"
];

// ==========================================
// 2. 160+ DETERMINISTIC INVENTORY RECORDS
// ==========================================
export function generateSyntheticInventory(): BloodInventoryItem[] {
  const items: BloodInventoryItem[] = [];
  const localRng = new SeededRandom(777);

  let idCounter = 101;

  for (const fac of SYNTHETIC_FACILITIES) {
    // Generate 5 to 7 batches per facility to get 160+ records
    const numBatches = 6;
    for (let i = 0; i < numBatches; i++) {
      const bg = localRng.choice(BLOOD_GROUPS);
      const comp = localRng.choice(fac.supportedComponents || COMPONENTS);
      const qty = localRng.choice([0, 1, 2, 3, 5, 8, 12, 18]);
      const reserved = qty > 2 ? localRng.intBetween(0, 2) : 0;
      
      // Determine storage temp based on component
      let temp = "2°C to 6°C";
      if (comp === "Fresh Frozen Plasma (FFP)") temp = "-20°C or colder";
      else if (comp === "Platelets") temp = "20°C to 24°C (Agitated)";

      // Determine date offset
      const isExpired = localRng.next() < 0.08; // 8% expired test fixtures
      const isStale = localRng.next() < 0.12; // 12% stale test fixtures

      const expiryDate = isExpired
        ? "2026-03-20T08:00:00Z"
        : `2026-05-${String(localRng.intBetween(1, 28)).padStart(2, "0")}T08:00:00Z`;

      const lastUpdated = isStale
        ? "2026-03-15T10:00:00.000Z" // Stale record (>20 days ago)
        : `2026-04-10T${String(localRng.intBetween(8, 12)).padStart(2, "0")}:${String(localRng.intBetween(10, 50)).padStart(2, "0")}:00.000Z`;

      let status: InventoryStatus = "available";
      if (isExpired) status = "expired";
      else if (qty === 0) status = "depleted";

      items.push({
        id: `inv-${idCounter}`,
        inventoryId: `inv-${idCounter}`,
        facilityId: fac.id,
        facilityName: fac.name,
        city: fac.city,
        bloodGroup: bg,
        component: comp,
        unitsAvailable: qty,
        quantity: qty,
        unit: "units",
        unitsReserved: reserved,
        storageTempCelsius: temp,
        batchNumber: `LOT-2026-${fac.city.slice(0, 3).toUpperCase()}-${idCounter}`,
        collectionDate: "2026-03-25T08:00:00Z",
        expiryDate,
        status,
        isVerified: fac.verified,
        lastUpdated,
        dataMode: "DEMO",
      });

      idCounter++;
    }
  }

  return items;
}

export const SYNTHETIC_INVENTORY: BloodInventoryItem[] = generateSyntheticInventory();

// ==========================================
// 3. 100 FICTIONAL DONOR PROFILES
// ==========================================
const FIRST_NAMES = [
  "Aarav", "Aditi", "Arjun", "Ananya", "Bhavya", "Chaitanya", "Deepa", "Divya",
  "Eswar", "Farhan", "Gautam", "Harika", "Ishaan", "Jaya", "Kavya", "Karthik",
  "Lakshmi", "Madhav", "Manish", "Meera", "Naveen", "Neha", "Nikhil", "Pooja",
  "Pranav", "Priyanka", "Rahul", "Rakesh", "Riya", "Rohit", "Sai", "Sandhya",
  "Siddharth", "Sneha", "Sravan", "Suresh", "Tanvi", "Tarun", "Varun", "Vidyut"
];
const LAST_NAMES = [
  "Reddy", "Rao", "Chowdary", "Naidu", "Varma", "Sharma", "Murthy", "Gupta",
  "Iyer", "Nair", "Patel", "Prasad", "Raju", "Srinivas", "Kulkarni", "Deshmukh",
  "Menon", "Pillai", "Babu", "Bhatt"
];

export function generateSyntheticDonors(): DonorProfile[] {
  const donors: DonorProfile[] = [];
  const localRng = new SeededRandom(888);

  for (let i = 1; i <= 100; i++) {
    const fName = localRng.choice(FIRST_NAMES);
    const lName = localRng.choice(LAST_NAMES);
    const fullName = `${fName} ${lName}`;
    const bg = localRng.choice(BLOOD_GROUPS);
    const city = localRng.choice(CITIES);
    const prefContact = localRng.choice<"call" | "sms" | "whatsapp" | "email">(["call", "sms", "whatsapp", "email"]);

    // Diverse status
    const statusRoll = localRng.next();
    let isAvailable = true;
    let availabilityStatus: DonorProfile["availabilityStatus"] = "Available";
    let consentStatus: DonorProfile["consentStatus"] = "Active Consent";

    if (statusRoll < 0.15) {
      isAvailable = false;
      availabilityStatus = "Paused";
    } else if (statusRoll < 0.22) {
      isAvailable = false;
      availabilityStatus = "Temporarily Unavailable";
    } else if (statusRoll < 0.25) {
      isAvailable = false;
      availabilityStatus = "Withdrawn";
      consentStatus = "Withdrawn";
    }

    donors.push({
      id: `don-${String(i).padStart(3, "0")}`,
      donorId: `don-${String(i).padStart(3, "0")}`,
      userId: `user-don-${i}`,
      fullName,
      fictionalDisplayName: fullName,
      bloodGroup: bg,
      city,
      state: "Andhra Pradesh",
      phone: `(0${localRng.intBetween(80, 99)}) 555-0${String(i).padStart(3, "0")}`,
      email: `${fName.toLowerCase()}.${lName.toLowerCase()}${i}@demo-donor.test`,
      preferredContact: prefContact,
      contactPreference: prefContact,
      isAvailable,
      availabilityStatus,
      consentStatus,
      lastDonationDate: `2025-${String(localRng.intBetween(1, 12)).padStart(2, "0")}-15`,
      totalDonations: localRng.intBetween(1, 24),
      radiusKm: localRng.choice([10, 15, 20, 25, 35, 50]),
      consentEmergencyContact: consentStatus === "Active Consent",
      registeredAt: `2025-0${localRng.intBetween(1, 9)}-10T09:00:00Z`,
      lastUpdated: "2026-04-01T00:00:00Z",
      medicalScreeningPassed: localRng.next() > 0.1,
      privacyShowPhonePublic: false,
      dataMode: "DEMO",
    });
  }

  return donors;
}

export const SYNTHETIC_DONORS: DonorProfile[] = generateSyntheticDonors();

// ==========================================
// 4. 100 DETERMINISTIC BLOOD REQUESTS
// ==========================================
export const SPECIFIED_DEMO_FIXTURES: BloodRequest[] = [
  {
    id: "req-1001",
    requestId: "req-1001",
    requestNumber: "DEMO-1001",
    requesterName: "Dr. K. Srinivas (Trauma Surgery Lead)",
    requesterDisplayName: "Dr. K. Srinivas",
    requesterPhone: "(08572) 555-0901",
    requesterEmail: "srinivas.k@chittoordistrict.demo",
    patientName: "Venkatesh Babu",
    patientAge: 42,
    hospitalName: "Chittoor District Memorial Health Institute",
    hospitalAddress: "Collectorate Road, ICU Ward Bed 3",
    city: "Chittoor",
    bloodGroup: "O-",
    component: "Packed Red Blood Cells (PRBC)",
    unitsRequired: 2,
    quantity: 2,
    urgency: "high",
    requiredDate: "2026-04-12",
    medicalReason: "Multiple vehicle trauma with severe internal bleeding and acute hypovolemic shock.",
    doctorName: "Dr. K. Srinivas, MS, MCh",
    doctorContact: "(08572) 555-0901",
    status: "matching-in-progress",
    createdAt: "2026-04-10T11:00:00.000Z",
    updatedAt: "2026-04-10T11:30:00.000Z",
    dataMode: "DEMO",
  },
  {
    id: "req-1002",
    requestId: "req-1002",
    requestNumber: "DEMO-1002",
    requesterName: "Nurse Incharge Radhika",
    requesterDisplayName: "Nurse Incharge Radhika",
    requesterPhone: "(08572) 555-0902",
    requesterEmail: "surgical.desk@chittoorvolunteers.demo",
    patientName: "Lalitha Kumari",
    patientAge: 55,
    hospitalName: "Chittoor Community Voluntary Blood Center",
    hospitalAddress: "Kongareddy Palli Road",
    city: "Chittoor",
    bloodGroup: "A+",
    component: "Packed Red Blood Cells (PRBC)",
    unitsRequired: 3,
    quantity: 3,
    urgency: "normal",
    requiredDate: "2026-04-14",
    medicalReason: "Scheduled elective hip replacement surgery.",
    doctorName: "Dr. N. Prasad, Orthopedic Surgeon",
    doctorContact: "(08572) 555-0902",
    status: "submitted",
    createdAt: "2026-04-10T09:15:00.000Z",
    updatedAt: "2026-04-10T09:15:00.000Z",
    dataMode: "DEMO",
  },
  {
    id: "req-1003",
    requestId: "req-1003",
    requestNumber: "DEMO-1003",
    requesterName: "Dr. P. Chandrasekhar",
    requesterDisplayName: "Dr. P. Chandrasekhar",
    requesterPhone: "(0877) 555-0903",
    requesterEmail: "hematology@tirupatibloodcenter.demo",
    patientName: "Siddhartha Varma",
    patientAge: 28,
    hospitalName: "Tirupati Regional Blood Center & Research Trust",
    hospitalAddress: "Alipiri Bypass Road",
    city: "Tirupati",
    bloodGroup: "AB+",
    component: "Packed Red Blood Cells (PRBC)",
    unitsRequired: 2,
    quantity: 2,
    urgency: "high",
    requiredDate: "2026-04-11",
    medicalReason: "Severe gastrointestinal bleeding secondary to peptic ulcer perforation.",
    doctorName: "Dr. P. Chandrasekhar, MD",
    doctorContact: "(0877) 555-0903",
    status: "under-review",
    createdAt: "2026-04-10T08:30:00.000Z",
    updatedAt: "2026-04-10T09:00:00.000Z",
    dataMode: "DEMO",
  },
  {
    id: "req-1004",
    requestId: "req-1004",
    requestNumber: "DEMO-1004",
    requesterName: "Anand Kumar (Attendant)",
    requesterDisplayName: "Anand Kumar",
    requesterPhone: "(0416) 555-0904",
    requesterEmail: "anand.k@demo-family.test",
    patientName: "Muthu Raman",
    patientAge: 64,
    hospitalName: "Vellore Apex Medical Pavilion & Blood Depot",
    hospitalAddress: "Arcot Road, Sathuvachari",
    city: "Vellore",
    bloodGroup: "B-",
    component: "Packed Red Blood Cells (PRBC)",
    unitsRequired: 5,
    quantity: 5,
    urgency: "normal",
    requiredDate: "2026-04-15",
    medicalReason: "Cardiac coronary artery bypass graft (CABG) scheduled support.",
    doctorName: "Dr. K. Meenakshi, Cardiothoracic Lead",
    doctorContact: "(0416) 555-0904",
    status: "submitted",
    createdAt: "2026-04-10T07:45:00.000Z",
    updatedAt: "2026-04-10T07:45:00.000Z",
    dataMode: "DEMO",
  },
  {
    id: "req-1005",
    requestId: "req-1005",
    requestNumber: "DEMO-1005",
    requesterName: "Dr. Jayanthi Ramanathan",
    requesterDisplayName: "Dr. Jayanthi Ramanathan",
    requesterPhone: "(044) 555-0905",
    requesterEmail: "jayanthi@chennairedcross.demo",
    patientName: "Deepak Sundaram",
    patientAge: 33,
    hospitalName: "Chennai Central Red Cross Regional Depot",
    hospitalAddress: "Poonamallee High Road, Kilpauk",
    city: "Chennai",
    bloodGroup: "AB-",
    component: "Packed Red Blood Cells (PRBC)",
    unitsRequired: 2,
    quantity: 2,
    urgency: "high",
    requiredDate: "2026-04-12",
    medicalReason: "Acute aplastic anemia with profound thrombocytopenia and bleeding.",
    doctorName: "Dr. Jayanthi Ramanathan, Hematologist",
    doctorContact: "(044) 555-0905",
    status: "matching-in-progress",
    createdAt: "2026-04-10T10:20:00.000Z",
    updatedAt: "2026-04-10T10:45:00.000Z",
    dataMode: "DEMO",
  },
  {
    id: "req-1006",
    requestId: "req-1006",
    requestNumber: "DEMO-1006",
    requesterName: "Dr. Farooq Siddiqui (Emergency Physician)",
    requesterDisplayName: "Dr. Farooq Siddiqui",
    requesterPhone: "(040) 555-0906",
    requesterEmail: "farooq.s@hyderabadpremier.demo",
    patientName: "Mohammad Arif",
    patientAge: 48,
    hospitalName: "Hyderabad Premier Trauma & Life Care Hospital",
    hospitalAddress: "Banjara Hills Road No. 2, Emergency Wing",
    city: "Hyderabad",
    bloodGroup: "O+",
    component: "Packed Red Blood Cells (PRBC)",
    unitsRequired: 4,
    quantity: 4,
    urgency: "emergency",
    requiredDate: "2026-04-10",
    medicalReason: "Ruptured abdominal aortic aneurysm emergency laparotomy.",
    doctorName: "Dr. Farooq Siddiqui, FACS",
    doctorContact: "(040) 555-0906",
    status: "under-review",
    createdAt: "2026-04-10T11:45:00.000Z",
    updatedAt: "2026-04-10T11:55:00.000Z",
    dataMode: "DEMO",
  },
  {
    id: "req-1007",
    requestId: "req-1007",
    requestNumber: "DEMO-1007",
    requesterName: "Nurse Supervisor Sudha",
    requesterDisplayName: "Nurse Supervisor Sudha",
    requesterPhone: "(0866) 555-0907",
    requesterEmail: "sudha.m@vijayawadaggh.demo",
    patientName: "Bhavani Shankar",
    patientAge: 39,
    hospitalName: "Vijayawada Government General Transfusion Wing",
    hospitalAddress: "MG Road, Governorpet",
    city: "Vijayawada",
    bloodGroup: "A-",
    component: "Packed Red Blood Cells (PRBC)",
    unitsRequired: 2,
    quantity: 2,
    urgency: "normal",
    requiredDate: "2026-04-13",
    medicalReason: "Chronic renal failure with secondary severe normocytic anemia.",
    doctorName: "Dr. T. Venkataramaiah, Nephrologist",
    doctorContact: "(0866) 555-0907",
    status: "submitted",
    createdAt: "2026-04-10T06:30:00.000Z",
    updatedAt: "2026-04-10T06:30:00.000Z",
    dataMode: "DEMO",
  },
  {
    id: "req-1008",
    requestId: "req-1008",
    requestNumber: "DEMO-1008",
    requesterName: "Dr. C. Madhusudhan",
    requesterDisplayName: "Dr. C. Madhusudhan",
    requesterPhone: "(08562) 555-0908",
    requesterEmail: "madhusudhan@kadapablood.demo",
    patientName: "Ramesh Naidu",
    patientAge: 51,
    hospitalName: "Kadapa Rayalaseema Regional Transfusion Centre",
    hospitalAddress: "Seven Roads Junction",
    city: "Kadapa",
    bloodGroup: "B+",
    component: "Packed Red Blood Cells (PRBC)",
    unitsRequired: 3,
    quantity: 3,
    urgency: "high",
    requiredDate: "2026-04-11",
    medicalReason: "Post-operative elective monitoring (Cancelled due to surgical deferral).",
    doctorName: "Dr. C. Madhusudhan, MS",
    doctorContact: "(08562) 555-0908",
    status: "cancelled",
    cancelledReason: "Procedure rescheduled by family request; patient stable without acute bleed.",
    createdAt: "2026-04-09T14:00:00.000Z",
    updatedAt: "2026-04-10T08:00:00.000Z",
    dataMode: "DEMO",
  },
  {
    id: "req-1009",
    requestId: "req-1009",
    requestNumber: "DEMO-1009",
    requesterName: "Dr. George Mathew (ICU Director)",
    requesterDisplayName: "Dr. George Mathew",
    requesterPhone: "(080) 555-0909",
    requesterEmail: "george.m@bengalurumetro.demo",
    patientName: "Aditya Hegde",
    patientAge: 21,
    hospitalName: "Bengaluru Metropolitan Hematology Institute",
    hospitalAddress: "Outer Ring Road, Marathahalli",
    city: "Bengaluru",
    bloodGroup: "O-",
    component: "Packed Red Blood Cells (PRBC)",
    unitsRequired: 8,
    quantity: 8,
    urgency: "emergency",
    requiredDate: "2026-04-10",
    medicalReason: "Massive polytrauma crush injury; unfulfilled regional stock (Testing No Matches fixture).",
    doctorName: "Dr. George Mathew, Trauma Critical Care",
    doctorContact: "(080) 555-0909",
    status: "no-matches",
    createdAt: "2026-04-10T12:00:00.000Z",
    updatedAt: "2026-04-10T12:15:00.000Z",
    dataMode: "DEMO",
  },
  {
    id: "req-1010",
    requestId: "req-1010",
    requestNumber: "DEMO-1010",
    requesterName: "Sister Mary Varghese",
    requesterDisplayName: "Sister Mary Varghese",
    requesterPhone: "(0861) 555-0910",
    requesterEmail: "mary.v@nellorelifesource.demo",
    patientName: "Padmavathi Amma",
    patientAge: 72,
    hospitalName: "Nellore Coastal LifeSource Blood Bank",
    hospitalAddress: "Trunk Road, Stonehousepet",
    city: "Nellore",
    bloodGroup: "AB+",
    component: "Packed Red Blood Cells (PRBC)",
    unitsRequired: 1,
    quantity: 1,
    urgency: "normal",
    requiredDate: "2026-04-09",
    medicalReason: "Pre-transfusion anemia correction before minor orthopedic pin removal.",
    doctorName: "Dr. V. Subrahmanyam",
    doctorContact: "(0861) 555-0910",
    status: "fulfilled",
    createdAt: "2026-04-08T10:00:00.000Z",
    updatedAt: "2026-04-09T14:30:00.000Z",
    fulfilledAt: "2026-04-09T14:30:00.000Z",
    dataMode: "DEMO",
  },
];

export function generateSyntheticRequests(): BloodRequest[] {
  const requests: BloodRequest[] = [...SPECIFIED_DEMO_FIXTURES];
  const localRng = new SeededRandom(999);

  const statuses: RequestStatus[] = [
    "submitted", "under-review", "matching-in-progress",
    "response-received", "fulfilled", "cancelled"
  ];

  const urgencies: UrgencyLevel[] = [
    "immediate", "within-24h", "within-48h", "elective",
    "emergency", "high", "normal", "low"
  ];

  for (let i = 11; i <= 100; i++) {
    const bg = localRng.choice(BLOOD_GROUPS);
    const comp = localRng.choice(COMPONENTS);
    const city = localRng.choice(CITIES);
    const fac = localRng.choice(SYNTHETIC_FACILITIES);
    const fName = localRng.choice(FIRST_NAMES);
    const lName = localRng.choice(LAST_NAMES);
    const status = localRng.choice(statuses);
    const urgency = localRng.choice(urgencies);
    const qty = localRng.choice([1, 2, 3, 4, 6, 8]);
    const reqNum = `DEMO-${1000 + i}`;

    requests.push({
      id: `req-${1000 + i}`,
      requestId: `req-${1000 + i}`,
      requestNumber: reqNum,
      requesterName: `${fName} ${lName} (${localRng.choice(["Attending Physician", "Family Guardian", "ICU Supervisor", "Clinical Coordinator"])})`,
      requesterDisplayName: `${fName} ${lName}`,
      requesterPhone: `(0${localRng.intBetween(80, 99)}) 555-0${String(i).padStart(3, "0")}`,
      requesterEmail: `${fName.toLowerCase()}.${lName.toLowerCase()}${i}@demo-health.test`,
      patientName: `${localRng.choice(FIRST_NAMES)} ${localRng.choice(LAST_NAMES)}`,
      patientAge: localRng.intBetween(4, 82),
      hospitalName: fac.name,
      hospitalAddress: `${fac.address}, Department Ward ${localRng.intBetween(1, 8)}`,
      city: fac.city,
      bloodGroup: bg,
      component: comp,
      unitsRequired: qty,
      quantity: qty,
      urgency,
      requiredDate: `2026-04-${String(localRng.intBetween(10, 28)).padStart(2, "0")}`,
      medicalReason: localRng.choice([
        "Acute surgical bleeding control during emergency intervention.",
        "Oncology chemotherapy support; severe platelet/hemoglobin drop.",
        "Postpartum hemorrhage management requiring rapid component replacement.",
        "Major vascular grafting with planned crossmatch backup.",
        "Sickle cell crisis with severe hemolytic anemia episode.",
        "Elective orthopedic reconstruction crossmatch support."
      ]),
      doctorName: `Dr. ${localRng.choice(FIRST_NAMES)} ${localRng.choice(LAST_NAMES)}, MD`,
      doctorContact: `(0${localRng.intBetween(80, 99)}) 555-9${String(i).padStart(3, "0")}`,
      status,
      createdAt: `2026-04-0${localRng.intBetween(1, 9)}T10:00:00.000Z`,
      updatedAt: "2026-04-10T11:00:00.000Z",
      fulfilledAt: status === "fulfilled" ? "2026-04-09T18:00:00.000Z" : undefined,
      cancelledReason: status === "cancelled" ? "Cancelled per attending clinical team assessment." : undefined,
      dataMode: "DEMO",
    });
  }

  return requests;
}

export const SYNTHETIC_REQUESTS: BloodRequest[] = generateSyntheticRequests();

// ==========================================
// 5. 160+ DETERMINISTIC REQUEST RESPONSES
// ==========================================
export function generateSyntheticResponses(): RequestResponse[] {
  const responses: RequestResponse[] = [];
  const localRng = new SeededRandom(555);

  const responseStatuses: RequestResponse["responseStatus"][] = [
    "Pending", "Accepted", "Declined", "Needs More Information"
  ];

  let respId = 1;

  for (const req of SYNTHETIC_REQUESTS) {
    if (req.status === "response-received" || req.status === "fulfilled" || localRng.next() < 0.8) {
      const numResponses = localRng.intBetween(1, 3);
      for (let k = 0; k < numResponses; k++) {
        const isFacility = localRng.next() > 0.4;
        const fac = localRng.choice(SYNTHETIC_FACILITIES);
        const donor = localRng.choice(SYNTHETIC_DONORS);
        const rStatus = localRng.choice(responseStatuses);

        responses.push({
          id: `resp-${respId}`,
          responseId: `resp-${respId}`,
          requestId: req.id,
          responderType: isFacility ? "facility" : "donor",
          respondingEntityType: isFacility ? "facility" : "donor",
          responderId: isFacility ? fac.id : donor.id,
          respondingEntityId: isFacility ? fac.id : donor.id,
          responderName: isFacility ? fac.name : `${donor.fullName} (${donor.bloodGroup} Voluntary Donor)`,
          responderContact: isFacility ? fac.emergencyHotline : "Protected via Platform Dispatch",
          bloodGroup: isFacility ? req.bloodGroup : donor.bloodGroup,
          unitsOffered: isFacility ? Math.min(req.unitsRequired, localRng.intBetween(1, 4)) : 1,
          status: rStatus === "Accepted" ? "accepted" : rStatus === "Declined" ? "declined" : "offered",
          responseStatus: rStatus,
          estimatedArrival: isFacility ? "Within 1 to 2 hours via cold chain courier" : "Ready to arrive at hospital blood bank within 3 hours",
          notes: isFacility ? "Pre-screened inventory cleared for immediate dispatch." : "Volunteer ready for collection.",
          createdAt: "2026-04-10T10:30:00.000Z",
          dataMode: "DEMO",
        });

        respId++;
      }
    }
  }

  return responses;
}

export const SYNTHETIC_RESPONSES: RequestResponse[] = generateSyntheticResponses();

// ==========================================
// 6. 120+ DETERMINISTIC NOTIFICATIONS
// ==========================================
export function generateSyntheticNotifications(): NotificationItem[] {
  const notifs: NotificationItem[] = [];
  const localRng = new SeededRandom(333);

  let nId = 1;

  for (const req of SYNTHETIC_REQUESTS.slice(0, 65)) {
    notifs.push({
      id: `notif-${nId}`,
      notificationId: `notif-${nId}`,
      recipientDemoUserId: `user-${localRng.intBetween(1, 50)}`,
      recipientRole: localRng.choice(["all", "hospital", "donor", "requester"]),
      title: `Emergency Requisition Broadcast: ${req.bloodGroup} ${req.component}`,
      message: `${req.hospitalName} in ${req.city} requires ${req.unitsRequired} unit(s) (${req.urgency.toUpperCase()}).`,
      type: "emergency",
      link: `/track-request?id=${req.requestNumber}`,
      read: localRng.next() > 0.4,
      readStatus: localRng.next() > 0.4 ? "Read" : "Unread",
      createdAt: "2026-04-10T11:00:00.000Z",
      dataMode: "DEMO",
    });
    nId++;

    if (req.status === "fulfilled") {
      notifs.push({
        id: `notif-${nId}`,
        notificationId: `notif-${nId}`,
        recipientDemoUserId: `user-${localRng.intBetween(1, 50)}`,
        recipientRole: "all",
        title: `Requisition ${req.requestNumber} Fulfilled`,
        message: `Units successfully delivered and verified for ${req.patientName} at ${req.hospitalName}.`,
        type: "status",
        link: `/track-request?id=${req.requestNumber}`,
        read: true,
        readStatus: "Read",
        createdAt: "2026-04-09T18:00:00.000Z",
        dataMode: "DEMO",
      });
      nId++;
    }
  }

  // Add system & match notifications to surpass 110 items
  for (let j = 1; j <= 45; j++) {
    notifs.push({
      id: `notif-${nId}`,
      notificationId: `notif-${nId}`,
      recipientDemoUserId: `user-${j}`,
      recipientRole: "hospital",
      title: `Telemetry Audit #${j}: Cold Chain Temperature Normal`,
      message: `Automatic sensor audit completed across regional storage units in ${localRng.choice(CITIES)}.`,
      type: "system",
      link: "/hospitals/dashboard",
      read: true,
      readStatus: "Read",
      createdAt: "2026-04-09T12:00:00.000Z",
      dataMode: "DEMO",
    });
    nId++;
  }

  return notifs;
}

export const SYNTHETIC_NOTIFICATIONS: NotificationItem[] = generateSyntheticNotifications();

// ==========================================
// 7. AUDIT LOGS
// ==========================================
export const SYNTHETIC_AUDIT_LOGS: AuditLog[] = [
  {
    id: "log-1",
    action: "SYNTHETIC_DATASET_INITIALIZED",
    actorName: "System Initialization Seed",
    actorRole: "admin",
    entityType: "facility",
    entityId: "SYSTEM-INIT",
    details: "Deterministic healthcare synthetic demonstration dataset loaded (30 facilities, 160+ inventory lots, 100 donors, 100 requests).",
    timestamp: "2026-04-10T00:00:00.000Z",
    dataMode: "DEMO",
  },
  {
    id: "log-2",
    action: "INVENTORY_AUDIT_LOGGED",
    actorName: "Tech Supervisor R. Raman",
    actorRole: "hospital",
    entityType: "inventory",
    entityId: "inv-101",
    details: "Logged initial verified inventory batch LOT-2026-CHI-101 (Chittoor District Memorial Health Institute)",
    timestamp: "2026-04-10T08:00:00.000Z",
    dataMode: "DEMO",
  },
  {
    id: "log-3",
    action: "EMERGENCY_REQUEST_BROADCAST",
    actorName: "Dr. K. Srinivas",
    actorRole: "requester",
    entityType: "request",
    entityId: "req-1001",
    details: "Created emergency request DEMO-1001 for 2 units O- PRBC in Chittoor",
    timestamp: "2026-04-10T11:00:00.000Z",
    dataMode: "DEMO",
  },
];

// ==========================================
// 8. 30 EXPLICIT TEST FIXTURES & EDGE CASES
// ==========================================
export const DEMO_EDGE_CASES = {
  EC01_NO_MATCHING_BLOOD_GROUP: {
    name: "No matching blood group in target city",
    input: { bloodGroup: "AB-" as BloodGroup, component: "Platelets" as BloodComponent, city: "Gudivada", unitsRequired: 10, urgency: "emergency" as UrgencyLevel },
  },
  EC02_UNKNOWN_CITY: {
    name: "Unknown / Unserviced city query",
    input: { bloodGroup: "O-" as BloodGroup, component: "Whole Blood" as BloodComponent, city: "NonExistentCityXYZ", unitsRequired: 1, urgency: "immediate" as UrgencyLevel },
  },
  EC03_ZERO_INVENTORY: {
    name: "Zero inventory available batch handling",
    sampleInventoryId: "inv-depleted-test",
  },
  EC04_INSUFFICIENT_QUANTITY: {
    name: "Request quantity exceeds available units",
    input: { bloodGroup: "O-" as BloodGroup, component: "Packed Red Blood Cells (PRBC)" as BloodComponent, city: "Chittoor", unitsRequired: 50, urgency: "emergency" as UrgencyLevel },
  },
  EC05_EXPIRED_INVENTORY: {
    name: "Expired inventory excluded from smart matching",
    checkExpiry: (expiryDate: string) => new Date(expiryDate).getTime() < new Date("2026-04-01").getTime(),
  },
  EC06_STALE_RECORD: {
    name: "Stale inventory penalized in match scoring",
    staleThresholdHours: 24 * 7,
  },
  EC07_UNVERIFIED_FACILITY: {
    name: "Unverified facility fixture",
    facilityId: "fac-unv-16",
    expectedVerified: false,
  },
  EC08_DONOR_PAUSED: {
    name: "Donor participation paused",
    checkAvailable: false,
  },
  EC09_DONOR_CONSENT_WITHDRAWN: {
    name: "Donor consent withdrawn",
    consentStatus: "Withdrawn",
  },
  EC10_DEMO_1001_MATCHING: {
    fixtureId: "DEMO-1001",
    expectedCity: "Chittoor",
    expectedBloodGroup: "O-",
    expectedUnits: 2,
  },
  EC11_DEMO_1009_NO_MATCHES: {
    fixtureId: "DEMO-1009",
    expectedStatus: "no-matches",
    expectedUnits: 8,
  },
  EC12_DEMO_1010_FULFILLED: {
    fixtureId: "DEMO-1010",
    expectedStatus: "fulfilled",
  },
  EC13_DEMO_1008_CANCELLED: {
    fixtureId: "DEMO-1008",
    expectedStatus: "cancelled",
  },
};
