# The token contract

Shared primitives never name a colour. They name a **role** — `bg-surface`,
`text-ink-2`, `border-hairline` — and each app maps those roles to its own values
in its own Tailwind v4 `@theme inline` block.

That indirection is the whole trick. It is why the CMS can render dark-first and
AM Campaigns light-only from one `<Button>`, and why neither app's palette leaks
into the other.

The machine-readable version is [`src/tokens/contract.ts`](../src/tokens/contract.ts).
This file and that one must agree.

---

## Tier 1 — required by every consumer

Consumed as `bg-<name>`, `text-<name>`, `border-<name>`.

Both apps declare these with **`@theme inline`**, which substitutes the value
into each utility (`.bg-ok{background-color:var(--ok)}`) rather than emitting a
`--color-ok` property. That matters for verification — see below.

| Role | What it means | CMS (light) | CMS (dark, default) | AM Campaigns |
|---|---|---|---|---|
| `canvas` | The page behind everything | `#f6f6f9` | `#080a14` | `#f6f6f9` |
| `surface` | A raised card or panel | `#ffffff` | `#0c0e1a` | `#ffffff` |
| `surface-2` | A recessed / secondary fill | `#efeff5` | `#121524` | `#efeff5` |
| `ink` | Primary text | `#0b0d18` | `#f4f5f7` | `#0b0d18` |
| `ink-2` | Secondary text (≥AA on surface) | 74% ink | 62% ink | 72% ink |
| `ink-3` | Tertiary text (≥AA on surface-2) | 64% ink | 50% ink | 56% ink |
| `accent` | Brand fill for the primary action | `#d9086b` | `#e50f76` | `#d9086b` |
| `accent-text` | Accent at text weight (≥AA on white) | `#b8045a` | `#ff7ab8` | `#b8045a` |
| `accent-soft` | Tinted accent wash | 10% accent | 14% accent | 10% accent |
| `on-accent` | Text on a solid `accent` fill | `#ffffff` | `#ffffff` | `#ffffff` |
| `ok` | Success / approved | `#0e8655` | `#3ddc97` | `#0e8655` |
| `on-ok` | Text on a solid `ok` fill | `#ffffff` | `#04160d` | `#ffffff` |
| `warn` | Warning | `#9a6708` | `#fdbe4a` | `#9a6708` |
| `danger-accent` | Destructive / error | `#cf3527` | `#ff6b85` | `#cf3527` |
| `on-danger` | Text on a solid `danger-accent` fill | `#ffffff` | `#2b070e` | `#ffffff` |
| `line` | A visible border | 20% ink | 16% ink | 16% ink |
| `hairline` | A barely-there divider | 10% ink | 8% ink | 9% ink |
| `input` | A field / quiet-button fill | 3% ink | 3% white | 3% ink |

**`on-*` roles are not decoration.** `on-ok` is `#ffffff` in the CMS's light
theme and near-black in its dark theme, because the same green does not carry
white text in both. A component that writes `text-white` on `bg-ok` is AA in one
theme and unreadable in the other — that is rule §C.2.

### Verifying an app satisfies tier 1

```ts
import { findMissingTokens, CAMPAIGNS_TOKEN_MAP } from '@am/ui'

it('defines every tier-1 design token', async () => {
  expect(await page.evaluate(() => findMissingTokens(CAMPAIGNS_TOKEN_MAP))).toEqual([])
})
```

The map is required, and the reason is worth understanding rather than working
around. Because both apps use `@theme inline`, there is **no `--color-*` property
to read back** — and no app-agnostic name to guess either: the CMS calls the `ok`
role `--sb-ok` and the `danger-accent` role `--sb-danger`. Probing a rendered
element doesn't help, because Tailwind is JIT: `bg-warn` has no rule at all until
some scanned file uses it, and a missing rule looks identical to a missing token.

`CMS_TOKEN_MAP` and `CAMPAIGNS_TOKEN_MAP` ship with the library and are asserted
against both apps' CSS in `src/__tests__/tokens.test.ts`.

Run the check where the app's real stylesheet is loaded — an e2e/browser test,
not jsdom, which does not evaluate an external stylesheet. What it catches is the
thing that actually happens: someone deletes or renames a variable in the app's
CSS, and every component using that role silently goes transparent.

---

## Tier 2 — required only by the primitives that use it

Skip these if you don't use the primitive.

| Token | Required by | Notes |
|---|---|---|
| `--radius-pill` | `Pill` | `999px`. Full pill, not a rounded rectangle. |
| `--radius-card` | `Modal`, `Popover` | `12px`. Matches `Card`'s hardcoded `rounded-[12px]`. |
| `--shadow-overlay` | `Modal`, `Drawer` | The heavy lift-off-page shadow. |
| `--shadow-raised` | `Popover` | The lighter floating-panel shadow. |
| `--font-display` | `Form.Label` | The CMS uses Clash Display for micro-labels. An app without a display face should map it to its sans — the utility simply does nothing if the token is absent, so labels silently fall back to the body font. |
| `animate-fade-in` | `Modal`, `Drawer` | Backdrop fade. |
| `animate-slide-in` | `Drawer` | Slide in from the right. |
| `animate-pop-in` | `Modal`, `Popover` | Scale + rise. |

The three `animate-*` utilities need both a keyframe and (in Tailwind v4) an
`--animate-*` entry in `@theme` for the keyframes to survive the build. AM
Campaigns' `src/index.css` is the reference implementation.

---

---

## Geometry — the `--am-*` scale

Colour roles are a contract the app must satisfy. Geometry is the opposite: the
library ships a working default and the app overrides what it wants. Every entry
is `var(--am-<name>, <the value the component always rendered>)`, so an app that
defines nothing looks exactly as it did.

```css
:root {
  --am-radius-control: 999px;
  --am-h-control-md: 38px;
}
```

| Group | Tokens |
|---|---|
| Control heights | `--am-h-control-sm` 28px · `-md` 34px · `-lg` 40px |
| Icon buttons | `--am-h-icon-sm` 32px · `-md` 40px · `-lg` 44px |
| Form controls | `--am-h-field-sm` 32px · `-md` 40px · `-lg` 48px |
| Radii | `--am-radius-chip` 6px · `-control` 8px · `-panel` 10px · `-card` → `--radius-card` · `-pill` → `--radius-pill` |
| Control text | `--am-text-control-sm` 12.5px · `-md` 13px · `-lg` 14px |
| Field text | `--am-text-field-sm` 14px · `-md` 13.5px · `-lg` 18px |

`--am-radius-card` and `--am-radius-pill` chain to the tier-2 app tokens before
their literal fallback, so an app that already defines `--radius-card` keeps
working without touching anything.

`GEOMETRY_TOKENS` exports the same table as data, and the docs site renders it.

## Adding a token

A new **tier 1** token is a breaking change for both apps (§C.4):

1. Add the role to `TIER1_COLOR_TOKENS` in `src/tokens/contract.ts`.
2. Add the row to the table above, with values for **all three** columns.
3. Define it in `../CMS/app/globals.css` (both `[data-theme]` blocks) **and**
   `../Influencer/src/index.css`.
4. Only then use it in a component.

Prefer tier 2 for anything not genuinely universal. Never widen tier 1 just to
avoid writing a lookup table.
