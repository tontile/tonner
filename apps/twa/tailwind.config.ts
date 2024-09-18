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
    extend: {
      colors: {
        // add telegram variables
        background: {
          DEFAULT: "hsl(var(--background))",
          secondary: "hsl(var(--background-secondary))",
        },
        foreground: "hsl(var(--foreground))",
        button: {
          DEFAULT: "hsl(var(--button))",
          foreground: "hsl(var(--button-foreground))",
        },
        accent: "hsl(var(--accent))",
        destructive: "hsl(var(--destructive))",
        hint: "hsl(var(--hint))",
        link: "hsl(var(--link))",
        header: "hsl(var(--header))",
        section: {
          DEFAULT: "hsl(var(--section))",
          header: { foreground: "hsl(var(--section-header))" },
        },
        subtitle: "hsl(var(--subtitle))",
      },
    },
  },
} satisfies Config;
