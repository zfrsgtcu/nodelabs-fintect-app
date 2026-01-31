"use client";

import { useEffect, useRef } from "react";

export type SearchModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    function onDocPointerDown(e: MouseEvent) {
      if (overlayRef.current && overlayRef.current === e.target) onClose();
    }
    if (open) document.addEventListener("mousedown", onDocPointerDown);
    return () => document.removeEventListener("mousedown", onDocPointerDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-start justify-center bg-black/40 pt-[12vh] px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div
        className="w-full max-w-lg rounded-xl bg-white shadow-xl ring-1 ring-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-row items-center justify-between gap-4 border-b border-gray-light px-5 pt-5 pb-3">
          <h2 className="text-xl font-semibold text-slate-dark font-kumbh-sans">Search</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-dark bg-gray-light-soft hover:bg-gray-light border border-gray-light font-kumbh-sans focus:outline-none focus:ring-2 focus:ring-green-primary/30"
            aria-label="Close search"
          >
            Close
          </button>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-light">
          <i className="icon-search text-slate text-[20px]" aria-hidden />
          <input
            ref={inputRef}
            type="search"
            placeholder="Search..."
            className="flex-1 border-0 bg-transparent py-2 text-slate-dark placeholder:text-slate focus:outline-none focus:ring-0 font-kumbh-sans text-base"
            aria-label="Search"
            autoComplete="off"
          />
        </div>
        <div className="max-h-[50vh] overflow-y-auto px-4 py-3 text-sm text-slate font-kumbh-sans">
          Search results will appear here.
        </div>
      </div>
    </div>
  );
}
