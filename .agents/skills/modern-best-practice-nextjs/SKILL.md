---
name: modern-best-practice-nextjs
description: Build modern Next.js apps with App Router and best practices
---

# Next.js Best Practices (App Router)

Next.js changes frequently. Before writing Next.js code in this repository,
read the relevant guide in `node_modules/next/dist/docs/`; use Context7 or the
`docs-explorer` agent when additional current documentation is needed.

## Routing & Structure

- Use the App Router in `app/` for new work
- Use nested layouts and route groups to organize sections
- Keep server components as the default; add `'use client'` only where needed

## Data Fetching & Caching

- Fetch data in React Server Components - AVOID fetching via `useEffect()` and `fetch()`
- Use server actions ("Server Functions") for mutations, potentially in conjunction with React Hooks like `useActionState`

## UI States

- Provide `loading.tsx` and `error.tsx` for route-level UX
- Use `Suspense` boundaries around async UI

## Metadata & SEO

- Use the Metadata API in layouts and pages
- Prefer static metadata when possible; keep dynamic metadata minimal
