import { forwardRef } from "react";
import styles from "./subheadline.module.css";

import { classNames } from "@/helpers";
import { Typography, type TypographyProps } from "../typography";

type SubheadlineLevel = "1" | "2";

export interface SubheadlineProps extends TypographyProps {
  /** Determines the size of the subheadline, with `1` being the default and '2' providing a smaller option. */
  level?: SubheadlineLevel;
}

const subheadlineLevelStyles: Record<SubheadlineLevel, string> = {
  "1": styles["wrapper--1"]!,
  "2": styles["wrapper--2"]!,
};

/**
 * The Subheadline component is designed to render text that serves as a secondary heading
 * or subheading within content. It leverages the Typography component for consistent text styling,
 * offering additional control over the text's size through the `level` prop. By default, it renders
 * as an `<h6>` element but can be customized with the `Component` prop.
 */
export const Subheadline = forwardRef(
  (
    { level = "1", className, Component, ...restProps }: SubheadlineProps,
    ref,
  ) => (
    <Typography
      {...restProps}
      ref={ref}
      className={classNames(
        styles.wrapper,
        subheadlineLevelStyles[level],
        className,
      )}
      Component={Component || "h6"}
    />
  ),
);
