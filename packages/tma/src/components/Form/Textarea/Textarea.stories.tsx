import type { Meta, StoryObj } from "@storybook/react";

import { List } from "@/components/blocks/List";
import { Textarea } from ".";

const meta = {
  title: "Form/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <List style={{ background: "var(--tgui--secondary_bg_color)", width: 240 }}>
      <Textarea header="Textarea" placeholder="I am usual textarea" />
    </List>
  ),
} satisfies Story;
