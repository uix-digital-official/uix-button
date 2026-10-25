import type { ButtonSize, ButtonVariant } from "./types";

export interface BuildClassNameOptions {
  variant?: ButtonVariant | undefined;
  size?: ButtonSize | undefined;
  rounded?: boolean | undefined;
}

export function buildClassName(opts: BuildClassNameOptions): string {
  const classes = ["uix-button"];
  if (opts.variant) classes.push(`uix-button--${opts.variant}`);
  if (opts.size) classes.push(`uix-button--${opts.size}`);
  if (opts.rounded) classes.push("uix-button--rounded");
  return classes.join(" ");
}

export const DEFAULT_SPINNER_HTML =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
  '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" ' +
  'stroke-linecap="round" stroke-dasharray="31.4 31.4" transform="rotate(-90 12 12)">' +
  '<animate attributeName="stroke-dashoffset" dur="0.8s" repeatCount="indefinite" from="0" to="62.8" />' +
  "</circle></svg>";
