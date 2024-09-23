"use client";

import type { ButtonHTMLAttributes } from "react";
import styles from "./tabs-item.module.css";

import { classNames } from "@/helpers";
import { usePlatform } from "@/hooks";

import { Tappable } from "@/components/service/tappable";
import { Text } from "@/components/typography/text";

export interface TabsItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Indicates if the tab item is currently selected. */
  selected?: boolean;
}

/**
 * Tabs.Item component represents an individual tab within a TabsList.
 * It can be interactively selected to display associated content.
 */
export const TabsItem = ({
  selected,
  className,
  children,
  ...restProps
}: TabsItemProps) => {
  const platform = usePlatform();
  const iosWeight = selected ? "1" : "2";

  return (
    <Tappable
      role="tab"
      Component="button"
      className={classNames(
        styles.wrapper,
        selected && styles["wrapper--selected"],
        className,
      )}
      {...restProps}
    >
      <Text weight={platform === "ios" ? iosWeight : "2"}>{children}</Text>
    </Tappable>
  );
};
