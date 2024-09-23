import type { HTMLAttributes } from "react";
import styles from "./icon-container.module.css";

import { classNames } from "@/helpers";

export interface IconContainerProps extends HTMLAttributes<HTMLDivElement> {}

export const IconContainer = ({
  className,
  children,
  ...restProps
}: IconContainerProps) => (
  <div className={classNames(styles.wrapper, className)} {...restProps}>
    {children}
  </div>
);
