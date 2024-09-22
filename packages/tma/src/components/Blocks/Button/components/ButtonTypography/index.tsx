import type { TypographyProps } from "@/components/typography";
import { Subheadline } from "@/components/typography/Subheadline";
import { Text } from "@/components/typography/Text";

export interface ButtonTypographyProps extends Omit<TypographyProps, "size"> {
  size: "s" | "m" | "l";
}

export const ButtonTypography = ({
  size,
  ...restProps
}: ButtonTypographyProps) => {
  if (size === "l") {
    return <Text weight="2" {...restProps} />;
  }

  return <Subheadline level="2" weight="2" {...restProps} />;
};
