import { dirname, join } from "node:path";
import type { StorybookConfig } from "@storybook/nextjs";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): string {
  return dirname(require.resolve(join(value, "package.json")));
}
const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  framework: {
    name: getAbsolutePath("@storybook/nextjs"),
    options: {
      fastRefresh: true,
    },
  },
  addons: [
    "@storybook/addon-links",
    {
      name: "@storybook/addon-essentials",
      options: {
        actions: false,
      },
    },
  ],
  docs: {
    autodocs: true,
    defaultName: "Documentation",
  },
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) => {
        if (prop.parent) {
          return prop.parent.fileName.includes("src/components");
        }

        if (!prop.declarations || prop.declarations.length === 0) {
          return false;
        }

        return prop.declarations[0].fileName.includes("src/components");
      },
    },
  },
  staticDirs: ["./media"],
};
export default config;
