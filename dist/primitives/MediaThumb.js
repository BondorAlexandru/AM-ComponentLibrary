"use client";
import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { motion } from "motion/react";
import { Film, Play } from "../icons/index.js";
import { tween } from "../motion/tokens.js";
import { useMotionEnabled } from "../motion/components.js";
/**
 * Shared preview for a media value that is only known as a URL.
 *
 * The media picker deliberately accepts video in image slots (many fields
 * render either), so any editor preview built on a bare `<img src={url}>`
 * shows a broken-image icon the moment an editor picks an .mp4 — the value is
 * correct and the site renders it fine, but the panel looks broken.
 *
 * `MediaLibraryClient` / `MediaPicker` avoid that by branching on the row's
 * `mimeType`. Field editors don't have the row — only the string — so detection
 * here is by extension.
 */
const VIDEO_EXTENSIONS = new Set(["mp4", "webm", "ogv", "ogg", "mov", "m4v", "avi", "mkv"]);
/** True when the URL points at something `<img>` cannot render. */
export function isVideoUrl(url) {
    if (!url)
        return false;
    // Drop the query and hash first — `…/clip.mp4?v=2` and `…/clip.mp4#t=0.1`
    // must both still read as video.
    const path = url.split(/[?#]/)[0];
    const dot = path.lastIndexOf(".");
    if (dot === -1 || dot < path.lastIndexOf("/"))
        return false;
    return VIDEO_EXTENSIONS.has(path.slice(dot + 1).toLowerCase());
}
/**
 * Append the poster-frame fragment so the browser fetches just enough to paint
 * frame one instead of downloading the whole clip. Skipped when the URL already
 * carries a hash, which would otherwise produce a second `#`.
 */
function posterSrc(url) {
    return url.includes("#") ? url : `${url}#t=0.1`;
}
export function MediaThumb({ src, alt = "", className, style, badge = "md", fallback = null, onError }) {
    const enabled = useMotionEnabled();
    // The *URL* that finished loading, not a boolean: changing `src` then has to
    // earn its fade again, without an effect to reset a flag.
    const [loadedSrc, setLoadedSrc] = React.useState(null);
    // A cached image can already be complete before React attaches `onLoad`, in
    // which case the event never fires and the tile would stay at opacity 0
    // forever. The ref catches that case on mount.
    const settle = React.useCallback((el) => {
        if (el?.complete && src)
            setLoadedSrc(src);
    }, [src]);
    if (!src)
        return _jsx(_Fragment, { children: fallback });
    if (isVideoUrl(src)) {
        const badgeSize = badge === "sm" ? "w-6 h-6" : "w-9 h-9";
        const iconSize = badge === "sm" ? "w-3 h-3" : "w-4 h-4";
        return (_jsxs("span", { className: "block relative w-full h-full", children: [_jsx("span", { className: "absolute inset-0 flex items-center justify-center bg-input pointer-events-none", children: _jsx(Film, { className: "w-4 h-4 text-ink-3" }) }), _jsx("video", { src: posterSrc(src), preload: "metadata", muted: true, playsInline: true, tabIndex: -1, className: `relative ${className ?? ""}`, style: style, onError: onError }), badge !== "none" && (_jsx("span", { className: "absolute inset-0 flex items-center justify-center pointer-events-none", children: _jsx("span", { className: `inline-flex items-center justify-center ${badgeSize} rounded-full bg-black/50 backdrop-blur-sm ring-1 ring-white/20`, children: _jsx(Play, { className: `${iconSize} text-white fill-white` }) }) }))] }));
    }
    /* dynamic CDN media (Bunny CDN) — dimensions unknown */
    /* eslint-disable-next-line @next/next/no-img-element */
    return (_jsx(motion.img, { ref: settle, src: src, alt: alt, className: className, style: style, 
        // A grid of thumbnails that each snap in as their bytes land reads as a
        // page still loading long after it has settled. Fading them in makes the
        // arrival order stop mattering.
        initial: enabled ? { opacity: 0 } : false, animate: { opacity: !enabled || loadedSrc === src ? 1 : 0 }, transition: tween('base'), onLoad: () => setLoadedSrc(src), 
        // A dead URL must still resolve to *something* visible — a permanently
        // transparent image is indistinguishable from a blank tile, whereas the
        // browser's broken-image glyph tells the editor what happened.
        onError: (e) => {
            setLoadedSrc(src);
            onError?.(e);
        } }));
}
//# sourceMappingURL=MediaThumb.js.map