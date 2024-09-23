import { useContext } from "react";

import {
  AppRootContext,
  type AppRootContextInterface,
} from "./app-root-context";
import { getInitialPlatform } from "./app-root.helpers";

export const usePlatform = (
  platform?: AppRootContextInterface["platform"],
): NonNullable<AppRootContextInterface["platform"]> => {
  if (platform !== undefined) {
    return platform;
  }

  const appContext = useContext(AppRootContext);
  if (appContext.isRendered && appContext.platform !== undefined) {
    return appContext.platform;
  }

  return getInitialPlatform();
};
