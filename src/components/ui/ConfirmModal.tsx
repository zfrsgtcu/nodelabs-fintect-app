"use client";

import { useEffect, useRef } from "react";

export type ConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Confirm butonuna tıklanınca loading göster (async onConfirm için) */
  loading?: boolean;
};

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Evet",
  cancelLabel = "Hayır",
  loading = false,
}: ConfirmModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !loading) onClose();
    }
    if (open) {
      document.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose, loading]);

  useEffect(() => {
    function onDocPointerDown(e: MouseEvent) {
      if (overlayRef.current && overlayRef.current === e.target && !loading) onClose();
    }
    if (open) document.addEventListener("mousedown", onDocPointerDown);
    return () => document.removeEventListener("mousedown", onDocPointerDown);
  }, [open, onClose, loading]);

  const handleConfirm = async () => {
    await Promise.resolve(onConfirm());
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[250] flex items-center justify-center bg-black/50 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby={message ? "confirm-modal-desc" : undefined}
    >
      <div
        className="w-full max-w-sm rounded-xl bg-white shadow-xl ring-1 ring-slate-200 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="confirm-modal-title"
          className="text-lg font-semibold text-slate-dark font-kumbh-sans mb-2"
        >
          {title}
        </h2>
        {message && (
          <p
            id="confirm-modal-desc"
            className="text-sm text-slate font-kumbh-sans mb-6"
          >
            {message}
          </p>
        )}
        <div className="flex flex-row gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="confirm-modal-cancel"
            aria-label={cancelLabel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="confirm-modal-confirm"
            aria-label={confirmLabel}
            aria-busy={loading}
          >
            {loading ? "..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
