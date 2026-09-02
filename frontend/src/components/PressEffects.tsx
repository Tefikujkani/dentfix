"use client";

import { useEffect } from "react";

const PRESSABLE = "a, button, label[data-press], [data-press]";

export function PressEffects() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function onPointerDown(event: PointerEvent) {
      if (event.button !== 0) return;
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(PRESSABLE);
      if (!target || target.getAttribute("aria-disabled") === "true") return;
      if (target instanceof HTMLButtonElement && target.disabled) return;

      target.classList.remove("is-pressing");
      void target.offsetWidth;
      target.classList.add("is-pressing");
      window.setTimeout(() => target.classList.remove("is-pressing"), 320);
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return null;
}
