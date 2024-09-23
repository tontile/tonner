"use client";

import { type ElementType, type ReactNode, forwardRef } from "react";
import styles from "./button-cell.module.css";

import { classNames } from "@/helpers";
import { hasReactNode } from "@/helpers/react";
import { usePlatform } from "@/hooks";

import { Tappable, type TappableProps } from "@/components/service/tappable";
import { Subheadline } from "@/components/typography/subheadline";
import { Text } from "@/components/typography/text";

export interface ButtonCellProps extends Omit<TappableProps, "Component"> {
  /** Determines the button cell's visual theme, influencing color and style. */
  mode?: "default" | "destructive";
  /** Element or component displayed before the main content, adding visual context or functionality. */
  before?: ReactNode;
  /** Element or component displayed after the main content, typically indicating a possible action or outcome. */
  after?: ReactNode;
  /** Specifies the root element type for more semantic HTML structure or integration with navigation libraries. */
  Component?: ElementType;
  /** The content within the button cell, usually text. */
  children?: ReactNode;
}

/**
 * Renders an interactive cell component with optional leading and trailing elements. Designed to be flexible,
 * supporting various content structures and interaction models within UI designs.
 */
export const ButtonCell = forwardRef(
  (
    {
      mode = "default",
      before,
      after,
      className,
      children,
      Component,
      ...restProps
    }: ButtonCellProps,
    ref,
  ) => {
    const platform = usePlatform();
    const Typography = platform === "ios" ? Subheadline : Text;

    return (
      <Tappable
        ref={ref}
        Component={Component || "button"}
        className={classNames(
          styles.wrapper,
          mode === "destructive" && styles["wrapper--destructive"],
          platform === "ios" && styles["wrapper--ios"],
          className,
        )}
        {...restProps}
      >
        {hasReactNode(before) && before}
        {hasReactNode(children) && <Typography>{children}</Typography>}
        {hasReactNode(after) && after}
      </Tappable>
    );
  },
);
