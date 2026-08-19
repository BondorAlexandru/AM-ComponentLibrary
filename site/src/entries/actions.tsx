import { Button, IconButton } from '@am/ui'
import { Check, ChevronDown, MoreHorizontal, Pencil, Plus, Trash2 } from '@am/ui/icons'
import type { DocEntry } from '../types.ts'

const BUTTON_VARIANTS = ['primary', 'secondary', 'tertiary', 'danger', 'success', 'ghost', 'quiet', 'dark'] as const
const SIZES = ['sm', 'md', 'lg'] as const

export const buttonEntry: DocEntry = {
  id: 'button',
  name: 'Button',
  group: 'Actions',
  origin: 'cms',
  frozen: true,
  covers: ['Button'],
  imports: "import { Button } from '@am/ui'",
  summary:
    'One filled accent primary per view, outline-first secondaries, quiet ghosts. Semantic fills — danger and success — are reserved for meaning, never for emphasis.',
  props: [
    {
      rows: [
        { name: 'variant', type: "'primary' | 'secondary' | 'tertiary' | 'danger' | 'success' | 'ghost' | 'quiet' | 'dark'", default: "'primary'", note: 'The first six are the CMS’s and their classes are frozen. quiet and dark were added for AM Campaigns.' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", note: 'Fixed heights (28 / 34 / 40px) rather than padding-driven, so buttons line up exactly in a toolbar row.' },
        { name: 'loading', type: 'boolean', default: 'false', note: 'Swaps children for the app spinner and disables the button. Also hides leftIcon/rightIcon.' },
        { name: 'fullWidth', type: 'boolean', default: 'false', note: 'Stretches to the container. Used for form submits and mobile sheets.' },
        { name: 'leftIcon', type: 'ReactNode', note: 'Leading glyph. Size it to 14px at sm/md, 16px at lg.' },
        { name: 'rightIcon', type: 'ReactNode', note: 'Trailing glyph — chevrons and external-link marks, not primary meaning.' },
        { name: 'disabled', type: 'boolean', default: 'false', note: 'Drops to 50% opacity and blocks the cursor. Prefer hiding an action over disabling it with no explanation.' },
        { name: 'className', type: 'string', note: 'Appended last, so it wins. Reach for it for layout, not for recolouring a variant.' },
      ],
    },
  ],
  notes: [
    'The loading spinner comes from AmUiProvider, not from this component — the CMS renders its WebGL brand loader there and Campaigns gets the token-driven ring.',
    'For an icon-only button use IconButton instead: it requires an aria-label, which a bare Button does not.',
  ],
  states: [
    {
      title: 'Variants',
      note: 'Rendered on a checkerboard so the transparent fills (quiet) are visibly different from a fill that happens to match the canvas.',
      cols: 4,
      items: BUTTON_VARIANTS.map((v) => ({
        label: `variant="${v}"`,
        checker: true,
        node: <Button variant={v}>Publish</Button>,
      })),
    },
    {
      title: 'Sizes',
      note: 'Heights are explicit: 28px, 34px, 40px. The md height is the shared bar-control height, so a Button, a Dropdown and a Form.TextInput all align in the same row.',
      cols: 3,
      items: SIZES.map((s) => ({
        label: `size="${s}"`,
        node: (
          <>
            <Button size={s} variant="primary">Save</Button>
            <Button size={s} variant="secondary">Cancel</Button>
          </>
        ),
      })),
    },
    {
      title: 'Interactive states',
      note: 'Hover and focus are live — hover the specimens, or tab into them to see the accent focus ring.',
      cols: 3,
      items: [
        { label: 'default', node: <Button>Approve</Button> },
        { label: 'disabled', note: '50% opacity, pointer blocked.', node: <Button disabled>Approve</Button> },
        { label: 'loading', note: 'Children swapped for the spinner, button auto-disabled.', node: <Button loading>Approve</Button> },
        { label: ':focus-visible', note: 'Tab to it — 2px accent ring, offset from the canvas.', node: <Button variant="secondary">Tab to me</Button> },
        { label: 'disabled + secondary', node: <Button variant="secondary" disabled>Archive</Button> },
        { label: 'loading + danger', node: <Button variant="danger" loading>Deleting</Button> },
      ],
    },
    {
      title: 'With icons',
      cols: 3,
      items: [
        { label: 'leftIcon', node: <Button leftIcon={<Plus size={14} />}>New page</Button> },
        { label: 'rightIcon', node: <Button variant="secondary" rightIcon={<ChevronDown size={14} />}>Options</Button> },
        { label: 'both', node: <Button variant="tertiary" leftIcon={<Check size={14} />} rightIcon={<ChevronDown size={14} />}>Approved</Button> },
        { label: 'loading hides icons', note: 'leftIcon and rightIcon are suppressed so the row does not jump.', node: <Button leftIcon={<Plus size={14} />} loading>New page</Button> },
        { label: 'icon at lg', node: <Button size="lg" leftIcon={<Plus size={16} />}>New campaign</Button> },
        { label: 'danger + icon', node: <Button variant="danger" leftIcon={<Trash2 size={14} />}>Delete</Button> },
      ],
    },
    {
      title: 'Layout',
      cols: 2,
      items: [
        { label: 'fullWidth', node: <div className="w-full max-w-sm"><Button fullWidth>Sign in</Button></div> },
        {
          label: 'in a toolbar row',
          note: 'md buttons next to each other — the 34px height is what keeps this line straight.',
          node: (
            <>
              <Button size="md" variant="primary" leftIcon={<Plus size={14} />}>Add</Button>
              <Button size="md" variant="secondary" leftIcon={<Pencil size={14} />}>Edit</Button>
              <Button size="md" variant="ghost">More</Button>
              <IconButton size="sm" aria-label="Overflow" icon={<MoreHorizontal className="h-4 w-4" />} />
            </>
          ),
        },
      ],
    },
  ],
}

const ICON_VARIANTS = ['primary', 'secondary', 'tertiary', 'danger', 'ghost'] as const

export const iconButtonEntry: DocEntry = {
  id: 'icon-button',
  name: 'IconButton',
  group: 'Actions',
  origin: 'cms',
  frozen: true,
  covers: ['IconButton'],
  imports: "import { IconButton } from '@am/ui'",
  summary:
    'A square, icon-only button for dense rows and card corners. aria-label is required by the type, because an icon-only control with no accessible name is unusable with a screen reader and easy to ship by accident.',
  props: [
    {
      rows: [
        { name: 'icon', type: 'ReactNode', required: true, note: 'The glyph. Size it with a className (h-4 w-4) rather than relying on the font size.' },
        { name: 'aria-label', type: 'string', required: true, note: 'Required, not optional. This is the button’s only accessible name.' },
        { name: 'variant', type: "'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost'", default: "'ghost'", note: 'Note the different default and the shorter list than Button: ghost here is transparent, and there is no success.' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", note: '32 / 40 / 44px squares. Explicit px because the CMS overrides --spacing-8/10/11, which makes h-8/h-10/h-11 mis-size.' },
        { name: 'disabled', type: 'boolean', default: 'false', note: '50% opacity, pointer blocked.' },
      ],
    },
  ],
  notes: [
    'The hit area is larger than the visible box: a ::before pseudo-element extends 6px past every edge, so a 32px button is comfortable on touch without pushing the row taller.',
    'IconButton’s ghost is transparent; Button’s ghost is a filled quiet treatment. Button’s quiet variant is the one that matches this.',
  ],
  states: [
    {
      title: 'Variants',
      note: 'On a checkerboard — danger and ghost are transparent until hovered.',
      cols: 4,
      items: ICON_VARIANTS.map((v) => ({
        label: `variant="${v}"`,
        checker: true,
        node: <IconButton variant={v} aria-label={`Edit (${v})`} icon={<Pencil className="h-4 w-4" />} />,
      })),
    },
    {
      title: 'Sizes',
      cols: 3,
      items: SIZES.map((s) => ({
        label: `size="${s}"`,
        note: { sm: '32px — table rows and card corners.', md: '40px — the default.', lg: '44px — touch targets and page headers.' }[s],
        node: (
          <>
            <IconButton size={s} aria-label={`Edit ${s}`} icon={<Pencil className="h-4 w-4" />} />
            <IconButton size={s} variant="secondary" aria-label={`Add ${s}`} icon={<Plus className="h-4 w-4" />} />
          </>
        ),
      })),
    },
    {
      title: 'Interactive states',
      cols: 3,
      items: [
        { label: 'default', checker: true, node: <IconButton aria-label="Delete" icon={<Trash2 className="h-4 w-4" />} /> },
        { label: 'disabled', checker: true, node: <IconButton disabled aria-label="Delete" icon={<Trash2 className="h-4 w-4" />} /> },
        { label: 'danger :hover', note: 'Hover to see the 10% danger wash.', checker: true, node: <IconButton variant="danger" aria-label="Delete" icon={<Trash2 className="h-4 w-4" />} /> },
      ],
    },
  ],
}
