/**
 * Skeleton — content placeholder. Extracted verbatim from the CMS
 * `components/ui/Loading.tsx` so the class strings (and therefore the CMS
 * rendering) are unchanged.
 *
 * Note: the `wave` animation needs an `--animate-shimmer` entry in the
 * consuming app's `@theme`. Neither app defines one today, so `wave` currently
 * degrades to a static bar — preserved as-is rather than silently "fixed",
 * because changing it would change the CMS.
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