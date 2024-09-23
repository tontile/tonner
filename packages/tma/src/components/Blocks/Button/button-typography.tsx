import { Subheadline } from "@/components/typography/subheadline";
import { Text } from "@/components/typography/text";
import type { TypographyProps } from "@/components/typography/typography";

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
