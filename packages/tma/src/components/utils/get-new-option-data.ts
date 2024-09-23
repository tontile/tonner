import type {
  MultiselectOption,
  MultiselectOptionLabel,
  MultiselectOptionValue,
} from "@/components/form/Multiselect/types";

export const getNewOptionData = (
  value: MultiselectOptionValue,
  label: MultiselectOptionLabel,
): MultiselectOption => ({
  value,
  label,
});
