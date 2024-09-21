import baseConfig from "@tonner/ui/tailwind.config";
import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"],
  presets: [baseConfig],
  theme: {
    screens: {
      xs: "475px",
      ...baseConfig.theme.screens,
    },
  },
} satisfies Config;
