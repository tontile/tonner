import { usePlatform } from "@/hooks";

import { Caption } from "@/components/typography/caption";
import { Subheadline } from "@/components/typography/subheadline";
import type { TypographyProps } from "@/components/typography/typography";

export interface BannerDescriptionTypographyProps
  extends Omit<TypographyProps, "level"> {}

export const BannerDescriptionTypography = (
  props: BannerDescriptionTypographyProps,
) => {
  const platform = usePlatform();

  if (platform === "ios") {
    return <Caption level="1" {...props} />;
  }

  return <Subheadline level="2" {...props} />;
};
