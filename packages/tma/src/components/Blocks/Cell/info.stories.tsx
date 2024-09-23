import { hideControls } from "@/storybook/controls";
import type { Meta, StoryObj } from "@storybook/react";

import { Avatar } from "../avatar";
import { AvatarStack } from "../avatar-stack";
import { Info } from "./info";

const meta = {
  title: "Blocks/Cell/Info",
  component: Info,
  parameters: {
    layout: "centered",
  },
  argTypes: hideControls("avatarStack"),
} satisfies Meta<typeof Info>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    type: "text",
    children: "Action",
    subtitle: "Subtitle",
  },
} satisfies Story;

export const _AvatarStack: Story = {
  args: {
    type: "avatarStack",
    avatarStack: (
      <Info
        type="avatarStack"
        avatarStack={
          <AvatarStack>
            <Avatar size={28} />
            <Avatar size={28} />
            <Avatar size={28} />
          </AvatarStack>
        }
      >
        Action
      </Info>
    ),
  },
} satisfies Story;
