import { hideControls } from "@/storybook/controls";
import type { Meta, StoryObj } from "@storybook/react";

import { Avatar, type AvatarProps } from "../avatar";
import { AvatarStack } from "./avatar-stack";

const AVATAR_URL = "https://avatars.githubusercontent.com/u/84640980?v=4";

const meta = {
  title: "Blocks/AvatarStack",
  component: AvatarStack,
  argTypes: hideControls("children"),
} satisfies Meta<typeof AvatarStack>;

export default meta;

export const Playground: StoryObj<AvatarProps> = {
  args: {
    children: (
      <>
        <Avatar size={48} src={AVATAR_URL} />
        <Avatar size={48} src={AVATAR_URL} />
        <Avatar size={48} src={AVATAR_URL} />
        <Avatar size={48} src={AVATAR_URL} />
      </>
    ),
  },
};
