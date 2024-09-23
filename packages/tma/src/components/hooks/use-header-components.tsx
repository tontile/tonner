"use client";

import { usePlatform } from "@/hooks";

import { Caption } from "@/components/typography/caption";
import { Subheadline } from "@/components/typography/subheadline";
import { Text } from "@/components/typography/text";
import type { TypographyProps } from "@/components/typography/typography";

export const useHeaderComponents = () => {
  const platform = usePlatform();

  const Default = ({ ...restProps }: TypographyProps) => {
    if (platform === "ios") {
      return <Caption caps {...restProps} />;
    }

    return <Subheadline level="2" weight="2" {...restProps} />;
  };

  const Large = ({ ...restProps }: TypographyProps) => {
    if (platform === "ios") {
      return <Subheadline level="1" weight="2" {...restProps} />;
    }

    return <Text weight="2" {...restProps} />;
  };

  return {
    Default,
    Large,
  };
};
