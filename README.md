# Firmify

Legal document automation for India — [wonder.legal](https://www.wonder.legal)-style. Users pick a
law-firm drafted contract or policy, answer a guided questionnaire with conditional logic, watch the
document assemble live, pay (or use a subscription pack), and download it as Word/PDF or e-sign it.

## Stack

| Layer | Choice |
| --- | --- |
| Frontend | Next.js (App Router) + Tailwind CSS |
| Database | Supabase Postgres, managed with Drizzle (migrations only) |
| Auth | Supabase Auth via `@supabase/ssr` (email/password, Google OAuth-ready) |
| Data access | `supabase-js` with the user's JWT — **RLS enforced everywhere, no service-role key** |
| Payments (planned) | Razorpay |
| E-sign (planned) | Leegality / Digio |

## Getting started

```bash
cp .env.example .env        # fill in the Supabase values
npm install
npm run db:migrate          # apply schema + RLS policies + auth trigger
npm run db:seed             # load the catalogue and demo questionnaires
npm run dev                 # http://localhost:3000
```

Supabase project requirements: email auth enabled; for local testing either disable
"Confirm email" (Authentication → Sign In / Providers → Email) or configure custom SMTP —
the built-in mailer is rate-limited to ~2 emails/hour.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` / `build` / `start` | Standard Next.js |
| `npm run db:generate` | Generate a migration from `src/db/schema.ts` changes |
| `npm run db:migrate` | Apply migrations in `drizzle/` to the database |
| `npm run db:seed` | Upsert categories, packs, the 224-document catalogue and the demo questionnaires (idempotent — re-run after editing templates) |
| `npm run db:studio` | Drizzle Studio against the database |

## How it works

The core is a pure function — `render(template, answers)` in `src/lib/render.ts`. A template is a
**clause tree**: questions (with `showIf` conditions) plus clauses carrying `includeIf` conditions,
wording `variants` and `repeatOver` groups. One structured representation drives the live preview,
the gated (watermarked) preview, and the Word/PDF output — so they can never disagree.

Templates are versioned (`template_versions` is append-only) and every user document pins the exact
version it was generated from, so later template edits never change already-created documents.
The clause text lives **only** in `template_versions`, which has no client RLS policies — the paid
content is unreadable from the browser by design.

Drafts autosave to the `documents` table when signed in (owner-scoped RLS); anonymous visitors use
localStorage, and their drafts migrate to the DB on sign-in.

## Project structure

```
drizzle/                  SQL migrations (incl. RLS policies + auth→profile trigger)
scripts/seed.ts           Catalogue + demo questionnaire seeder
src/
  app/                    Routes: home, all-documents, category/, page/, packs,
                          document/, create/ (wizard), checkout/, success/,
                          dashboard, resources, help/, legal/, city/, esign/,
                          auth/ (OAuth + email-confirm callbacks), admin (stub)
  components/
    shell/                Site chrome: nav, footer, auth modal, chat, draft float
    wizard/               DocumentWizard — questionnaire + live/gated preview
  data/                   Catalogue (categories, 224 documents, packs) and FAQ content
  db/schema.ts            Drizzle schema — single source of truth for the database
  lib/
    render.ts, types.ts   The clause-tree template engine
    templates/            Authored demo questionnaires (one per main category)
    store.tsx             Client state: session, drafts, demo entitlements
    documentsApi.ts       RLS-scoped reads/writes for the documents table
    supabase/             Browser + server Supabase clients
  proxy.ts                Session refresh on navigation (Next middleware)
```

## Status

Working: full public site, auth, DB-backed drafts, 4 demo questionnaires (Employment Contract,
Vendor Agreement, Founders' Agreement, Residential Rent Agreement), simulated checkout/entitlements.

Next phases: server-side gated rendering, real DOCX/PDF generation, Razorpay, e-sign, admin CMS.
