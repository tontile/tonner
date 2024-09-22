import { hideControls } from "@/storybook/controls";
import type { Meta, StoryObj } from "@storybook/react";

import { PinInput } from ".";

const meta = {
  title: "Form/PinInput",
  component: PinInput,
  argTypes: hideControls("value"),
} satisfies Meta<typeof PinInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  decorators: [
    (Component) => (
      <div style={{ height: "600px" }}>
        <Component />
      </div>
    ),
  ],
} satisfies Story;
