import { hideControls, setControlsTypes } from "@/storybook/controls";
import type { Meta, StoryObj } from "@storybook/react";

import { Cell } from ".";
import { Avatar } from "../Avatar";
import { Badge } from "../Badge";
import { Info } from "./components/Info";

const meta = {
  title: "Blocks/Cell",
  component: Cell,
  argTypes: {
    ...hideControls("before", "after", "titleBadge"),
    ...setControlsTypes(
      ["Component", "subhead", "subtitle", "children", "hint", "description"],
      "text",
    ),
  },
} satisfies Meta<typeof Cell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    subhead: "Subhead",
    children: "Title",
    subtitle: "Subtitle",
    description: "Description",
    titleBadge: <Badge type="dot" />,
    before: <Avatar size={48} />,
    after: <Badge type="number">99</Badge>,
  },
} satisfies Story;

export const CellWithInfo: Story = {
  args: {
    children: "Noah",
    subtitle: "Yesterday",
    before: <Avatar size={48} />,
    after: (
      <Info type="text" subtitle="Received">
        +1000
      </Info>
    ),
  },
};
