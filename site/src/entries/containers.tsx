import {
  Button,
  Card,
  EmptyDocumentsIcon,
  EmptyImageIcon,
  EmptySearchIcon,
  EmptyState,
  MediaThumb,
  Skeleton,
  isVideoUrl,
} from '@am/ui'
import { Image, Plus } from '@am/ui/icons'
import type { DocEntry } from '../types.ts'

export const cardEntry: DocEntry = {
  id: 'card',
  name: 'Card',
  group: 'Containers',
  origin: 'cms',
  frozen: true,
  covers: ['Card', 'CardHeader', 'CardFooter', 'CardSection'],
  imports: "import { Card } from '@am/ui'   // Card.Header / Card.Footer / Card.Section",
  summary:
    'The surface panel: 12px radius, hairline border, on the surface role rather than the canvas. Header, Footer and Section are attached to Card as a namespace, so a whole card reads as one block at the call site.',
  props: [
    {
      title: 'Card',
      rows: [
        { name: 'padding', type: "'none' | 'sm' | 'md' | 'lg'", default: "'md'", note: 'md and lg are responsive (p-4 md:p-6 / p-6 md:p-8). Use none when a child needs to bleed to the edge — a table or an image.' },
        { name: 'shadow', type: "'none' | 'sm' | 'md' | 'lg'", default: "'sm'", note: 'Hardcoded rgba values, not the shadow tokens, so they read correctly on the CMS’s dark canvas as well as light.' },
        { name: 'border', type: 'boolean', default: 'true', note: 'The hairline. Turn it off when the card sits inside another bordered container.' },
        { name: 'hover', type: 'boolean', default: 'false', note: 'Border brightens to line on hover and the cursor becomes a pointer. Set it when the whole card is a link.' },
        { name: 'onClick', type: '() => void', note: 'Also sets a pointer cursor. Note this puts a click handler on a div — for keyboard reachability wrap or nest a real button.' },
      ],
    },
    {
      title: 'Card.Header',
      rows: [
        { name: 'title', type: 'string', required: true, note: 'Truncates rather than wrapping.' },
        { name: 'subtitle', type: 'string', note: 'One line, also truncated.' },
        { name: 'action', type: 'ReactNode', note: 'Right-aligned, does not shrink. A Button, an IconButton or a Menu.' },
      ],
    },
  ],
  notes: [
    'onClick lands on a div with no role or tabIndex — a card that is genuinely a navigation target should contain a real link or button rather than relying on it.',
  ],
  states: [
    {
      title: 'Padding',
      cols: 2,
      items: (['none', 'sm', 'md', 'lg'] as const).map((p) => ({
        label: `padding="${p}"`,
        node: <div className="w-full"><Card padding={p}><p className="text-ink text-[13px]">Padding {p}</p></Card></div>,
      })),
    },
    {
      title: 'Shadow',
      note: 'Look at these in the CMS dark theme too — a shadow tuned only for light disappears on a near-black canvas.',
      cols: 2,
      items: (['none', 'sm', 'md', 'lg'] as const).map((s) => ({
        label: `shadow="${s}"`,
        node: <div className="w-full p-2"><Card shadow={s}><p className="text-ink text-[13px]">Shadow {s}</p></Card></div>,
      })),
    },
    {
      title: 'Borders and hover',
      cols: 2,
      items: [
        { label: 'border={false}', node: <div className="w-full"><Card border={false}><p className="text-ink text-[13px]">No border</p></Card></div> },
        { label: 'hover', note: 'Hover it — the border steps from hairline to line.', node: <div className="w-full"><Card hover><p className="text-ink text-[13px]">Hover me</p></Card></div> },
      ],
    },
    {
      title: 'Composed',
      cols: 1,
      items: [
        {
          label: 'Card + Header + Section + Footer',
          note: 'The full anatomy. Header truncates, Section adds a titled block, Footer sits above a hairline rule.',
          wide: true,
          node: (
            <div className="w-full max-w-xl">
              <Card>
                <Card.Header
                  title="Autumn skincare launch"
                  subtitle="12 pieces · 4 creators · goes live 3 Sept"
                  action={<Button size="sm" variant="secondary">Edit</Button>}
                />
                <Card.Section title="Brief">
                  <p className="text-ink-2 text-[13px] leading-relaxed">
                    Three reels per creator, shot in daylight, product visible in the first two seconds.
                  </p>
                </Card.Section>
                <Card.Footer>
                  <span className="text-ink-3 text-[12px]">Updated 2 hours ago</span>
                  <Button size="sm">Review</Button>
                </Card.Footer>
              </Card>
            </div>
          ),
        },
        {
          label: 'long title truncation',
          note: 'Header truncates instead of wrapping, so a card in a grid keeps its height.',
          wide: true,
          node: (
            <div className="w-full max-w-sm">
              <Card>
                <Card.Header
                  title="An extremely long campaign name that will certainly not fit on one line"
                  subtitle="And a subtitle that is also far too long to sit comfortably here"
                  action={<Button size="sm" variant="ghost">Open</Button>}
                />
              </Card>
            </div>
          ),
        },
      ],
    },
  ],
}

