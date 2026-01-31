import gsap from "gsap";

const PRELOAD_COMPLETE_EVENT = "preloadComplete";

declare global {
  interface Window {
    __preloadComplete?: boolean;
  }
}

/** Login ↔ Register geçişinde form kayma: yön "left" | "right" — yeni form hangi taraftan girecek. */
export const formTransitionIn = (
  target: HTMLElement,
  fromDirection: "left" | "right",
  options?: { duration?: number; ease?: string }
) => {
  const xFrom = fromDirection === "right" ? "100%" : "-100%";
  gsap.fromTo(
    target,
    { x: xFrom },
    {
      x: 0,
      duration: options?.duration ?? 0.45,
      ease: (options?.ease as gsap.EaseString) ?? "power2.out",
      overwrite: "auto",
    }
  );
};

/**
 * hand-watch-wrap opacity 0 ile başlıyor → 1’e ve yukarıdan aşağı (y: -120 → 0) animasyon.
 */
export const opacityBounceIn = (target: HTMLElement) => {
  gsap.fromTo(
    target,
    { opacity: 0, y: -120 },
    {
      opacity: 1,
      y: 0,
      delay: 0.4,
      duration: 0.95,
      ease: "power2.out",
    }
  );
};

/**
 * Pre-load tamamlandıktan sonra callback çalıştırır.
 * Preload zaten bitmişse hemen çalıştırır; bitmemişse "preloadComplete" event'ini bekler.
 */
export function runAfterPreload(fn: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  if (window.__preloadComplete === true) {
    fn();
    return () => {};
  }

  const handler = () => {
    window.removeEventListener(PRELOAD_COMPLETE_EVENT, handler);
    fn();
  };
  window.addEventListener(PRELOAD_COMPLETE_EVENT, handler);
  return () => window.removeEventListener(PRELOAD_COMPLETE_EVENT, handler);
}