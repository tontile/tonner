"use client";

import { useContext } from "react";

import { AppRootContext } from "@/components/service/AppRoot/AppRootContext";

export const useAppRootContext = () => {
  const appRootContext = useContext(AppRootContext);

  if (!appRootContext.isRendered) {
    throw new Error("[TNNR] Wrap your app with <AppRoot> component");
  }

  return appRootContext;
};
