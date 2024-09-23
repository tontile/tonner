"use client";

import { AppRootContext } from "@/components/service/app-root/app-root-context";
import { useContext } from "react";

export const useAppRootContext = () => {
  const appRootContext = useContext(AppRootContext);

  if (!appRootContext.isRendered) {
    throw new Error("[TNNR] Wrap your app with <AppRoot> component");
  }

  return appRootContext;
};
