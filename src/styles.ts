export const BUTTON_CSS = `
.uix-button {
  --uix-primary: #ff7130;
  --uix-primary-hover: color-mix(in srgb, var(--uix-primary) 85%, black);
  --uix-on-primary: #ffffff;

  --uix-danger: #dc2626;
  --uix-danger-hover: color-mix(in srgb, var(--uix-danger) 85%, black);
  --uix-on-danger: #ffffff;

  --uix-warning: #ea580c;
  --uix-warning-hover: color-mix(in srgb, var(--uix-warning) 85%, black);
  --uix-on-warning: #111827;

  --uix-success: #16a34a;
  --uix-success-hover: color-mix(in srgb, var(--uix-success) 85%, black);
  --uix-on-success: #ffffff;

  --uix-on-surface: #111827;

  --uix-radius: 0.25;
  --uix-radius-full: 9999px;
  --uix-gap: 0.5rem;
  --uix-padding-inline: 1.5;
  --uix-padding-block: 0.75;
  --uix-font-size: 0.875rem;
  --uix-font-weight: 600;
  --uix-line-height: 1.25rem;
  --uix-transition: 150ms ease;

  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--uix-gap);
  padding: var(--uix-padding-block) var(--uix-padding-inline);
  border: 1px solid transparent;
  border-radius: var(--uix-radius);
  background: transparent;
  color: inherit;
  font-family: inherit;
  font-size: var(--uix-font-size);
  font-weight: var(--uix-font-weight);
  line-height: var(--uix-line-height);
  text-align: center;
  text-decoration: none;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  -webkit-appearance: none;
  appearance: none;
  transition:
    background-color var(--uix-transition),
    border-color var(--uix-transition),
    color var(--uix-transition),
    box-shadow var(--uix-transition);
}

.uix-button *,
.uix-button *::before,
.uix-button *::after { box-sizing: border-box; }

.uix-button:focus-visible { outline: 2px solid var(--uix-primary); outline-offset: 2px; }

.uix-button:disabled,
.uix-button[aria-disabled='true'] {
  opacity: 0.5;
  cursor: not-allowed;
}

.uix-button--solid { background: var(--uix-primary); color: var(--uix-on-primary); }
.uix-button--solid:hover:not(:disabled):not([aria-disabled='true']) { background: var(--uix-primary-hover); }

.uix-button--subtle {
  background: color-mix(in srgb, var(--uix-primary) 12%, transparent);
  color: var(--uix-primary);
}
.uix-button--subtle:hover:not(:disabled):not([aria-disabled='true']) {
  background: color-mix(in srgb, var(--uix-primary) 20%, transparent);
}

.uix-button--surface {
  background: color-mix(in srgb, var(--uix-primary) 12%, transparent);
  color: var(--uix-on-surface);
  border-color: color-mix(in srgb, var(--uix-primary) 20%, transparent);
}
.uix-button--surface:hover:not(:disabled):not([aria-disabled='true']) {
  background: color-mix(in srgb, var(--uix-primary) 20%, transparent);
}

.uix-button--outline {
  background: transparent;
  color: var(--uix-primary);
  border-color: var(--uix-primary);
}
.uix-button--outline:hover:not(:disabled):not([aria-disabled='true']) {
  background: color-mix(in srgb, var(--uix-primary) 12%, transparent);
}


.uix-button--ghost {
  background: transparent;
  color: var(--uix-primary);
  border-color: transparent;
}
.uix-button--ghost:hover:not(:disabled):not([aria-disabled='true']) {
  background: color-mix(in srgb, var(--uix-primary) 10%, transparent);
}


.uix-button--plain {
  background: transparent;
  color: var(--uix-on-surface);
  padding-inline: 0.25rem;
}
.uix-button--plain:hover:not(:disabled):not([aria-disabled='true']) {
  color: var(--uix-primary);
  text-decoration: underline;
}

.uix-button--sm {
  --uix-font-size: 1rem;
  --uix-padding-inline: 0.625rem;
  --uix-padding-block: 1.25rem;
  --uix-gap: 0.375rem;
}
.uix-button--lg {
  --uix-font-size: 1rem;
  --uix-padding-inline: 1.75;
  --uix-padding-block: 0.875;
  --uix-gap: 0.75rem;
}
.uix-button--rounded { border-radius: var(--uix-radius-full); }

.uix-button__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
  flex-shrink: 0;
}
.uix-button__icon > svg,
.uix-button__icon > img { width: 100%; height: 100%; display: block; }

.uix-button__spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
  flex-shrink: 0;
}
.uix-button__spinner > svg { width: 100%; height: 100%; display: block; }
.uix-button__spinner--default > svg { animation: uix-spin 0.8s linear infinite; }

@keyframes uix-spin { to { transform: rotate(360deg); } }
@keyframes uix-ripple-animation { to { transform: scale(2.5); opacity: 0; } }

@media (prefers-reduced-motion: reduce) {
  .uix-button { transition: none; }
  .uix-button__spinner--default > svg { animation: none; }
  .uix-ripple { display: none; }
}
`.trim();

const STYLE_ID = "uix-button-styles";
let injected = false;

export function injectStyles(): void {
  if (injected) return;
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) {
    injected = true;
    return;
  }
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = BUTTON_CSS;
  document.head.appendChild(style);
  injected = true;
}
