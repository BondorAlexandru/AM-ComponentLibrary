/**
 * The motion scale.
 *
 * This is the `src/tokens/geometry.ts` of movement, with one deliberate
 * difference: geometry tokens are *literal Tailwind class strings* because
 * Tailwind has to find them by scanning source text, whereas motion runs in JS
 * and never goes near the stylesheet. So these are plain values, and the purge
 * rule (§C.3) does not apply to them — a duration may be computed at runtime.
 *
 * What does carry over from geometry is the reason the scale exists at all:
 * mixed curves and ad-hoc durations are why an interface feels "off" without
 * anyone being able to point at the frame that is wrong. One easing, five
 * durations, three springs. If a component needs a sixth duration, the
 * question to answer first is which of these five it actually meant.
 *
 * The easing is the same curve AM Campaigns' landing page already ships
 * (`../Influencer/src/pages/LandingPage.tsx`), so the marketing page and the
 * product move alike rather than merely looking alike.
 */
/**
 * One easing curve, everywhere. A strong ease-out: quick to commit, slow to
 * settle, which reads as responsive rather than sluggish even at 600ms.
 *
 * Typed as a 4-tuple rather than `number[]` so Motion accepts it as a cubic
 * bezier without a cast at every call site.
 */
export declare const EASE: readonly [number, number, number, number];
/**
 * A softer curve for movement that reverses — a drawer that can slide both
 * ways, a value that can go up or down. `EASE` overshoots the eye on the way
 * out; this one is symmetric enough not to.
 */
export declare const EASE_IN_OUT: readonly [number, number, number, number];
/**
 * Durations, in seconds (Motion's unit — not milliseconds).
 *
 * The names describe the *job*, not the number, so a component picks by intent
 * and the scale can be retuned in one place:
 *
 * - `instant` — a state flip the user already knows about because they caused
 *   it this frame. Hover tints, active states.
 * - `fast` — a small element appearing near the cursor. Tooltips, menu items.
 * - `base` — the default. Anything with no reason to be quicker or slower.
 * - `slow` — something large or far-travelling. Drawers, sheets, page bodies.
 * - `slower` — a deliberate, once-per-session moment. Scroll reveals, onboarding.
 */
export declare const DURATION: {
    readonly instant: 0.12;
    readonly fast: 0.18;
    readonly base: 0.24;
    readonly slow: 0.36;
    readonly slower: 0.6;
};
export type DurationName = keyof typeof DURATION;
/**
 * Springs, for anything the user is physically manipulating — a dragged card,
 * a layout that reflows under a click, a sliding tab indicator. A spring tracks
 * an interrupted gesture gracefully; a fixed-duration tween does not.
 *
 * `visualDuration` is Motion's perceptual-duration API: the spring *looks* like
 * it takes this long regardless of the bounce, which is what makes these
 * comparable to the `DURATION` scale above.
 */
export declare const SPRING: {
    /** Tight and quick. Indicators, small position changes. */
    readonly snappy: {
        readonly type: "spring";
        readonly visualDuration: 0.22;
        readonly bounce: 0.18;
    };
    /** The default spring. Layout changes, cards settling into place. */
    readonly smooth: {
        readonly type: "spring";
        readonly visualDuration: 0.34;
        readonly bounce: 0.22;
    };
    /** Loose and physical. Drag release, playful confirmation. */
    readonly bouncy: {
        readonly type: "spring";
        readonly visualDuration: 0.42;
        readonly bounce: 0.42;
    };
};
export type SpringName = keyof typeof SPRING;
/**
 * The stagger step for a list revealing its children. Slow enough to read as
 * deliberate, fast enough that a twelve-item list is not a loading screen.
 */
export declare const STAGGER = 0.045;
/**
 * Default `whileInView` viewport config: fire once, and start a little before
 * the element is properly on screen. Waiting until it is fully visible means a
 * fast scroll lands on something still blank.
 */
export declare const VIEWPORT: {
    readonly once: true;
    readonly margin: "0px 0px 120px 0px";
};
/** A tween at one of the named durations. The workhorse transition builder. */
export declare function tween(duration?: DurationName, delay?: number): {
    readonly duration: 0.12 | 0.18 | 0.24 | 0.36 | 0.6;
    readonly ease: readonly [number, number, number, number];
    readonly delay: number;
};
//# sourceMappingURL=tokens.d.ts.map