import type { ButtonHTMLAttributes } from "react";
import styles from "./pin-input-button.module.css";

import { classNames } from "@/helpers";
import { usePlatform } from "@/hooks";

import { Tappable } from "@/components/service/tappable";
import { LargeTitle } from "@/components/typography/large-title";
import { Title } from "@/components/typography/title";
import type { TypographyProps } from "@/components/typography/typography";

export interface PinInputButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const PinInputButtonTypography = (props: TypographyProps) => {
  const platform = usePlatform();

  if (platform === "ios") {
    return <LargeTitle {...props} />;
  }

  return <Title {...props} />;
};

export const PinInputButton = ({
  children,
  ...restProps
}: PinInputButtonProps) => {
  const platform = usePlatform();

  return (
    <Tappable
      Component="button"
      className={classNames(
        styles.wrapper,
        platform === "ios" && styles["wrapper--ios"],
      )}
      {...restProps}
    >
      <PinInputButtonTypography>{children}</PinInputButtonTypography>
    </Tappable>
  );
};
