# Motion

The library animates with [Motion](https://motion.dev) (`motion`, imported from
`motion/react`). This document is the contract: what the scale is, why the
library took on a runtime dependency to get it, and what an app has to do.

Short version for an app author: **mount `AmUiMotionConfig` once and you are
done.** Everything else here is for people changing the library.

---

## Wiring

```tsx
import { AmUiMotionConfig } from '@am/ui'

<AmUiMotionConfig>
  <App />
</AmUiMotionConfig>
```

That is the whole integration. It renders Motion's `<MotionConfig
reducedMotion="user">`, which makes every Motion component below it — the
library's and yours — drop transforms and keep opacity for anyone whose OS asks
for less movement. Without it, honouring that preference is a conditional in
every component that moves.

There is **no CSS to add and no token to define.** That is the main practical
difference from the old approach and the reason for the switch: see
[Why not CSS](#why-not-css).

### Turning it off

```tsx
<AmUiProvider theme={{ motion: { enabled: false } }}>
```

Every library animation then renders at its end state on frame one. This is for
screenshot harnesses and test runners — not for reduced motion, which
`AmUiMotionConfig` already handles better, per animation rather than all or
nothing.

---

## The scale

From `src/motion/tokens.ts`, exported from the package root and from
`@am/ui/motion`.

### Easing

| Export | Value | Use for |
|---|---|---|
| `EASE` | `[0.16, 1, 0.3, 1]` | Everything. Quick to commit, slow to settle. |
| `EASE_IN_OUT` | `[0.65, 0, 0.35, 1]` | Movement that reverses — a drawer that slides both ways, a value that can go up or down. |

One curve is the point. Mixed easings are why an interface feels "off" without
anyone being able to name the frame that is wrong.

### Durations

Seconds, because that is Motion's unit. Named by **job**, not by number, so a
component picks by intent and the scale can be retuned in one place.

| Name | Value | Use for |
|---|---|---|
| `instant` | 0.12 | A flip the user caused this frame. Hover tints, active states. |
| `fast` | 0.18 | Something small appearing near the cursor. Tooltips, menu items. |
| `base` | 0.24 | The default. Anything with no reason to be quicker or slower. |
| `slow` | 0.36 | Something large or far-travelling. Drawers, sheets, page bodies. |
| `slower` | 0.60 | A deliberate, once-per-session moment. Scroll reveals, onboarding. |

### Springs

For anything the user is physically manipulating — a dragged card, a layout
reflowing under a click, a sliding indicator. A spring tracks an interrupted
gesture gracefully; a fixed-duration tween does not.

| Name | Feel | Use for |
|---|---|---|
| `SPRING.snappy` | tight, quick | Indicators, small position changes. |
| `SPRING.smooth` | the default | Layout changes, cards settling. |
| `SPRING.bouncy` | loose, physical | Drag release, playful confirmation. |

Each uses Motion's `visualDuration`, so they stay comparable to the duration
scale above regardless of bounce.

### Other

| Export | What |
|---|---|
| `STAGGER` | `0.045` — the step between children in a revealing list. |
| `VIEWPORT` | `{ once: true, margin: '0px 0px 120px 0px' }` — fire a little before the element is properly on screen, so a fast scroll doesn't land on something blank. |
| `tween(name, delay)` | A tween at one of the named durations. The workhorse. |

---

## The variants

From `src/motion/variants.ts`. Every enter/exit in the library is one of these.
A menu, a dropdown and a popover are the same gesture at three sizes; they
should not each invent their own numbers.

| Variant | Shape | Used by |
|---|---|---|
| `fade` | opacity only | Scrims, tab panels, anything with no direction |
| `rise` | opacity + `y: 22` | Scroll reveals, page bodies |
| `pop` | opacity + `scale: 0.96` + `y: -4` | Menu, Dropdown, Popover |
| `popCentered` | opacity + `scale: 0.96` + `y: 8` | Modal — rises rather than drops, because it is centred |
| `slideFrom(side)` | opacity + 100% offset on one axis | Drawer, sheets |
| `staggerList` / `riseItem` | container + child pair | Lists revealing in sequence |
| `collapse` | `height: auto` | Accordions |

**Every one of them animates opacity.** That is what makes
`reducedMotion="user"` sufficient on its own: Motion drops the transforms, the
opacity survives, and no variant needs a reduced-motion branch. A variant that
moved without fading would simply teleport for a reduced-motion user, so this is
enforced by a test rather than left to discipline.

Transform count is a softer rule — at most two, capped by the same test. `pop`
uses `scale` *and* a small `y` on purpose: a panel opening under the cursor
wants both. The cap exists to stop a variant quietly growing a scale + rotate +
x pile.

`pop`'s scale floor is 0.96 rather than something more dramatic because these
panels contain text — below about 0.94 the type visibly reflows and the whole
thing reads as cheap.

---

## The primitives

Four components, in `src/motion/components.tsx`. Each exists because the plain
version has a specific failure both apps kept hitting.

| Component | Why it exists |
|---|---|
| `Reveal` | A scroll reveal otherwise means an IntersectionObserver per element. Both apps wrote one; AM Campaigns abandoned its half-way and left dead `.am-reveal` CSS behind. |
| `Collapse` | **`height: auto` cannot be transitioned in CSS.** Every accordion in both apps jump-cut while its chevron rotated smoothly — the tell that nobody could make it work. This one component is most of why the library took on a motion runtime. |
| `Stagger` / `StaggerItem` | A staggered list needs `staggerChildren` on the parent *and* a matching variant on each direct child. Getting one of the two wrong silently animates nothing. |
| `AnimatedNumber` | Counting with `setState` re-renders the tree 60×/second. A motion value writes straight to the DOM node and re-renders nothing. |

`Collapse` applies `overflow: hidden` inline rather than as a class, so a
caller's `className` cannot accidentally remove the one thing making the clip
work.

---

## Why not CSS

The library used to animate its overlays with three Tailwind utilities —
`animate-fade-in`, `animate-slide-in`, `animate-pop-in` — declared as tier-2
tokens each app was expected to define.

Both failure modes that design has actually happened:

- **The CMS never defined any of them.** `app/globals.css` declares exactly one
  `--animate-*` entry, and it is `--animate-marquee`. So `Modal`, `Drawer` and
  `Popover` rendered there with *no* enter animation at all, silently, for as
  long as they have existed. A green test run in this repo proved nothing,
  because the class strings were correct — the CSS behind them was absent.
- **`animate-shimmer` was never defined anywhere.** `Skeleton`'s `wave` variant
  emitted a class no repo declared, so it rendered as a static bar. It shipped
  that way and was written down as a known gap rather than fixed, because
  fixing it meant changing a CMS-canonical primitive. `wave` now sweeps
  `backgroundPosition` in Motion, needs no token, and works in both apps today.

Both are the §C.3 failure this repo's rules exist to prevent — an unstyled
control in production and a perfectly green test run here — and neither was
catchable from inside the library.

Motion moves the whole thing into JS, where the library controls it end to end.
No token to define, no keyframe to declare, no `@source` scanning to get right,
and the same behaviour in both apps by construction. That is worth the
dependency.

The three `animate-*` entries remain in `TIER2_ANIMATIONS` and in the tier-2
table: they are no longer required by any library primitive, but both apps still
use the utilities in their own components, and removing an export is a breaking
change (§C.6).

---

## Testing against it

**jsdom has no `IntersectionObserver`, and Motion's `whileInView` / `useInView`
construct one with no feature check** — so a component using either does not
merely fail to animate under test, it throws `ReferenceError:
IntersectionObserver is not defined` and takes the test with it.

**The library no longer has this problem.** `Reveal` and `AnimatedNumber` go
through an internal `useInViewSafe`, which checks for the API and reports
*visible* when it is missing. A metric tile should not require an app to stub a
browser API in order to display a number.

App code that reaches for `whileInView` directly still needs a stub. Copy the
one in `src/__tests__/setup.ts` — and note that it reports **intersecting
immediately**. A noop stub is the tempting version and it is worse than nothing:
it type-checks, it stops the crash, and then every revealed element sits at
`opacity: 0` and every counter renders `0` forever, which reads as a broken
component rather than a missing viewport.

When a test needs the *visible* state, render with motion off rather than
faking an intersection:

```tsx
render(
  <AmUiProvider theme={{ motion: { enabled: false } }}>
    <Thing />
  </AmUiProvider>,
)
```

`enabled: false` flattens every variant's transition to zero duration via
`useVariants`, so components land on their target on the first frame and
`AnimatePresence` still unmounts them correctly. Every primitive routes its
variants through that hook — a `variants={someVariant}` written directly is a
bug, because it makes the flag a promise the component does not keep.

### End-to-end suites

Both apps' Playwright suites predate this work and lean on fixed sleeps:

- **CMS** — `tests/app.spec.ts` has 23 hardcoded `waitForTimeout` calls with
  `retries: 0` and a 30s per-test timeout. Animations on the modal and
  confirm-delete paths are kept at or under ~260ms for this reason.
- **AM Campaigns** — `e2e/design-system.spec.ts` reads `getComputedStyle` off the
  live Sign-in button and asserts an exact `height: 40px`. **Never animate
  `scale` on anything containing it**: a mid-flight scale changes the measured
  height and the assertion becomes a coin flip.

---

## Adding an animation to a primitive

1. **Use the vocabulary.** A raw duration or cubic-bezier in a primitive is a
   bug — if none of the five durations fits, the question to answer first is
   which one you actually meant.
2. **Swap the tag, don't add a wrapper.** `<div className="…">` becomes
   `<motion.div className="…">`. Same element, same classes. Several frozen-class
   assertions read `container.firstElementChild`, so a new wrapper fails them —
   and a wrapper changes layout in ways the class strings do not record.
3. **`AnimatePresence` must wrap the conditional, not sit inside it.** The
   `if (!open) return null` pattern early-returns before the element exists;
   nothing can animate its exit from there.
4. **Release side effects on the state change, not on unmount.** An exit
   animation keeps the element mounted for a few hundred milliseconds after
   `open` goes false. Scroll-lock and focus restore have to fire when the state
   flips, or the user is locked out of the page for the length of the animation.
5. **`layoutId` must be unique per instance.** Two tab bars on one page with the
   same id animate into each other. `useId()`.
6. **Show it on the docs site** (§C.12). An animation nobody can trigger is an
   animation nobody trusts — the specimen has to be a real control you can click,
   in all three themes.
