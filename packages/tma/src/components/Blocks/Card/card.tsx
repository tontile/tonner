import {
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type RefAttributes,
  forwardRef,
} from "react";
import styles from "./card.module.css";

import { classNames } from "@/helpers";
import { useObjectMemo } from "@/hooks";

import { CardCell } from "./card-cell";
import { CardChip } from "./card-chip";
import { CardContext, type CardContextInterface } from "./card-context";

export interface CardProps extends HTMLAttributes<HTMLElement> {
  /** Defines the visual style of the card, influencing background, shadow, and border. */
  type?: CardContextInterface["type"];
}

type CardWithComponents = ForwardRefExoticComponent<
  CardProps & RefAttributes<HTMLDivElement>
> & {
  Cell: typeof CardCell;
  Chip: typeof CardChip;
};

/**
 * Serves as a container for card-styled UI elements, providing context for its child components.
 * It supports different visual styles and can encapsulate various content types.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ type = "plain", className, children, ...restProps }, ref) => {
    const contextValue = useObjectMemo({
      type,
    });

    return (
      <CardContext.Provider value={contextValue}>
        <article
          ref={ref}
          className={classNames(
            styles.wrapper,
            type === "ambient" && styles["wrapper--ambient"],
            className,
          )}
          {...restProps}
        >
          {children}
        </article>
      </CardContext.Provider>
    );
  },
) as CardWithComponents;

Card.Cell = CardCell;
Card.Chip = CardChip;
