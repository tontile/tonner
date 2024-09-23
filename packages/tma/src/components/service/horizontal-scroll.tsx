import type { AllHTMLAttributes, ElementType } from "react";
import styles from "./horizontal-scroll.module.css";

import { classNames } from "@/helpers/class-names";

export interface HorizontalScrollProps extends AllHTMLAttributes<HTMLElement> {
  Component?: ElementType;
}

export const HorizontalScroll = ({
  Component = "div",
  className,
  children,
  ...restProps
}: HorizontalScrollProps) => (
  <Component className={classNames(styles.wrapper, className)} {...restProps}>
    {children}
  </Component>
);
