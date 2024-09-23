import type { MultiselectOption } from "@/components/types";

export const getValueOptionByHTMLElement = (
  options: MultiselectOption[],
  el: HTMLElement,
) => {
  const value = el.getAttribute("value");
  return options.find((v) => v.value === value);
};
