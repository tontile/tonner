"use client";

import { StyledJsxRegistry } from "@/components/styled-jsx-registry";
import { I18nProviderClient } from "@/locales/client";
import { TelegramProvider } from "@/modules/telegram/providers";
import { TelegramThemeProvider } from "@/modules/telegram/providers/telegram-theme-provider";
import { ThemeProvider } from "next-themes";
import type React from "react";

type ProviderProps = {
  locale: string;
  children: React.ReactNode;
};

export function Providers({ children, locale }: ProviderProps) {
  return (
    <I18nProviderClient locale={locale}>
      <TelegramProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StyledJsxRegistry>
            <TelegramThemeProvider>{children}</TelegramThemeProvider>
          </StyledJsxRegistry>
        </ThemeProvider>
      </TelegramProvider>
    </I18nProviderClient>
  );
}
