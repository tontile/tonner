import type { Meta, StoryObj } from "@storybook/react";

import { Section } from "@/components/blocks/section";
import { Subheadline } from "@/components/typography/subheadline";
import { Accordion } from "./accordion";
import {
  AccordionContent,
  type AccordionContentProps,
} from "./accordion-content";

const meta = {
  title: "Blocks/Accordion.Content",
  component: AccordionContent,
} satisfies Meta<typeof AccordionContent>;

export default meta;

export const Playground: StoryObj<AccordionContentProps> = {
  args: {
    children: "Accordion content",
  },
  render: (args) => (
    <Accordion.Content {...args}>
      <Subheadline style={{ padding: "12px 24px 24px" }} level="2">
        This is Accordion.Content component, it is just body of Accordion.
      </Subheadline>
    </Accordion.Content>
  ),
  decorators: [
    (Story) => (
      <Section
        style={{
          background: "var(--tgui--secondary_bg_color)",
          padding: 20,
          width: 358,
        }}
      >
        <Accordion expanded onChange={console.log}>
          <Accordion.Summary>Accordion summary</Accordion.Summary>
          <Story />
        </Accordion>
      </Section>
    ),
  ],
};
