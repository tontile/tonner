import type { ImageProps } from "@/components/blocks/Image";
import type { TypographyProps } from "@/components/typography";
import { Caption } from "@/components/typography/Caption";
import { Headline } from "@/components/typography/Headline";
import { LargeTitle } from "@/components/typography/LargeTitle";
import { Title } from "@/components/typography/Title";

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
