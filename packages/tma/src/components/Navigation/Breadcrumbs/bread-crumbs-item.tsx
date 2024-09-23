import type { AllHTMLAttributes, ElementType } from "react";
import styles from "./bread-crumbs-item.module.css";

import { classNames } from "@/helpers";

import { Subheadline } from "@/components/typography/subheadline";

export interface BreadCrumbsItemProps extends AllHTMLAttributes<HTMLElement> {
  Component?: ElementType;
}

export const BreadCrumbsItem = ({
  Component = "div",
  className,
  children,
  ...restProps
}: BreadCrumbsItemProps) => (
  <Component className={classNames(styles.wrapper, className)} {...restProps}>
    <Subheadline level="2" weight="2">
      {children}
    </Subheadline>
  </Component>
);
