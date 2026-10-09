# ScamShield AI — Technical Architecture & Redesign Documentation

> **IEEE VIT Bhopal Hackathon 2026 · Build Beyond Boundaries**  
> **Track 04 · CYBERSECURITY: Problem Statement 04.1 ("The Scam That Almost Worked")**  
> **Engineering Team: D43M0N$**  
> - **Aastik Tripathi** (26BCY10090) — Security Architecture & Project Lead  
> - **Palak Kalra** (26BCY10001) — NLP & Linguistic Intelligence  
> - **Yash Raj Kushwaha** (26BCE10122) — Full-Stack & Cloud Integration  
> - **Mangal Nath Yadav** (26BHI10047) — UPI Protocols & QR Pipeline  

---

## 1. Executive Summary & Problem Context

In India, over **10,000+ financial cyber fraud complaints** are registered daily across banking and UPI payment ecosystems. Conventional cybersecurity solutions focus heavily on server-side patch management, network firewalls, and post-theft forensic logging. However, modern financial fraud succeeds not through zero-day vulnerabilities in payment gateways, but through **social engineering and psychological urgency**.

Attackers exploit human fear and manufactured panic:
- **Fake Electricity/Utility Disconnection Notices** (threatening immediate power shut-off tonight at 9:30 PM).
- **Phishing Banking Links** using homoglyphs and typosquatted domains (e.g., `sbl-kyc-update.xyz` mimicking `sbi.co.in`).
- **Reverse-Charge QR Code Scams** claiming "Scan this QR code to receive your ₹5,000 cashback or refund", tricking citizens into approving a debit transaction by entering their UPI PIN.

**ScamShield AI** is an autonomous, pre-click Zero-Trust defense platform designed to neutralize financial fraud vectors **before** credentials travel across the wire and **before** UPI debit authorization occurs.

---

## 2. Minimalist UI/UX Redesign & Design System

The platform has been reworked from the ground up, embracing a **high-craft minimalist SaaS design system** directly inspired by the ElevenLabs product interface.

### 2.1 Aesthetic Philosophy
- **Light-Themed Elegance**: Immaculate whitespace, gentle 1px hairline borders, subtle micro-elevations (`shadow-[0_1px_3px_rgba(0,0,0,0.03)]`), and crisp sans-serif typography.
- **Glassmorphism Panels**: Translucent frosted surfaces (`backdrop-blur-md bg-white/85 border border-zinc-200/80`) that deliver tactile depth without visual clutter.
- **Micro-Interactions**: Smooth 200ms cubic-bezier transitions, pill badges, and elevated hover states.

### 2.2 Color Theme System (5 Distinguishable Palettes)
ScamShield AI features 5 distinct, selectable themes with persistent `localStorage` synchronization:
1. ⚪ **Eleven Clean Light (Default)**: Crisp paper white (`#ffffff` surfaces on `#f9fafb` background) with slate accents (`#09090b`) and refined graphite borders (`#e4e4e7`).
2. 🟢 **Glass Mint & Emerald Light**: Calming mint background (`#f2fbf6`) with frosted white cards, emerald badges (`#059669`), and jade border accents (`#d1fae5`).
3. 🟣 **Lavender Frost Light**: Subtle lilac background (`#fbf8ff`) with royal violet accents (`#7c3aed`) and soft amethyst borders (`#e9d5ff`).
4. 🟡 **Solar Sand & Warm Amber Light**: Warm ivory daylight (`#fffdf7`) with solar amber highlights (`#d97706`) and warm sand borders (`#fde68a`).
5. ⚫ **Obsidian Stealth Dark**: High-contrast cybersecurity dark terminal (`#09090b` onyx background, `#121216` cards, `#27272a` borders, and cyber emerald accents).

### 2.3 Layout Structure (ElevenLabs-Inspired Composition)
1. **Collapsible Left Navigation Rail**:
   - Compact 64px icon rail or expanded 256px sidebar.
   - Branding: Minimalist Shield logo + `ScamShield AI` + `[ | ]` rail collapse toggle.
   - Nav Links: `Home / Overview`, `Threat Library (Live)`, `Playground & Inspector`, `Investigation & Simulation`.
   - Utility Footer: Color theme switcher, Language toggle (EN / हिन्दी), 1930 Cyber Helpline quick card, and Google Auth account pill.
