import type { ButtonHTMLAttributes } from "react";
import styles from "./snackbar-button.module.css";

import { classNames } from "@/helpers";

import { Tappable } from "@/components/service/tappable";

export interface SnackbarButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const SnackbarButton = ({
  className,
  children,
  ...restProps
}: SnackbarButtonProps) => (
  <Tappable
    Component="button"
    className={classNames(styles.wrapper, className)}
    {...restProps}
  >
    {children}
  </Tappable>
);
