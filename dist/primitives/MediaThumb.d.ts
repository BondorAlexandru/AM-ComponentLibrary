/** True when the URL points at something `<img>` cannot render. */
export declare function isVideoUrl(url: string | null | undefined): boolean;
export interface MediaThumbProps {
    /** The media URL. Renders the fallback when empty. */
    src: string | null | undefined;
    alt?: string;
    /** Applied to the underlying `<img>` / `<video>`. */
    className?: string;
    /** Inline styles for the underlying element (e.g. a chosen `objectFit`). */
    style?: React.CSSProperties;
    /** Play badge size for videos. `none` suits thumbnails under ~40px. */
    badge?: "sm" | "md" | "none";
    /** Rendered instead when `src` is empty. */
    fallback?: React.ReactNode;
    /** Passed through to the underlying element, for call sites that hide a dead URL. */
    onError?: React.ReactEventHandler<HTMLImageElement | HTMLVideoElement>;
}
export declare function MediaThumb({ src, alt, className, style, badge, fallback, onError }: MediaThumbProps): import("react").JSX.Element;
//# sourceMappingURL=MediaThumb.d.ts.map