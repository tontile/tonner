import styles from "./card-chip.module.css";

import { classNames } from "@/helpers";

import { Chip, type ChipProps } from "@/components/form/chip";

export interface CardChipProps extends ChipProps {}

export const CardChip = ({ className, ...restProps }: CardChipProps) => (
  <Chip className={classNames(styles.wrapper, className)} {...restProps} />
);
