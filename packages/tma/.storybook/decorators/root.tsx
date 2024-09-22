import type { Decorator } from "@storybook/react";
import React from "react";
import { AppRoot } from "../../src/components/service";

export const AppRootDecorator: Decorator = (Story, context) => (
  <AppRoot
    platform={context.globals.platform}
    appearance={context.globals.theme}
  >
    <Story />
  </AppRoot>
);
