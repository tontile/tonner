"use client";

import {
  type HTMLAttributes,
  type InputHTMLAttributes,
  forwardRef,
} from "react";
import styles from "./slider-thumb.module.css";

import { classNames } from "@/helpers";
import { usePlatform } from "@/hooks";

import { VisuallyHidden } from "@/components/service/visually-hidden";

export interface SliderThumbProps extends HTMLAttributes<HTMLSpanElement> {
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  withTooltip?: boolean;
}

export const SliderThumb = forwardRef<HTMLSpanElement, SliderThumbProps>(
  ({ className, inputProps, withTooltip, ...restProps }, ref) => {
    const platform = usePlatform();

    return (
      <span
        className={classNames(
          styles.wrapper,
          platform === "ios" && styles["wrapper--ios"],
          className,
        )}
        {...restProps}
      >
        <VisuallyHidden
          {...inputProps}
          Component="input"
          type="range"
          ref={ref}
          className={classNames(styles.input, className)}
          aria-orientation="horizontal"
        />
      </span>
    );
  },
);