2. **Top Header & Announcement**:
   - Announcement Pill: `[New] IEEE Track 04.1 · Zero-Trust Phishing & UPI Defense Platform →`.
   - Dynamic Greeting: `Good morning / afternoon / evening, Analyst` (or user's first name).
   - Top-Right Action: `Have a question? [Ask AI Advisor]` with an iridescent sparkling gradient badge.
3. **Six Hero Quick Action Cards**:
   - Directly matching the ElevenLabs 6-card row:
     1. `Instant scan` (Multi-vector Omni Scanner)
     2. `Domain guard` (Homograph & typosquatting inspector)
     3. `Message NLP` (Multilingual Hindi/English urgency engine)
     4. `QR & UPI guard` (Reverse-charge debit detector)
     5. `Attack simulator` (4-stage attack anatomy)
     6. `Test benchmark` (100-sample test suite & confusion matrix)
4. **Two-Column Lower Section**:
   - **Left Column**: `Latest from the Threat Stream` — Filterable list of live threat signatures with colorful circular avatars, verified checkmark badges, risk percentages, and one-click forensic loading.
   - **Right Column**: `Defense Engines & Verification` — 3 wide rectangular cards with soft rounded corners covering Domain Forensics, Reverse-Charge UPI Sentinel, and Multilingual Panic NLP.
5. **Interactive AI Cyber Advisor**:
   - Slide-over drawer answering queries regarding Indian cyber laws (IT Act Section 66D), Golden Hour protocols, homograph mechanics, and reverse QR scams.

---

## 3. Core Forensic & Threat Engines

### 3.1 URL & Domain Guard (`lib/analyzers/urlAnalyzer.ts`)
- **Homoglyph & Punycode Inspection**: Detects visually deceptive character substitutions (e.g., lowercase `l` replacing `i` in `sbl` vs `sbi`, Cyrillic characters, zero-width characters).
- **Domain Age Analysis**: Flags domains registered under 7 to 30 days old (`.xyz`, `.top`, `.tk`, `.live`, `.buzz`).
- **Brand Registry Matching**: Compares targets against authorized banking domains (State Bank of India, HDFC Bank, ICICI Bank, BESCOM/Discom portals).
- **Transport Security**: Penalizes plain HTTP endpoints harvesting banking credentials.

### 3.2 Multilingual Panic NLP Engine (`lib/analyzers/nlpEngine.ts`)
- **Language Detection**: Automatically handles English, Hindi (देवनागरी), and Hinglish messages.
- **Urgency & Pressure Scoring**: Quantifies psychological manipulation triggers (e.g., "तुरंत", "आज रात 9:30 बजे", "account blocked", "within 24 hours", "debit card suspended").
- **Authority Impersonation**: Detects simulated institutional authority (SBI, YONO, Electricity Board, Income Tax Dept, TRAI).
- **Composite NLP Threat Index**: Weighted aggregation of urgency (40%), impersonation (35%), and call-to-action anomalies (25%).

### 3.3 Reverse-Charge UPI & QR Sentinel (`lib/analyzers/qrInspector.ts`)
- **UPI URI Intent Parsing**: Breaks down standard `upi://pay` strings into payee VPA (`pa`), payee name (`pn`), amount (`am`), transaction note (`tn`), and currency (`cu`).
- **Reverse-Charge Anomaly Detection**: In the Unified Payments Interface (UPI) protocol, **scanning a QR code or entering a UPI PIN strictly debits funds**. When transaction notes or payee names claim "Scan to receive cashback" or "Refund authorization", the sentinel triggers a critical warning.
- **VPA Masquerade Verification**: Distinguishes institutional merchant handles from individual mule VPAs (e.g., claiming to be "Electricity Department" but routing to `utilitybill29@okaxis`).
- **Client-Side Image Decoding (`lib/qrDecoder.ts`)**: Integrates `jsqr` with an HTML5 canvas pipeline to parse QR images directly on the user's browser without transferring images to external servers.

### 3.4 Zero-Trust Threat Synthesis (`lib/analyzers/threatScorer.ts`)
- Aggregates multi-vector telemetry into a single **Zero-Trust Trust Index** (0–100) and **Threat Score** (0–100).
- Generates bilingual threat summaries (English & Hindi) and actionable step-by-step remediation protocols.

---

## 4. Attack Progression Simulation (IEEE Track 04.1 Anatomy)

ScamShield models and visually simulates the 4 stages of social engineering fraud:

| Stage | Name | Attack Vector Mechanism | ScamShield Zero-Trust Intervention |
|---|---|---|---|
| **01** | **Initial Contact** | Unsolicited SMS/WhatsApp from unknown 10-digit number. | Inbound metadata inspection & link pre-screening. |
| **02** | **Cognitive Exploitation** | Manufactured urgency & 24-hr panic deadline ("Account blocked tonight"). | **Autonomous Pre-Click Interception**: NLP flags emotional coercion before user clicks. |
| **03** | **Credential Harvesting** | Pixel-perfect cloned portal (`sbl-kyc-update.xyz`). | Domain guard blocks destination; flags disposable TLD and homograph mismatch. |
| **04** | **Capital Extraction** | Rapid, irreversible UPI transfer to mule account. | **Neutralized**: Zero-Trust prevents credential input and payment authorization. |

---

## 5. Live Telemetry & Automated Benchmark Suite

### 5.1 Firebase Realtime Database Telemetry (`lib/firebase.ts`)
- Live WebSocket synchronization using Firebase Realtime Database (`threat_reports`).
- Dual-mode resilience: connects to cloud database with automatic failover to local in-memory cache when offline.
- Citizen threat broadcasting modal with instant network propagation.

### 5.2 100-Sample Model Evaluation Suite (`lib/analyzers/dataset.ts`)
- Evaluates 50 malicious scam vectors (banking clones, utility SMS, reverse-charge QR) against 50 verified legitimate transactions.
- **Performance Metrics**:
  - **Accuracy**: 98.0%
  - **Precision**: 98.0%
  - **Recall**: 98.0%
  - **F1-Score**: 98.0%
- **2×2 Confusion Matrix**:
  - **True Positives (TP)**: 49 / 50
  - **False Positives (FP)**: 1 / 50
  - **False Negatives (FN)**: 1 / 50
  - **True Negatives (TN)**: 49 / 50

---

## 6. Regulatory & Legal Framework

ScamShield AI aligns directly with statutory Indian cyber security guidelines:
- **Information Technology Act, 2000 — Section 66D**: Penalizes cheating by personation by using computer resources (imprisonment up to 3 years and fines up to ₹1,00,000).
- **National Cyber Crime Helpline (1930)**: Promotes the critical **2-hour Golden Hour window** to freeze transacted capital in mule accounts before ATM withdrawal.
- **DoT Chakshu Portal (`sancharsaathi.gov.in`)**: Provides direct referral instructions for citizen reporting of fraudulent telecom identifiers.

---

## 7. Technical Stack & Deployment

- **Framework**: Next.js 15 (App Router, Server Components + Client Interactive Views)
- **Language**: TypeScript 5.8
- **Styling**: Tailwind CSS with custom design tokens (`--surface`, `--surface-glass`, `--tile-bg`)
- **Icons**: Lucide React
- **Cloud Database**: Firebase Realtime Database (`firebase/database`)
- **Authentication**: Firebase Authentication with Google Auth Provider (`firebase/auth`)
- **QR Decoding**: Client-Side `jsqr` canvas integration
- **Testing**: 100-sample automated benchmark test harness

### Local Setup Instructions:
```bash
# 1. Install dependencies
npm install

# 2. Build production assets
npm run build

# 3. Launch the production server
npm start
```
The application will be live at `http://localhost:3000`.
