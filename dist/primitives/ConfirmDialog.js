import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "./Button.js";
export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', confirmVariant = 'danger', isLoading = false, }) {
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-surface rounded-[var(--am-radius-card,var(--radius-card,12px))] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.5)] border border-hairline w-full max-w-md p-6", children: [_jsx("h2", { className: "text-lg font-semibold tracking-tight text-ink mb-2", children: title }), _jsx("p", { className: "text-sm text-ink-2 mb-6 leading-relaxed", children: message }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx(Button, { variant: "tertiary", onClick: onClose, disabled: isLoading, children: "Cancel" }), _jsx(Button, { variant: confirmVariant, onClick: onConfirm, loading: isLoading, children: confirmText })] })] }) }));
}
//# sourceMappingURL=ConfirmDialog.js.map