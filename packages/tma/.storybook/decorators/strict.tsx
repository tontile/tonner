import type { Decorator } from "@storybook/react";
import React from "react";
import { StrictMode } from "react";

export const StrictDecorator: Decorator = (Story) => (
  <StrictMode>
    <Story />
  </StrictMode>
);
