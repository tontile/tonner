import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"],
  darkMode: ["class"],
  theme: {
    screens: {
      xs: "475px",
      ...defaultTheme.screens,
    },
    fontFamily: {
      display: ["var(--font-display)", "sans-serif"],
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
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
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
