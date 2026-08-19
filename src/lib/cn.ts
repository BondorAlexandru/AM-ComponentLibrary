/**
 * Class-name joiner. Deliberately dependency-free — the library's only
 * runtime peers are react/react-dom, so a consumer never inherits a
 * transitive version conflict for something this small.
 *
 * Accepts the `clsx` argument shapes the apps already use (strings, arrays,
 * conditional objects, falsy) so `cn` is a drop-in for AM Campaigns'
 * `src/lib/cn.ts`.
 */
export type ClassValue = string | number | null | undefined | false | ClassValue[] | Record<string, unknown>

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = []
  for (const input of inputs) {
    if (!input) continue
    if (typeof input === 'string' || typeof input === 'number') {
      out.push(String(input))
    } else if (Array.isArray(input)) {
      const nested = cn(...input)
      if (nested) out.push(nested)
    } else {
      for (const key in input) {
        if (input[key]) out.push(key)
      }
    }
  }
  return out.join(' ')
}
