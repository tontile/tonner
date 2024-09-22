"use client";

import { usePlatform } from "@/hooks/usePlatform";

import type { TypographyProps } from "@/components/typography";
import { Caption } from "@/components/typography/Caption";
import { Subheadline } from "@/components/typography/Subheadline";

export const FormInputTitle = ({ ...restProps }: TypographyProps) => {
  const platform = usePlatform();

  if (platform === "ios") {
    return <Caption caps {...restProps} />;
  }

  return <Subheadline level="2" weight="2" {...restProps} />;
};
