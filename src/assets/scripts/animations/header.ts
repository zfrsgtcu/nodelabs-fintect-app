import gsap from "gsap";

const MENU_ANIM_DURATION = 0.22;
const MENU_ANIM_EASE: gsap.EaseString = "power2.out";
const MENU_Y_OFFSET = 6;

/**
 * Profil menüsünü açılış animasyonu — kurumsal, sade (opacity + hafif y).
 */
export function headerAnimateMenuIn(menuEl: HTMLElement | null): void {
  if (!menuEl) return;
  gsap.fromTo(
    menuEl,
    {
      opacity: 0,
      y: -MENU_Y_OFFSET,
    },
    {
      opacity: 1,
      y: 0,
      duration: MENU_ANIM_DURATION,
      ease: MENU_ANIM_EASE,
      overwrite: "auto",
    }
  );
}

/**
 * Profil menüsünü kapanış animasyonu — kapanınca onComplete çağrılır.
 */
export function headerAnimateMenuOut(
  menuEl: HTMLElement | null,
  onComplete?: () => void
): void {
  if (!menuEl) {
    onComplete?.();
    return;
  }
  gsap.to(menuEl, {
    opacity: 0,
    y: -MENU_Y_OFFSET,
    duration: MENU_ANIM_DURATION,
    ease: MENU_ANIM_EASE,
    overwrite: "auto",
    onComplete,
  });
}
