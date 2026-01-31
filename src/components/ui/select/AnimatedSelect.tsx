"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { selectAnimateClose, selectAnimateOpen } from "@/assets/scripts/animations/ui/select";

export type SelectOption<T extends string = string> = {
  value: T;
  label: string;
};

export type AnimatedSelectProps<T extends string = string> = {
  value: T;
  options: readonly SelectOption<T>[];
  onChange: (v: T) => void;
  name?: string;
  ariaLabel?: string;
  /** Panel width in pixels. Default: 180 */
  panelWidthPx?: number;
  className?: string;
};

function getLabel<T extends string>(options: readonly SelectOption<T>[], value: T): string {
  return options.find((o) => o.value === value)?.label ?? String(value);
}

export function AnimatedSelect<T extends string = string>({
  value,
  options,
  onChange,
  name,
  ariaLabel,
  panelWidthPx = 180,
  className,
}: AnimatedSelectProps<T>) {
  const selectedIndex = useMemo(
    () => Math.max(0, options.findIndex((o) => o.value === value)),
    [options, value]
  );
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(selectedIndex);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const arrowRef = useRef<HTMLSpanElement | null>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    setActiveIndex(selectedIndex);
  }, [selectedIndex]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const optionEls = Array.from(panel.querySelectorAll<HTMLElement>("[data-opt]"));

    if (open) {
      selectAnimateOpen({ panelEl: panel, arrowEl: arrowRef.current, optionEls });
    } else {
      selectAnimateClose({ panelEl: panel, arrowEl: arrowRef.current });
    }
  }, [open]);

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!open) return;
      const root = rootRef.current;
      if (!root) return;
      if (e.target instanceof Node && !root.contains(e.target)) setOpen(false);
    }
    function onDocKeyDown(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onDocKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onDocKeyDown);
    };
  }, [open]);

  function commit(index: number) {
    const opt = options[index];
    if (!opt) return;
    onChange(opt.value);
    setOpen(false);
  }

  function onButtonKeyDown(e: ReactKeyboardEvent<HTMLButtonElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((v) => !v);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      const next = Math.min(options.length - 1, activeIndex + 1);
      setActiveIndex(next);
      queueMicrotask(() => optionRefs.current[next]?.focus());
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      const prev = Math.max(0, activeIndex - 1);
      setActiveIndex(prev);
      queueMicrotask(() => optionRefs.current[prev]?.focus());
    }
  }

  function onOptionKeyDown(e: ReactKeyboardEvent<HTMLButtonElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      commit(activeIndex);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.min(options.length - 1, activeIndex + 1);
      setActiveIndex(next);
      optionRefs.current[next]?.focus();
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = Math.max(0, activeIndex - 1);
      setActiveIndex(prev);
      optionRefs.current[prev]?.focus();
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className={["relative", className ?? ""].join(" ").trim()}>
      {name ? <input type="hidden" name={name} value={value} /> : null}

      <button
        type="button"
        className="relative flex items-center gap-2 py-[6px] pl-[10px] pr-[32px] bg-gray-lighter-4 rounded-[5px] text-[12px] font-[400] text-[var(--color-slate-dark)] cursor-pointer hover:bg-[var(--color-gray-lighter)] transition-colors"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onButtonKeyDown}
      >
        <span className="whitespace-nowrap">{getLabel(options, value)}</span>
        <span
          ref={arrowRef}
          className="pointer-events-none absolute right-[8px] top-1/2 -translate-y-1/2 text-[var(--color-slate-dark)]"
          aria-hidden
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M3 4.5L6 7.5L9 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      <div
        ref={panelRef}
        className="absolute right-0 z-20 mt-2 overflow-hidden rounded-[5px] border border-[var(--color-gray-lighter-2)] bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
        style={{
          width: panelWidthPx,
          height: 0,
          opacity: 0,
          transform: "translateY(-6px)",
          pointerEvents: "none",
        }}
      >
        <div role="listbox" aria-label={ariaLabel}>
          {options.map((opt, idx) => {
            const selected = opt.value === value;
            const active = idx === activeIndex;
            return (
              <button
                key={opt.value}
                data-opt
                ref={(el) => {
                  optionRefs.current[idx] = el;
                }}
                type="button"
                role="option"
                aria-selected={selected}
                className={[
                  "w-full px-3 py-2 text-left text-[12px] transition-colors cursor-pointer",
                  "text-[var(--color-slate-dark)]",
                  active ? "bg-[var(--color-gray-lighter-3)]" : "bg-transparent",
                  "hover:bg-[var(--color-gray-lighter-3)] focus:outline-none",
                ].join(" ")}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => commit(idx)}
                onKeyDown={onOptionKeyDown}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className={selected ? "font-[600]" : undefined}>{opt.label}</span>
                  {selected ? (
                    <span className="text-[var(--color-green-1)]" aria-hidden>
                      ✓
                    </span>
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

