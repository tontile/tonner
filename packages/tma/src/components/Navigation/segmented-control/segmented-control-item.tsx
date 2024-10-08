"use client";

import type { ButtonHTMLAttributes } from "react";
import styles from "./segmented-control-item.module.css";

import { classNames } from "@/helpers";
import { usePlatform } from "@/hooks";

import { Tappable } from "@/components/service/tappable";
import { Caption } from "@/components/typography/caption";

export interface SegmentedControlItemProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Whether the item is selected. Used by the parent SegmentedControl to style accordingly. */
  selected?: boolean;
}

/**
 * A component representing an individual item within a SegmentedControl.
 * It leverages the Tappable component for handling interactions and supports platform-specific styles.
 */
export const SegmentedControlItem = ({
  selected,
  className,
  children,
  ...restProps
}: SegmentedControlItemProps) => {
  const platform = usePlatform();
  return (
    <Tappable
      role="tab"
      Component="button"
      className={classNames(
        styles.wrapper,
        platform === "ios" && styles["wrapper--ios"],
        className,
      )}
      {...restProps}
    >
      <Caption weight={selected ? "2" : "3"}>{children}</Caption>
    </Tappable>
  );
};
