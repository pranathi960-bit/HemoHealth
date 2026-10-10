# HEMOHEALTH
**Real-Time Blood Availability & Emergency Donor Coordination Platform**

> *"Every Drop Counts. Every Second Matters."*

HemoHealth is a specialized healthcare coordination platform engineered to eliminate critical blood shortages and logistical delays. It provides unified inventory visibility across certified hospitals and blood banks, deterministic component-specific compatibility matching, and rapid voluntary donor mobilization with strict healthcare privacy safeguards.

---

## 🌟 Key Features & Capabilities

### 1. 🩸 Real-Time Blood Inventory Discovery (`/find-blood`)
- Multi-parameter filtering by **Blood Group** (A+, A-, B+, B-, AB+, AB-, O+, O-), **Blood Component** (Whole Blood, PRBC, Platelets, FFP, Cryoprecipitate), and **Location / City**.
- Displays batch lots, storage temperature specifications (2-6°C, -20°C, 20-24°C agitated), expiry countdowns, and verification badges.
- In-app facility direct contact desk and immediate requisition routing.

### 2. ⚡ Emergency Blood Requisitions (`/request-blood`)
- Rapid triage form validated strictly with **Zod** schema.
- Assigns stable medical requisition identifiers (e.g., `REQ-2026-8941`).
- Real-time broadcast to regional hospital networks and volunteer notification queues.
- Immediate routing to live fulfillment timeline tracking.

### 3. 🎯 Smart Matching Engine — Signature Feature (`/smart-match`)
- Transparent, deterministic clinical compatibility algorithm.
- Component-specific biological rules:
  - **Packed Red Blood Cells (PRBC)**: Evaluates erythrocyte surface antigens (O- is Universal RBC Donor; AB+ is Universal RBC Recipient).
  - **Fresh Frozen Plasma (FFP)**: Evaluates plasma antibodies (AB is Universal Plasma Donor; O is Universal Plasma Recipient).
  - **Platelets & Cryoprecipitate**: ABO identity and crossmatch suitability.
- Multi-factor weighted composite scoring:
  - **Biological Compatibility** (35%)
  - **Location Proximity** (20%)
  - **Quantity Coverage** (15%)
  - **Data Freshness** (15%)
  - **Facility Verification & Accreditation** (15%)
- Explainable score breakdown with direct requisition dispatch actions.

### 4. 🛰️ Live Requisition Tracking (`/track-request`)
- Visual multi-stage fulfillment timeline:
  `Submitted` ➔ `Under Review` ➔ `Matching in Progress` ➔ `Response Received` ➔ `Fulfilled` (or `Cancelled`).
- Live unit offers list from certified depots and voluntary donors.
- Interactive stage simulator for QA and training evaluations.
- Printable clinical requisition slip formatted for hospital records.

### 5. 🤝 Volunteer Donor Registry & Dashboard (`/donors` & `/donors/dashboard`)
- Rapid onboarding with pre-screening health criteria and radius settings.
- Personal donor portal with instant emergency availability toggles (Active / Paused).
- Incoming emergency shortage invitations and one-click commitment confirmation.
- **Privacy By Design**: Telephone numbers and addresses are strictly sequestered behind protected platform dispatch channels.

### 6. 🏥 Hospital & Blood Bank Portal (`/hospitals` & `/hospitals/dashboard`)
- Facility directory featuring accredited blood transfusion centers.
- Operations dashboard for inventory management:
  - Add new lot batches with collection/expiry dates and storage temps.
  - Quick stock increment/decrement controls (+/-).
  - Mark lots as reserved, available, or depleted.
- Inbound emergency requisition triage feed with direct response dispatching.

### 7. 🛡️ Role-Based Authentication & Firebase Readiness (`/auth/login`)
- 1-click demonstration role switcher (Patient Requester, Volunteer Donor, Hospital Staff, Admin).
- Seamless data access layer supporting either demonstration state or live Firebase Authentication / Cloud Firestore.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 & Vanilla CSS Design Tokens
- **Icons**: Lucide React
- **Validation**: Zod
- **Animations & Effects**: Canvas Confetti & CSS Micro-Interactions
- **Persistence**: Layered Repository Pattern with LocalStorage sync & Firebase adapter
- **Security Rules**: Production Cloud Firestore Security Rules (`src/lib/firebase/firestore.rules`)

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18.17+ or 20+
- npm 9+

### Installation & Run Commands

1. **Clone & Install Dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

2. **Configure Environment Variables (Optional for demo mode)**:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

3. **Start Development Server**:
   \`\`\`bash
   npm run dev
   \`\`\`
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Run Production Build & Typecheck**:
   \`\`\`bash
   npm run build
   npm run start
   \`\`\`

---

## ☁️ Deployment Guide (Vercel Ready)

HemoHealth is fully optimized for one-click deployment on [Vercel](https://vercel.com).

### Deploying to Vercel via CLI
\`\`\`bash
npm i -g vercel
vercel
\`\`\`

### Environment Variables on Vercel
In your Vercel Project Settings ➔ Environment Variables, configure (if using live Firebase):
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

*If left unset, the platform seamlessly runs in high-fidelity Demonstration Mode with local data persistence.*

---

## 🧪 Testing Verification Checklist

| Test Flow | Status | Description |
|---|---|---|
| **Landing Page Navigation** | ✅ Passed | Hero section, compatibility matrix explorer, live stream cards, responsive drawer |
| **Find Blood Search & Filtering** | ✅ Passed | Filter by ABO/Rh, component, city, and verified facilities |
| **Emergency Requisition Validation** | ✅ Passed | Form validation via Zod, error handling, request ID assignment |
| **Smart Matching Calculation** | ✅ Passed | Component-specific biological rules, multi-factor scoring breakdown |
| **Request Tracking & Lifecycle** | ✅ Passed | Visual timeline transitions, offer commitments, slip printing |
| **Donor Registration & Privacy** | ✅ Passed | Screening questionnaire, availability toggle, phone masking |
| **Hospital Inventory Operations** | ✅ Passed | Adding lots, stock count adjustments, triage response dispatch |
| **Production Build & Type Check** | ✅ Passed | Zero TypeScript or compilation errors (`next build` exited with code 0) |

---

## ⚖️ Clinical & Legal Disclaimer

HemoHealth is a software coordination tool for blood resource discovery. It is **not** an emergency medical dispatch service (EMS/911/112) and does not replace certified laboratory crossmatching or clinical decisions by licensed physicians.
