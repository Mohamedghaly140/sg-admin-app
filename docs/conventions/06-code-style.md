# 06 — Code Style & Naming

## TypeScript

- `strict: true`; **no `any`** — use `unknown` and narrow with Zod or type guards.
- Prefer `type` over `interface` unless extending.
- **API types are hand-written from the contract docs** (`integration/admin/`), placed in `features/<feature>/types/` (or `lib/api/types.ts` for cross-feature shapes like `PageMeta`). There is no generated client — when the contract changes, update the types with it.

## Naming

| Thing | Convention | Example |
|---|---|---|
| All files | `kebab-case` | `create-category.ts`, `orders-table.tsx` |
| Components | PascalCase export in a kebab-case file | `OrdersTable` in `orders-table.tsx` |
| Component props types | prefixed with the component name — **never bare `Props`** | `OrdersTableProps` |
| Feature default export | `<Name>Feature` from `index.tsx` | `OrdersFeature` |
| Server Action files | one file per action, verb-first | `update-order-status.ts` → `updateOrderStatus` |
| Query files | `get-` prefix | `get-orders.ts` → `getOrders` |
| nuqs hooks | `use-<feature>-params.ts` | `useOrdersParams` + `loadOrdersParams` |
| Zod schemas | `<thing>Schema` in `features/<feature>/schema/` | `createCouponSchema` |
| Lucide icons | always `Lucide` prefix | `LucideSearch`, never `Search` |

## Zod v4 (this project uses v4 — differs from training data)

- `z.enum()` accepts enum-like objects directly; `z.nativeEnum()` is deprecated. For API enums, define a const object and pass it: `const OrderStatus = { PENDING: "PENDING", ... } as const; z.enum(OrderStatus)`.
- `.Enum` / `.Values` accessors are removed; use `.enum` (singular).
- `error.flatten()` is deprecated in v4 — the existing `fromErrorToActionState` still uses it (works); **prefer `z.flattenError(error)` in new code**.
- Use `z.url()`, `z.email()` etc. as top-level functions (v4 style), not `z.string().url()`.

## Money & dates

- Money and record decimals arrive as **strings** (`"1299.00"`, EGP). Never `parseFloat` for arithmetic; never do float math. Display via `formatEGP()` from `lib/format.ts` (`Intl.NumberFormat("en-EG", { style: "currency", currency: "EGP" })`).
- For money **inputs**, submit the string the user typed (validated by Zod to 2-decimal shape) — the API validates decimals itself.
- Dates arrive ISO 8601 UTC; format for display via the `lib/format.ts` date helpers (single source, consistent locale).

## Server Actions

- One file per action; validation, the API call, and `revalidatePath` for that action live together.
- **Never throw out of a Server Action** (except `redirect()`/`notFound()`) — always return an `ActionState` via `toActionState` / `fromErrorToActionState`.
- Co-locate the Zod schema in `features/<feature>/schema/` and export the inferred type: `export type CreateCouponInput = z.infer<typeof createCouponSchema>`.

## Git

- Conventional commits: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`.
- One logical change per commit.
