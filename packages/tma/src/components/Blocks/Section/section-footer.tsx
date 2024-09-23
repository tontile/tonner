"use client";

import type { HTMLAttributes } from "react";
import styles from "./section-footer.module.css";

import { classNames } from "@/helpers";
import { usePlatform } from "@/hooks";

import { Caption } from "@/components/typography/caption";
import { Subheadline } from "@/components/typography/subheadline";
import type { TypographyProps } from "@/components/typography/typography";

export interface SectionFooterProps extends HTMLAttributes<HTMLElement> {
  /** Centering text, adding additional indents */
  centered?: boolean;
}

const FooterTypography = ({ ...restProps }: TypographyProps) => {
  const platform = usePlatform();

  if (platform === "ios") {
    return <Caption {...restProps} />;
  }

  return <Subheadline level="2" {...restProps} />;
};

export const SectionFooter = ({
  className,
  children,
  centered,
  ...restProps
}: SectionFooterProps) => {
  const platform = usePlatform();

  return (
    <footer
      className={classNames(
        styles.wrapper,
        platform === "ios" && styles["wrapper--ios"],
        centered && styles["wrapper--centered"],
        className,
      )}
      {...restProps}
    >
      <FooterTypography className={styles.text}>{children}</FooterTypography>
    </footer>
  );
};
