"use client";

import { type HTMLAttributes, useContext, useRef } from "react";
import styles from "./accordion-content.module.css";

import { classNames } from "@/helpers";

import { calcMaxHeight } from "@/components/utils/calc-max-height";
import { AccordionContext } from "./accordion-context";

export interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> {}

/**
 * Renders the content part of an accordion, leveraging context to control visibility and animation.
 * Utilizes `calcMaxHeight` for smooth height transitions during expand/collapse actions.
 */
export const AccordionContent = ({
  className,
  children,
  ...restProps
}: AccordionContentProps) => {
  const bodyRef = useRef(null);
  const { expanded, labelId, contentId } = useContext(AccordionContext);

  return (
    <div
      id={contentId}
      role="region"
      aria-labelledby={labelId}
      aria-hidden={!expanded}
      className={classNames(styles.wrapper, className)}
      {...restProps}
    >
      <div
        ref={bodyRef}
        className={styles.body}
        style={{
          maxHeight: calcMaxHeight(expanded, bodyRef.current),
        }}
      >
        {children}
      </div>
    </div>
  );
};
