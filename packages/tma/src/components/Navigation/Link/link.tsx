import type { AnchorHTMLAttributes } from "react";
import styles from "./link.module.css";

import { classNames } from "@/helpers";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {}

export const Link = ({ className, children, ...restProps }: LinkProps) => (
  <a className={classNames(styles.wrapper, className)} {...restProps}>
    {children}
  </a>
);
