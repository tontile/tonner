import type { Meta, StoryObj } from "@storybook/react";

import {
  SegmentedControlItem,
  type SegmentedControlItemProps,
} from "./segmented-control-item";

const meta = {
  title: "Navigation/SegmentedControl.Item",
  component: SegmentedControlItem,
} satisfies Meta<typeof SegmentedControlItem>;

export default meta;

export const Playground: StoryObj<SegmentedControlItemProps> = {
  args: {
    selected: true,
    children: "This is a SegmentedControl.Item",
  },
};
