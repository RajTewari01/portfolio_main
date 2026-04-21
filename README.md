# Nexus: Enterprise Developer Portfolio

An elite, high-performance web portfolio built on **Next.js 16 (App Router)** and **React 19**, designed to showcase 3D kinematics, server-side dynamic credential verification, and a fortified 3-Factor Multi-Authentication Admin Dashboard.

![Nexus Portfolio](public/hero_bg.png)

## Architecture & Stack
- **Framework:** Next.js 16 (App Router), React 19
- **Graphics Engine:** Three.js, React Three Fiber
- **Animation System:** GSAP (ScrollTrigger), Framer Motion
- **Database Vault:** Supabase
- **Identity Provider:** Firebase v12
- **Hardware Security Flow:** Native WebAuthn API (Biometrics)

## Core Features

- **Kinematic & 3D Hero Render:** A seamless `Lenis` smooth-scroll architecture backed by dynamic ambient point lights and parallaxing elements.
- **Dynamic Credentials Vault:** Automatically generates functional previews of PDF credentials retrieved directly via the Supabase cache layer, featuring client-side pagination.
- **Tier-3 Authentication Dashboard:** 
  1. Google Auth Identity Whitelist (Firebase)
  2. Native Hardware passkeys securely invoked by the `navigator.credentials` standard.
  3. One-Time Emailed Cipher (NodeMailer)
- **Database Driven Operations:** Live dynamic projects pulled instantly from the backend, modifiable seamlessly directly through the authenticated admin portal.

## Local Installation

Ensure Node.js 20+ is installed on your system.

```bash
git clone https://github.com/RajTewari01/portfolio_main.git
cd portfolio_main
npm install
npm run dev
```

Navigate to `http://localhost:3000`.

## Configuration (Environment)

To properly orchestrate the full backend capability, copy the `.env.local.example` structure locally into a `.env.local` file and fill the missing variables. 
Reference `WIKI.md` for specific instructions on obtaining Firebase, Supabase, and Mail transport tokens.

## License

This software is strictly licensed under the **MIT License**.

*(c) 2026 Biswadeep Tewari*
