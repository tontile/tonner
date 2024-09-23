import { canUseDOM, getTelegramData } from "@/helpers";

import type { AppRootContextInterface } from "../service/app-root-context";

export const getBrowserAppearanceSubscriber = (
  setAppearance: (
    appearance: NonNullable<AppRootContextInterface["appearance"]>,
  ) => void,
): (() => void) => {
  if (!canUseDOM || !window.matchMedia) {
    return () => {};
  }

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const listener = () => {
    setAppearance(mediaQuery.matches ? "dark" : "light");
  };

  mediaQuery.addEventListener("change", listener);
  return () => mediaQuery.removeEventListener("change", listener);
};

export const getInitialPlatform = () => {
  const telegramData = getTelegramData();
  if (!telegramData) {
    return "base";
  }

  if (["ios", "macos"].includes(telegramData.platform)) {
    return "ios";
  }

  return "base";
};

export const getInitialAppearance = () => {
  if (
    canUseDOM &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
};
