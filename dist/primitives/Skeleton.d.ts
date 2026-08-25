/**
 * Skeleton — content placeholder. Extracted verbatim from the CMS
 * `components/ui/Loading.tsx` so the class strings (and therefore the CMS
 * rendering) are unchanged.
 *
 * `wave` used to emit `animate-shimmer`, which needed an `--animate-shimmer`
 * entry in the consuming app's `@theme` that neither app ever defined — so it
 * rendered as a dead static bar in both. The sweep is driven from Motion now:
 * same gradient classes, no token required, works everywhere. `pulse` still
 * uses `animate-pulse`, which is a Tailwind built-in and needs nothing.
 */
interface SkeletonProps {
    width?: string | number;
    height?: string | number;
    variant?: 'text' | 'circular' | 'rectangular';
    animation?: 'pulse' | 'wave' | 'none';
    className?: string;
}
export declare function Skeleton({ width, height, variant, animation, className, }: SkeletonProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=Skeleton.d.ts.map