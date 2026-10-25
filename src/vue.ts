import {
  defineComponent,
  h,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  normalizeClass,
  type PropType,
} from "vue";
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

function DefaultSpinner() {
  return h(
    "svg",
    { viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true" },
    [
      h(
        "circle",
        {
          cx: 12,
          cy: 12,
          r: 10,
          stroke: "currentColor",
          "stroke-width": 3,
          "stroke-linecap": "round",
          "stroke-dasharray": "31.4 31.4",
          transform: "rotate(-90 12 12)",
        },
        [
          h("animate", {
            attributeName: "stroke-dashoffset",
            dur: "0.8s",
            repeatCount: "indefinite",
            from: "0",
            to: "62.8",
          }),
        ],
      ),
    ],
  );
}

export const UIXButton = defineComponent({
  name: "UIXButton",
  inheritAttrs: false,
  props: {
    variant: { type: String as PropType<ButtonVariant>, default: "solid" },
    size: { type: String as PropType<ButtonSize>, default: "md" },
    as: { type: String as PropType<ButtonAs>, default: "button" },
    type: { type: String as PropType<ButtonType>, default: "button" },
    href: { type: String, default: undefined },
    target: { type: String, default: undefined },
    rel: { type: String, default: undefined },
    download: {
      type: [String, Boolean] as PropType<string | boolean>,
      default: undefined,
    },
    rounded: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    ripple: { type: Boolean, default: true },
    colorPalette: {
      type: [String, Object] as PropType<string | ColorPalette>,
      default: undefined,
    },
  },
  setup(props, { slots, attrs }) {
    const el = ref<HTMLElement | null>(null);
    let cleanup: (() => void) | null = null;

    function syncRipple(enabled: boolean) {
      if (enabled && !cleanup && el.value) {
        cleanup = attachRipple(el.value);
      } else if (!enabled && cleanup) {
        cleanup();
        cleanup = null;
      }
    }

    onMounted(() => {
      injectStyles();
      if (el.value) {
        syncRipple(props.ripple);
        applyPalette(el.value, props.colorPalette);
      }
    });

    watch(
      () => props.ripple,
      (enabled) => syncRipple(enabled),
    );

    onBeforeUnmount(() => {
      cleanup?.();
      cleanup = null;
    });

    watch(
      () => props.colorPalette,
      (pal) => {
        if (el.value) applyPalette(el.value, pal);
      },
    );

    return () => {
      const tag = props.as === "a" ? "a" : "button";
      const isDisabled = props.disabled || props.loading;

      const baseClass = buildClassName({
        variant: props.variant,
        size: props.size,
        rounded: props.rounded,
      });
      const classes = normalizeClass([baseClass, attrs["class"]]);

      const startIcon = slots["startIcon"];
      const endIcon = slots["endIcon"];
      const spinnerSlot = slots["spinner"];
      const defaultSlot = slots["default"];

      const children: unknown[] = [];
      if (startIcon) {
        children.push(
          h(
            "span",
            { class: "uix-button__icon", "aria-hidden": "true" },
            startIcon(),
          ),
        );
      }
      if (props.loading) {
        const custom = spinnerSlot?.();
        const isDefault = !custom || custom.length === 0;
        children.push(
          h(
            "span",
            {
              class:
                "uix-button__spinner" +
                (isDefault ? " uix-button__spinner--default" : ""),
              "aria-hidden": "true",
            },
            isDefault ? [DefaultSpinner()] : custom,
          ),
        );
      }
      children.push(defaultSlot?.());
      if (endIcon) {
        children.push(
          h(
            "span",
            { class: "uix-button__icon", "aria-hidden": "true" },
            endIcon(),
          ),
        );
      }

      const { class: _cls, style: _style, ...fallthrough } = attrs;

      const elementAttrs: Record<string, unknown> = {
        ref: el,
        class: classes,
        style: _style,
        "aria-busy": props.loading || undefined,
        ...fallthrough,
      };

      if (tag === "a") {
        if (props["href"] !== undefined) elementAttrs["href"] = props["href"];
        if (props["target"] !== undefined)
          elementAttrs["target"] = props["target"];
        if (props["rel"] !== undefined) elementAttrs["rel"] = props["rel"];
        if (props["download"] !== undefined)
          elementAttrs["download"] = props["download"];
        elementAttrs["aria-disabled"] = isDisabled || undefined;
        elementAttrs["tabindex"] = isDisabled ? -1 : undefined;
      } else {
        elementAttrs["type"] = props["type"];
        elementAttrs["disabled"] = isDisabled;
      }

      return h(tag, elementAttrs, children as never);
    };
  },
});

export default UIXButton;
