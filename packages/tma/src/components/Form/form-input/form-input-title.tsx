"use client";

import { usePlatform } from "@/hooks";

import { Caption } from "@/components/typography/caption";
import { Subheadline } from "@/components/typography/subheadline";
import type { TypographyProps } from "@/components/typography/typography";

export const FormInputTitle = ({ ...restProps }: TypographyProps) => {
  const platform = usePlatform();

  if (platform === "ios") {
    return <Caption caps {...restProps} />;
  }

  return <Subheadline level="2" weight="2" {...restProps} />;
};
