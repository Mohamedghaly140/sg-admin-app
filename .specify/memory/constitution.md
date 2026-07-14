<!--
Sync Impact Report
- Version change: [TEMPLATE] → 1.0.0 (initial ratification)
- Modified principles: n/a (first concrete version; template placeholders replaced)
- Added sections:
  - Core Principles: I. API Contract Is Law, II. Next.js-First Architecture
    (NON-NEGOTIABLE), III. Documented Conventions Over Improvisation,
    IV. Verify Before You Build, V. Quality Gates Without a Test Suite
  - Security & Data Handling
  - Development Workflow
  - Governance
- Removed sections: none (template placeholder slots only)
- Templates requiring updates:
  - .specify/templates/plan-template.md — ✅ compatible, no change needed
    (Constitution Check gate is filled dynamically per feature)
  - .specify/templates/spec-template.md — ✅ compatible, no change needed
    (generic, no test-mandate conflict)
  - .specify/templates/tasks-template.md — ✅ compatible, no change needed
    (tests already marked OPTIONAL, matching Principle V)
  - .claude/skills/speckit-*/SKILL.md — ✅ no CLAUDE-only or stale references
    found outside this file's own instructions
- Follow-up TODOs: none
-->

# SG Couture Admin Dashboard Constitution

## Core Principles

### I. API Contract Is Law

The backend REST API is the single source of truth for data, validation, and
business rules. Endpoints and fields not documented in `docs/integration/admin/`
MUST NOT be invented or assumed. Error handling MUST branch on the response
`code`, never on `message`. Server-owned fields (`slug`, `priceAfterDiscount`,
`sold`, ratings, order totals, `usedCount`, etc.) MUST NOT be sent in request
bodies. This app has no database and no backend of its own — it is a pure
client of that contract.

**Rationale**: The admin dashboard and the backend are separately deployed and
separately owned. Drifting from the documented contract produces silent
integration bugs that only surface at runtime against the real API.

### II. Next.js-First Architecture (NON-NEGOTIABLE)

Reads MUST go through Server Components calling the server-only `apiFetch`
helper (fresh Clerk session token per request as `Authorization: Bearer`).
Mutations MUST be Server Actions returning `ActionState` (Zod parse →
`apiFetch` → `revalidatePath` + `toActionState`; errors via
`fromErrorToActionState`; never throw except for `redirect`/`notFound`). URL
state (filters, sort, pagination, search) MUST use nuqs (`useQueryStates`,
`shallow: false`) with one params schema per feature — never `useState` for
this data. Client-side data fetching, `useEffect` data loading, and
client-state-for-server-data patterns are prohibited wherever a Next.js-native
alternative exists.

**Rationale**: This is what "senior Next.js developer" architecture means in
this repo — App Router idioms end-to-end, not generic React/Express habits
transplanted onto Next.js.

### III. Documented Conventions Over Improvisation

Established patterns in `docs/conventions/` and `docs/architecture/` MUST be
followed exactly rather than re-derived per feature: one Server Action per
file, Zod schemas as whitelists mirroring the API body, `formData.getAll(...)`
for multi-value fields, shared `Form`/`FormControl`/`SubmitButton` for forms,
`ConfirmDialog` for destructive actions, kebab-case filenames,
`<Name>Feature` default exports, `<Component>Props` prop-type naming,
`Lucide`-prefixed icon imports, shadcn `base-nova` on `@base-ui/react` (not
Radix), and Tailwind v4 CSS-first theming (no `tailwind.config.*`). Bun is the
only package manager and script runner — never `npm`, `npx`, or `yarn`.

**Rationale**: A small admin dashboard with no test suite relies on
consistency, not tests, to stay maintainable. Deviating per-feature compounds
into an unreviewable codebase.

### IV. Verify Before You Build

