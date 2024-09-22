import { hideControls } from "@/storybook/controls";
import type { Meta, StoryObj } from "@storybook/react";

import { Placeholder } from "@/components/blocks/Placeholder";
import { ModalHeader, type ModalHeaderProps } from ".";

const meta = {
  title: "Overlays/Modal.Header",
  component: ModalHeader,
  argTypes: hideControls("children", "before", "after"),
} satisfies Meta<typeof ModalHeader>;

export default meta;

export const Playground: StoryObj<ModalHeaderProps> = {
  args: {
    children: "Only iOS header",
  },
  render: (args) => (
    <Placeholder description="This is a modal header. If you want to see the text title, change the platform to iOS">
      <ModalHeader {...args} />
    </Placeholder>
  ),
};
