# ScamShield AI — Real-Time Phishing Link & QR Code Threat Analyzer

> **IEEE VIT Bhopal Hackathon 2026 · Build Beyond Boundaries**  
> **Track 04 · CYBERSECURITY: Problem Statement 04.1 ("The Scam That Almost Worked")**  
> **Submitted by Team D43M0N$**:
> - **Aastik Tripathi** (26BCY10090) — Security Architecture & Lead
> - **Palak Kalra** (26BCY10001) — NLP & Linguistic Intelligence
> - **Yash Raj Kushwaha** (26BCE10122) — Full-Stack & Cloud Integration
> - **Mangal Nath Yadav** (26BHI10047) — UPI Protocols & QR Pipeline

---

## 🎨 Minimalist UI/UX & ElevenLabs-Inspired Design System

ScamShield AI has been redesigned from the ground up with high-craft minimalism inspired by modern product layouts like ElevenLabs:

- **Collapsible Navigation Rail**: 64px compact icon rail or 256px expanded sidebar with live status indicator, emergency helpline card, and user profile.
- **Top Greeting & Header**: Announcement pill (`[New] IEEE Track 04.1...`), dynamic time-aware greeting (`Good morning / afternoon / evening, Analyst`), and `Have a question? [Ask AI Advisor]` interactive drawer.
- **Six Quick Action Cards**: Horizontal row of rounded cards for Instant scan, Domain guard, Message NLP, QR & UPI guard, Attack simulator, and Test benchmark.
- **Two-Column Section**:
  - **Left**: `Latest from the Threat Stream` with filter chips (All, Critical, UPI Fraud, Phishing), stylized avatars with verified threat badges, and one-click forensic loading.
  - **Right**: `Defense Engines & Verification` featuring wide action cards for Domain Guard, Reverse-Charge UPI Sentinel, and Multilingual Panic NLP.
- **QR Code Image Reader**: Client-side QR image decoding via `jsqr` and HTML5 canvas—drag & drop or upload any QR image to parse UPI intents instantly.

---

## 🌈 5 Selectable Color Base Themes (Light-Themed First)

1. ⚪ **Eleven Clean Light (Default)**: Crisp paper white (`#ffffff` surfaces on `#f9fafb` background) with slate accents (`#09090b`) and hairline borders (`#e4e4e7`).
2. 🟢 **Glass Mint & Emerald Light**: Calming mint background (`#f2fbf6`) with frosted white cards, emerald badges (`#059669`), and jade borders (`#d1fae5`).
3. 🟣 **Lavender Frost Light**: Subtle lilac background (`#fbf8ff`) with royal violet accents (`#7c3aed`) and soft amethyst borders (`#e9d5ff`).
4. 🟡 **Solar Sand & Warm Amber Light**: Warm ivory daylight (`#fffdf7`) with solar amber highlights (`#d97706`) and warm sand borders (`#fde68a`).
5. ⚫ **Obsidian Stealth Dark**: High-contrast cybersecurity dark terminal (`#09090b` onyx background, `#121216` cards, slate borders, and cyber emerald accents).

---

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript 5.8
- **Styling**: Tailwind CSS with custom CSS variables and glassmorphism tokens
- **Database**: **Firebase Realtime Database** (`firebase/database`) with live WebSocket synchronization
- **Authentication**: **Google Auth** (`firebase/auth` via `GoogleAuthProvider`)
- **Telemetry**: Google Analytics (`firebase/analytics` G-YLCSM4VQD4)
- **Protocols & Threat Engines**:
  - Homograph & Typosquatting Link Inspector (`sbl` vs `sbi`, unverified TLDs `.xyz`, `.top`)
  - Multilingual NLP Message Intelligence (Hindi देवनागरी, Hinglish, and English)
  - QR Code UPI Intent Inspector (catches "Scan to Receive Money" reverse-charge scam)
  - Automated 100-sample benchmark evaluation suite with 2x2 confusion matrix (98% accuracy)

---

## 📖 Documentation Files

- **Markdown Documentation**: [`DOCUMENTATION.md`](./DOCUMENTATION.md) — Comprehensive technical architecture, forensic engines, legal framework, and benchmark results.
- **Word Document**: [`DOCUMENTATION.docx`](./DOCUMENTATION.docx) — Professionally formatted Microsoft Word document with tables, callouts, and design system specifications.

---

## 🚀 Running the Web Application

The application is built and running live on **`http://localhost:3000`**.

### Development Mode:
```bash
npm run dev
```

### Production Mode:
```bash
npm run build
npm start
```
