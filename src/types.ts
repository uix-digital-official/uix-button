export type ButtonVariant =
  | "solid"
  | "subtle"
  | "surface"
  | "outline"
  | "ghost"
  | "plain";

export type ButtonSize = "sm" | "md" | "lg";
export type ButtonAs = "button" | "a";
export type ButtonType = "button" | "submit" | "reset";

export interface ColorPalette {
  primary?: string;
  danger?: string;
  warning?: string;
  success?: string;
  [key: string]: string | undefined;
}

/** Used by the imperative controller (Angular, vanilla, etc.). */
export interface ButtonOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  rounded?: boolean;
  as?: ButtonAs;
  href?: string;
  target?: string;
  rel?: string;
  type?: ButtonType;
  disabled?: boolean;
  loading?: boolean;
  /** Enable the click ripple effect. Defaults to `true`. */
  ripple?: boolean;
  colorPalette?: string | ColorPalette;
}
