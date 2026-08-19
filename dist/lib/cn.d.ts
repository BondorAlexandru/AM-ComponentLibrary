/**
 * Class-name joiner. Deliberately dependency-free — the library's only
 * runtime peers are react/react-dom, so a consumer never inherits a
 * transitive version conflict for something this small.
 *
 * Accepts the `clsx` argument shapes the apps already use (strings, arrays,
 * conditional objects, falsy) so `cn` is a drop-in for AM Campaigns'
 * `src/lib/cn.ts`.
 */
export type ClassValue = string | number | null | undefined | false | ClassValue[] | Record<string, unknown>;
export declare function cn(...inputs: ClassValue[]): string;
//# sourceMappingURL=cn.d.ts.map