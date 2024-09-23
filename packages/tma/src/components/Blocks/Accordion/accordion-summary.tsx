import { useContext } from "react";
import styles from "./accordion-summary.module.css";

import { classNames } from "@/helpers";
import { callMultiple } from "@/helpers";

import { Icon24ChevronDown } from "@/icons/24/chevron_down";

import { Cell, type CellProps } from "@/components/blocks/cell";
import { AccordionContext } from "./accordion-context";

export interface AccordionSummaryProps extends CellProps {}

/**
 * `AccordionSummary` serves as the clickable header for an accordion section, toggling the visibility of the content.
 * It incorporates an expand/collapse icon to visually indicate state. This component further extends `Cell` to provide
 * a consistent UI and accessibility features.
 */
export const AccordionSummary = ({
  after,
  onClick,
  children,
  ...restProps
}: AccordionSummaryProps) => {
  const { expanded, labelId, contentId, onChange } =
    useContext(AccordionContext);
  const toggle = () => onChange(!expanded);

  return (
    <Cell
      id={labelId}
      aria-expanded={expanded}
      aria-controls={contentId}
      onClick={callMultiple(toggle, onClick)}
      after={
        after || (
          <Icon24ChevronDown
            className={classNames(
              styles.chevron,
              expanded && styles["chevron--expanded"],
            )}
          />
        )
      }
      {...restProps}
    >
      {children}
    </Cell>
  );
};
