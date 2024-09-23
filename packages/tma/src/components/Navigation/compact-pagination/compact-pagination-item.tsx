import type { ButtonHTMLAttributes } from "react";
import styles from "./compact-pagination-item.module.css";

import { VisuallyHidden } from "@/components/service/visually-hidden";
import { classNames } from "@/helpers";
import { hasReactNode } from "@/helpers/react";

export interface CompactPaginationItemProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

export const CompactPaginationItem = ({
  selected,
  className,
  children,
  ...restProps
}: CompactPaginationItemProps) => (
  <button
    type="button"
    role="tab"
    aria-selected={selected}
    className={classNames(
      styles.wrapper,
      selected && styles["wrapper--selected"],
      className,
    )}
    {...restProps}
  >
    {hasReactNode(children) ? (
      <VisuallyHidden>{children}</VisuallyHidden>
    ) : undefined}
  </button>
);
