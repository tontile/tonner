import type { HTMLAttributes, ReactElement } from "react";
import styles from "./avatar-stack.module.css";

import { classNames } from "@/helpers";

import type { AvatarProps } from "@/components/blocks/avatar";

export interface AvatarStackProps extends HTMLAttributes<HTMLDivElement> {
  /** An array of `Avatar` components to be rendered within the stack. */
  children: ReactElement<AvatarProps>[];
}

/**
 * Renders a container for displaying avatars in a stacked layout. This component
 * allows for the creation of visually grouped avatar representations, often used
 * to indicate multiple users or participants.
 */
export const AvatarStack = ({ children, ...restProps }: AvatarStackProps) => {
  return (
    <div {...restProps} className={classNames(styles.wrapper)}>
      {children}
    </div>
  );
};
