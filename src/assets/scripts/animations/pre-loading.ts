import gsap from "gsap";

const PRELOAD_HIDE_DELAY_MS = 1400;
const REVEAL_DURATION = 0.55;
const HIDE_DURATION = 0.5;

const SEL_LOGO = ".icon-fintech-logo";
const SEL_FINTECH = ".icon-fintech";

/**
 * Pre-load animasyonu: container içinde logo + fintech animasyonu,
 * sayfa load olunca 200ms bekleyip overlay’ı kapatır.
 * Scope: tüm seçiciler containerEl içinde çözülür.
 */
export function initPreloadFintech(containerEl: HTMLElement | null): (() => void) | void {
  if (!containerEl) return;

  const logoEl = containerEl.querySelector<HTMLElement>(SEL_LOGO);
  const fintechEl = containerEl.querySelector<HTMLElement>(SEL_FINTECH);

  // opacity-0 ile başlıyorlar → hedefe (görünür) doğru animasyon
  if (logoEl) {
    gsap.to(logoEl, {
      autoAlpha: 1,
      duration: 1,
      delay: 0.25,
      ease: "power2.out",
    });
  }

  if (fintechEl) {
    gsap.fromTo(
      fintechEl,
      { opacity: 0, marginLeft: "-30%", overflow: "hidden" },
      {
        opacity: 1,
        marginLeft: 0,
        overflow: "visible",
        delay: 0.75,
        duration: REVEAL_DURATION,
        ease: "power1.in",
      }
    );
  }

  const hidePreload = () => {
    gsap.to(containerEl, {
      opacity: 0,
      duration: HIDE_DURATION,
      delay: PRELOAD_HIDE_DELAY_MS / 1000,
      ease: "power2.inOut",
      onComplete: () => {
        containerEl.style.pointerEvents = "none";
        containerEl.style.visibility = "hidden";
        window.dispatchEvent(new CustomEvent("preloadComplete"));
        try {
          (window as Window & { __preloadComplete?: boolean }).__preloadComplete = true;
        } catch {
          /* ignore */
        }
      },
    });
  };

  const onLoad = () => {
    hidePreload();
  };

  if (document.readyState === "complete") {
    setTimeout(onLoad, 0);
  } else {
    window.addEventListener("load", onLoad);
  }

  return () => {
    window.removeEventListener("load", onLoad);
  };
}
