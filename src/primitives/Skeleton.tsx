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

'use client'

import { motion } from 'motion/react'
import { cn } from '../lib/cn.js'
import { DURATION } from '../motion/tokens.js'
import { useMotionEnabled } from '../motion/components.js'


interface SkeletonProps {
  width?: string | number
  height?: string | number
  variant?: 'text' | 'circular' | 'rectangular'
  animation?: 'pulse' | 'wave' | 'none'
  className?: string
}

export function Skeleton({
  width = '100%',
  height = '1rem',
  variant = 'rectangular',
  animation = 'pulse',
  className = '',
}: SkeletonProps) {
  const widthStyle = typeof width === 'number' ? `${width}px` : width
  const heightStyle = typeof height === 'number' ? `${height}px` : height
  const enabled = useMotionEnabled()

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  }

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'bg-gradient-to-r from-input via-hairline to-input bg-[length:200%_100%]',
    none: '',
  }

  const classes = cn(`
        bg-input
        ${variantClasses[variant]}
        ${animationClasses[animation]}`, className)
  const style = { width: widthStyle, height: heightStyle }

  if (animation === 'wave' && enabled) {
    return (
      <motion.div
        className={classes}
        style={style}
        // The gradient is 200% wide, so sweeping the position by 400% carries
        // it fully across and back to where it started — a loop with no seam.
        animate={{ backgroundPosition: ['200% 0%', '-200% 0%'] }}
        transition={{
          // A shimmer is ambient: it has to outlast every duration on the
          // scale or it reads as an error state blinking at you. Twice the
          // longest one, so it still moves when the scale is retuned.
          duration: DURATION.slower * 2,
          // The one place a named linear is right — any ease leaves a visible
          // stall at the loop point.
          ease: 'linear',
          repeat: Infinity,
          repeatType: 'loop',
        }}
      />
    )
  }

  return <div className={classes} style={style} />
}