Before assuming a piece of infrastructure exists (`lib/api/`, `lib/env.ts`,
`proxy.ts`, a given `features/` module, a UI primitive), check
`docs/phases/README.md` — providers and shared plumbing are phased work, not
givens. Before implementing against a third-party library/framework detail
that isn't already established in this codebase, pull fresh official
documentation (e.g. via the `docs-explorer` agent) instead of relying on
possibly-stale training data — this repo runs Next.js 16 with breaking changes
from prior versions. Before committing to any architecture decision,
deviation from documented conventions or the API contract, or a refactor
touching 3+ files, consult the `fable-advisor` subagent and resolve any `Flag`
verdict — by fixing the plan or explaining in the response why the flag does
not apply — before writing code.

**Rationale**: Wrong assumptions about what exists, or about a fast-moving
framework's current API, are more expensive to unwind here than the cost of
checking first.

### V. Quality Gates Without a Test Suite

No automated test suite is configured (no Jest/Vitest, no `*.test.*` files).
In its place, `bun lint` and `bunx tsc --noEmit` MUST pass before work is
considered done, and UI/frontend changes MUST be manually exercised in a
running dev server — golden path and edge cases — before being reported as
complete. Type-checking verifies code correctness, not feature correctness;
claiming a UI change works without having driven it in the browser is not
acceptable.

**Rationale**: Absent tests, linting, type-checking, and hands-on
verification are the only checks standing between a change and a production
regression.

## Security & Data Handling

- The backend's 401/403 response is the real authorization gate. `proxy.ts`
  middleware and role-filtered navigation are UX conveniences only, never the
  actual enforcement.
- Roles are `USER | MANAGER | ADMIN`, sourced from Clerk `publicMetadata.role`.
  ADMIN-only: `/`, `/analytics`, `/staff-users`. Everything else is MANAGER+.
  MANAGER lands on `/orders`. USER has no access.
- The Clerk session JWT (the API bearer token) MUST be obtained fresh per
  request server-side via `auth()` → `getToken()` and MUST NEVER reach the
  client.
- Money and other record decimals are strings (e.g. `"1299.00"`, EGP) — no
  float math; format with `formatEGP()`. Dashboard/analytics values are plain
  numbers, not strings.
- Only three environment variables exist:
  `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `API_URL`
  (server-only, no `NEXT_PUBLIC_` prefix). Access them only through the
  validated `lib/env.ts` singleton, never `process.env` directly.

## Development Workflow

- Use Bun for every command: `bun dev`, `bun run build` (also type-checks),
  `bun lint`, `bunx tsc --noEmit`, `bunx shadcn@latest add <item>`.
- Tables are server-rendered shadcn `table` + nuqs; no TanStack Table, no bulk
  actions (the API exposes none).
- Charts (Recharts) use `--chart-*` CSS variables and belong only on
  dashboard/analytics screens.
- `app/` stays thin (pages/layouts only, zero logic); feature logic lives in
  `features/<name>/` (`components/`, `hooks/`, `actions/`, `queries/`,
  `schema/`, `types/`, `index.tsx`); cross-cutting Server Actions live in
  `actions/`. No `src/` directory — `@/*` maps to the repo root.
- Consult `docs/README.md` as the doc map when uncertain where a convention or
  API detail is documented.

## Governance

This constitution supersedes ad hoc practice for this repository. `CLAUDE.md`
and `AGENTS.md` carry the same architectural rules for their respective
tooling — this document is the canonical, versioned source; if the three
drift, this constitution wins and the other files MUST be updated to match.

Amendments are made by editing `.specify/memory/constitution.md` (normally
via the `/speckit-constitution` workflow), which MUST also re-check
`.specify/templates/plan-template.md`, `spec-template.md`, and
`tasks-template.md` for consistency, and record a Sync Impact Report.
Versioning follows semantic versioning: MAJOR for backward-incompatible
principle removals or redefinitions, MINOR for new principles or materially
expanded guidance, PATCH for clarifications and wording fixes. Every
non-trivial plan or PR touching this app SHOULD be checked against these
principles; unresolved `fable-advisor` flags or skipped quality gates (Principle
V) block completion, not just review comments.

**Version**: 1.0.0 | **Ratified**: 2026-07-14 | **Last Amended**: 2026-07-14
