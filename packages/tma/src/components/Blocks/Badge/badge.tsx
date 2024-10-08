import type { HTMLAttributes } from "react";
import styles from "./badge.module.css";

import { classNames } from "@/helpers";
import { hasReactNode } from "@/helpers/react";

import { Caption } from "@/components/typography/caption";
import { Subheadline } from "@/components/typography/subheadline";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** The visual style of the badge: 'number' displays the content, 'dot' shows a simple dot. */
  type: "number" | "dot";
  /** The color scheme of the badge, affecting its background and text color. */
  mode?: "primary" | "critical" | "secondary" | "gray" | "white";
  /** Increases the size of the badge. Applicable only when `type` is 'number'. */
  large?: boolean;
}

const typeStyles = {
  number: styles["wrapper--number"],
  dot: styles["wrapper--dot"],
};

const modeStyles = {
  primary: styles["wrapper--primary"],
  critical: styles["wrapper--critical"],
  secondary: styles["wrapper--secondary"],
  gray: styles["wrapper--gray"],
  white: styles["wrapper--white"],
};

/**
 * The `Badge` component renders a small numeric or dot indicator, typically used for notifications, statuses, or counts.
 * It supports several visual modes for different contexts (e.g., critical, primary) and can be sized normally or enlarged.
 */
export const Badge = ({
  type,
  mode = "primary",
  large,
  className,
  children,
  ...restProps
}: BadgeProps) => {
  const isNumber = type === "number";
  return (
    <span
      className={classNames(
        styles.wrapper,
        typeStyles[type],
        modeStyles[mode],
        isNumber && large && styles["wrapper--large"],
        className,
      )}
      {...restProps}
    >
      {hasReactNode(children) && isNumber && (
        <>
          {large && (
            <Subheadline Component="span" level="2" weight="2">
              {children}
            </Subheadline>
          )}
          {!large && <Caption weight="2">{children}</Caption>}
        </>
      )}
    </span>
  );
};
