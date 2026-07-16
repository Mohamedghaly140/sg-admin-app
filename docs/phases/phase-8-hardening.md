# Phase 8 — Hardening & Polish

## Goal

Cross-feature quality pass: every screen handles every state, auth failures behave consistently, the app works on mobile, and the docs match reality.

## Depends on

Phases 1–7.

## Tasks

### 1. States audit (every list + detail)

- [ ] Empty vs. filtered-empty (`EmptyState` with distinct copy), loading (`loading.tsx` skeletons match final layout), segment `error.tsx` boundaries.
- [ ] `notFound()` paths verified for every `[id]` route.

### 2. Auth consistency

- [x] `401 UNAUTHENTICATED` → sign-in redirect from both reads and actions.
- [x] `403 FORBIDDEN` → access-denied screen (reads) / permission toast (actions).
- [x] `403 ACCOUNT_DISABLED` → Clerk sign-out + notice.
- [x] Verify no Clerk token or `API_URL` ever reaches a Client Component (grep the client bundle boundaries).

### 3. Responsive & a11y

- [ ] Sidebar collapses to a `sheet` on mobile; tables scroll horizontally in their own container.
- [ ] Keyboard pass: dialogs trap focus, forms submit on Enter, row menus reachable.
- [ ] Labels/aria on all inputs (FormControl covers most — audit custom selects/switches), icon-only buttons get `aria-label`, charts get text alternatives.

### 4. Consistency sweep

- [ ] All destructive actions behind `ConfirmDialog`; all money through `formatEGP`; all dates through the `lib/format.ts` helpers.
- [ ] All Lucide imports use the `Lucide` prefix; no `Props`-named types; no `useState` URL state (grep-audit each).

### 5. Docs & QA

- [ ] Manual QA script: walk every screen doc's actions table against the live API with both an ADMIN and a MANAGER account.
- [ ] Update [`phases/README.md`](./README.md) tracker; prune anything stale in `docs/`; note any API drift in the relevant screen doc and report it to the backend.

## Acceptance criteria

- [ ] QA script passes for both roles.
- [ ] `bun lint` and `bun run build` clean.
- [ ] Docs tracker reflects reality; no doc contradicts the API contract.
