"use client";

import type { HTMLAttributes } from "react";
import styles from "./section-header.module.css";

import { classNames } from "@/helpers";
import { usePlatform } from "@/hooks";

import { useHeaderComponents } from "@/components/hooks/use-header-components";

export interface SectionHeaderProps extends HTMLAttributes<HTMLHeadElement> {
  /** Large title, changes font size, padding and color */
  large?: boolean;
}

export const SectionHeader = ({
  large,
  className,
  children,
  ...restProps
}: SectionHeaderProps) => {
  const platform = usePlatform();
  const { Default, Large } = useHeaderComponents();

  const Component = large ? Large : Default;
  return (
    <header
      className={classNames(
        styles.wrapper,
        platform === "ios" && styles["wrapper--ios"],
        large && styles["wrapper--large"],
        className,
      )}
      {...restProps}
    >
      <Component Component="h1" className={styles.title}>
        {children}
      </Component>
    </header>
  );
};
