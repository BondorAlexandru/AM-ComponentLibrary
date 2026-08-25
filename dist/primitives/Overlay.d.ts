/**
 * Modal + Drawer — extracted verbatim from AM Campaigns `ui/Overlay.tsx`.
 * The CMS has no equivalent (it uses `ConfirmDialog` and bespoke panels), so
 * adding these to the library changes nothing there.
 *
 * Requires tier-2 tokens: `--radius-card` and `--shadow-overlay`.
 * See docs/TOKENS.md.
 *
 * Enter *and* exit are driven by Motion. The `animate-fade-in` /
 * `animate-slide-in` / `animate-pop-in` classes these used to carry are gone,
 * and they had to go rather than merely being joined: the CMS never defined
 * those keyframes at all, and AM Campaigns declares them with
 * `animation-fill-mode: both`. A CSS animation outranks inline style, so a
 * finished `both` animation pins opacity at 1 forever and no JS exit is ever
 * visible. The two cannot coexist, and only one of them can animate the way out.
 *
 * Both panels set `text-ink` explicitly rather than inheriting. They portal into
 * `document.body`, so without it the text colour comes from whatever the host
 * put on <body> — which is `ink` in both apps today, but is ambient state a
 * self-contained overlay should not depend on. The docs site caught this: its
 * chrome sets a light body colour, and the modal title rendered near-invisible
 * on the white surface.
 */
import { type ReactNode } from 'react';
export declare function Drawer({ open, onClose, children, width, label, }: {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
    width?: string;
    label?: string;
}): import("react").ReactPortal | null;
export declare function Modal({ open, onClose, title, description, children, footer, width, }: {
    open: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children?: ReactNode;
    footer?: ReactNode;
    width?: string;
}): import("react").ReactPortal | null;
//# sourceMappingURL=Overlay.d.ts.map