"use client";

import React from "react";
import type { ITelegramUser, IWebApp } from "../types";

export interface ITelegramContext {
  webApp?: IWebApp;
  user?: ITelegramUser;
}

export const TelegramContext = React.createContext<ITelegramContext>({});

export const TelegramProvider = ({
  children,
}: { children: React.ReactNode }) => {
  const [webApp, setWebApp] = React.useState<IWebApp | null>(null);

  React.useEffect(() => {
    const app = (window as any).Telegram?.WebApp;
    if (app) {
      app.ready();
      setWebApp(app);
    }
  }, []);

  const value = React.useMemo(() => {
    return webApp
      ? {
          webApp,
          unsafeData: webApp.initDataUnsafe,
          user: webApp.initDataUnsafe.user,
        }
      : {};
  }, [webApp]);

  if (!webApp) {
    return null;
  }

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  );
};
