import { type MouseEvent, useState } from "react";

import { hideControls } from "@/storybook/controls";
import type { Meta, StoryObj } from "@storybook/react";

import { Placeholder } from "@/components/blocks/placeholder";
import { Touch } from "@/components/service/touch";
import { Caption } from "@/components/typography/caption";
import { Popper } from "./popper";

const meta = {
  title: "Overlays/Popper",
  component: Popper,
  argTypes: hideControls(
    "ArrowIcon",
    "targetRef",
    "arrowProps",
    "Component",
    "customMiddlewares",
  ),
} satisfies Meta<typeof Popper>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => {
    const [virtualElement, setVirtualElement] = useState(() =>
      DOMRect.fromRect({
        x: -200,
        y: -200,
        width: 10,
        height: 10,
      }),
    );

    const handleClick = (event: MouseEvent<HTMLDivElement>) => {
      setVirtualElement(({ width, height }) =>
        DOMRect.fromRect({
          x: event.clientX,
          y: event.clientY,
          width,
          height,
        }),
      );
    };

    return (
      <Touch
        style={{
          position: "relative",
          height: "40vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClickCapture={handleClick}
      >
        <Placeholder
          header="Click anywhere in this window"
          description="A low-level component for rendering a dropdown block. It's positioning itself correctly next to the target element."
        />
        <Popper
          {...args}
          arrowProps={{ style: { color: "var(--tgui--button_color)" } }}
          style={{
            padding: "10px 12px",
            background: "var(--tgui--button_color)",
            color: "var(--tgui--white)",
          }}
          targetRef={{
            getBoundingClientRect() {
              return virtualElement;
            },
          }}
        >
          <Caption level="1">Hello</Caption>
        </Popper>
      </Touch>
    );
  },
};
