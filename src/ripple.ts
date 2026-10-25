export interface RippleOptions {
  color?: string;
  duration?: number;
}

const RIPPLE_CLASS = "uix-ripple";

export function attachRipple(
  element: HTMLElement,
  options: RippleOptions = {},
): () => void {
  const handlePointerDown = (event: PointerEvent) => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement("span");
    ripple.className = RIPPLE_CLASS;
    ripple.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      pointer-events: none;
      background: ${options.color ?? "currentColor"};
      opacity: 0.28;
      transform: scale(0);
      animation: uix-ripple-animation ${options.duration ?? 550}ms ease-out forwards;
    `;

    element.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove(), {
      once: true,
    });
  };

  element.addEventListener("pointerdown", handlePointerDown);

  return () => {
    element.removeEventListener("pointerdown", handlePointerDown);
    element.querySelectorAll(`.${RIPPLE_CLASS}`).forEach((r) => r.remove());
  };
}
