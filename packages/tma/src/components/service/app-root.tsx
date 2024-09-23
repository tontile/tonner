"use client";

import { type HTMLAttributes, forwardRef } from "react";
import styles from "../app-root/app-root.module.css";

import { classNames } from "@/helpers/class-names";
import { multipleRef } from "@/helpers/react/refs";
import { useObjectMemo } from "@/hooks/use-object-memo";

import {
  AppRootContext,
  type AppRootContextInterface,
} from "./app-root-context";
import { useAppearance } from "./use-appearance";
import { usePlatform } from "./use-platform";
import { usePortalContainer } from "./use-portal-container";

export interface AppRootProps extends HTMLAttributes<HTMLDivElement> {
  /** Application platform, determined automatically if nothing passed */
  platform?: AppRootContextInterface["platform"];
  /** Application appearance, determined automatically if nothing passed */
  appearance?: AppRootContextInterface["appearance"];
  /** Rewriting portal container for rendering, AppRoot container as default */
  portalContainer?: AppRootContextInterface["portalContainer"];
}

export const AppRoot = forwardRef<HTMLDivElement, AppRootProps>(
  (
    {
      platform: platformProp,
      appearance: appearanceProp,
      portalContainer: portalContainerProp,
      children,
      className,
      ...restProps
    },
    ref,
  ) => {
    const appearance = useAppearance(appearanceProp);
    const portalContainer = usePortalContainer(portalContainerProp);
    const platform = usePlatform(platformProp);

    const contextValue = useObjectMemo({
      platform,
      appearance,
      portalContainer,
      isRendered: true,
    });

    return (
      <div
        ref={multipleRef(ref, portalContainer)}
        className={classNames(
          styles.wrapper,
          platform === "ios" && styles["wrapper--ios"],
          appearance === "dark" && styles["wrapper--dark"],
          className,
        )}
        {...restProps}
      >
        <AppRootContext.Provider value={contextValue}>
          {children}
        </AppRootContext.Provider>
      </div>
    );
  },
);
