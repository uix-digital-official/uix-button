"use client";

import * as React from "react";
import { buildClassName } from "./core";
import { injectStyles } from "./styles";
import { attachRipple } from "./ripple";
import { applyPalette } from "./palette";
import type {
  ButtonVariant,
  ButtonSize,
  ButtonAs,
  ButtonType,
  ColorPalette,
} from "./types";

export interface UIXButtonProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "color"
> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  as?: ButtonAs;
  type?: ButtonType;
  href?: string;
  target?: string;
  rel?: string;
  download?: string | boolean;
  form?: string;
  formAction?: string;
  formMethod?: "get" | "post";
  formNoValidate?: boolean;
  formTarget?: string;
  name?: string;
  value?: string | number | readonly string[];
  rounded?: boolean;
  disabled?: boolean;
  loading?: boolean;
  /** Enable the click ripple effect. Defaults to `true`. */
  ripple?: boolean;
  colorPalette?: string | ColorPalette;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  spinner?: React.ReactNode;
}

function DefaultSpinner() {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 2400 2400"
    >
      <g
        strokeWidth="200"
        strokeLinecap="round"
        stroke="currentColor"
        fill="none"
        id="spinner"
      >
        <line x1="1200" y1="600" x2="1200" y2="100" />
        <line opacity="0.5" x1="1200" y1="2300" x2="1200" y2="1800" />
        <line opacity="0.917" x1="900" y1="680.4" x2="650" y2="247.4" />
        <line opacity="0.417" x1="1750" y1="2152.6" x2="1500" y2="1719.6" />
        <line opacity="0.833" x1="680.4" y1="900" x2="247.4" y2="650" />
        <line opacity="0.333" x1="2152.6" y1="1750" x2="1719.6" y2="1500" />
        <line opacity="0.75" x1="600" y1="1200" x2="100" y2="1200" />
        <line opacity="0.25" x1="2300" y1="1200" x2="1800" y2="1200" />
        <line opacity="0.667" x1="680.4" y1="1500" x2="247.4" y2="1750" />
        <line opacity="0.167" x1="2152.6" y1="650" x2="1719.6" y2="900" />
        <line opacity="0.583" x1="900" y1="1719.6" x2="650" y2="2152.6" />
        <line opacity="0.083" x1="1750" y1="247.4" x2="1500" y2="680.4" />
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          keyTimes="0;0.08333;0.16667;0.25;0.33333;0.41667;0.5;0.58333;0.66667;0.75;0.83333;0.91667"
          values="0 1199 1199;30 1199 1199;60 1199 1199;90 1199 1199;120 1199 1199;150 1199 1199;180 1199 1199;210 1199 1199;240 1199 1199;270 1199 1199;300 1199 1199;330 1199 1199"
          dur="0.83333s"
          begin="0s"
          repeatCount="indefinite"
          calcMode="discrete"
        />
      </g>
    </svg>
  );
}

type ButtonEl = HTMLButtonElement | HTMLAnchorElement;

export const UIXButton = React.forwardRef<ButtonEl, UIXButtonProps>(
  function UIXButton(props, forwardedRef) {
    const {
      variant = "solid",
      size = "md",
      as = "button",
      type = "button",
      href,
      target,
      rel,
      download,
      form,
      formAction,
      formMethod,
      formNoValidate,
      formTarget,
      name,
      value,
      rounded,
      disabled,
      loading,
      ripple = true,
      colorPalette,
      startIcon,
      endIcon,
      spinner,
      children,
      className,
      ...rest
    } = props;

    const ref = React.useRef<ButtonEl | null>(null);

    React.useImperativeHandle(forwardedRef, () => ref.current as ButtonEl, []);

    React.useEffect(() => {
      injectStyles();
    }, []);

    React.useEffect(() => {
      if (!ripple || !ref.current) return;
      return attachRipple(ref.current);
    }, [ripple]);

    React.useEffect(() => {
      if (!ref.current) return;
      applyPalette(ref.current, colorPalette);
    }, [colorPalette]);

    const computedClass = [
      buildClassName({ variant, size, rounded }),
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const isDisabled = Boolean(disabled || loading);

    const content = (
      <>
        {startIcon != null && (
          <span className="uix-button__icon" aria-hidden="true">
            {startIcon}
          </span>
        )}
        {loading && (
          <span
            className={
              "uix-button__spinner" +
              (spinner == null ? " uix-button__spinner--default" : "")
            }
            aria-hidden="true"
          >
            {spinner ?? <DefaultSpinner />}
          </span>
        )}
        {children}
        {endIcon != null && (
          <span className="uix-button__icon" aria-hidden="true">
            {endIcon}
          </span>
        )}
      </>
    );

    if (as === "a") {
      const downloadValue =
        download === true
          ? ""
          : download === false || download === undefined
            ? undefined
            : download;

      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={computedClass}
          href={href}
          target={target}
          rel={rel}
          download={downloadValue}
          aria-disabled={isDisabled || undefined}
          aria-busy={loading || undefined}
          tabIndex={isDisabled ? -1 : undefined}
          {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={computedClass}
        type={type}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        form={form}
        formAction={formAction}
        formMethod={formMethod}
        formNoValidate={formNoValidate}
        formTarget={formTarget}
        name={name}
        value={value}
        {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </button>
    );
  },
);
