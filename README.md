# uix-button

A lightweight, accessible button for **React**, **Vue 3**, **Angular**, and plain JavaScript. Ships with six variants, three sizes, an optional ripple effect, a loading state, and a theming system driven by CSS custom properties. No CSS file to import: styles are injected automatically.

[![npm version](https://img.shields.io/npm/v/uix-button.svg)](https://www.npmjs.com/package/uix-button)
[![npm downloads](https://img.shields.io/npm/dm/uix-button.svg)](https://www.npmjs.com/package/uix-button)
[![bundle size](https://img.shields.io/bundlephobia/minzip/uix-button)](https://bundlephobia.com/package/uix-button)
[![types: included](https://img.shields.io/badge/types-TypeScript-blue.svg)](#typescript)
[![GitHub stars](https://img.shields.io/github/stars/uix-digital-official/uix-button?style=social)](https://github.com/uix-digital-official/uix-button)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

**uix-button** is a zero-dependency button component for React, Vue 3 and Angular (and plain JavaScript) with an optional Material-style ripple effect, loading spinner, accessible link buttons, dynamic color palettes and CSS-variable theming. It is tree-shakeable, SSR-safe, works with the Next.js App Router, and ships ESM, CJS and TypeScript types.

## Table of contents

- [Features](#features)
- [Installation](#installation)
- [Quick start](#quick-start)
- [Usage](#usage)
  - [React](#react)
  - [Vue 3](#vue-3)
  - [Angular](#angular)
  - [Vanilla JavaScript](#vanilla-javascript)
- [Variants and sizes](#variants-and-sizes)
- [Ripple effect](#ripple-effect)
- [Loading state](#loading-state)
- [Links](#links)
- [Props](#props)
- [Accessibility](#accessibility)
- [Theming](#theming)
- [SSR and custom style injection](#ssr-and-custom-style-injection)
- [API reference](#api-reference)
- [TypeScript](#typescript)
- [FAQ](#faq)
- [Contributing and support](#contributing-and-support)
- [License](#license)

## Features

- 🎨 **6 variants**: `solid`, `subtle`, `surface`, `outline`, `ghost`, `plain`
- 📏 **3 sizes**: `sm`, `md`, `lg`
- 🌊 **Optional ripple effect**: off by default, turn it on with `ripple` (respects `prefers-reduced-motion`)
- ⏳ **Loading state** with a default spinner or your own
- 🔗 **Renders as `<button>` or `<a>`** with correct a11y attributes
- 🎛️ **Dynamic color palettes** from a single color string or an object
- 🧩 **Framework adapters** for React, Vue, and Angular, plus a framework-agnostic core
- 📦 **Tree-shakeable**, ESM + CJS, full TypeScript types, `sideEffects: false`
- 🚫 **Zero runtime dependencies**

## Installation

```bash
npm install uix-button
# or
pnpm add uix-button
# or
yarn add uix-button
```

`react`, `react-dom`, and `vue` are **optional peer dependencies**. Install only what you use:

| Adapter              | Requires                             |
| -------------------- | ------------------------------------ |
| `uix-button/react`   | `react >= 18`, `react-dom >= 18`     |
| `uix-button/vue`     | `vue ^3.3.0`                         |
| `uix-button/angular` | none (framework-agnostic controller) |

## Quick start

```tsx
import { UIXButton } from "uix-button/react";

export default function App() {
  return <UIXButton onClick={() => alert("Hello!")}>Click me</UIXButton>;
}
```

## Usage

### React

```tsx
import { UIXButton } from "uix-button/react";

export function App() {
  return (
    <>
      <UIXButton onClick={() => alert("Clicked!")}>Save</UIXButton>

      <UIXButton variant="outline" size="lg" rounded>
        Large rounded outline
      </UIXButton>

      <UIXButton loading>Saving…</UIXButton>

      <UIXButton ripple={false}>No ripple</UIXButton>

      <UIXButton
        as="a"
        href="https://example.com"
        target="_blank"
        rel="noreferrer"
      >
        Visit site
      </UIXButton>

      <UIXButton colorPalette="#ef4444">Delete</UIXButton>

      <UIXButton type="submit" form="signup-form">
        Submit
      </UIXButton>
    </>
  );
}
```

With icons and a custom spinner:

```tsx
<UIXButton
  startIcon={<PlusIcon />}
  endIcon={<ArrowRightIcon />}
  loading={isLoading}
  spinner={<MySpinner />}
>
  Add item
</UIXButton>
```

Using a ref:

```tsx
const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null);

<UIXButton ref={ref}>Focus me</UIXButton>;
```

The component forwards its `ref` to the underlying `<button>` / `<a>` element and passes through all other native attributes and event handlers. The React entry includes a `"use client"` banner, so it works in the Next.js App Router.

### Vue 3

```vue
<script setup lang="ts">
import { UIXButton } from "uix-button/vue";
</script>

<template>
  <UIXButton variant="subtle" @click="onClick">Click me</UIXButton>

  <UIXButton :loading="saving">Saving…</UIXButton>

  <UIXButton :ripple="false">No ripple</UIXButton>

  <UIXButton as="a" href="/docs">Docs</UIXButton>

  <UIXButton color-palette="#10b981">
    <template #startIcon><CheckIcon /></template>
    Confirm
    <template #endIcon><ArrowIcon /></template>
  </UIXButton>

  <!-- Custom spinner -->
  <UIXButton loading>
    <template #spinner><MySpinner /></template>
    Loading
  </UIXButton>
</template>
```

Available slots: `default`, `startIcon`, `endIcon`, `spinner`. Both `UIXButton` (named) and the default export are available. Extra attributes, `class`, and `style` fall through to the root element.

### Angular

Angular support is provided as a framework-agnostic controller that you wrap in a directive:

```ts
import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { UIXButtonController, type ButtonOptions } from "uix-button/angular";

@Directive({ selector: "[uixButton]", standalone: true })
export class UIXButtonDirective implements OnInit, OnChanges, OnDestroy {
  @Input() uixButton: ButtonOptions = {};
  private ctrl?: UIXButtonController;

  constructor(private host: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.ctrl = new UIXButtonController(this.host.nativeElement);
    this.ctrl.update(this.uixButton);
  }
  ngOnChanges(): void {
    this.ctrl?.update(this.uixButton);
  }
  ngOnDestroy(): void {
    this.ctrl?.destroy();
  }
}
```

```html
<button [uixButton]="{ variant: 'outline', size: 'lg' }">Click me</button>
<button [uixButton]="{ ripple: false }">No ripple</button>
<button [uixButton]="{ loading: isSaving, colorPalette: '#10b981' }">
  Save
</button>
<a [uixButton]="{ as: 'a', href: '/docs', variant: 'ghost' }">Docs</a>
```

> **Note:** the controller manages the element's `class` attribute, so apply extra classes via a wrapper or after `update()`. Icons and custom spinners are not handled by the controller; add your own markup inside the host element.

### Vanilla JavaScript

The core utilities are exported from the package root and can be used with any framework (or none):

```ts
import {
  injectStyles,
  buildClassName,
  attachRipple,
  applyPalette,
} from "uix-button";

injectStyles();

const btn = document.querySelector("button")!;
btn.className = buildClassName({ variant: "solid", size: "md", rounded: true });

// Ripple is opt-in here: only attach it if you want it
const detach = attachRipple(btn, { color: "white", duration: 600 });
applyPalette(btn, "#8b5cf6");

// later
detach();
```

## Variants and sizes

```tsx
<UIXButton variant="solid">Solid</UIXButton>
<UIXButton variant="subtle">Subtle</UIXButton>
<UIXButton variant="surface">Surface</UIXButton>
<UIXButton variant="outline">Outline</UIXButton>
<UIXButton variant="ghost">Ghost</UIXButton>
<UIXButton variant="plain">Plain</UIXButton>

<UIXButton size="sm">Small</UIXButton>
<UIXButton size="md">Medium</UIXButton>
<UIXButton size="lg">Large</UIXButton>

<UIXButton rounded>Pill</UIXButton>
```

## Ripple effect

The ripple is **enabled by default** and is optional. Disable it per button with the `ripple` prop:

| Framework | Disable                           |
| --------- | --------------------------------- |
| React     | `<UIXButton ripple={false}>`      |
| Vue       | `<UIXButton :ripple="false">`     |
| Angular   | `[uixButton]="{ ripple: false }"` |
| Vanilla   | simply don't call `attachRipple`  |

The prop is reactive: toggling it at runtime attaches or removes the ripple listener (and any in-flight ripple elements) without remounting the button.

The ripple is also skipped automatically when the user has `prefers-reduced-motion: reduce` enabled.

The framework components use the default ripple color (`currentColor`) and duration (550 ms). To customize them, use `attachRipple(el, { color, duration })` directly and pass `ripple={false}` to the component.

## Loading state

`loading` shows a spinner before the content, sets `aria-busy="true"`, and disables interaction:

```tsx
<UIXButton loading>Saving…</UIXButton>
```

The default spinner is animated and is disabled under `prefers-reduced-motion`. Provide your own with the `spinner` prop (React) or `#spinner` slot (Vue).

## Links

Set `as="a"` to render an anchor. `href`, `target`, `rel`, and `download` are applied only in this mode:

```tsx
<UIXButton as="a" href="/report.pdf" download="report.pdf">
  Download
</UIXButton>
```

When `disabled` or `loading`, anchors get `aria-disabled="true"` and `tabindex="-1"` instead of the native `disabled` attribute.

## Props

### React & Vue

| Prop           | Type                                                                  | Default    | Description                                     |
| -------------- | --------------------------------------------------------------------- | ---------- | ----------------------------------------------- |
| `variant`      | `"solid" \| "subtle" \| "surface" \| "outline" \| "ghost" \| "plain"` | `"solid"`  | Visual style.                                   |
| `size`         | `"sm" \| "md" \| "lg"`                                                | `"md"`     | Button size.                                    |
| `as`           | `"button" \| "a"`                                                     | `"button"` | Element to render.                              |
| `type`         | `"button" \| "submit" \| "reset"`                                     | `"button"` | Native `type` (when `as="button"`).             |
| `href`         | `string`                                                              | –          | Link URL (when `as="a"`).                       |
| `target`       | `string`                                                              | –          | Link target (when `as="a"`).                    |
| `rel`          | `string`                                                              | –          | Link rel (when `as="a"`).                       |
| `download`     | `string \| boolean`                                                   | –          | Link download attribute (when `as="a"`).        |
| `rounded`      | `boolean`                                                             | `false`    | Fully rounded (pill) corners.                   |
| `disabled`     | `boolean`                                                             | `false`    | Disables the button.                            |
| `loading`      | `boolean`                                                             | `false`    | Shows a spinner and disables interaction.       |
| `ripple`       | `boolean`                                                             | `true`     | Enables the click ripple effect.                |
| `colorPalette` | `string \| ColorPalette`                                              | –          | Override theme colors. See [Theming](#theming). |

In Vue, use kebab-case in templates (`color-palette`).

**React only:**

| Prop                                                                                | Type        | Description                        |
| ----------------------------------------------------------------------------------- | ----------- | ---------------------------------- |
| `startIcon`                                                                         | `ReactNode` | Icon rendered before the children. |
| `endIcon`                                                                           | `ReactNode` | Icon rendered after the children.  |
| `spinner`                                                                           | `ReactNode` | Custom loading indicator.          |
| `form`, `formAction`, `formMethod`, `formNoValidate`, `formTarget`, `name`, `value` | native      | Forwarded to `<button>`.           |

### Angular / `ButtonOptions`

`variant`, `size`, `rounded`, `as`, `href`, `target`, `rel`, `type`, `disabled`, `loading`, `ripple`, `colorPalette`.

## Accessibility

- `disabled` and `loading` set the native `disabled` attribute on `<button>`.
- On `<a>`, they set `aria-disabled="true"` and `tabindex="-1"` instead.
- `loading` sets `aria-busy="true"`.
- Icons and spinners are marked `aria-hidden`.
- A visible `:focus-visible` outline is included.
- Ripple and transitions are disabled under `prefers-reduced-motion: reduce`.

## Theming

### `colorPalette`

Pass a single color string to set the **primary** color. Hover and active shades are derived automatically with `color-mix`:

```tsx
<UIXButton colorPalette="#ef4444">Danger</UIXButton>
```

Or pass an object to set several colors at once:

```tsx
<UIXButton
  colorPalette={{
    primary: "#6366f1",
    danger: "#dc2626",
    success: "#16a34a",
  }}
>
  Custom
</UIXButton>
```

Any color format the browser understands is accepted (hex, `rgb()`, `hsl()`, named colors). Missing `danger`, `warning`, and `success` values are derived from the primary color's saturation and lightness. You can also generate a palette yourself:

```ts
import { generatePalette } from "uix-button";

const palette = generatePalette("#ff7130");
// { primary, danger, warning, success }
```

### CSS custom properties

Every button exposes CSS variables you can override globally or per element:

```css
.my-theme .uix-button {
  --uix-primary: #7c3aed;
  --uix-radius: 0.25rem;
  --uix-font-weight: 500;
}
```

| Variable                                                    | Default                         |
| ----------------------------------------------------------- | ------------------------------- |
| `--uix-primary` / `-hover` / `--uix-on-primary`             | `#ff7130` / derived / `#ffffff` |
| `--uix-danger` (+ `-hover`, `--uix-on-danger`)              | `#dc2626`                       |
| `--uix-warning` (+ `-hover`, `--uix-on-warning`)            | `#ea580c`                       |
| `--uix-success` (+ `-hover`, `--uix-on-success`)            | `#16a34a`                       |
| `--uix-on-surface`                                          | `#111827`                       |
| `--uix-radius`, `--uix-radius-full`                         | `0.25rem`, `9999px`             |
| `--uix-gap`                                                 | `0.5rem`                        |
| `--uix-padding-inline`, `--uix-padding-block`               | `1.5rem`, `0.75rem`             |
| `--uix-font-size`, `--uix-font-weight`, `--uix-line-height` | `0.875rem`, `600`, `1.25rem`    |
| `--uix-transition`                                          | `150ms ease`                    |

`-active` variants (e.g. `--uix-primary-active`) are set when you use `colorPalette`.

> Styles use `color-mix()`, which is supported in all current evergreen browsers.

## SSR and custom style injection

Styles are injected into `document.head` on first render (and skipped safely on the server). If you prefer to ship the CSS yourself, for example to satisfy a strict CSP, import the raw string:

```ts
import { BUTTON_CSS } from "uix-button";
```

## API reference

Exports from `uix-button`:

| Export                       | Description                                                                                                          |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `buildClassName(opts)`       | Builds the class string for a given `variant`, `size`, and `rounded`.                                                |
| `DEFAULT_SPINNER_HTML`       | SVG markup string for the default spinner.                                                                           |
| `BUTTON_CSS`                 | The full stylesheet as a string.                                                                                     |
| `injectStyles()`             | Injects the stylesheet once (no-op on the server).                                                                   |
| `attachRipple(el, options?)` | Adds a ripple effect; returns a cleanup function. Options: `{ color?: string; duration?: number }` (default 550 ms). |
| `generatePalette(input)`     | Expands a color or partial palette into a full palette.                                                              |
| `applyPalette(el, input)`    | Applies a palette to an element as CSS variables.                                                                    |

Types: `ButtonVariant`, `ButtonSize`, `ButtonAs`, `ButtonType`, `ColorPalette`, `ButtonOptions`, `RippleOptions`, `GeneratedPalette`.

Framework entry points:

- `uix-button/react`: `UIXButton`, `UIXButtonProps`
- `uix-button/vue`: `UIXButton` (named and default)
- `uix-button/angular`: `UIXButtonController`, plus the shared types

## TypeScript

All entry points ship with `.d.ts` files. No additional `@types` packages are needed.

## FAQ

**How do I add a ripple effect to a React button?**
Use `UIXButton`; the ripple is on by default. Turn it off with `ripple={false}`.

**How do I show a loading spinner on a button in Vue 3?**
Pass `:loading="true"`. The button is disabled and gets `aria-busy`. Use the `#spinner` slot for a custom spinner.

**Does it work with Next.js and SSR?**
Yes. Styles are injected only in the browser, and the React entry includes `"use client"`.

**Can I use it in Angular without a component library?**
Yes. Wrap `UIXButtonController` in a small directive (see [Angular](#angular)).

**How do I change the button color?**
Use `colorPalette="#hex"` or override the `--uix-*` CSS variables.

## Contributing and support

- 🐛 Found a bug or want a feature? [Open an issue](https://github.com/uix-digital-official/uix-button/issues).
- 🔧 Pull requests are welcome: fork the repo, run `npm install`, then `npm run dev` and `npm run typecheck`.
- ⭐ If uix-button helps you, [star it on GitHub](https://github.com/uix-digital-official/uix-button).

Source code: [https://github.com/uix-digital-official/uix-button](https://github.com/uix-digital-official/uix-button)

## License

[MIT](./LICENSE) © 2026 UIX Digital
