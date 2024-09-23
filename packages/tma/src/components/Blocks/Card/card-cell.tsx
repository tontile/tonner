import { useContext } from "react";
import styles from "./card-cell.module.css";

import { classNames } from "@/helpers";
import { hasReactNode } from "@/helpers/react";

import { Cell, type CellProps } from "@/components/blocks/cell";
import { CardContext } from "./card-context";

interface CardCellProps extends CellProps {}

export const CardCell = ({
  children,
  subtitle,
  className,
  ...restProps
}: CardCellProps) => {
  const cardContext = useContext(CardContext);

  return (
    <Cell
      className={classNames(
        styles.wrapper,
        cardContext.type === "ambient" && styles["wrapper--ambient"],
        className,
      )}
      subtitle={
        hasReactNode(subtitle) && (
          <span className={styles.subtitle}>{subtitle}</span>
        )
      }
      {...restProps}
    >
      {hasReactNode(children) && (
        <span className={styles.header}>{children}</span>
      )}
    </Cell>
  );
};
