import styles from "./large-title.module.css";
import { Typography, type TypographyProps } from "./typography";

import { classNames } from "@/helpers/class-names";

export type LargeTitleProps = TypographyProps;

/**
 * The LargeTitle component is designed for prominent display text, typically used for major headings
 * or titles within an application. It encapsulates the Typography component's features, offering
 * extensive styling and semantic customization options while defaulting to an `<h1>` HTML element.
 * This choice of default component underscores the importance and hierarchy of the text it encapsulates,
 * making it suitable for primary page titles or significant headings.
 */
export const LargeTitle = ({
  className,
  Component,
  ...restProps
}: LargeTitleProps) => (
  <Typography
    {...restProps}
    Component={Component || "h1"}
    className={classNames(styles.wrapper, className)}
  />
);
