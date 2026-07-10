# 02 — Tech Stack

Versions are pinned by `package.json` / `bun.lock` — check there for exact numbers.

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 16 (App Router, Turbopack) | **Breaking changes vs. training data** — read `node_modules/next/dist/docs/` before writing Next.js code (see `AGENTS.md`) |
| Language | TypeScript 5 | strict mode, no `any` |
| Runtime / package manager | Bun | Never `npm`, `npx`, or `yarn` — use `bun` / `bunx` everywhere |
| UI runtime | React 19 | `useActionState`, `useFormStatus` |
| Styling | Tailwind CSS v4 | CSS-first: theme in `app/globals.css` `@theme`; **no `tailwind.config.*`** |
| Components | shadcn/ui, style `base-nova` | Built on **`@base-ui/react` — NOT Radix.** Anatomy/data-attributes differ; check the generated file, don't assume Radix docs |
| Icons | lucide-react | Always import with the `Lucide` prefix (`LucideSearch`) |
| Auth | Clerk `@clerk/nextjs` v7 + `@clerk/ui` | Session token = the API Bearer token |
| URL state | nuqs v2 | Type-safe search params; one schema per feature |
| Charts | Recharts v3 | Dashboard + analytics only |
| Toasts | sonner | Driven by the shared `Form` / `RedirectToast` components |
| Validation | Zod v4 | See [conventions/06-code-style.md](../conventions/06-code-style.md) for v4 gotchas |
| Theming | next-themes | Light/dark toggle |

## What each library is for

- **Next.js 16** — Server Components render API data; Server Actions carry mutations to the API. This app has no route handlers of its own.
- **Bun** — install (`bun add`), scripts (`bun dev`, `bun run build`), tooling (`bunx shadcn@latest add <item>`).
- **Clerk** — sign-in and session. The backend accepts the Clerk session JWT as its Bearer token; roles are read from `publicMetadata.role`.
- **nuqs** — the URL is the only source of truth for filters/sort/pagination/search.
- **Zod v4** — pre-flight validation in Server Actions, mirroring the API's documented request bodies exactly.

## Forbidden / non-choices

- **No `npm` / `npx` / `yarn`** — including inside `package.json` scripts and CI.
- **No `src/` folder** — all source lives at the repo root (`@/*` maps to `./`).
- **No client-side data fetching for page data** — Server Components call the API server-side. The single exception: the browser-direct Cloudinary upload ([conventions/05-media.md](../conventions/05-media.md)).
- **No `useState` for filter/sort/pagination** — nuqs only.
- **No `any`** — use `unknown` and narrow with Zod or type guards.
- **No `tailwind.config.js/ts`** — Tailwind v4 is configured in CSS.
- **No data-layer libraries** — no Prisma, no TanStack Query/Table; the server-fetch + nuqs model covers the dashboard's needs.
