# 05 — Environment

This app needs exactly three environment variables:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...   # Clerk frontend key (public)
CLERK_SECRET_KEY=sk_...                    # Clerk server key (secret)
API_URL=https://<api-host>                 # backend origin, WITHOUT /api/v1 (server-only)
```

- `API_URL` has **no `NEXT_PUBLIC_` prefix** on purpose: the API is called exclusively server-side (`lib/api`), so the value never needs to reach the browser. `apiFetch` appends `/api/v1` itself.
- No database URLs, no Stripe/Cloudinary/Resend keys — those live in the backend. The Cloudinary cloud name/API key arrive per-upload from [`POST /admin/uploads/signature`](../integration/admin/10-uploads.md).

## `lib/env.ts` — validated singleton (phase 1)

Never read `process.env` directly in app code. `lib/env.ts` parses the variables with Zod once at startup and throws immediately if any are missing:

```ts
import "server-only";
import { z } from "zod";

const envSchema = z.object({
  API_URL: z.url(),
  CLERK_SECRET_KEY: z.string().min(1),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
});

export const env = envSchema.parse({
  API_URL: process.env.API_URL,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
});
```

(Clerk's own SDK reads its two variables from `process.env` directly — that's fine; the schema exists so a missing key fails fast and loudly.)

## Local setup

1. Copy the three variables into `.env` at the repo root (never commit it).
2. `bun install`
3. `bun dev`

## Deploy

- Build with `bun run build`; the app is a standard Next.js 16 deployment (e.g. Vercel).
- Set the same three variables in the hosting environment; use the production Clerk instance keys and the production API origin.
