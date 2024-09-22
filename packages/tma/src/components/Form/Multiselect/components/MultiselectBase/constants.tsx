import { Chip, type ChipProps } from "@/components/form/Chip";

export const renderChipDefault = (props: ChipProps) => {
  const { ...rest } = props;
  return <Chip mode="mono" {...rest} />;
};
