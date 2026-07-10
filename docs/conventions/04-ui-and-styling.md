# 04 — UI & Styling

## shadcn/ui — base-nova on Base UI (not Radix)

`components.json` is already configured: style `base-nova`, base color `neutral`, CSS variables, lucide icons. Components are generated on top of **`@base-ui/react`** — *not* Radix. Anatomy, part names, and data-attributes differ from Radix-based shadcn; when composing or restyling a primitive, **read the generated file in `components/ui/`** instead of assuming Radix docs apply.

- Install on demand: `bunx shadcn@latest add <item>` (never npm/npx).
- `components/ui/` holds shadcn primitives **only** — no business logic, no app-specific components.
- Currently installed: `button`, `alert-dialog`. Everything else (input, label, card, table, badge, select, dialog, dropdown-menu, skeleton, sheet, tabs, …) is installed as needed — the phase-1 batch covers the common set.

## Prefer the shared components

Before building UI, check `components/shared/` ([inventory](../architecture/03-project-structure.md#componentsshared-inventory)):

- Destructive actions → `ConfirmDialog` (never a bare browser `confirm`).
- Empty lists → `EmptyState`.
- Loading → `Spinner` or shadcn `skeleton` in `loading.tsx`.
- Forms → the [form system](./02-forms.md), always.

## Tables

Admin lists use plain shadcn `table` markup rendered **server-side**, with pagination/filtering/search fully server-driven via [nuqs](./03-url-state.md) and the API's `page`/`limit`/`meta`. **No TanStack Table, no client-side sorting/filtering, no bulk row selection** — the API has no bulk endpoints. Row actions (edit/delete/toggle) live in a dropdown-menu or inline buttons per row.

## Tailwind CSS v4

- CSS-first: all theme tokens live in `app/globals.css` (`@theme`, `:root` / `.dark` palettes). **No `tailwind.config.js/ts` — do not create one.**
- Class merging via `cn()` from `lib/utils.ts`.
- Dark mode: `.dark` class strategy driven by **next-themes** (`ThemeProvider` + a topbar toggle — phase 1). Use semantic tokens (`bg-background`, `text-muted-foreground`, `border-border`) so both themes work for free.

## Icons

lucide-react, always imported with the `Lucide` prefix: `LucideSearch`, `LucideTrash2`, `LucidePlus`. Never bare names.

## Charts (Recharts — dashboard & analytics only)

- Colors come from the `--chart-1` … `--chart-5` CSS variables in `globals.css` — never hard-coded hex.
- Money axes/tooltips format via `formatEGP()` from `lib/format.ts`. Dashboard/analytics endpoints return plain **numbers**, so values chart directly.
- Wrap charts in a fixed-height container (Recharts' `ResponsiveContainer` needs one) and give each a loading `skeleton` of the same height to avoid layout shift.
- Handle empty ranges: render an `EmptyState`, not an empty axis frame.
