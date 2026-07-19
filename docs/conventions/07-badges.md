# 07 — Badges & Status Design System

How the admin dashboard colours every status / state / label pill. One colour
language across all features so an operator reads state at a glance and the app
never looks templated. **Presentation only** — badges reflect data, they never
change it.

## Principle

Colour encodes **meaning**, not decoration. Every badge goes through a `Badge`
**semantic variant**; we never put literal colour classes (`bg-green-500`,
`text-red-700`) on a badge. The palette is intentionally restrained — most of the
UI is monochrome, and colour is spent only where it communicates state.

## The semantic variants

`components/ui/badge.tsx` defines these (base-nova CVA). The coloured ones use a
soft tinted treatment — `bg-<token>/10 text-<token>-foreground` (dark: `/20`) —
matching the original `destructive` variant, so they read calm, not loud.

| Variant | Hue | Meaning | Token |
|---|---|---|---|
| `success` | green | healthy · positive · complete | `--success` |
| `warning` | amber | needs attention · partial | `--warning` |
| `info` | blue | in progress · in transit | `--info` |
| `destructive` | red | error · terminal-bad | `--destructive` |
| `secondary` | neutral fill | neutral · in-house / being prepared | `--secondary` |
| `outline` | bordered | neutral · inactive · terminal | `--border` |
| `default` | solid dark | high-emphasis / tonal (e.g. top role) | `--primary` |

Roles and other non-health labels stay **tonal** (`default` / `secondary` /
`outline`) — mapping them to `success`/`warning` would dilute the system.

## Theme tokens

Defined in `app/globals.css` and registered in `@theme inline`. Each semantic
family separates its base hue (tints, hover states, and focus rings) from a text
foreground tuned for contrast.

| Family | Light base | Light foreground | Dark base / foreground |
|---|---|---|---|
| Success | `oklch(0.58 0.14 155)` | `oklch(0.45 0.14 155)` | `oklch(0.70 0.15 155)` |
| Warning | `oklch(0.66 0.15 75)` | `oklch(0.45 0.15 75)` | `oklch(0.76 0.15 80)` |
| Info | `oklch(0.58 0.16 245)` | `oklch(0.45 0.16 245)` | `oklch(0.70 0.15 245)` |

The dark foreground aliases the brighter dark base token. Both themes are tuned
so `text-<token>-foreground` meets WCAG AA on the `/10`–`/20` tint. If you
retune either token, re-check contrast in light **and** dark.

## Status catalogue

The canonical status → variant mappings currently in use:

**Order status** (`components/shared/order-status-badge.tsx`)

| Status | Variant | Reads as |
|---|---|---|
| Pending | `warning` | amber — needs action |
| Processing | `secondary` | neutral — being prepared |
| Shipped | `info` | blue — in transit |
| Delivered | `success` | green — done |
| Cancelled | `destructive` | red |
| Refunded | `outline` | bordered neutral — terminal |

**Payment** (`components/shared/payment-status-badge.tsx`): Paid → `success`,
Unpaid → `warning`.

**Active state** (`components/shared/active-badge.tsx`): Active → `success`,
Inactive → `outline`.

**Coupon** (`features/coupons/components/coupon-status-badge.tsx`): active →
`success`, exhausted → `warning`, expired → `destructive`, deactivated → `outline`.

**Product** (`features/products/components/products-table.tsx`): Active →
`success`, Draft → `outline`, Archived → `secondary`.

**Staff role** (`features/staff-users/components/staff-users-table.tsx`): tonal —
ADMIN → `default`, MANAGER → `secondary`, USER → `outline`.

**Dashboard KPI delta** (`features/dashboard/components/kpi-cards.tsx`): up →
`success`, down → `destructive`, flat → `secondary`.

**Dashboard low stock** (`features/dashboard/components/low-stock-list.tsx`):
critical (`qty ≤ 2`) → `destructive`, otherwise → `warning`.

## Shared components

Cross-feature badges live in `components/shared/` (a feature never imports another
feature's component). Reuse these instead of re-implementing the pattern:

| Component | Prop | Output |
|---|---|---|
| `OrderStatusBadge` | `status: OrderStatus` | coloured, humanized order status; also exports `orderStatusLabels` |
| `PaymentStatusBadge` | `isPaid: boolean` | Paid / Unpaid |
| `ActiveBadge` | `active: boolean` | Active / Inactive |

Single-feature status badges (coupon, product) stay feature-local — promote to
`components/shared/` only when a second feature needs them.

## Rules

- **Always a variant, never literal colour classes** on a badge.
- **Humanize labels** — `Pending`, not `PENDING`. Provide a `statusLabels` map;
  never render a raw enum. (Roles are shown as-is by convention.)
- **Derive the variant union** for status→variant maps from the primitive:
  `VariantProps<typeof badgeVariants>["variant"]` — don't hand-write it (it drifts
  when variants change).
- **Reuse the shared components** above; keep new single-feature badges local.
- Editing `components/ui/badge.tsx` is a maintained fork — re-running
  `bunx shadcn@latest add badge` would clobber the custom variants.

## Adding a new status badge

1. Pick variants from the semantic table by **meaning**, keeping each status
   visually distinct where it aids scanning.
2. Feature-local: add a `statusVariants` (typed via the derived union) + a
   `statusLabels` map, render `<Badge variant={…}>{label}</Badge>`. Cross-feature:
   add a component under `components/shared/` and list it in
   [`architecture/03-project-structure.md`](../architecture/03-project-structure.md).
3. Verify `bunx tsc --noEmit` + `bun lint`, then eyeball contrast in light & dark.
