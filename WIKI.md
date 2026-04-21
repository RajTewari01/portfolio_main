# Nexus Portfolio WIKI

Welcome to the internal documentation for the Nexus portfolio build logic.

## 1. Setting up Supabase Backend
To configure the dynamic projects and credentials features:
1. Create a [Supabase](https://supabase.com/) project.
2. In the "SQL Editor", manually paste and execute the contents of `setup_supabase.sql`.
3. In your `.env.local` file, input the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` matching your project's API configs.
4. Execute `node scripts/ingest_vault.js` to automatically crawl your local pdf files and upload database stubs.

## 2. Setting up Google Authentication
To secure your `/admin` site:
1. Set up a [Firebase](https://firebase.google.com/) project and enable **Google authentication** in Identity Providers.
2. Supply your configuration object block via the `.env.local` settings marked by `NEXT_PUBLIC_FIREBASE_...` parameters.

## 3. Server Deployment
This codebase uses Next.js server-side API routes for sending automated emails natively. **Do not perform a static export**, as features will break.

- Suggested Hosting: Vercel or Render.
- Deployment Type: Edge servers or standard Node application build.
- Configuration: Sync `.env.local` identically to your deployment platform's Secret Manager.
