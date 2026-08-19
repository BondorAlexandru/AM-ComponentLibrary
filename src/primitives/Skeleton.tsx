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

'use client'


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

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  }

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer bg-gradient-to-r from-input via-hairline to-input bg-[length:200%_100%]',
    none: '',
  }

  return (
    <div
      className={`
        bg-input
        ${variantClasses[variant]}
        ${animationClasses[animation]}
        ${className}
      `}
      style={{ width: widthStyle, height: heightStyle }}
    />
  )
}
