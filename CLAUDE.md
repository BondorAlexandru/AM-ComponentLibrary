# CLAUDE.md — AM Component Library (`@am/ui`)

Working rules for this repo. Same shape as the two consumer repos (`CMS`,
`Influencer`) so the three read alike: **§A** what to load, **§B** how to talk,
**§C** the absolute rules.

This repo is different from those two in one way that changes everything about
how you work in it: **it has no app, no database, no users of its own.** Its
only output is code that two shipped apps render. A mistake here is not a bug in
this repo — it is a visual regression in production, in an app you are not
looking at. Every rule below follows from that.

There is no server-side CI gate beyond `npm run check` (`typecheck` + `test` +
`build`) and the GitHub Actions workflow. The real enforcement layer is a
read-only **reviewer sub-agent** (`.claude/agents/*`) invoked at review time —
each rule names the one that backs it.

---

## §A Progressive disclosure — load what you touch

### A.1 Always load (every task)

This file, plus this one-paragraph **architecture at a glance**:

> `@am/ui` is a React 19 component library with three small runtime deps —
> `clsx`, `tailwind-merge` and `class-variance-authority`, the same set shadcn/ui
> uses, and each one load-bearing (see §C.14). It is
> built by **plain `tsc`** (`tsconfig.build.json`) to per-file ESM in `dist/`,
> which is **committed to the repo** — both consumers install it as a git
> dependency, so there is no install-time build step to fail on Vercel or
> Railway. Components carry **Tailwind v4 utility class strings** that name
> **semantic token roles only** (`bg-surface`, `text-ink-2`, `border-hairline`)
> — never a hex, never an app-specific colour name. Each consuming app maps
> those roles to its own values in its own `@theme inline` block, which is how
> the CMS renders dark-first and AM Campaigns renders light from one component.
> The contract is `src/tokens/contract.ts` + `docs/TOKENS.md`. Brand-specific
> internals (the CMS's WebGL spinner) are **slots** filled via `AmUiProvider`.
> The **CMS is the canonical source** for every primitive it already had.

### A.2 Trigger table — touching X → load/check first

| Touching… | Load / re-read / respect |
|---|---|
| `src/primitives/Button.tsx`, `Badge.tsx`, `Card.tsx`, `EmptyState.tsx`, `Menu.tsx`, `Dropdown.tsx`, `Form.tsx`, `MediaThumb.tsx`, `ConfirmDialog.tsx`, `Skeleton.tsx` | §C.1 — these are **CMS-canonical**. Their class strings are frozen. |
| `src/__tests__/frozen-classes.test.tsx` | §C.1 — this file *is* the freeze. A failure here is a CMS design change, not a broken test. |
| any component's class strings | §C.2 tokens-only, §C.3 no purge-invisible classes |
| `src/tokens/contract.ts`, `docs/TOKENS.md` | §C.4 — adding a required token is a breaking change for both apps |
| `src/provider.tsx` | §C.5 — brand slots; never hardcode a brand asset |
| `src/index.ts` | §C.6 — the public surface; removing/renaming an export breaks a consumer's build |
| `package.json` (`exports`, `peerDependencies`, `files`) | §C.6, §C.7 — packaging is load-bearing for two deploy targets |
| `tsconfig.build.json`, `dist/**` | §C.7 — `dist/` is committed and must never be stale |
| `src/icons/index.tsx` | §C.8 — generated from `@material-symbols/svg-300`; regenerate, don't hand-edit |
| adding a component | §C.9 — earn its place in both apps first, then §C.12 — document it |
| `src/tokens/geometry.ts` | §C.14 — every entry is a literal class string whose fallback is the historical value |
| `src/theme.tsx`, `src/lib/cn.ts`, `src/lib/Slot.tsx` | §C.14 — the customisation contract and its layer order |
| `site/**` | §C.12 — the docs site; every export needs an entry with visible states |
| `site/src/registry.ts`, `site/src/entries/**` | §C.12 — the catalogue. `registry.test.ts` fails if an export is undocumented |
| `site/src/themes.ts` | §C.12 — a mirror of both apps' palettes. Run `npm run check:themes` |

### A.3 When unsure what to load

Default: don't. Read the nearest sibling primitive that already does the thing
right and copy its shape. When the question is "what does the CMS expect here",
read the CMS — `../CMS/components/ui/**` — rather than guessing.

---

## §B Communication & working tone

- Be direct and concrete. Lead with a verdict; name trade-offs plainly.
- **Don't invent values you don't have** — token names, prop names, export
  names, class strings. `grep`, don't guess. The three places that hold the
  truth: `src/tokens/contract.ts`, `../CMS/app/globals.css`,
  `../Influencer/src/index.css`.
- Prefer the **established sibling pattern** over clever new code. A design
  system's whole value is that its parts are predictable.
- State the success criteria before non-trivial work and verify against them:
  `npm run check`, and — for anything touching a CMS-canonical primitive or the
  token contract — **build both consumer apps** and invoke the reviewer agents.
- **Look at it.** `npm run site:dev` and open the component you changed, in all
  three themes. A green test run proves the class strings; only the site proves
  the thing looks right. Every bug found in this repo so far was found that way.
- When a change would look better but differ from the CMS, say so and **stop**.
  That is a product decision, not a refactor.

---

## §C Absolute rules

Each rule: **_Backed by:_** the agent that gates it · **_Why:_** the risk it prevents.

**C.1 — The CMS-canonical primitives are frozen. Never change how one renders.**
The CMS is a shipped app whose design must not move. Every class string in a
CMS-canonical primitive (see the §A.2 list) was copied from
`../CMS/components/ui/**` and is pinned by `src/__tests__/frozen-classes.test.tsx`.
**Additive** change is allowed — a new variant, a new optional prop with a
default that preserves current output. **Nothing else is.** Changing a class,
a default, or the shape of existing markup is a CMS design change: stop and ask.
If a frozen-class test fails, the test is right and you are wrong.
_Backed by: am-ui-reviewer._ _Why: nobody is looking at the CMS when this repo
changes — the regression ships silently._

**C.2 — Components name token roles, never values.**
No hex, no `rgb()`, no `text-white`/`bg-black`, no app-specific colour name
(`green`, `blue`, `lime`, `sb-*`, `neutral-600`). Use the roles in
`src/tokens/contract.ts` (`surface`, `ink-2`, `accent-soft`, `ok`, `on-danger`,
`hairline`, …). A literal colour is how a component that looks right in one app
becomes unreadable in the other's theme.
_Backed by: am-ui-reviewer._ _Why: the CMS is dark-first and AM Campaigns is
light-only; a hardcoded colour is correct in at most one of them._

**C.3 — Never write a class string Tailwind cannot see, or a token the app hasn't got.**
Two failure modes, both invisible in this repo:
- **Purge.** Tailwind v4 scans files for literal class strings. A class built by
  concatenation (`` `bg-${tone}` ``) is never emitted. Write whole class names
  in a lookup object, the way every primitive here already does.
- **Missing token.** A utility whose token the app never mapped silently emits
  nothing. Adding `bg-warn` to a component adds `warn` to the contract — see §C.4.
_Backed by: am-ui-reviewer + devils-advocate._ _Why: both produce an unstyled
control in production and a perfectly green test run here._

**C.4 — Adding a required token is a breaking change; ship it to both apps in the same task.**
`src/tokens/contract.ts` is the contract. New **tier 1** token → both
`../CMS/app/globals.css` and `../Influencer/src/index.css` must define it before
the component ships, and `docs/TOKENS.md` must say what role it plays. Prefer
**tier 2** (required only by the primitives that use it) for anything not
genuinely universal. Never widen tier 1 to avoid writing a lookup table.
_Backed by: am-ui-architect._ _Why: a component that needs a token an app lacks
renders invisible text on an invisible background._

**C.5 — Brand-specific internals are slots, not imports.**
The CMS loading indicator is a WebGL SpaceBlock "B" (`sb-loader.js`); AM
Campaigns must never render it, and the CMS must never lose it. Anything in that
category goes through `AmUiProvider` (`src/provider.tsx`) with a token-driven
default. Never import an app's asset, font, icon set, or domain type into a
primitive.
_Backed by: am-ui-reviewer._ _Why: one app's branding leaking into the other is
the failure this library is most likely to cause._

**C.6 — The public surface is append-only without a version bump and both consumers updated.**
`src/index.ts` and the `exports` map in `package.json` are the API. Removing or
renaming an export, or narrowing a prop type, breaks a consumer's build. If it
must go: bump the version, update both apps, land it in one task.
_Backed by: am-ui-architect._ _Why: the consumers pin a git tag; a half-landed
rename breaks whichever app upgrades first._

**C.7 — `dist/` is committed and must never be stale.**
Both apps install this repo as a git dependency with **no install-time build**,
so `dist/` in the tree is what production runs. Never commit a `src/` change
without `npm run build` in the same commit. `npm run verify:dist` and the CI
workflow are the guard. Never delete `dist/` from the tree or add it to
`.gitignore`.
_Backed by: am-ui-architect + devils-advocate._ _Why: a stale `dist/` means both
apps silently run last week's components._

**C.8 — `src/icons/index.tsx` is generated. Regenerate, don't hand-edit.**
146 Material Symbols (Rounded, weight 300, fill 1, 24dp), cropped to the 20dp
live area, exported under lucide-compatible PascalCase names. Adding an icon
means adding its path from `@material-symbols/svg-300` — not drawing one.
_Backed by: devils-advocate._ _Why: a hand-tuned path drifts off the grid and
reads as a different icon set at 14px._

**C.9 — A component earns its place in this repo by being needed in both apps.**
One app needing it is not a design system, it is a file in the wrong repo. Two
apps *nearly* needing it is worse — that is how a primitive grows six props
nobody uses. If it exists in both today, extract it; if it exists in one,
leave it there until the second asks.
_Backed by: am-ui-architect + devils-advocate._ _Why: an unshared component in a
shared library costs both apps a version bump and gives neither a benefit._

**C.10 — Never delete files, exports, or `.gitignore` entries without asking.**
_Backed by: devils-advocate._ _Why: silent removals are how guards and history
disappear._

**C.12 — Nothing ships undocumented. Document it *and* show its states.**
A component nobody can look at is a component nobody trusts, and prose is not a
substitute for seeing it. Every addition to the public surface — a component, a
variant, a prop, a utility, a token — lands with its docs in the **same commit**:

1. **An entry in `site/src/entries/**`**, listed in `site/src/registry.ts`, with
   the new export named in its `covers` array. `site/src/registry.test.ts` fails
   the build if a runtime export is undocumented, documented twice, or documented
   but no longer exported — so this is checked, not trusted.
2. **Every state visible, not described.** One specimen per state, each with a
   label saying which state it is: every variant, every size, and the states a
   reader cannot infer — `disabled`, `loading`, `error`, empty, overflowing,
   focused. If a state only exists when something is open, the specimen is a real
   trigger you can click, not a screenshot. Use `checker: true` where a fill is
   transparent, and `raw: true` for a docs data table that must not sit on the
   themed canvas.
3. **A props table** — `name`, `type`, `default`, and a note saying what the prop
   is *for*. Restating the type is not a note.
4. **The `summary` says what it is and when to reach for it**, and where two
   primitives look similar (`Badge` vs `Pill`, `Menu` vs `Popover`) it says which
   one to pick. That ambiguity is the most expensive thing a design system ships.
5. **A `notes` entry for anything a reader would otherwise find out the hard
   way** — a dropped prop, an inert animation, a naming inconsistency, a token an
   app has not defined yet. Write the sharp edge down; do not smooth it over.
6. **Check it in all three themes.** A component only works if it works in CMS
   dark, CMS light and Campaigns. The theme switcher exists because "looks fine"
   in one of them means nothing.

Adding a variant to an existing component means adding its specimen too — a
variant with no specimen is invisible to the next person and will be
reinvented. _Backed by: am-ui-reviewer (states + themes) + am-ui-architect
(coverage + registry)._ _Why: the two apps are the only consumers, and their
authors cannot read this source while they work. If the site does not show a
state, that state effectively does not exist — someone will rebuild it locally,
and the duplication this library exists to remove comes straight back._

**C.14 — Keep all four customisation layers working, in that order.**
An app must be able to restyle this library without forking a component. Four
mechanisms, and each has a failure mode worth naming:

- **Tokens.** Geometry lives in `src/tokens/geometry.ts` as *literal* class
  strings of the form `h-[var(--am-h-control-md,34px)]`. The fallback is the
  value the component rendered before the token existed — that is what lets a
  shipped app adopt this and change nothing. **Never change a fallback**; that
  silently moves every app that has not defined the token. Never assemble one at
  runtime (§C.3): Tailwind scans source text and emits nothing for
  `` `h-[${x}]` ``.
- **Theme.** `AmUiProvider`'s `theme.components.<Name>` supplies `defaultProps`
  and a `className`. A new component with variants should read
  `useComponentTheme` so it is configurable like the rest; one that doesn't is
  an inconsistency an app will trip over.
- **`className`.** `cn` is `twMerge(clsx(...))`. Every component must pass the
  caller's `className` **last**, or the override silently loses. Two utilities of
  the same kind have identical specificity — without `tailwind-merge`, the
  winner is whichever Tailwind happened to emit later, not the one you wrote.
- **Variants.** Export the `cva` function (`buttonVariants`, …) and its
  `VariantProps` type from `src/index.ts`, so an app can build its own component
  on the same classes rather than copying them.

Order is fixed and must stay fixed: variant classes → theme `className` → call
site `className`. _Backed by: am-ui-reviewer + am-ui-architect._ _Why: the
alternative to configuration is a fork, and a forked primitive is the exact
duplication this repo exists to delete._

**C.13 — To break a rule, stop and ask.**
No silent `// eslint-disable`, no `--no-verify`, no `.skip` on a frozen-class
test, no `covers: []` to dodge §C.12, no "temporarily" hardcoding a colour.
_Backed by: all three._

---

## Consumer wiring (what an app must do)

Both are required. Neither fails loudly.

1. **Install** — `"@am/ui": "github:BondorAlexandru/AM-ComponentLibrary#v0.3.0"`.
2. **Point Tailwind at the package**, or every class string is purged and the
   components render unstyled:
   ```css
   @source "../node_modules/@am/ui/dist";   /* path is relative to the CSS file */
   ```
3. **Map the token contract** in the app's `@theme inline` (see `docs/TOKENS.md`).
4. **Mount `AmUiProvider`** if the app has a brand spinner.
5. Next.js only: nothing. `'use client'` is preserved per-file in `dist/`.

---

## The docs site

`site/` is a Vite app that imports the library from `src/` (not `dist/`), so
`npm run site:dev` reflects what you are editing with no rebuild. It is published
to GitHub Pages from `main`:
**https://bondoralexandru.github.io/AM-ComponentLibrary/**

What it is for, beyond a component list:

- **Three themes, one switcher.** CMS dark, CMS light, Campaigns — mirrored from
  the real stylesheets in `site/src/themes.ts`. `npm run check:themes` diffs them
  against the sibling repos so the docs cannot quietly start lying.
- **Every state, side by side.** The point of §C.12. A grid of labelled specimens
  beats a page of prose about what `disabled` looks like.
- **Which tier-2 tokens each app actually declares.** The Tokens page marks the
  four the CMS has not defined yet, so "adopting Modal in the CMS" has a visible
  prerequisite instead of a surprise.
- Chrome is built from Tailwind's built-in palette, never the token roles, so a
  broken token cannot take the navigation down with it.

## Known gaps (review-time awareness, not yet rules)

- **Only Button and IconButton read `useComponentTheme` so far.** The other
  primitives honour tokens and `className` but ignore `theme.components`. Wiring
  the rest is mechanical; until then the theme layer is partial.
- **Not every literal is a token.** One-off type sizes (a chip label, the KPI
  figure, the gauge number) and the shadow/scrim colours are still hardcoded.
  The theme `className` covers them; tokens would be cleaner.
- **No automated visual regression testing.** `frozen-classes.test.tsx` pins
  class strings and `registry.test.ts` pins docs coverage, but neither catches a
  changed DOM structure or a token an app maps to the wrong value. The site makes
  that reviewable by eye; a screenshot diff over it is the natural next layer.
- **`Skeleton`'s `wave` animation is dead.** It needs an `--animate-shimmer`
  entry that neither app defines, so `wave` renders as a static bar. Preserved
  as-is rather than "fixed", because fixing it would change the CMS (§C.1).
- **`ConfirmDialog` and `Pill` carry no `'use client'`.** Correct today — both
  are only ever imported from client components, and the CMS original had none.
  A future server-component call site would need the directive added.
- **AM Campaigns still keeps app-level prop adapters** (`Button`'s default
  variant, `EmptyState`'s `body`/`compact` names). Deliberate: it shares the
  implementation without churning ~70 call sites. Converging the prop names is a
  separate, mechanical task.
- **Two menu primitives on purpose.** `Menu` (items array, portalled, flips) and
  `Popover` (render-prop, in-flow) are different tools, not duplicates —
  see the header comment in `src/primitives/Popover.tsx`.

---

## Reviewer sub-agents (the second layer)

Invoke via the Task tool. Each returns a structured `Verdict: APPROVE | CONCERN | REJECT`.

| Agent | Use for |
|---|---|
| **am-ui-reviewer** | any change to a component's markup or class strings, new variants/props, token usage, accessibility, whether the new states are actually shown on the site, anything near a CMS-canonical primitive |
| **am-ui-architect** | the token contract, `src/index.ts`, `package.json` exports/peers, the build & committed `dist/`, docs coverage in `site/src/registry.ts`, whether a component belongs here at all |
| **devils-advocate** | a general "what did I miss" pass — silent deletions, stale `dist/`, purge-invisible classes, an undocumented variant, a consumer left un-updated |
