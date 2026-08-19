/**
 * Modal + Drawer — extracted verbatim from AM Campaigns `ui/Overlay.tsx`.
 * The CMS has no equivalent (it uses `ConfirmDialog` and bespoke panels), so
 * adding these to the library changes nothing there.
 *
 * Requires tier-2 tokens: `--radius-card`, `--shadow-overlay`, and the
 * `animate-fade-in` / `animate-slide-in` / `animate-pop-in` keyframes.
 * See docs/TOKENS.md.
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