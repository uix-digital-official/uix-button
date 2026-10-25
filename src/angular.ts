import { buildClassName } from "./core";
import { injectStyles } from "./styles";
import { attachRipple } from "./ripple";
import { applyPalette } from "./palette";
import type { ButtonOptions } from "./types";

export type {
  ButtonVariant,
  ButtonSize,
  ButtonAs,
  ButtonType,
  ColorPalette,
  ButtonOptions,
} from "./types";

/**
 * Framework-agnostic controller. Instantiate it against the native host
 * element (`ElementRef.nativeElement`) and call `update()` whenever props
 * change. `destroy()` on component teardown.
 *
 * Example Angular directive (copy-paste into your app):
 *
 * ```ts
 * import {
 *   Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit,
 * } from '@angular/core';
 * import { UIXButtonController, type ButtonOptions } from 'uix-button/angular';
 *
 * @Directive({ selector: '[uixButton]', standalone: true })
 * export class UIXButtonDirective implements OnInit, OnChanges, OnDestroy {
 *   @Input() uixButton: ButtonOptions = {};
 *   private ctrl?: UIXButtonController;
 *   constructor(private host: ElementRef<HTMLElement>) {}
 *   ngOnInit(): void {
 *     this.ctrl = new UIXButtonController(this.host.nativeElement);
 *     this.ctrl.update(this.uixButton);
 *   }
 *   ngOnChanges(): void { this.ctrl?.update(this.uixButton); }
 *   ngOnDestroy(): void { this.ctrl?.destroy(); }
 * }
 * ```
 */
export class UIXButtonController {
  private readonly el: HTMLElement;
  private cleanup: (() => void) | null = null;

  constructor(element: HTMLElement) {
    this.el = element;
  }

  update(options: ButtonOptions = {}): void {
    injectStyles();

    const variant = options.variant ?? "solid";
    const size = options.size ?? "md";
    const rounded = options.rounded ?? false;
    const disabled = options.disabled ?? false;
    const loading = options.loading ?? false;
    const ripple = options.ripple ?? false;
    const as = options.as ?? "button";
    const type = options.type ?? "button";

    this.el.className = buildClassName({ variant, size, rounded });

    if (as === "a") {
      if (options.href !== undefined)
        this.el.setAttribute("href", options.href);
      else this.el.removeAttribute("href");

      if (options.target !== undefined)
        this.el.setAttribute("target", options.target);
      else this.el.removeAttribute("target");

      if (options.rel !== undefined) this.el.setAttribute("rel", options.rel);
      else this.el.removeAttribute("rel");

      if (disabled || loading) {
        this.el.setAttribute("aria-disabled", "true");
        this.el.setAttribute("tabindex", "-1");
      } else {
        this.el.removeAttribute("aria-disabled");
        this.el.removeAttribute("tabindex");
      }
    } else if (this.el instanceof HTMLButtonElement) {
      this.el.type = type;
      this.el.disabled = disabled || loading;
    }

    if (loading) this.el.setAttribute("aria-busy", "true");
    else this.el.removeAttribute("aria-busy");

    applyPalette(this.el, options.colorPalette);

    if (ripple && !this.cleanup) {
      this.cleanup = attachRipple(this.el);
    } else if (!ripple && this.cleanup) {
      this.cleanup();
      this.cleanup = null;
    }
  }

  destroy(): void {
    this.cleanup?.();
    this.cleanup = null;
  }
}
