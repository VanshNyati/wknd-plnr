import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function Modal({ open, onClose, title, children, actions }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    // focus first focusable
    const t = setTimeout(() => {
      const focusable = dialogRef.current?.querySelector(
        'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
      );
      focusable?.focus();
    }, 0);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open, onClose]);

  if (!open) return null;

  const node = (
    <div className="fixed inset-0 z-[100]">
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          className="w-full max-w-2xl rounded-3xl border border-white/20 bg-white/95 p-5 shadow-2xl"
        >
          {title ? (
            <h3 className="text-lg font-semibold mb-2 text-slate-900">
              {title}
            </h3>
          ) : null}
          <div className="space-y-3">{children}</div>
          {actions ? (
            <div className="mt-4 flex flex-wrap justify-end gap-2">
              {actions}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );

  return createPortal(node, document.body);
}
