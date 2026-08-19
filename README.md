# `@am/ui` — AM Component Library

The shared design system behind **SpaceBlock CMS** and **AM Campaigns**.
Token-driven React 19 primitives, zero runtime dependencies, one look.

**→ [Browse the components](https://bondoralexandru.github.io/AM-ComponentLibrary/)** — every
component, every state, in all three app themes.

- **[CLAUDE.md](./CLAUDE.md)** — the working rules for this repo. Read first.
- **[docs/TOKENS.md](./docs/TOKENS.md)** — the token contract.

---

## Install

```bash
npm i "github:BondorAlexandru/AM-ComponentLibrary#v0.3.2"
```

`dist/` is committed, so there is **no install-time build** — nothing to fail on
Vercel or Railway. Pin a tag; don't track `main`.

Runtime dependencies: `clsx`, `tailwind-merge`, `class-variance-authority` —
the same three shadcn/ui uses, ~10kB gzipped together.

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

## Customise it

Four layers, weakest to strongest. You should never need to fork a component.

**1. Tokens** — colour roles and the geometry scale, from your stylesheet:

```css
:root {
  --am-radius-control: 999px;   /* pill buttons everywhere */
  --am-h-control-md: 38px;      /* taller controls */
  --am-text-control-md: 13.5px;
}
```

Every geometry token is `var(--am-x, <the value it always had>)`, so defining
nothing renders exactly as before. See the
[Customising page](https://bondoralexandru.github.io/AM-ComponentLibrary/#customising)
for the full list.

**2. Theme** — per-component defaults and classes, MUI-style:

```tsx
<AmUiProvider theme={{ components: {
  Button: { defaultProps: { variant: 'secondary' }, className: 'uppercase' },
} }}>
```

**3. `className`** — wins over both, because `cn` runs `tailwind-merge`:

```tsx
<Button className="h-12 rounded-full" />   // really replaces the height
```

**4. Compose** — the `cva` functions are exported, so build your own:

```tsx
<a className={cn(buttonVariants({ variant: 'tertiary' }), 'gap-1')} />
<Button asChild><Link to="/x">Or use asChild</Link></Button>
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
`Menu` · `Dropdown` · `Form` · `ConfirmDialog` · `MediaThumb` · `Skeleton` ·
`Delta` · `KpiCard` · `BarList` · `ScoreGauge` · `SectionCard` · `EmptyHint`

**Contributed from AM Campaigns** — new to the CMS, which is unaffected:
`Pill` · `Modal` · `Drawer` · `Popover` · `MenuItem` · `MenuLabel` ·
`MenuSeparator` · `Stat` · `Stepper` · `SegmentedControl` · `ProgressBar` ·
`SegmentedBar`

**Also** — `Tabs`, `cn`, `formatNumber`, `formatBytes`, `AmUiProvider`,
`Spinner`, `findMissingTokens`, and 146 Material Symbols icons under
`@am/ui/icons` (lucide-compatible names).

Several pairs look similar and are not. `Menu` is an items-array kebab menu that
portals itself and flips above the trigger; `Popover` is render-prop driven and
sits in flow. `Badge` owns its colours via a variant; `Pill` takes them from the
caller. `Tabs` underlines for page-level sections; `SegmentedControl` uses pills
inside a panel. Each component's page on the site says which to pick.

## The docs site

```bash
npm --prefix site install   # once
npm run site:dev            # http://localhost:5173
```

It imports the library from `src/`, not `dist/`, so what you see is what you are
editing. Three things it is for beyond listing components:

- **A theme switcher** — CMS dark, CMS light, AM Campaigns, mirrored from the real
  stylesheets. A component only works if it works in all three; the CMS is
  dark-first and Campaigns is light-only, and a fill tuned for one can be
  unreadable in the other.
- **Every state side by side** — every variant and size, plus `disabled`,
  `loading`, `error`, empty and overflowing. Overlays are live triggers, so you
  can check that Escape closes and body scroll locks.
- **Which tier-2 tokens each app actually declares** — the Tokens page flags the
  four the CMS has not defined, so adopting `Modal` there has a visible
  prerequisite rather than a surprise.

Published to GitHub Pages from `main`. Adding anything to the public surface
means adding its docs in the same commit — see `CLAUDE.md` §C.12.

## Develop

```bash
npm install
npm run check           # typecheck + test + build + site typecheck + docs coverage
npm run check:themes    # site palettes still match both apps (needs the sibling repos)
```

`dist/` is committed — **run `npm run build` and commit it with every `src/`
change** (`CLAUDE.md` §C.7). `npm run verify:dist` and CI enforce it.

Two tests will stop you, on purpose:

- `src/__tests__/frozen-classes.test.tsx` pins the exact class strings the CMS
  renders. If it fails, you changed the CMS's design. That needs a decision, not
  a fix to the test.
- `site/src/registry.test.ts` fails if a runtime export has no docs entry, is
  documented twice, or is documented but no longer exported. §C.12 is a rule
  because of this test, not in spite of it.
