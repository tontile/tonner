import styles from "./CardChip.module.css";

import { classNames } from "@/helpers/classNames";

import { Chip, type ChipProps } from "@/components/form/Chip";

export interface CardChipProps extends ChipProps {}

export const CardChip = ({ className, ...restProps }: CardChipProps) => (
  <Chip className={classNames(styles.wrapper, className)} {...restProps} />
);
