"use client";

import { useCallback, useContext, useEffect, useState } from "react";

import { getTelegramData } from "@/helpers/telegram";

import {
  AppRootContext,
  type AppRootContextInterface,
} from "./app-root-context";
import {
  getBrowserAppearanceSubscriber,
  getInitialAppearance,
} from "./app-root.helpers";

export const useAppearance = (
  appearanceProp?: AppRootContextInterface["appearance"],
): NonNullable<AppRootContextInterface["appearance"]> => {
  const { appearance: contextAppearance } = useContext(AppRootContext);
  const [appearance, setAppearance] = useState(
    appearanceProp || contextAppearance || getInitialAppearance(),
  );

  const handleThemeChange = useCallback(() => {
    const telegramData = getTelegramData();
    if (!telegramData) {
      return;
    }

    setAppearance(telegramData.colorScheme);
  }, []);

  useEffect(() => {
    if (appearanceProp !== undefined) {
      setAppearance(appearanceProp);
      return () => {};
    }

    const telegramData = getTelegramData();
    if (telegramData) {
      telegramData.onEvent("themeChanged", handleThemeChange);
      return () => telegramData.offEvent("themeChanged", handleThemeChange);
    }

    return getBrowserAppearanceSubscriber(setAppearance);
  }, [appearanceProp]);

  return appearance;
};
