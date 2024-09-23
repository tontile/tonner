import type { PaginationType } from "@/components/enums";
import type { Placement } from "@floating-ui/react-dom";
import type { ChangeEvent, ReactElement, SyntheticEvent } from "react";

export type AutoPlacementType = "auto" | "auto-start" | "auto-end";

export type PlacementWithAuto = AutoPlacementType | Placement;

export interface CustomTouchEvent extends MouseEvent, TouchEvent {}

export interface Gesture {
  startX: number;
  startY: number;
  startT: Date;
  duration: number;
  isPressed: boolean;
  isY: boolean;
  isX: boolean;
  isSlideX: boolean;
  isSlideY: boolean;
  isSlide: boolean;
  clientX: number;
  clientY: number;
  shiftX: number;
  shiftY: number;
  shiftXAbs: number;
  shiftYAbs: number;
}

export interface Wave {
  x: number;
  y: number;
  date: number;
  pointerId: number;
}

export interface UsePaginationProps {
  /** Number of always visible pages at the beginning and end. */
  boundaryCount?: number;
  /** The total number of pages. */
  count?: number;
  /** The page selected by default when the component is uncontrolled */
  defaultPage?: number;
  /** If `true`, hide the next-page button. */
  hideNextButton?: boolean;
  /** If `true`, hide the previous-page button. */
  hidePrevButton?: boolean;
  /** Callback fired when the page is changed. */
  onChange?: (event: ChangeEvent<unknown>, page: number) => void;
  /** The current page. */
  page?: number;
  /** Number of always visible pages before and after the current page. */
  siblingCount?: number;
}

export interface UsePaginationItem {
  onClick: (event: SyntheticEvent<Element, Event>) => void;
  type: PaginationType;
  page: number | null;
  selected: boolean;
  disabled: boolean;
  "aria-current"?: "true" | "false";
}

export type InternalValueState = [number, number | null];

export type InternalDraggingType = "start" | "end";

export interface InternalGestureRef {
  dragging: InternalDraggingType | null;
  startX: number;
  containerWidth: number;
}

export type Step = {
  isPassed: boolean;
  XCoordinate: number;
};

export type MultiselectOptionValue = string | number;
export type MultiselectOptionLabel = ReactElement | string | number;

export type MultiselectOption = {
  value: MultiselectOptionValue;
  label: MultiselectOptionLabel;
  // biome-ignore lint/suspicious/noExplicitAny: w
  [index: string]: any;
};
