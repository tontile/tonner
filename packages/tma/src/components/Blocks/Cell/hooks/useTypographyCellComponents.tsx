"use client";

import { usePlatform } from "@/hooks/usePlatform";

import type { TypographyProps } from "@/components/typography";
import { Caption } from "@/components/typography/Caption";
import { Subheadline } from "@/components/typography/Subheadline";
import { Text } from "@/components/typography/Text";

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
