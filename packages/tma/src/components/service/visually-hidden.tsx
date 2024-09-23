import React, {
  type AllHTMLAttributes,
  type ElementType,
  forwardRef,
} from "react";
import styles from "./visually-hidden.module.css";

import { classNames } from "@/helpers/class-names";

export interface VisuallyHiddenProps<T> extends AllHTMLAttributes<T> {
  Component?: ElementType;
}

export const VisuallyHidden = forwardRef<
  HTMLSpanElement,
  VisuallyHiddenProps<HTMLSpanElement>
>(({ Component = "span", className, ...restProps }, ref) => (
  <Component
    {...restProps}
    ref={ref}
    className={classNames(styles.wrapper, className)}
  />
));
