import { usePlatform } from "@/hooks/usePlatform";

import type { TypographyProps } from "@/components/typography";
import { Caption } from "@/components/typography/Caption";
import { Subheadline } from "@/components/typography/Subheadline";

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
