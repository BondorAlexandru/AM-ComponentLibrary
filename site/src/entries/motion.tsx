import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, type Variants } from 'motion/react'
import {
  AmUiProvider,
  AnimatedNumber,
  Collapse,
  DURATION,
  EASE,
  EASE_IN_OUT,
  Reveal,
  SPRING,
  STAGGER,
  Stagger,
  StaggerItem,
  VIEWPORT,
  cn,
  collapse,
  fade,
  instantVariants,
  pop,
  popCentered,
  rise,
  riseItem,
  slideFrom,
  staggerList,
  tween,
  useMotionEnabled,
  useVariants,
} from '@am/ui'
import { ChevronDown } from '@am/ui/icons'
import type { DocEntry } from '../types.ts'

/**
 * Motion is the one page where a static specimen is worthless: the whole
 * subject is what happens between two frames. So every specimen here is a
 * control you press, and everything that can be compared is compared in one
 * row, replayed by one button — a table of durations tells you nothing about
 * which one to pick.
 *
 * The little grey buttons are docs chrome (zinc, Tailwind's built-in palette),
 * deliberately not token roles: they have to stay legible on all three canvases
 * and keep working if a token is broken.
 */

/* ── docs chrome ─────────────────────────────────────────────────────────── */

function Ctl({ onClick, children, active }: { onClick: () => void; children: ReactNode; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`rounded px-2 py-1 text-[11.5px] font-medium transition-colors ${
        active ? 'bg-zinc-600 text-zinc-50' : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
      }`}
    >
      {children}
    </button>
  )
}

function Row({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-2">{children}</div>
}

/** A stage a specimen animates inside: dashed, so an empty one still reads as a box. */
function Stage({
  height = 84,
  clip,
  children,
  className,
}: {
  height?: number
  clip?: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'border-hairline relative mt-2 flex w-full items-center justify-center rounded-lg border border-dashed',
        clip && 'overflow-hidden',
        className,
      )}
      style={{ height }}
    >
      {children}
    </div>
  )
}

/* ── the scale ───────────────────────────────────────────────────────────── */

