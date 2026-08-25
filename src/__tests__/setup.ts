import '@testing-library/jest-dom/vitest'

/**
 * jsdom implements no `IntersectionObserver`, and Motion's `whileInView` /
 * `useInView` construct one with no feature check — so a component using either
 * does not merely fail to animate under test, it throws and takes the test with
 * it. The library itself no longer has that problem (see `useInViewSafe`), but
 * app code that reaches for `whileInView` directly still does, and both apps
 * should copy this.
 *
 * The stub reports **intersecting immediately**. A noop stub is the tempting
 * version and it is worse than nothing: it type-checks, it stops the crash, and
 * then every scroll-revealed element sits at `opacity: 0` and every counter
 * renders `0` forever, which reads as a broken component rather than a missing
 * viewport. jsdom has no viewport at all, so "everything is on screen" is the
 * more honest fiction of the two.
 */
class ImmediateIntersectionObserver implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = ''
  readonly thresholds: ReadonlyArray<number> = []

  constructor(private readonly callback: IntersectionObserverCallback) {}

  observe(target: Element): void {
    const entry = {
      target,
      isIntersecting: true,
      intersectionRatio: 1,
      time: 0,
      boundingClientRect: target.getBoundingClientRect(),
      intersectionRect: target.getBoundingClientRect(),
      rootBounds: null,
    } as IntersectionObserverEntry
    this.callback([entry], this)
  }

  disconnect(): void {}
  unobserve(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}

if (!('IntersectionObserver' in globalThis)) {
  globalThis.IntersectionObserver =
    ImmediateIntersectionObserver as unknown as typeof IntersectionObserver
}

/** Same story: jsdom has no layout engine, so nothing can be measured. */
if (!('ResizeObserver' in globalThis)) {
  globalThis.ResizeObserver = class {
    disconnect(): void {}
    observe(): void {}
    unobserve(): void {}
  } as unknown as typeof ResizeObserver
}
