import type { DocEntry } from './types.ts'
import { buttonEntry, iconButtonEntry } from './entries/actions.tsx'
import { badgeEntry, pillEntry } from './entries/status.tsx'
import { cardEntry, emptyStateEntry, mediaThumbEntry, skeletonEntry } from './entries/containers.tsx'
import { dropdownEntry, formEntry } from './entries/forms.tsx'
import { confirmDialogEntry, menuEntry, modalEntry, popoverEntry } from './entries/overlays.tsx'
import { iconsEntry, spinnerEntry, tokensEntry, utilsEntry } from './entries/foundations.tsx'

/**
 * The catalogue. Order inside a group is the order in the sidebar.
 *
 * Every runtime export of `@am/ui` must appear in some entry's `covers` array —
 * `registry.test.ts` fails the build otherwise. That is what makes CLAUDE.md
 * §C.12 ("document it and show its states") enforceable rather than aspirational.
 */
export const ENTRIES: DocEntry[] = [
  tokensEntry,
  utilsEntry,
  spinnerEntry,
  iconsEntry,
  buttonEntry,
  iconButtonEntry,
  badgeEntry,
  pillEntry,
  cardEntry,
  emptyStateEntry,
  skeletonEntry,
  mediaThumbEntry,
  formEntry,
  dropdownEntry,
  modalEntry,
  confirmDialogEntry,
  menuEntry,
  popoverEntry,
]

export const GROUP_ORDER = ['Foundations', 'Actions', 'Status', 'Containers', 'Forms', 'Overlays'] as const

export function groupedEntries(): { group: string; entries: DocEntry[] }[] {
  return GROUP_ORDER.map((group) => ({
    group,
    entries: ENTRIES.filter((e) => e.group === group),
  })).filter((g) => g.entries.length > 0)
}

export function entryById(id: string): DocEntry | undefined {
  return ENTRIES.find((e) => e.id === id)
}
