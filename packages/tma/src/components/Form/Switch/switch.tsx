"use client";

import type { InputHTMLAttributes } from "react";
import styles from "./switch.module.css";

import { classNames } from "@/helpers";
import { usePlatform } from "@/hooks";

import { VisuallyHidden } from "@/components/service/visually-hidden";

export interface SwitchProps extends InputHTMLAttributes<HTMLInputElement> {}

const platformStyles = {
  base: styles["wrapper--base"],
  ios: styles["wrapper--ios"],
};

/**
 * A custom switch component that mimics the behavior of a checkbox input but with enhanced styling.
 * It supports all the standard attributes of an HTML input element of type "checkbox".
 * The appearance of the switch can be customized to match either a base or iOS platform style using CSS modules.
 */
export const Switch = ({
  style,
  className,
  disabled,
  children,
  ...restProps
}: SwitchProps) => {
  const platform = usePlatform();

  return (
    <label
      className={classNames(
        styles.wrapper,
        platformStyles[platform],
        disabled && styles["wrapper--disabled"],
        className,
      )}
    >
      <VisuallyHidden
        {...restProps}
        Component="input"
        type="checkbox"
        className={styles.input}
        disabled={disabled}
      />
      <div aria-hidden className={styles.control} />
      {children}
    </label>
  );
};
