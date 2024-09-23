"use client";

import {
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type ReactElement,
  type RefAttributes,
  forwardRef,
} from "react";
import styles from "./inline-buttons.module.css";

import { classNames } from "@/helpers";
import { useObjectMemo } from "@/hooks";
import { usePlatform } from "@/hooks";

import {
  InlineButtonsContext,
  type InlineButtonsContextProps,
} from "./inline-buttons-context";
import {
  InlineButtonsItem,
  type InlineButtonsItemProps,
} from "./inline-buttons-item";

export interface InlineButtonsProps extends HTMLAttributes<HTMLDivElement> {
  /** Dictates the styling mode for the inline buttons, affecting color and background. */
  mode?: InlineButtonsContextProps["mode"];
  /**
   * Children should be `InlineButtons.Item` components. Each child will inherit the `mode`
   * from this parent, ensuring consistent styling across all items.
   */
  children: ReactElement<InlineButtonsItemProps>[];
}

type InlineButtonsWithComponents = ForwardRefExoticComponent<
  InlineButtonsProps & RefAttributes<HTMLDivElement>
> & {
  Item: typeof InlineButtonsItem;
};

/**
 * `InlineButtons` acts as a container for `InlineButtons.Item` components. This component
 * provides a unified context for styling and interaction, leveraging the `mode` to apply
 * consistent styling across all child components. It ensures visual consistency across different
 * platforms and supports custom styling modes.
 */
export const InlineButtons = forwardRef(
  ({ mode, className, children, ...restProps }: InlineButtonsProps, ref) => {
    const platform = usePlatform();
    const contextValue = useObjectMemo({ mode });

    return (
      <div
        ref={ref}
        className={classNames(
          styles.wrapper,
          platform === "ios" && styles["wrapper--ios"],
          className,
        )}
        {...restProps}
      >
        <InlineButtonsContext.Provider value={contextValue}>
          {children}
        </InlineButtonsContext.Provider>
      </div>
    );
  },
) as InlineButtonsWithComponents;

InlineButtons.Item = InlineButtonsItem;
