import gsap from "gsap";

const SELECT_ANIM_IN_DURATION = 0.22;
const SELECT_ANIM_OUT_DURATION = 0.18;
const SELECT_EASE_IN: gsap.EaseString = "power2.out";
const SELECT_EASE_OUT: gsap.EaseString = "power2.inOut";
const SELECT_Y_OFFSET = 6;

export type SelectAnimTargets = {
  panelEl: HTMLElement | null;
  arrowEl?: HTMLElement | null;
  optionEls?: Array<HTMLElement> | NodeListOf<HTMLElement> | null;
};

/**
 * Custom select panel opening animation — corporate (height + opacity + slight y) + stagger.
 */
export function selectAnimateOpen({ panelEl, arrowEl, optionEls }: SelectAnimTargets): void {
  if (!panelEl) return;

  // Kill previous tweens to avoid stacking
  gsap.killTweensOf([panelEl, arrowEl].filter(Boolean) as HTMLElement[]);
  if (optionEls) gsap.killTweensOf(optionEls as any);

  const targetHeight = panelEl.scrollHeight;
  gsap.set(panelEl, { pointerEvents: "auto" });

  gsap.to(panelEl, {
    height: targetHeight,
    opacity: 1,
    y: 0,
    duration: SELECT_ANIM_IN_DURATION,
    ease: SELECT_EASE_IN,
    overwrite: "auto",
  });

  if (arrowEl) {
    gsap.to(arrowEl, {
      rotate: 180,
      duration: 0.2,
      ease: SELECT_EASE_IN,
      overwrite: "auto",
    });
  }

  if (optionEls) {
    gsap.fromTo(
      optionEls as any,
      { opacity: 0, y: -4 },
      { opacity: 1, y: 0, duration: 0.18, ease: SELECT_EASE_IN, stagger: 0.03, delay: 0.03, overwrite: "auto" }
    );
  }
}

/**
 * Custom select panel closing animation.
 */
export function selectAnimateClose({ panelEl, arrowEl }: SelectAnimTargets): void {
  if (!panelEl) return;

  gsap.killTweensOf([panelEl, arrowEl].filter(Boolean) as HTMLElement[]);

  gsap.to(panelEl, {
    height: 0,
    opacity: 0,
    y: -SELECT_Y_OFFSET,
    duration: SELECT_ANIM_OUT_DURATION,
    ease: SELECT_EASE_OUT,
    overwrite: "auto",
    onComplete: () => {
      gsap.set(panelEl, { pointerEvents: "none" });
    },
  });

  if (arrowEl) {
    gsap.to(arrowEl, {
      rotate: 0,
      duration: SELECT_ANIM_OUT_DURATION,
      ease: SELECT_EASE_OUT,
      overwrite: "auto",
    });
  }
}