/** Measure the track so the dot travels its real width rather than a magic number. */
function useTrackWidth() {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setWidth(el.clientWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return { ref, width }
}

/**
 * One dot crossing one track. `run` is a remount key: bumping it replays every
 * runner in the group on the same frame, which is the only way to actually
 * compare two durations rather than remember the first one.
 */
function Runner({
  label,
  value,
  transition,
  run,
}: {
  label: string
  value: string
  transition: object
  run: number
}) {
  const { ref, width } = useTrackWidth()
  // Stops short of the end on purpose: a bouncy spring overshoots its target by
  // about a tenth of the distance, and with the dot finishing flush against the
  // right edge the overshoot would leave the track entirely.
  const travel = Math.max(0, width * 0.82 - 14)
  return (
    <div className="flex w-full items-center gap-3">
      <span className="text-ink-2 w-20 shrink-0 font-mono text-[11px]">{label}</span>
      <div ref={ref} className="bg-input relative h-4 min-w-0 flex-1 rounded-full">
        <motion.span
          key={run}
          className="bg-accent absolute top-0.5 left-0.5 h-3 w-3 rounded-full"
          initial={{ x: 0 }}
          animate={{ x: travel }}
          transition={transition}
        />
      </div>
      <span className="text-ink-3 w-32 shrink-0 text-right font-mono text-[10.5px] whitespace-nowrap">{value}</span>
    </div>
  )
}

function DurationLab() {
  const [run, setRun] = useState(0)
  const names = Object.keys(DURATION) as (keyof typeof DURATION)[]
  return (
    <div className="w-full">
      <Row>
        <Ctl onClick={() => setRun((r) => r + 1)}>Replay all five</Ctl>
        <span className="text-ink-3 text-[11.5px]">tween(name) — one easing, five lengths</span>
      </Row>
      <div className="mt-3 flex w-full flex-col gap-2">
        {names.map((n) => (
          <Runner key={n} label={n} value={`${DURATION[n]}s`} transition={tween(n)} run={run} />
        ))}
      </div>
    </div>
  )
}

function SpringLab() {
  const [run, setRun] = useState(0)
  const names = Object.keys(SPRING) as (keyof typeof SPRING)[]
  return (
    <div className="w-full">
      <Row>
        <Ctl onClick={() => setRun((r) => r + 1)}>Replay all four</Ctl>
        <span className="text-ink-3 text-[11.5px]">
          the three springs against a base tween — watch the end, not the start
        </span>
      </Row>
      <div className="mt-3 flex w-full flex-col gap-2">
        {names.map((n) => (
          <Runner
            key={n}
            label={n}
            value={`${SPRING[n].visualDuration}s · bounce ${SPRING[n].bounce}`}
            transition={SPRING[n]}
            run={run}
          />
        ))}
        <Runner label="tween base" value={`${DURATION.base}s`} transition={tween('base')} run={run} />
      </div>
    </div>
  )
}

function EasingLab() {
  const [run, setRun] = useState(0)
  return (
    <div className="w-full">
      <Row>
        <Ctl onClick={() => setRun((r) => r + 1)}>Replay both</Ctl>
        <span className="text-ink-3 text-[11.5px]">both at slower (0.6s), so the curve is what differs</span>
      </Row>
      <div className="mt-3 flex w-full flex-col gap-2">
        <Runner
          label="EASE"
          value="[0.16,1,0.3,1]"
          transition={{ duration: DURATION.slower, ease: EASE }}
          run={run}
        />
        <Runner
          label="EASE_IN_OUT"
          value="[0.65,0,0.35,1]"
          transition={{ duration: DURATION.slower, ease: EASE_IN_OUT }}
          run={run}
        />
      </div>
    </div>
  )
}

/* ── the variants ────────────────────────────────────────────────────────── */

const PANEL = 'bg-surface border-hairline text-ink rounded-[12px] border px-4 py-3 text-[13px] shadow-lg'

/**
 * A variant, entering and leaving on a real toggle.
 *
 * The toggle matters more than it looks: half of these variants have an `exit`
 * that differs from their `hidden`, and an enter-only specimen would never show
 * it. `AnimatePresence` wraps the conditional rather than sitting inside it —
 * the mistake docs/MOTION.md calls out, and the reason the exit plays at all.
 */
function VariantStage({
  variants,
  exitState = 'exit',
  label,
  height,
  clip,
}: {
  variants: Variants
  exitState?: string
  label: string
  height?: number
  clip?: boolean
}) {
  const [on, setOn] = useState(true)
  return (
    <div className="w-full">
      <Row>
        <Ctl onClick={() => setOn((v) => !v)} active={!on}>
          {on ? 'Play exit' : 'Play enter'}
        </Ctl>
      </Row>
      <Stage height={height} clip={clip}>
        <AnimatePresence>
          {on && (
            <motion.div key="panel" className={PANEL} variants={variants} initial="hidden" animate="show" exit={exitState}>
              {label}
            </motion.div>
          )}
        </AnimatePresence>
      </Stage>
    </div>
  )
}

const SLIDE_ANCHOR = {
  left: 'inset-y-0 left-0 w-1/2',
  right: 'inset-y-0 right-0 w-1/2',
  top: 'inset-x-0 top-0 h-1/2',
  bottom: 'inset-x-0 bottom-0 h-1/2',
} as const

function SlideStage({ side }: { side: keyof typeof SLIDE_ANCHOR }) {
  const [on, setOn] = useState(true)
  // Built per render rather than at module scope only because there are four of
  // them here; a real call site should hoist it (`slideFrom` allocates).
  const variants = slideFrom(side)
  return (
    <div className="w-full">
      <Row>
        <Ctl onClick={() => setOn((v) => !v)} active={!on}>
          {on ? 'Play exit' : 'Play enter'}
        </Ctl>
      </Row>
      <Stage height={110} clip>
        <AnimatePresence>
          {on && (
            <motion.div
              key="panel"
              className={cn(
                'bg-surface border-hairline text-ink absolute flex items-center justify-center border text-[12.5px]',
                SLIDE_ANCHOR[side],
              )}
              variants={variants}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              from {side}
            </motion.div>
          )}
        </AnimatePresence>
      </Stage>
    </div>
  )
}

const STAGGER_ROWS = ['Aurelia Skincare', 'Northbank Coffee', 'Vela Athletics', 'Harlow & Finch', 'Studio Meridian']

function StaggerVariantStage() {
  const [on, setOn] = useState(true)
  return (
    <div className="w-full">
      <Row>
        <Ctl onClick={() => setOn((v) => !v)} active={!on}>
          {on ? 'Play exit' : 'Play enter'}
        </Ctl>
        <span className="text-ink-3 text-[11.5px]">exit reverses direction, at half the step</span>
      </Row>
      <Stage height={196} className="items-start justify-start p-2">
        <AnimatePresence>
          {on && (
            <motion.ul
              key="list"
              className="flex w-full flex-col gap-1"
              variants={staggerList}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              {STAGGER_ROWS.map((r) => (
                <motion.li
                  key={r}
                  variants={riseItem}
                  className="bg-surface border-hairline text-ink-2 rounded-lg border px-3 py-1.5 text-[12.5px]"
                >
                  {r}
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </Stage>
    </div>
  )
}

function CollapseVariantStage() {
  const [on, setOn] = useState(true)
  return (
    <div className="w-full">
      <Row>
        <Ctl onClick={() => setOn((v) => !v)} active={!on}>
          {on ? 'Play exit' : 'Play enter'}
        </Ctl>
        <span className="text-ink-3 text-[11.5px]">no exit state — it plays hidden backwards</span>
      </Row>
      <Stage height={130} className="items-start">
        <AnimatePresence initial={false}>
          {on && (
            <motion.div
              key="panel"
              className="text-ink-2 w-full text-[12.5px] leading-relaxed"
              variants={collapse}
              initial="hidden"
              animate="show"
              exit="hidden"
              style={{ overflow: 'hidden' }}
            >
              <div className="px-3 py-2">
                height: auto is measured on every open, so the panel can change size between
                openings and still animate. This is the shape CSS cannot do without a magic-number
                max-height or a ResizeObserver.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Stage>
    </div>
  )
}

/* ── the four primitives ─────────────────────────────────────────────────── */

function RevealDemo({ delay = 0 }: { delay?: number }) {
  const [run, setRun] = useState(0)
  return (
    <div className="w-full">
      <Row>
        <Ctl onClick={() => setRun((r) => r + 1)}>Remount &amp; replay</Ctl>
        <span className="text-ink-3 text-[11.5px]">delay={delay}s</span>
      </Row>
      <Stage height={92}>
        <Reveal key={run} delay={delay} className={PANEL}>
          Revealed on entering the viewport
        </Reveal>
      </Stage>
    </div>
  )
}

function RevealScrollDemo() {
  const [run, setRun] = useState(0)
  return (
    <div className="w-full">
      <Row>
        <Ctl onClick={() => setRun((r) => r + 1)}>Reset</Ctl>
        <span className="text-ink-3 text-[11.5px]">scroll the box — each row fires once, as it arrives</span>
      </Row>
      <div
        key={run}
        className="border-hairline mt-2 h-40 w-full overflow-y-auto rounded-lg border border-dashed p-3"
      >
        <div className="text-ink-3 flex h-28 items-center justify-center text-[12px]">
          ↓ keep scrolling inside this box
        </div>
        {STAGGER_ROWS.map((r, i) => (
          <Reveal key={r} delay={i * 0.05} className={cn(PANEL, 'mb-2 block')}>
            {r}
          </Reveal>
        ))}
        <div className="h-4" />
      </div>
    </div>
  )
}

function CollapseDemo() {
  const [open, setOpen] = useState(false)
  const [long, setLong] = useState(false)
  return (
    <div className="w-full">
      <div className="border-hairline bg-surface w-full overflow-hidden rounded-[12px] border">
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-ink flex w-full items-center justify-between px-3 py-2 text-[13px] font-medium"
        >
          Delivery details
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={SPRING.snappy} className="text-ink-3">
            <ChevronDown size={16} />
          </motion.span>
        </button>
        <Collapse open={open}>
          <div className="text-ink-2 border-hairline border-t px-3 py-2 text-[12.5px] leading-relaxed">
            The chevron and the panel are on the same clock, which is the tell that the height is
            really being animated rather than jump-cut.
            {long && (
              <>
                {' '}
                Press “Change the content” and reopen it: the height is re-measured on every open,
                so a panel that grew still animates to the right place.
              </>
            )}
          </div>
        </Collapse>
      </div>
      <div className="mt-2">
        <Row>
          <Ctl onClick={() => setOpen((v) => !v)} active={open}>
            {open ? 'Close' : 'Open'}
          </Ctl>
          <Ctl onClick={() => setLong((v) => !v)} active={long}>
            Change the content
          </Ctl>
        </Row>
      </div>
    </div>
  )
}

function StaggerDemo({ inView = false }: { inView?: boolean }) {
  const [run, setRun] = useState(0)
  return (
    <div className="w-full">
      <Row>
        <Ctl onClick={() => setRun((r) => r + 1)}>Replay</Ctl>
        <span className="text-ink-3 text-[11.5px]">
          {inView ? 'inView — fires when scrolled to' : `${STAGGER}s between children`}
        </span>
      </Row>
      <Stage height={196} className="items-start justify-start p-2">
        <Stagger key={run} inView={inView} className="flex w-full flex-col gap-1">
          {STAGGER_ROWS.map((r) => (
            <StaggerItem key={r} className="bg-surface border-hairline text-ink-2 rounded-lg border px-3 py-1.5 text-[12.5px]">
              {r}
            </StaggerItem>
          ))}
        </Stagger>
      </Stage>
    </div>
  )
}

function StaggerWrongDemo() {
  const [run, setRun] = useState(0)
  return (
    <div className="w-full">
      <Row>
        <Ctl onClick={() => setRun((r) => r + 1)}>Replay</Ctl>
        <span className="text-ink-3 text-[11.5px]">items nested one level deeper — nothing staggers</span>
      </Row>
      <Stage height={196} className="items-start justify-start p-2">
        <Stagger key={run} className="w-full">
          <div className="flex w-full flex-col gap-1">
            {STAGGER_ROWS.map((r) => (
              <StaggerItem key={r} className="bg-surface border-hairline text-ink-2 rounded-lg border px-3 py-1.5 text-[12.5px]">
                {r}
              </StaggerItem>
            ))}
          </div>
        </Stagger>
      </Stage>
    </div>
  )
}

function AnimatedNumberDemo() {
  const [value, setValue] = useState(12400)
  return (
    <div className="w-full">
      <Row>
        <Ctl onClick={() => setValue((v) => v + 1250)}>+1,250</Ctl>
        <Ctl onClick={() => setValue((v) => Math.max(0, v - 4300))}>−4,300</Ctl>
        <Ctl onClick={() => setValue(Math.round(Math.random() * 90000))}>Randomise</Ctl>
        <Ctl onClick={() => setValue(0)}>Zero</Ctl>
      </Row>
      <Stage height={92}>
        <span className="text-ink font-display text-[34px] leading-none tabular-nums">
          <AnimatedNumber value={value} countOnView={false} />
        </span>
      </Stage>
      <p className="text-ink-3 mt-2 text-[11.5px]">
        value={value} — the first arrival counts from zero, every later change ticks from wherever
        the number currently is.
      </p>
    </div>
  )
}

function AnimatedNumberFormatDemo() {
  const [pct, setPct] = useState(0.42)
  return (
    <div className="w-full">
      <Row>
        <Ctl onClick={() => setPct(Math.random())}>New value</Ctl>
        <Ctl onClick={() => setPct(1)}>100%</Ctl>
      </Row>
      <Stage height={92}>
        <span className="text-accent-text font-display text-[34px] leading-none tabular-nums">
          <AnimatedNumber value={pct} duration={0.6} countOnView={false} format={(v) => `${Math.round(v * 100)}%`} />
        </span>
      </Stage>
      <p className="text-ink-3 mt-2 text-[11.5px]">
        format runs on every frame, so the running value is rounded for display but interpolated at
        full precision.
      </p>
    </div>
  )
}

/* ── the enabled flag ────────────────────────────────────────────────────── */

/** Everything the flag touches, driven entirely by props so both sides move together. */
function MotionSampler({ open, value, run }: { open: boolean; value: number; run: number }) {
  return (
    <div className="flex w-full flex-col gap-2">
      <Reveal key={`r${run}`} className="bg-surface border-hairline text-ink rounded-lg border px-3 py-1.5 text-[12.5px]">
        Reveal
      </Reveal>
      <Collapse open={open}>
        <div className="bg-surface border-hairline text-ink-2 rounded-lg border px-3 py-1.5 text-[12.5px]">
          Collapse — height: auto
        </div>
      </Collapse>
      <Stagger key={`s${run}`} className="flex flex-col gap-1">
        {STAGGER_ROWS.slice(0, 3).map((r) => (
          <StaggerItem key={r} className="bg-input text-ink-2 rounded px-2 py-1 text-[11.5px]">
            {r}
          </StaggerItem>
        ))}
      </Stagger>
      <span className="text-ink font-display text-[24px] leading-none tabular-nums">
        <AnimatedNumber key={`n${run}`} value={value} countOnView={false} />
      </span>
    </div>
  )
}

function MotionOffCompare() {
  const [open, setOpen] = useState(true)
  const [value, setValue] = useState(4820)
  const [run, setRun] = useState(0)
  return (
    <div className="w-full">
      <Row>
        <Ctl onClick={() => setOpen((v) => !v)} active={open}>
          Toggle the Collapse
        </Ctl>
        <Ctl onClick={() => setValue(Math.round(Math.random() * 20000))}>New number</Ctl>
        <Ctl onClick={() => setRun((r) => r + 1)}>Replay the rest</Ctl>
      </Row>
      <div className="mt-3 grid w-full gap-3 sm:grid-cols-2">
        <div className="border-hairline rounded-lg border border-dashed p-3">
          <p className="text-ink-3 mb-2 font-mono text-[11px]">no provider — animation on</p>
          <MotionSampler open={open} value={value} run={run} />
        </div>
        <div className="border-hairline rounded-lg border border-dashed p-3">
          <p className="text-ink-3 mb-2 font-mono text-[11px]">theme=&#123;&#123; motion: &#123; enabled: false &#125; &#125;&#125;</p>
          <AmUiProvider theme={{ motion: { enabled: false } }}>
            <MotionSampler open={open} value={value} run={run} />
          </AmUiProvider>
        </div>
      </div>
    </div>
  )
}

/* ── hooks and helpers, as readouts ──────────────────────────────────────── */

function EnabledReadout({ label }: { label: string }) {
  const on = useMotionEnabled()
  return (
    <span className="flex items-center gap-2 font-mono text-[11.5px] text-zinc-400">
      useMotionEnabled() →{' '}
      <span className={on ? 'text-emerald-400' : 'text-amber-400'}>{String(on)}</span>
      <span className="text-zinc-500">— {label}</span>
    </span>
  )
}

function VariantsReadout({ label }: { label: string }) {
  const v = useVariants(pop)
  return (
    <div className="min-w-0 flex-1">
      <p className="mb-1 font-mono text-[11px] text-zinc-500">{label}</p>
      <pre className="overflow-x-auto rounded border border-zinc-800 bg-zinc-950 p-2 font-mono text-[11px] text-zinc-300">
        <code>{`show: ${JSON.stringify(v.show)}`}</code>
      </pre>
    </div>
  )
}

function HooksReadout() {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-col gap-1">
        <EnabledReadout label="outside a provider" />
        <AmUiProvider theme={{ motion: { enabled: false } }}>
          <EnabledReadout label="inside enabled: false" />
        </AmUiProvider>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <VariantsReadout label="useVariants(pop) — default" />
        <AmUiProvider theme={{ motion: { enabled: false } }}>
          <VariantsReadout label="useVariants(pop) — enabled: false" />
        </AmUiProvider>
      </div>
    </div>
  )
}

function ValuesTable({ rows }: { rows: [string, string][] }) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-zinc-800">
      <table className="w-full border-collapse text-left text-[12px]">
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k} className="border-t border-zinc-800 first:border-0 align-top">
              <td className="px-3 py-1.5 font-mono whitespace-nowrap text-zinc-300">{k}</td>
              <td className="px-3 py-1.5 font-mono text-[11.5px] break-all text-emerald-400">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const SCALE_VALUES: [string, string][] = [
  ['EASE', JSON.stringify(EASE)],
  ['EASE_IN_OUT', JSON.stringify(EASE_IN_OUT)],
  ['DURATION', JSON.stringify(DURATION)],
  ['SPRING.snappy', JSON.stringify(SPRING.snappy)],
  ['SPRING.smooth', JSON.stringify(SPRING.smooth)],
  ['SPRING.bouncy', JSON.stringify(SPRING.bouncy)],
  ['STAGGER', String(STAGGER)],
  ['VIEWPORT', JSON.stringify(VIEWPORT)],
  ["tween()", JSON.stringify(tween())],
  ["tween('slow', 0.2)", JSON.stringify(tween('slow', 0.2))],
]

const INSTANT_VALUES: [string, string][] = [
  ['pop.show', JSON.stringify(pop.show)],
  ['instantVariants(pop).show', JSON.stringify(instantVariants(pop).show)],
  ['fade.exit', JSON.stringify(fade.exit)],
  ['instantVariants(fade).exit', JSON.stringify(instantVariants(fade).exit)],
]

/* ── the entry ───────────────────────────────────────────────────────────── */

export const motionEntry: DocEntry = {
  id: 'motion',
  name: 'Motion',
  group: 'Foundations',
  origin: 'library',
  covers: [
    'EASE',
    'EASE_IN_OUT',
    'DURATION',
    'SPRING',
    'STAGGER',
    'VIEWPORT',
    'tween',
    'fade',
    'rise',
    'pop',
    'popCentered',
    'slideFrom',
    'staggerList',
    'riseItem',
    'collapse',
    'AmUiMotionConfig',
    'Reveal',
    'Collapse',
    'Stagger',
    'StaggerItem',
    'AnimatedNumber',
    'useMotionEnabled',
    'useVariants',
    'instantVariants',
  ],
  imports:
    "import { AmUiMotionConfig, Reveal, Collapse, Stagger, StaggerItem, AnimatedNumber } from '@am/ui'\nimport { DURATION, SPRING, tween, fade, rise, pop } from '@am/ui'   // also '@am/ui/motion'",
  summary:
    'The shared movement vocabulary, built on Motion (motion.dev): one easing curve, five durations named by job, three springs, and seven variants every enter and exit in the library is made of. Reach for it whenever a component needs to move — a raw duration or a hand-written cubic-bezier in a primitive is a bug, because mixed curves are why an interface feels “off” without anyone being able to name the frame that is wrong.',
  props: [
    {
      title: 'Reveal',
      rows: [
        { name: 'delay', type: 'number', default: '0', note: 'Seconds to hold after the element enters the viewport. Stagger a column of cards by hand when they are not siblings of one Stagger.' },
        { name: 'as', type: "'div' | 'li' | 'section'", default: "'div'", note: 'Pick li inside a list so revealing a row does not put a div between ul and li and invalidate the markup.' },
        { name: 'className', type: 'string', note: 'Goes on the animated element itself — Reveal adds no wrapper, so your layout classes still apply where you put them.' },
        { name: '…rest', type: 'HTMLAttributes<HTMLDivElement>', note: 'Forwarded. Handlers, data-*, id.' },
      ],
    },
    {
      title: 'Collapse',
      rows: [
        { name: 'open', type: 'boolean', required: true, note: 'Controlled. Closing keeps the panel mounted until the exit finishes, so anything you release on unmount has to be released here instead.' },
        { name: 'className', type: 'string', note: 'On the clipping element. Put padding on a child, not here — padding on the collapsing box is animated to zero along with the height and reads as a squash.' },
        { name: 'children', type: 'ReactNode', note: 'Measured on every open, so it may change size between openings.' },
      ],
    },
    {
      title: 'Stagger',
      rows: [
        { name: 'inView', type: 'boolean', default: 'false', note: 'Wait for the viewport instead of running on mount. Use it for a list below the fold; leave it off for one the user just caused to appear.' },
        { name: 'className', type: 'string', note: 'On the container. The layout classes go here — the sequence is a transition, not a layout.' },
        { name: 'children', type: 'ReactNode', note: 'Must be StaggerItems as *direct* children. One extra wrapper div and nothing staggers — there is a specimen of that failure below.' },
        { name: '…rest', type: 'HTMLAttributes<HTMLDivElement>', note: 'Forwarded to the container.' },
      ],
    },
    {
      title: 'StaggerItem',
      rows: [
        { name: 'as', type: "'div' | 'li'", default: "'div'", note: 'li when the Stagger is a list, so the sequence does not cost you valid markup.' },
        { name: 'className', type: 'string', note: 'On the item. It carries riseItem, so do not add your own initial/animate — they would win and break the sequence.' },
        { name: 'children', type: 'ReactNode', note: 'One row of the list.' },
      ],
    },
    {
      title: 'AnimatedNumber',
      rows: [
        { name: 'value', type: 'number', required: true, note: 'The target. Changing it ticks from the current running value rather than restarting at zero, which is what makes a live figure readable.' },
        { name: 'duration', type: 'number', default: '1.1', note: 'Seconds. Longer than anything on the DURATION scale on purpose — a counter is content being read, not a control responding.' },
        { name: 'countOnView', type: 'boolean', default: 'true', note: 'Hold at zero until scrolled to. Set false for a figure that must be correct even where nothing reports visibility — a headless render, a stubbed observer, a tile inside a modal.' },
        { name: 'format', type: '(value: number) => string', default: 'rounded, locale-grouped', note: 'Runs every frame on the interpolated value, so this is where a percentage, a currency or a suffix goes.' },
        { name: 'className', type: 'string', note: 'On the outer span. Size and colour it here; the inner span is the one Motion writes to.' },
      ],
    },
    {
      title: 'The scale',
      rows: [
        { name: 'EASE', type: '[number, number, number, number]', default: '[0.16, 1, 0.3, 1]', note: 'The curve for everything. Quick to commit, slow to settle — reads as responsive even at 600ms.' },
        { name: 'EASE_IN_OUT', type: '[number, number, number, number]', default: '[0.65, 0, 0.35, 1]', note: 'Only for movement that reverses: a drawer that slides both ways, a figure that can go up or down. EASE overshoots the eye coming back; this one does not.' },
        { name: 'DURATION', type: "Record<'instant'|'fast'|'base'|'slow'|'slower', number>", default: '0.12 … 0.6', note: 'Seconds, named by job so a component picks by intent and the scale can be retuned in one place. If none of the five fits, work out which one you actually meant.' },
        { name: 'SPRING', type: "Record<'snappy'|'smooth'|'bouncy', Transition>", note: 'For anything the user physically manipulates — a sliding indicator, a card settling. A spring survives an interrupted gesture; a fixed tween does not.' },
        { name: 'STAGGER', type: 'number', default: '0.045', note: 'The step between children in a revealing list. Slow enough to read as deliberate, fast enough that twelve rows are not a loading screen.' },
        { name: 'VIEWPORT', type: '{ once, margin }', default: "{ once: true, margin: '0px 0px 120px 0px' }", note: 'The whileInView config. Fires a little early so a fast scroll never lands on something still blank, and once so scrolling past twice is not unpleasant.' },
        { name: 'tween(name, delay)', type: "(DurationName, number) => Transition", default: "('base', 0)", note: 'The workhorse builder — a tween at one of the five durations, on the one curve. Use it instead of writing { duration, ease } by hand.' },
      ],
    },
    {
      title: 'The variants',
      rows: [
        { name: 'fade', type: 'Variants', note: 'Opacity only. Scrims, tab panels, anything with no direction to it.' },
        { name: 'rise', type: 'Variants', note: 'Opacity + y:22, at the slower duration. Scroll reveals and page bodies. Its show is a function, so a delay can be passed through Motion’s custom prop.' },
        { name: 'pop', type: 'Variants', note: 'Opacity + scale 0.96 + a 4px drop, on a snappy spring. Everything that opens near where you clicked: Menu, Dropdown, Popover.' },
        { name: 'popCentered', type: 'Variants', note: 'pop for something already in the middle of the screen — it rises instead of dropping. Modal and ConfirmDialog.' },
        { name: 'slideFrom(side)', type: "(side) => Variants", note: 'Off one edge by 100% of the element’s own size, so one variant serves a 320px panel and a full-height sheet without measuring either.' },
        { name: 'staggerList', type: 'Variants', note: 'The container half of a sequenced list. On its own it animates nothing — it only drives children.' },
        { name: 'riseItem', type: 'Variants', note: 'The child half. Must sit on the *direct* child of the staggerList container or the sequence silently does nothing.' },
        { name: 'collapse', type: 'Variants', note: 'height: auto, measured per open. The one shape CSS cannot do, and most of why the library took on a motion runtime.' },
      ],
    },
    {
      title: 'Wiring and escape hatches',
      rows: [
        { name: 'AmUiMotionConfig', type: 'ComponentType<{ children }>', note: 'Mount once at the app root. That is the whole integration — it renders MotionConfig reducedMotion="user", which makes every Motion component below it drop transforms and keep opacity for anyone whose OS asks for less movement.' },
        { name: 'useMotionEnabled()', type: '() => boolean', default: 'true', note: 'Reads theme.motion.enabled. Branch on it when a component animates without variants — a whileHover, a keyframe loop, a layoutId.' },
        { name: 'useVariants(variants)', type: '(Variants) => Variants', note: 'Route every variants={…} in the library through this. Skip it and theme.motion.enabled becomes a promise the component does not keep.' },
        { name: 'instantVariants(variants)', type: '(Variants) => Variants', note: 'The non-hook version: keeps the targets, strips the timing. The animation still runs, it just takes no time — which is why AnimatePresence still unmounts correctly with motion off.' },
      ],
    },
  ],
  notes: [
    'AnimatePresence must wrap the conditional, not sit inside it. The `if (!open) return null` pattern early-returns before the element exists, so nothing can animate its exit from there — that shape is why the overlays used to have no exit at all.',
    'Release side effects on the state change, not on unmount. An exit keeps the element mounted for a few hundred milliseconds after `open` goes false, so a scroll lock or focus restore cleaned up on unmount locks the user out of the page for the length of the animation.',
    'layoutId must be unique per instance. Two tab bars on one page sharing an id animate into each other — Tabs and SegmentedControl build theirs from useId() for exactly this reason.',
    'Motion’s whileInView and useInView construct an IntersectionObserver with no feature check, so they throw outright in jsdom rather than merely not animating. The library’s own components do not: Reveal and AnimatedNumber go through an internal guard that reports *visible* when the API is missing. App code reaching for whileInView directly still needs the stub in src/__tests__/setup.ts — and that stub reports intersecting immediately, because a noop one type-checks, stops the crash, and then leaves every reveal at opacity 0 forever.',
    'Every variant animates opacity, and that is load-bearing rather than stylistic: reducedMotion="user" works by dropping transforms and keeping opacity, so a variant that moved without fading would simply teleport. A test enforces it, along with a cap of two transforms per state.',
    'The three animate-* utilities (animate-fade-in, animate-slide-in, animate-pop-in) are no longer required by any primitive. They are still exported and both apps still use them in their own components, so nothing was removed — but a component here should reach for a variant, not a class. See the Tokens page.',
    'theme.motion.enabled: false is for screenshot harnesses and test runners, not for reduced motion. AmUiMotionConfig already handles that better, per animation rather than all or nothing.',
    'This docs site mounts AmUiMotionConfig at its root, so every specimen on every page is running under reducedMotion="user". If your OS is set to reduce motion, the specimens below will fade without moving — that is the feature, not a broken page.',
  ],
  states: [
    {
      title: 'The duration scale',
      note: 'Five identical dots, one per duration, replayed together. This is the only honest way to choose between 0.18s and 0.24s — the numbers are indistinguishable on paper and obvious side by side.',
      cols: 1,
      items: [
        { label: 'DURATION — all five, one click', wide: true, node: <DurationLab /> },
        { label: 'EASE vs EASE_IN_OUT', note: 'Same length, different curve. EASE arrives fast and settles; EASE_IN_OUT leaves and lands at the same rate.', wide: true, node: <EasingLab /> },
      ],
    },
    {
      title: 'The springs',
      note: 'All three use Motion’s visualDuration, so they stay comparable to the tweens regardless of bounce. The tween at the bottom is the reference — watch how the springs settle past their target and come back.',
      cols: 1,
      items: [{ label: 'SPRING — snappy, smooth, bouncy, and a tween', wide: true, node: <SpringLab /> }],
    },
    {
      title: 'The variants — enter and exit',
      note: 'Each toggle plays the real thing in both directions. Several of these have an exit that is not their entrance reversed, which an enter-only demo would never show.',
      cols: 2,
      items: [
        { label: 'fade', note: 'Opacity only — no direction.', node: <VariantStage variants={fade} label="fade" /> },
        { label: 'rise', note: 'The scroll-reveal shape: 22px up, at slower.', node: <VariantStage variants={rise} label="rise" height={110} /> },
        { label: 'pop', note: 'Menu, Dropdown, Popover. Scale floor is 0.96 — below ~0.94 the type reflows and it reads as cheap.', node: <VariantStage variants={pop} label="pop" /> },
        { label: 'popCentered', note: 'Modal. Rises rather than drops, because it is already centred.', node: <VariantStage variants={popCentered} label="popCentered" /> },
        { label: 'collapse', note: 'The one CSS cannot do. No exit state — the exit is hidden, played forwards.', wide: true, node: <CollapseVariantStage /> },
        { label: 'staggerList + riseItem', wide: true, node: <StaggerVariantStage /> },
      ],
    },
    {
      title: 'slideFrom — one variant, four edges',
      note: 'The offset is 100% of the element’s own size, so the same variant works for a narrow filter panel and a full-height sheet. Each stage clips, which is what makes the edge readable.',
      cols: 2,
      items: [
        { label: "slideFrom('left')", node: <SlideStage side="left" /> },
        { label: "slideFrom('right')", note: 'What Drawer uses.', node: <SlideStage side="right" /> },
        { label: "slideFrom('top')", node: <SlideStage side="top" /> },
        { label: "slideFrom('bottom')", note: 'The mobile sheet shape.', node: <SlideStage side="bottom" /> },
      ],
    },
    {
      title: 'Reveal',
      note: 'Fires once, the first time it is scrolled to, then stops being involved. Because “once” means you cannot replay it by scrolling, each specimen has a remount button.',
      cols: 2,
      items: [
        { label: 'default', node: <RevealDemo /> },
        { label: 'delay={0.3}', note: 'For hand-sequencing elements that are not siblings of one Stagger.', node: <RevealDemo delay={0.3} /> },
        { label: 'in a scroll container', note: 'Scroll down inside the box. Each row fires as it arrives, and does not re-fire on the way back up.', wide: true, node: <RevealScrollDemo /> },
      ],
    },
    {
      title: 'Collapse',
      note: 'A real disclosure. The chevron and the panel share a clock — that is the difference from the accordions both apps shipped, where the chevron rotated smoothly over a panel that jump-cut.',
      cols: 2,
      items: [
        { label: 'a disclosure, open and closed', node: <CollapseDemo /> },
        {
          label: 'the clip is inline, not a class',
          note: 'overflow: hidden is set as an inline style so a caller’s className cannot remove the one thing making the clip work.',
          raw: true,
          node: <ValuesTable rows={[['<Collapse className="px-4">', 'style="overflow: hidden"'], ['open → false', 'stays mounted until the exit finishes']]} />,
        },
      ],
    },
    {
      title: 'Stagger & StaggerItem',
      note: 'A pair, and it only works as a pair. The second specimen is the failure mode: one wrapper div between the container and the items, and the sequence silently does nothing.',
      cols: 2,
      items: [
        { label: 'on mount', node: <StaggerDemo /> },
        { label: 'inView', node: <StaggerDemo inView /> },
        { label: 'the wrong shape — items nested one level deep', note: 'staggerChildren only reaches direct children. Everything still appears; nothing is sequenced. Compare it against the first specimen.', wide: true, node: <StaggerWrongDemo /> },
      ],
    },
    {
      title: 'AnimatedNumber',
      note: 'Press the buttons more than once. The interesting case is not the count from zero — it is the second change, which ticks from wherever the number currently is instead of restarting.',
      cols: 2,
      items: [
        { label: 'a live figure', node: <AnimatedNumberDemo /> },
        { label: 'with a format function', node: <AnimatedNumberFormatDemo /> },
      ],
    },
    {
      title: 'theme.motion.enabled: false',
      note: 'The same four primitives, the same controls, driven by the same state — the right-hand column is wrapped in AmUiProvider theme={{ motion: { enabled: false } }}. It lands on the end state on frame one and still mounts and unmounts correctly, which is what makes it usable in a screenshot harness.',
      cols: 1,
      items: [{ label: 'side by side, one set of controls', wide: true, node: <MotionOffCompare /> }],
    },
    {
      title: 'The hooks',
      note: 'useVariants is how the flag reaches a component. It keeps the targets and flattens the timing to zero — the animation still runs, it just takes no time, so AnimatePresence still unmounts on exit.',
      cols: 1,
      items: [{ label: 'useMotionEnabled and useVariants, inside and outside a provider', wide: true, raw: true, node: <HooksReadout /> }],
    },
    {
      title: 'The values themselves',
      note: 'For when you need the actual number — but pick a duration by watching the row above, not by reading this table.',
      cols: 1,
      items: [
        { label: 'the scale, as exported', wide: true, raw: true, node: <ValuesTable rows={SCALE_VALUES} /> },
        { label: 'instantVariants — targets kept, timing stripped', wide: true, raw: true, node: <ValuesTable rows={INSTANT_VALUES} /> },
      ],
    },
  ],
}
