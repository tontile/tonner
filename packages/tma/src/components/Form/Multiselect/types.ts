import type { ReactElement } from "react";

export type MultiselectOptionValue = string | number;
export type MultiselectOptionLabel = ReactElement | string | number;

export type MultiselectOption = {
  value: MultiselectOptionValue;
  label: MultiselectOptionLabel;
  // biome-ignore lint/suspicious/noExplicitAny: w
  [index: string]: any;
};
