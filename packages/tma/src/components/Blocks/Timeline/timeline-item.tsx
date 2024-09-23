import type { HTMLAttributes, ReactNode } from "react";
import styles from "./timeline-item.module.css";

import { classNames } from "@/helpers";
import { usePlatform } from "@/hooks";

import { Subheadline } from "@/components/typography/subheadline";
import { Text } from "@/components/typography/text";

export interface TimelineItemProps extends HTMLAttributes<HTMLLIElement> {
  /** Internal prop, but you can change it. Marks line and dot of the item */
  mode?: "active" | "pre-active";
  /** If true, the item will be horizontal, passed from parent */
  horizontal?: boolean;
  /** Header of the item */
  header?: string;
  /** Description of the item */
  children?: ReactNode;
}

const modeStyles = {
  active: styles["wrapper--active"],
  "pre-active": styles["wrapper--preActive"],
};

export const TimelineItem = ({
  header,
  horizontal,
  mode,
  className,
  children,
  ...restProps
}: TimelineItemProps) => {
  const platform = usePlatform();

  return (
    <li
      className={classNames(
        styles.wrapper,
        mode && modeStyles[mode],
        platform === "ios" && styles["wrapper--ios"],
        horizontal && styles["wrapper--horizontal"],
        className,
      )}
      {...restProps}
    >
      <div className={styles.side}>
        <div className={styles.line} />
        <div className={styles.dot} />
      </div>
      <div className={styles.fields}>
        <Text className={styles.title} weight="2">
          {header}
        </Text>
        <Subheadline
          level={platform === "ios" ? "1" : "2"}
          className={styles.description}
        >
          {children}
        </Subheadline>
      </div>
    </li>
  );
};
