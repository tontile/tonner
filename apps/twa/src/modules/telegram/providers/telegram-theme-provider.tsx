"use client";

import { useTelegram } from "@/modules/telegram/hooks";
import { ColorTranslator } from "colortranslator";
import type React from "react";

const HexToHSL = (colorHex: string) => {
  const hslObject = new ColorTranslator(colorHex).HSLObject;
  return `${hslObject.H} ${hslObject.S}% ${hslObject.L}%`;
};

export function TelegramThemeProvider({
  children,
}: { children: React.ReactNode }) {
  const { webApp } = useTelegram();

  if (!webApp) {
    return null;
  }

  return (
    <>
      {webApp.themeParams.button_color && (
        <style jsx global>{`
          :root {
            --background: ${HexToHSL(webApp.themeParams.bg_color)};
            --foreground: ${HexToHSL(webApp.themeParams.text_color)};
            --background-secondary: ${HexToHSL(webApp.themeParams.secondary_bg_color)};

            --button: ${HexToHSL(webApp.themeParams.button_color)};
            --button-foreground: ${HexToHSL(webApp.themeParams.button_text_color)};

            --accent: ${HexToHSL(webApp.themeParams.accent_text_color)};
            --destructive: ${HexToHSL(webApp.themeParams.destructive_text_color)};
            --hint: ${HexToHSL(webApp.themeParams.hint_color)};
            --link: ${HexToHSL(webApp.themeParams.link_color)};

            --header: ${HexToHSL(webApp.themeParams.header_bg_color)};
            --section: ${HexToHSL(webApp.themeParams.section_bg_color)};
            --section-header-foreground: ${HexToHSL(
              webApp.themeParams.section_header_text_color,
            )};
            --subtitle: ${HexToHSL(webApp.themeParams.subtitle_text_color)};
          }

          .dark {
            --background: ${HexToHSL(webApp.themeParams.bg_color)};
            --foreground: ${HexToHSL(webApp.themeParams.text_color)};
            --background-secondary: ${HexToHSL(webApp.themeParams.secondary_bg_color)};

            --button: ${HexToHSL(webApp.themeParams.button_color)};
            --button-foreground: ${HexToHSL(webApp.themeParams.button_text_color)};

            --accent: ${HexToHSL(webApp.themeParams.accent_text_color)};
            --destructive: ${HexToHSL(webApp.themeParams.destructive_text_color)};
            --hint: ${HexToHSL(webApp.themeParams.hint_color)};
            --link: ${HexToHSL(webApp.themeParams.link_color)};

            --header: ${HexToHSL(webApp.themeParams.header_bg_color)};
            --section: ${HexToHSL(webApp.themeParams.section_bg_color)};
            --section-header-foreground: ${HexToHSL(
              webApp.themeParams.section_header_text_color,
            )};
            --subtitle: ${HexToHSL(webApp.themeParams.subtitle_text_color)};
          }
        `}</style>
      )}
      {children}
    </>
  );
}
