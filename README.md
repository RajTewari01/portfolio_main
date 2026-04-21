# NEXUS — Enterprise Portfolio Platform

> **A high-performance, full-stack portfolio engineered on Next.js 16 (App Router), React 19, and Three.js — featuring 3D WebGL rendering, cinematic scroll animations, a fortified 3-Factor Authentication admin vault, and edge-deployed serverless APIs.**

[![Build](https://github.com/RajTewari01/portfolio_main/actions/workflows/build.yml/badge.svg)](https://github.com/RajTewari01/portfolio_main/actions/workflows/build.yml)
[![Lint](https://github.com/RajTewari01/portfolio_main/actions/workflows/lint.yml/badge.svg)](https://github.com/RajTewari01/portfolio_main/actions/workflows/lint.yml)
[![Security](https://github.com/RajTewari01/portfolio_main/actions/workflows/security.yml/badge.svg)](https://github.com/RajTewari01/portfolio_main/actions/workflows/security.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-C9A96E.svg)](LICENSE)

**Live** → [biswadeeptewari.vercel.app](https://biswadeeptewari.vercel.app)

---

## Why Nexus?

Most portfolios are static HTML templates. **Nexus** is an architected platform — a showcase of real engineering depth, not just design polish. Every animation is physics-driven, every API route is edge-optimized, and the admin dashboard is protected by hardware-level biometrics.

---

## System Architecture

```mermaid
graph TB
    subgraph Client["Client Layer"]
        direction TB
        HERO["3D WebGL Canvas<br/>React Three Fiber + GLSL"]
        SCROLL["Scroll Engine<br/>Lenis + GSAP ScrollTrigger"]
        UI["App Router Pages<br/>Next.js 16 + React 19"]
    end

    subgraph Edge["Edge API Layer"]
        direction TB
        AUTH_API["/api/admin/*<br/>Authentication Routes"]
        OTP_API["/api/admin/send-otp<br/>Nodemailer SMTP"]
        VERIFY["/api/admin/verify-*<br/>JWT Session Control"]
    end

    subgraph Auth["3-Factor Authentication"]
        direction LR
        F1["Factor 1<br/>Firebase Google OAuth<br/>Whitelisted Emails"]
        F2["Factor 2<br/>WebAuthn Passkey<br/>Hardware Biometrics"]
        F3["Factor 3<br/>Email OTP<br/>TOTP via Nodemailer"]
    end

    subgraph Data["Data Layer"]
        SUPA[("Supabase Postgres<br/>Projects + Certificates")]
        FIRE[("Firebase Firestore<br/>Auth State + Metadata")]
        STATIC["Static PDF Vault<br/>/public/certificates/"]
    end

    Client --> Edge
    Edge --> Auth
    Edge --> Data
    UI --> HERO
    UI --> SCROLL
    AUTH_API --> F1
    AUTH_API --> F2
    OTP_API --> F3
    VERIFY --> SUPA
    VERIFY --> FIRE
```

---

## Core Modules

### Cinematic Frontend

| Feature | Implementation |
|---|---|
| **3D Background** | React Three Fiber + custom GLSL vertex/fragment shaders with ambient point lights |
| **Parallax Hero** | Perspective-driven sticky scroll with dynamic scale, blur, and rotation transforms |
| **SVG Mask Reveal** | `clip-path: circle()` with eased scroll-driven expansion using `getBoundingClientRect()` |
| **Infinite Marquee** | CSS `@keyframes` with `IntersectionObserver` trigger — zero JS scroll dependencies |
| **Smooth Scroll** | Lenis scroll engine with custom easing: `1.001 - 2^(-10t)` |

### Credential Vault

| Feature | Implementation |
|---|---|
| **PDF Previews** | Native `<iframe>` on desktop, Google Docs Viewer proxy on mobile |
| **Responsive Grid** | 8 cards on mobile (`< 768px`), 16 on desktop, with "View All" pagination |
| **Dynamic Fetch** | Supabase Postgres with realtime subscription fallback to static `/public/certificates/` |

### 3-Factor Admin Authentication

```mermaid
sequenceDiagram
    participant U as Admin
    participant C as Client
    participant S as Edge API
    participant G as Firebase
    participant W as WebAuthn
    participant M as Nodemailer

    U->>C: Navigate to /admin
    C->>G: Google OAuth Sign-In
    G-->>C: UID + Email
    C->>C: Verify email ∈ whitelist
    Note over C: Factor 1 ✓

    C->>W: navigator.credentials.create()
    W-->>C: PublicKeyCredential
    Note over C: Factor 2 ✓

    C->>S: POST /api/admin/send-otp
    S->>M: Generate 6-digit TOTP
    M-->>U: Email delivered
    U->>C: Enter OTP
    C->>S: POST /api/admin/verify-otp
    S-->>C: JWT Session Token
    Note over C: Factor 3 ✓

    C->>S: Authenticated API calls
    S->>S: Verify JWT on every request
```

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 16 (App Router), React 19, TypeScript 5 |
| **3D / Animation** | React Three Fiber, Three.js, GSAP, Lenis, Framer Motion |
| **Styling** | Tailwind CSS 4, CSS Variables, Custom Design Tokens |
| **Authentication** | Firebase Auth v12, WebAuthn/FIDO2, Nodemailer |
| **Database** | Supabase (Postgres), Firebase Firestore |
| **Deployment** | Vercel Edge Functions, GitHub Actions CI/CD |
| **Security** | JWT Sessions, TOTP, Hardware Biometrics, Email Whitelist |

---

## Quick Start

```bash
# Clone
git clone https://github.com/RajTewari01/portfolio_main.git
cd portfolio_main

# Install
npm ci

# Configure environment
cp .env.local.example .env.local
# Edit .env.local with your credentials

# Initialize database
# Run setup_supabase.sql in Supabase SQL Editor

# Launch
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anonymous key |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | ✅ | Firebase Web API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | ✅ | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ✅ | Firebase project ID |
| `EMAIL_USER` | ✅ | Gmail address for OTP delivery |
| `EMAIL_PASS` | ✅ | Gmail App Password (not account password) |
| `JWT_SECRET` | ✅ | Secret key for JWT session signing |
| `ADMIN_PIN` | ✅ | 6-digit admin verification PIN |

---

## CI/CD Pipeline

```mermaid
graph LR
    PUSH["git push"] --> LINT["Lint<br/>ESLint + TSC"]
    PUSH --> BUILD["Build<br/>Node 20 + 22 Matrix"]
    PUSH --> SEC["Security<br/>npm audit"]
    PR["Pull Request"] --> LH["Lighthouse<br/>Performance Audit"]
    PR --> LINT
    PR --> BUILD
    LINT --> PASS{All Green?}
    BUILD --> PASS
    SEC --> PASS
    PASS -->|Yes| DEPLOY["Vercel<br/>Auto Deploy"]
    PASS -->|No| BLOCK["Block Merge"]
```

| Workflow | Trigger | What It Does |
|---|---|---|
| `lint.yml` | Push + PR | ESLint analysis + TypeScript strict validation |
| `build.yml` | Push + PR | Production build across Node 20 & 22 matrix |
| `security.yml` | Push + PR + Weekly | NPM dependency audit + license compliance |
| `lighthouse.yml` | PR only | Lighthouse performance scoring with artifact upload |

---

## Project Structure

```
├── .github/workflows/     # CI/CD pipeline definitions
├── public/
│   ├── certificates/      # Static PDF credential vault
│   └── profile.jpg        # Hero section avatar
├── scripts/
│   └── ingest_vault.js    # Supabase certificate ingestion
├── src/
│   ├── app/
│   │   ├── admin/         # 3FA admin dashboard
│   │   ├── api/admin/     # Edge API routes
│   │   ├── hire/          # Contact & hiring page
│   │   └── page.tsx       # Root composition
│   ├── components/
│   │   ├── ParallaxHero   # 3D sticky scroll hero
│   │   ├── AboutSection   # SVG mask reveal + skills
│   │   ├── ProjectsSection # Dynamic project grid
│   │   ├── CertificatesSection # PDF vault + pagination
│   │   ├── SkillsMarquee  # Infinite CSS marquee
│   │   ├── ThreeCanvas    # WebGL background
│   │   └── ContactSection # Form + social links
│   └── lib/
│       ├── supabase.ts    # Database client
│       └── firebase.ts    # Auth client
├── setup_supabase.sql     # Database schema
├── vercel.json            # Deployment routing
└── LICENSE                # MIT
```

---

## License

MIT © 2026 **Biswadeep Tewari**

See [LICENSE](LICENSE) for full terms.
