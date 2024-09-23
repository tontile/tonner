import type { ImageProps } from "@/components/blocks/image";
import { Caption } from "@/components/typography/caption";
import { Headline } from "@/components/typography/headline";
import { LargeTitle } from "@/components/typography/large-title";
import { Title } from "@/components/typography/title";
import type { TypographyProps } from "@/components/typography/typography";

export interface AvatarAcronymProps extends TypographyProps {
  size: ImageProps["size"];
}

export const AvatarAcronym = ({ size, ...restProps }: AvatarAcronymProps) => {
  if (!size) {
    return null;
  }

  if (size <= 28) {
    return (
      <Caption level={size <= 24 ? "2" : "1"} weight="1" caps {...restProps} />
    );
  }

  if (size === 40) {
    return <Headline weight="2" caps {...restProps} />;
  }

  if (size === 48) {
    return <Title weight="1" level="3" caps {...restProps} />;
  }

  return <LargeTitle weight="1" caps {...restProps} />;
};
