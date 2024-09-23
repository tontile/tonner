"use client";

import { useAppRootContext } from "./use-app-root-context";

import type { AppRootContextInterface } from "../components/service/app-root-context";

export const usePlatform = (): NonNullable<
  AppRootContextInterface["platform"]
> => {
  const context = useAppRootContext();
  return context.platform || "base";
};
