import styles from "./image-badge.module.css";

import { classNames } from "@/helpers";

import { Badge, type BadgeProps } from "@/components/blocks/badge";

export interface ImageBadgeProps extends BadgeProps {}

export const ImageBadge = ({
  type,
  className,
  ...restProps
}: ImageBadgeProps) => {
  if (type !== "number") {
    console.error('[ImageBadge]: Component supports only type="number"');
    return null;
  }

  return (
    <Badge
      type="number"
      className={classNames(styles.wrapper, className)}
      {...restProps}
    />
  );
};
