import { useEffect, useState } from "react";

import { hideControls } from "@/storybook/controls";
import type { Meta, StoryObj } from "@storybook/react";

import { Blockquote } from "@/components/blocks/blockquote";
import { Section } from "@/components/blocks/section";
import { Accordion, type AccordionProps } from "./accordion";

const meta = {
  title: "Blocks/Accordion",
  component: Accordion,
  argTypes: hideControls("children"),
} satisfies Meta<typeof Accordion>;

export default meta;

export const Playground: StoryObj<AccordionProps> = {
  render: (args) => {
    const [expanded, setExpanded] = useState(args.expanded);

    useEffect(() => {
      setExpanded(args.expanded);
    }, [args.expanded]);

    return (
      <Accordion
        {...args}
        onChange={() => setExpanded(!expanded)}
        expanded={expanded}
      >
        <Accordion.Summary>History of accordion</Accordion.Summary>
        <Accordion.Content>
          <div style={{ padding: "10px 20px 20px" }}>
            <Blockquote>
              The accordion&apos;s basic form is believed to have been invented
              in Berlin, in 1822, by Christian Friedrich Ludwig Buschmann,
              although one instrument was discovered in 2006 that appears to
              have been built earlier. The earliest history of the accordion in
              Russia is poorly documented.
            </Blockquote>
          </div>
        </Accordion.Content>
      </Accordion>
    );
  },
  decorators: [
    (Story) => (
      <Section
        style={{
          background: "var(--tgui--secondary_bg_color)",
          padding: 20,
          width: 358,
        }}
      >
        <Story />
      </Section>
    ),
  ],
};
