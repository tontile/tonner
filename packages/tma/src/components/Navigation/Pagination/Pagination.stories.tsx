import type { Meta, StoryObj } from "@storybook/react";

import { Pagination, type PaginationProps } from ".";

const meta = {
  title: "Navigation/Pagination",
  component: Pagination,
} satisfies Meta<typeof Pagination>;

export default meta;

export const Playground: StoryObj<PaginationProps> = {};