export const emptyStateEntry: DocEntry = {
  id: 'empty-state',
  name: 'EmptyState',
  group: 'Containers',
  origin: 'cms',
  frozen: true,
  covers: ['EmptyState', 'EmptyDocumentsIcon', 'EmptySearchIcon', 'EmptyImageIcon'],
  imports: "import { EmptyState, EmptyDocumentsIcon } from '@am/ui'",
  summary:
    'The nothing-here state. Say what is missing and give one way out of it — an empty state without an action is a dead end. Ships with three illustration icons for the common cases.',
  props: [
    {
      rows: [
        { name: 'title', type: 'string', required: true, note: 'What is missing, in the user’s words.' },
        { name: 'description', type: 'string', note: 'Why it is empty or what to do. Capped at max-w-md so it stays readable.' },
        { name: 'icon', type: 'ReactNode', note: 'Sized by the size prop (48/64/80px box). The bundled Empty*Icons are drawn for that box.' },
        { name: 'action', type: 'ReactNode', note: 'The way out. Almost always a Button.' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", note: 'Vertical padding and icon box: py-8/12/16.' },
        { name: 'chrome', type: 'boolean', default: 'true', note: 'The surface card around it. Set false when nesting inside a panel that already has a border — otherwise you get two.' },
      ],
    },
  ],
  notes: [
    'chrome is the only prop added on top of the CMS original, and it defaults to true so the CMS is unchanged. AM Campaigns passes false because its empty states live inside board columns and drawers.',
  ],
  states: [
    {
      title: 'Sizes',
      cols: 1,
      items: (['sm', 'md', 'lg'] as const).map((s) => ({
        label: `size="${s}"`,
        wide: true,
        node: <div className="w-full"><EmptyState size={s} icon={<EmptyDocumentsIcon className="h-full w-full" />} title="No pages yet" description="Create your first page to start building this site." action={<Button size="sm" leftIcon={<Plus size={14} />}>New page</Button>} /></div>,
      })),
    },
    {
      title: 'chrome',
      note: 'The difference is the border and surface fill. Both are shown inside a bordered container so you can see the double-border problem chrome={false} exists to solve.',
      cols: 1,
      items: [
        { label: 'chrome (default)', wide: true, node: <div className="border-line w-full rounded-[12px] border p-3"><EmptyState size="sm" title="Nested with chrome" description="Two borders — one from the panel, one from the empty state." /></div> },
        { label: 'chrome={false}', wide: true, node: <div className="border-line w-full rounded-[12px] border p-3"><EmptyState size="sm" chrome={false} title="Nested without chrome" description="One border. This is what AM Campaigns uses." /></div> },
      ],
    },
    {
      title: 'Content combinations',
      cols: 1,
      items: [
        { label: 'title only', wide: true, node: <div className="w-full"><EmptyState size="sm" title="Nothing to show" /></div> },
        { label: 'title + description', wide: true, node: <div className="w-full"><EmptyState size="sm" title="No results" description="Try a different search term, or clear your filters." /></div> },
        { label: 'no icon, with action', wide: true, node: <div className="w-full"><EmptyState size="sm" title="No team members" description="Invite someone to collaborate." action={<Button size="sm">Invite</Button>} /></div> },
      ],
    },
    {
      title: 'The bundled icons',
      note: 'Drawn on a 156-unit box with a 10%-opacity backing circle, so they read as illustration rather than as a UI glyph.',
      cols: 3,
      items: [
        { label: 'EmptyDocumentsIcon', node: <div className="text-ink-3 h-16 w-16"><EmptyDocumentsIcon className="h-full w-full" /></div> },
        { label: 'EmptySearchIcon', node: <div className="text-ink-3 h-16 w-16"><EmptySearchIcon className="h-full w-full" /></div> },
        { label: 'EmptyImageIcon', node: <div className="text-ink-3 h-16 w-16"><EmptyImageIcon className="h-full w-full" /></div> },
      ],
    },
  ],
}

export const skeletonEntry: DocEntry = {
  id: 'skeleton',
  name: 'Skeleton',
  group: 'Containers',
  origin: 'cms',
  frozen: true,
  covers: ['Skeleton'],
  imports: "import { Skeleton } from '@am/ui'",
  summary:
    'A content placeholder sized to the thing it stands in for. Prefer it over a centred spinner when you know the shape of what is loading — the layout does not jump when the data lands.',
  props: [
    {
      rows: [
        { name: 'width', type: 'string | number', default: "'100%'", note: 'A number is treated as px.' },
        { name: 'height', type: 'string | number', default: "'1rem'", note: 'A number is treated as px.' },
        { name: 'variant', type: "'text' | 'circular' | 'rectangular'", default: "'rectangular'", note: 'Only the border radius changes: rounded / rounded-full / rounded-md.' },
        { name: 'animation', type: "'pulse' | 'wave' | 'none'", default: "'pulse'", note: 'See the note below — wave does not currently animate in either app.' },
      ],
    },
  ],
  notes: [
    'animation="wave" is inert. It needs an --animate-shimmer entry in the consuming app’s @theme, and neither app defines one, so wave renders as a static bar. It is preserved rather than fixed because changing it would change the CMS.',
  ],
  states: [
    {
      title: 'Variants',
      cols: 3,
      items: [
        { label: "variant='text'", node: <div className="w-full"><Skeleton variant="text" /></div> },
        { label: "variant='rectangular'", node: <div className="w-full"><Skeleton variant="rectangular" height={48} /></div> },
        { label: "variant='circular'", node: <Skeleton variant="circular" width={40} height={40} /> },
      ],
    },
    {
      title: 'Animations',
      cols: 3,
      items: [
        { label: "animation='pulse'", note: 'The default — opacity breathes.', node: <div className="w-full"><Skeleton animation="pulse" height={32} /></div> },
        { label: "animation='wave'", note: 'Currently static — see the note above.', node: <div className="w-full"><Skeleton animation="wave" height={32} /></div> },
        { label: "animation='none'", node: <div className="w-full"><Skeleton animation="none" height={32} /></div> },
      ],
    },
    {
      title: 'Composed into a real placeholder',
      cols: 1,
      items: [
        {
          label: 'a loading card',
          note: 'Skeletons are only worth it when they match the shape of the loaded content.',
          wide: true,
          node: (
            <div className="w-full max-w-sm">
              <Card>
                <div className="flex items-center gap-3">
                  <Skeleton variant="circular" width={40} height={40} />
                  <div className="flex-1">
                    <Skeleton variant="text" width="60%" />
                    <div className="h-1.5" />
                    <Skeleton variant="text" width="35%" height={10} />
                  </div>
                </div>
                <div className="h-4" />
                <Skeleton height={72} />
              </Card>
            </div>
          ),
        },
      ],
    },
  ],
}

const IMG = 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=320&q=70'

export const mediaThumbEntry: DocEntry = {
  id: 'media-thumb',
  name: 'MediaThumb',
  group: 'Containers',
  origin: 'cms',
  frozen: true,
  covers: ['MediaThumb', 'isVideoUrl'],
  imports: "import { MediaThumb, isVideoUrl } from '@am/ui'",
  summary:
    'A preview for a media value you only know as a URL. It exists because the media picker accepts video in image slots, and a bare <img src> shows a broken-image icon the moment an editor picks an .mp4 — the value is fine and the site renders it, but the panel looks broken.',
  props: [
    {
      rows: [
        { name: 'src', type: 'string | null | undefined', required: true, note: 'Empty renders the fallback.' },
        { name: 'alt', type: 'string', default: "''", note: 'Images only. Videos are decorative previews.' },
        { name: 'badge', type: "'sm' | 'md' | 'none'", default: "'md'", note: 'The play overlay on videos. Use none under about 40px, where the badge covers the frame.' },
        { name: 'fallback', type: 'ReactNode', default: 'null', note: 'Rendered instead when src is empty.' },
        { name: 'className', type: 'string', note: 'Goes on the underlying <img>/<video>, not a wrapper.' },
        { name: 'onError', type: 'ReactEventHandler', note: 'Passed through, for call sites that hide a dead URL.' },
      ],
    },
  ],
  notes: [
    'Detection is by file extension, because field editors only ever hold the string — not the media row with its mimeType. The query and hash are stripped first, so …/clip.mp4?v=2 still reads as video.',
    'Video previews get #t=0.1 appended so the browser fetches just enough to paint frame one, with a film-icon layer behind it for the case where a background tab or data-saver skips the metadata fetch entirely.',
  ],
  states: [
    {
      title: 'By media type',
      cols: 3,
      items: [
        { label: 'an image', node: <div className="h-24 w-32 overflow-hidden rounded-lg"><MediaThumb src={IMG} alt="A product shot" className="h-full w-full object-cover" /></div> },
        { label: 'a video', note: 'Play badge over the poster frame.', node: <div className="h-24 w-32 overflow-hidden rounded-lg"><MediaThumb src="https://cdn.example.com/clip.mp4" className="h-full w-full object-cover" /></div> },
        { label: 'empty + fallback', node: <div className="bg-input h-24 w-32 overflow-hidden rounded-lg"><MediaThumb src={null} fallback={<div className="text-ink-3 flex h-full w-full items-center justify-center"><Image size={20} /></div>} /></div> },
      ],
    },
    {
      title: 'Video badge sizes',
      cols: 3,
      items: [
        { label: "badge='md'", node: <div className="h-24 w-32 overflow-hidden rounded-lg"><MediaThumb src="https://cdn.example.com/clip.mp4" badge="md" className="h-full w-full object-cover" /></div> },
        { label: "badge='sm'", node: <div className="h-16 w-20 overflow-hidden rounded-lg"><MediaThumb src="https://cdn.example.com/clip.mp4" badge="sm" className="h-full w-full object-cover" /></div> },
        { label: "badge='none'", note: 'For thumbnails under ~40px, where a badge would cover the frame.', node: <div className="h-9 w-9 overflow-hidden rounded"><MediaThumb src="https://cdn.example.com/clip.mp4" badge="none" className="h-full w-full object-cover" /></div> },
      ],
    },
    {
      title: 'isVideoUrl',
      note: 'The extension test on its own, exported so call sites can branch before rendering.',
      cols: 1,
      items: [
        {
          label: 'what counts as video',
          wide: true,
          node: (
            <div className="w-full font-mono text-[12px]">
              {['clip.mp4', 'clip.mp4?v=2', 'clip.mp4#t=0.1', 'photo.jpg', 'no-extension', 'dir.mp4/file'].map((u) => (
                <div key={u} className="border-hairline flex items-center justify-between gap-4 border-b py-1 last:border-0">
                  <span className="text-ink-2">{u}</span>
                  <span className={isVideoUrl(u) ? 'text-ok' : 'text-ink-3'}>{String(isVideoUrl(u))}</span>
                </div>
              ))}
            </div>
          ),
        },
      ],
    },
  ],
}
