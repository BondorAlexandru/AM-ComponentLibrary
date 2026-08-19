"use client"

import { Film, Play } from "../icons/index.js"

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

const VIDEO_EXTENSIONS = new Set(["mp4", "webm", "ogv", "ogg", "mov", "m4v", "avi", "mkv"])

/** True when the URL points at something `<img>` cannot render. */
export function isVideoUrl(url: string | null | undefined): boolean {
  if (!url) return false
  // Drop the query and hash first — `…/clip.mp4?v=2` and `…/clip.mp4#t=0.1`
  // must both still read as video.
  const path = url.split(/[?#]/)[0]
  const dot = path.lastIndexOf(".")
  if (dot === -1 || dot < path.lastIndexOf("/")) return false
  return VIDEO_EXTENSIONS.has(path.slice(dot + 1).toLowerCase())
}

/**
 * Append the poster-frame fragment so the browser fetches just enough to paint
 * frame one instead of downloading the whole clip. Skipped when the URL already
 * carries a hash, which would otherwise produce a second `#`.
 */
function posterSrc(url: string): string {
  return url.includes("#") ? url : `${url}#t=0.1`
}

export interface MediaThumbProps {
  /** The media URL. Renders the fallback when empty. */
  src: string | null | undefined
  alt?: string
  /** Applied to the underlying `<img>` / `<video>`. */
  className?: string
  /** Inline styles for the underlying element (e.g. a chosen `objectFit`). */
  style?: React.CSSProperties
  /** Play badge size for videos. `none` suits thumbnails under ~40px. */
  badge?: "sm" | "md" | "none"
  /** Rendered instead when `src` is empty. */
  fallback?: React.ReactNode
  /** Passed through to the underlying element, for call sites that hide a dead URL. */
  onError?: React.ReactEventHandler<HTMLImageElement | HTMLVideoElement>
}

export function MediaThumb({ src, alt = "", className, style, badge = "md", fallback = null, onError }: MediaThumbProps) {
  if (!src) return <>{fallback}</>

  if (isVideoUrl(src)) {
    const badgeSize = badge === "sm" ? "w-6 h-6" : "w-9 h-9"
    const iconSize = badge === "sm" ? "w-3 h-3" : "w-4 h-4"
    return (
      <span className="block relative w-full h-full">
        {/* Behind the video: the poster frame needs a metadata fetch, which the
            browser defers in a background tab and skips under data-saver. That
            left the tile blank grey — indistinguishable from "broken". */}
        <span className="absolute inset-0 flex items-center justify-center bg-input pointer-events-none">
          <Film className="w-4 h-4 text-ink-3" />
        </span>
        <video
          src={posterSrc(src)}
          preload="metadata"
          muted
          playsInline
          tabIndex={-1}
          className={`relative ${className ?? ""}`}
          style={style}
          onError={onError}
        />
        {badge !== "none" && (
          <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span
              className={`inline-flex items-center justify-center ${badgeSize} rounded-full bg-black/50 backdrop-blur-sm ring-1 ring-white/20`}
            >
              <Play className={`${iconSize} text-white fill-white`} />
            </span>
          </span>
        )}
      </span>
    )
  }

  /* dynamic CDN media (Bunny CDN) — dimensions unknown */
  /* eslint-disable-next-line @next/next/no-img-element */
  return <img src={src} alt={alt} className={className} style={style} onError={onError} />
}
