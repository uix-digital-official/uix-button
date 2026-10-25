import type { ColorPalette } from "./types";

export interface GeneratedPalette {
  primary: string;
  danger: string;
  warning: string;
  success: string;
  [key: string]: string;
}

interface Hsl {
  h: number;
  s: number;
  l: number;
}

function rgbToHsl(r: number, g: number, b: number): Hsl {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function parseHex(color: string): Hsl | null {
  const match = color.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!match) return null;
  let hex = match[1]!;
  if (hex.length === 3) {
    hex = hex[0]! + hex[0]! + hex[1]! + hex[1]! + hex[2]! + hex[2]!;
  }
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return rgbToHsl(r, g, b);
}

function parseToHsl(color: string): Hsl {
  const hex = parseHex(color);
  if (hex) return hex;
  if (typeof document !== "undefined") {
    const ctx = document.createElement("canvas").getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#000";
      ctx.fillStyle = color;
      const normalised = ctx.fillStyle;
      if (/^#[0-9a-f]{6}$/i.test(normalised)) {
        const parsed = parseHex(normalised);
        if (parsed) return parsed;
      }
    }
  }
  return { h: 217, s: 91, l: 60 };
}

function hslToString(h: number, s: number, l: number): string {
  return `hsl(${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%)`;
}

export function generatePalette(
  input: string | Record<string, string | undefined>,
): GeneratedPalette {
  const base: Record<string, string | undefined> =
    typeof input === "string" ? { primary: input } : { ...input };

  const primaryHsl = parseToHsl(base["primary"] ?? "#3b82f6");

  const palette: GeneratedPalette = {
    primary:
      base["primary"] ?? hslToString(primaryHsl.h, primaryHsl.s, primaryHsl.l),
    danger:
      base["danger"] ??
      hslToString(0, Math.min(primaryHsl.s, 85), primaryHsl.l),
    warning:
      base["warning"] ??
      hslToString(38, Math.min(primaryHsl.s, 90), primaryHsl.l),
    success:
      base["success"] ??
      hslToString(142, Math.min(primaryHsl.s, 70), primaryHsl.l),
  };

  for (const [k, v] of Object.entries(base)) {
    if (v !== undefined && !(k in palette)) palette[k] = v;
  }
  return palette;
}

const appliedKeys = new WeakMap<HTMLElement, string[]>();

export function applyPalette(
  element: HTMLElement,
  input: string | ColorPalette | undefined,
): void {
  const prev = appliedKeys.get(element) ?? [];
  for (const p of prev) {
    element.style.removeProperty(`--uix-${p}`);
    element.style.removeProperty(`--uix-${p}-hover`);
    element.style.removeProperty(`--uix-${p}-active`);
  }

  if (input == null) {
    appliedKeys.set(element, []);
    return;
  }

  const palette = generatePalette(
    typeof input === "string"
      ? input
      : (input as Record<string, string | undefined>),
  );

  const keys: string[] = [];
  for (const [name, value] of Object.entries(palette)) {
    element.style.setProperty(`--uix-${name}`, value);
    element.style.setProperty(
      `--uix-${name}-hover`,
      `color-mix(in srgb, ${value} 85%, black)`,
    );
    element.style.setProperty(
      `--uix-${name}-active`,
      `color-mix(in srgb, ${value} 70%, black)`,
    );
    keys.push(name);
  }
  appliedKeys.set(element, keys);
}
