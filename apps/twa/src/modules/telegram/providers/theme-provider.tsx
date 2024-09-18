import { useTelegram } from "@/modules/telegram/hooks";
import { useTheme } from "next-themes";
import React from "react";

export const TelegramThemeProvider = ({
  children,
}: { children: React.ReactNode }) => {
  const { setTheme } = useTheme();
  const { webApp } = useTelegram();

  React.useEffect(() => {
    function themeChanged() {
      setTheme(webApp?.colorScheme || "system");
      // console.log(webApp?.themeParams);
    }
    if (webApp) {
      // @ts-ignore
      webApp.onEvent("themeChanged", themeChanged);
    }

    return () => {
      if (webApp) {
        //TODO fix this
        // @ts-ignore
        webApp.offEvent("themeChanged", themeChanged);
      }
    };
  });

  return children;
};
