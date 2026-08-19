# `@am/ui` — AM Component Library

The shared design system behind **SpaceBlock CMS** and **AM Campaigns**.
Token-driven React 19 primitives, zero runtime dependencies, one look.

- **[CLAUDE.md](./CLAUDE.md)** — the working rules for this repo. Read first.
- **[docs/TOKENS.md](./docs/TOKENS.md)** — the token contract.

---

## Install

```bash
npm i "github:BondorAlexandru/AM-ComponentLibrary#v0.1.3"
```

`dist/` is committed, so there is **no install-time build** — nothing to fail on
Vercel or Railway. Pin a tag; don't track `main`.

## Wire it up

Both steps are required, and neither fails loudly if you skip it.

**1. Point Tailwind at the package.** Tailwind v4 scans files for literal class
strings; the library's live in `node_modules`. Without this, every shared
component renders unstyled.

```css
/* app/globals.css (CMS) or src/index.css (Campaigns) */
@import 'tailwindcss';
@source "../node_modules/@am/ui/dist";   /* relative to this CSS file */
```

**2. Map the token contract** in your `@theme inline` block. See
[docs/TOKENS.md](./docs/TOKENS.md) for the 18 tier-1 roles and what they mean.

**3. Optional — mount the brand spinner.** Shared components that show a loading
state render whatever the app supplies, falling back to a token-driven ring.

```tsx
import { AmUiProvider } from '@am/ui'
import { Spinner } from '@/components/ui/Spinner'   // your brand loader

<AmUiProvider spinner={Spinner}>{children}</AmUiProvider>
```

## Use it

```tsx
import { Button, Badge, Card, Form, Menu, Modal } from '@am/ui'
import { Plus, Trash2 } from '@am/ui/icons'

<Button variant="primary" leftIcon={<Plus size={14} />}>New campaign</Button>
```

## What's in it

**Canonical primitives** — extracted from the CMS, class strings frozen
(`CLAUDE.md` §C.1):
`Button` · `IconButton` · `Badge` · `Tag` · `Status` · `Card` · `EmptyState` ·
`Menu` · `Dropdown` · `Form` · `ConfirmDialog` · `MediaThumb` · `Skeleton`

**Contributed from AM Campaigns** — new to the CMS, which is unaffected:
`Pill` · `Modal` · `Drawer` · `Popover` · `MenuItem` · `MenuLabel` · `MenuSeparator`

**Also** — `cn`, `AmUiProvider`, `Spinner`, `findMissingTokens`, and 146
Material Symbols icons under `@am/ui/icons` (lucide-compatible names).

Two menu primitives exist on purpose: `Menu` is an items-array kebab menu that
portals itself and flips above the trigger; `Popover` is render-prop driven and
sits in flow. See the header of `src/primitives/Popover.tsx`.

## Develop

```bash
npm install
npm run check     # typecheck + test + build
```

`dist/` is committed — **run `npm run build` and commit it with every `src/`
change** (`CLAUDE.md` §C.7). `npm run verify:dist` and CI enforce it.

`src/__tests__/frozen-classes.test.tsx` pins the exact class strings the CMS
renders. If it fails, you changed the CMS's design. That needs a decision, not a
fix to the test.
