import type {
  MultiselectOption,
  MultiselectOptionValue,
} from "@/components/form/Multiselect/types";

export const isValueLikeOption = <O extends MultiselectOption>(
  value: O | MultiselectOptionValue,
): value is O => typeof value === "object" && "value" in value;
