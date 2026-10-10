import { z } from "zod";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
const bloodComponents = [
  "Whole Blood",
  "Packed Red Blood Cells (PRBC)",
  "Platelets",
  "Fresh Frozen Plasma (FFP)",
  "Cryoprecipitate",
] as const;
const urgencies = ["immediate", "within-24h", "within-48h", "elective"] as const;

export const emergencyRequestSchema = z.object({
  requesterName: z
    .string()
    .min(3, "Requester name must be at least 3 characters")
    .max(80, "Name is too long"),
  requesterPhone: z
    .string()
    .min(7, "Please enter a valid phone number with area code")
    .regex(/^[\d\+\(\)\-\s]{7,20}$/, "Invalid phone number format"),
  requesterEmail: z.string().email("Please enter a valid email address"),
  patientName: z
    .string()
    .min(2, "Patient name is required for medical requisition tracking")
    .max(80, "Name is too long"),
  patientAge: z.coerce
    .number()
    .min(0, "Age must be valid")
    .max(125, "Please enter a valid age")
    .optional(),
  hospitalName: z
    .string()
    .min(3, "Hospital or clinical facility name is required"),
  hospitalAddress: z.string().optional(),
  city: z.string().min(2, "City / Location is required"),
  bloodGroup: z.enum(bloodGroups, {
    error: "Please select a valid blood group",
  }),
  component: z.enum(bloodComponents, {
    error: "Please select a valid blood component",
  }),
  unitsRequired: z.coerce
    .number()
    .min(1, "At least 1 unit is required")
    .max(50, "For massive transfusions (>50 units), contact regional command directly"),
  urgency: z.enum(urgencies, {
    error: "Please select an urgency classification",
  }),
  requiredDate: z.string().min(1, "Required fulfillment date is needed"),
  medicalReason: z
    .string()
    .min(5, "Please provide clinical context (e.g., Trauma, Postpartum Hemorrhage, Oncology, Surgery)")
    .max(500, "Notes cannot exceed 500 characters"),
  doctorName: z.string().optional(),
  doctorContact: z.string().optional(),
});

export type EmergencyRequestFormData = z.infer<typeof emergencyRequestSchema>;

export const donorRegistrationSchema = z.object({
  fullName: z.string().min(3, "Full legal or preferred name is required (min 3 chars)"),
  email: z.string().email("Valid email address required"),
  phone: z
    .string()
    .min(7, "Valid phone number required")
    .regex(/^[\d\+\(\)\-\s]{7,20}$/, "Invalid phone number format"),
  bloodGroup: z.enum(bloodGroups, {
    error: "Please select your blood group (or select closest if known)",
  }),
  city: z.string().min(2, "City is required for localized emergency matching"),
  state: z.string().min(2, "State/Province is required"),
  preferredContact: z.enum(["call", "sms", "whatsapp", "email"]),
  radiusKm: z.coerce.number().min(5, "Minimum 5 km").max(150, "Maximum 150 km"),
  consentEmergencyContact: z.literal(true, {
    error: "You must consent to receive critical emergency blood shortage notifications",
  }),
  medicalScreeningPassed: z.boolean().default(true),
  privacyShowPhonePublic: z.boolean().default(false),
});

export type DonorRegistrationFormData = z.infer<typeof donorRegistrationSchema>;

export const inventoryItemSchema = z.object({
  facilityId: z.string().min(1, "Facility selection is required"),
  facilityName: z.string().min(1, "Facility name is required"),
  city: z.string().min(1, "City is required"),
  bloodGroup: z.enum(bloodGroups),
  component: z.enum(bloodComponents),
  unitsAvailable: z.coerce.number().min(1, "Available units must be at least 1"),
  unitsReserved: z.coerce.number().min(0, "Reserved units cannot be negative").default(0),
  storageTempCelsius: z.string().min(1, "Storage temp is required (e.g. 2°C to 6°C)"),
  batchNumber: z.string().min(3, "Lot / Unit identification number is required"),
  collectionDate: z.string().min(1, "Collection date is required"),
  expiryDate: z.string().min(1, "Expiry date is required"),
  isVerified: z.boolean().default(true),
  status: z.enum(["available", "reserved", "depleted", "expired"]).default("available"),
});

export type InventoryItemFormData = z.infer<typeof inventoryItemSchema>;
