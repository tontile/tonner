import styles from "./avatar-badge.module.css";

import { classNames } from "@/helpers";

import { Badge, type BadgeProps } from "@/components/blocks/badge";

export interface AvatarBadgeProps extends BadgeProps {}

export const AvatarBadge = ({
  type,
  className,
  ...restProps
}: AvatarBadgeProps) => {
  if (type !== "number") {
    throw new Error('[ImageBadge]: Component supports only type="number"');
  }

  return (
    <Badge
      type="number"
      className={classNames(styles.wrapper, className)}
      {...restProps}
    />
  );
};
