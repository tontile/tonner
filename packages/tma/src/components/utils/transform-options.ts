import { isServicePreset } from "@/components/constants";
import type { UseMultiselectProps } from "@/components/hooks/use-multiselect";
import type { MultiselectOption } from "@/components/types";
import { getNewOptionData } from "@/components/utils/get-new-option-data";

export const transformOptions = ({
  value,
  inputValue = "",
  emptyText,
  creatable = false,
  filterFn,
  options: optionsProp,
  selectedBehavior,
}: Required<Pick<UseMultiselectProps, "value" | "options" | "emptyText">> &
  Pick<
    UseMultiselectProps,
    | "inputValue"
    | "emptyText"
    | "creatable"
    | "filterFn"
    | "options"
    | "selectedBehavior"
  >): MultiselectOption[] => {
  const filteredOptionsProp = filterFn
    ? optionsProp.filter((option) => filterFn(inputValue, option))
    : optionsProp;

  if (filteredOptionsProp.length === 0) {
    if (inputValue !== "" && typeof creatable === "string") {
      return [
        {
          ...getNewOptionData("", ""),
          actionText: creatable,
        },
      ];
    }

    return [
      {
        ...getNewOptionData("", ""),
        placeholder: emptyText,
      },
    ];
  }

  if (selectedBehavior === "hide") {
    const selected = value.map((item) => item.value);
    return filteredOptionsProp.filter((item) => {
      return !isServicePreset(item) ? !selected.includes(item.value) : false;
    });
  }

  return filteredOptionsProp;
};
