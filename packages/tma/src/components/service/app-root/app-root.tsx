"use client";

import { type HTMLAttributes, forwardRef } from "react";
import styles from "./app-root.module.css";

import { classNames } from "@/helpers";
import { multipleRef } from "@/helpers/react";
import { useObjectMemo } from "@/hooks";

import { useAppearance } from "@/components/hooks/use-appearance";
import { usePlatform } from "@/components/hooks/use-platform";
import { usePortalContainer } from "@/components/hooks/use-portal-container";
import {
  AppRootContext,
  type AppRootContextInterface,
} from "./app-root-context";

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
