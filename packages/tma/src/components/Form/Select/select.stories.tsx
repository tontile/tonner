import type { Meta, StoryObj } from "@storybook/react";

import { List } from "@/components/blocks/list";
import { Select, type SelectProps } from "./select";

const meta = {
  title: "Form/Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Select>;

export default meta;

export const Playground: StoryObj<SelectProps> = {
  render: () => (
    <List
      style={{
        width: 240,
        background: "var(--tgui--secondary_bg_color)",
      }}
    >
      <Select
        header="Select"
        placeholder="I am usual input, just leave me alone"
      >
        <option>Hello</option>
        <option>Okay</option>
      </Select>
    </List>
  ),
};
