"use client";

import { usePlatform } from "@/hooks";

import { Caption } from "@/components/typography/caption";
import { Subheadline } from "@/components/typography/subheadline";
import { Text } from "@/components/typography/text";
import type { TypographyProps } from "@/components/typography/typography";

export const useTypographyCellComponents = () => {
  const platform = usePlatform();
  const isIOS = platform === "ios";

  const Title = (props: TypographyProps) => {
    if (isIOS) {
      return <Text {...props} />;
    }

    return <Subheadline level="1" {...props} />;
  };

  const Description = (props: TypographyProps) => {
    if (isIOS) {
      return <Caption {...props} />;
    }

    return <Subheadline level="2" {...props} />;
  };

  return {
    Title,
    Description,
  };
};
