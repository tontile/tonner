import type { Meta, StoryObj } from "@storybook/react";

import { List } from "@/components/blocks/list";
import { ColorInput } from "./color-input";

const meta = {
  title: "Form/ColorInput",
  component: ColorInput,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ColorInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <List style={{ background: "var(--tgui--secondary_bg_color)", width: 500 }}>
      <ColorInput header="Color" placeholder="Select color" />
    </List>
  ),
} satisfies Story;
