"use client";

import {
  SDKProvider,
  bindMiniAppCSSVars,
  bindThemeParamsCSSVars,
  bindViewportCSSVars,
  useLaunchParams,
  useMiniApp,
  useThemeParams,
  useViewport,
} from "@telegram-apps/sdk-react";
import { AppRoot } from "@telegram-apps/telegram-ui";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { type PropsWithChildren, useEffect, useMemo } from "react";

import { ErrorBoundary } from "@/components/error-boundary";
import { ErrorPage } from "@/components/error-page";
import { useDidMount } from "@/hooks/use-did-mount";
import { useTelegramMock } from "@/hooks/use-telegram-mock";

import "./styles.css";
import { I18nProviderClient } from "@/locales/client";
import { Icons } from "@tonner/ui/icons";

function App(props: PropsWithChildren) {
  const lp = useLaunchParams();
  const miniApp = useMiniApp();
  const themeParams = useThemeParams();
  const viewport = useViewport();

  useEffect(() => {
    return bindMiniAppCSSVars(miniApp, themeParams);
  }, [miniApp, themeParams]);

  useEffect(() => {
    return bindThemeParamsCSSVars(themeParams);
  }, [themeParams]);

  useEffect(() => {
    return viewport && bindViewportCSSVars(viewport);
  }, [viewport]);

  return (
    <AppRoot
      appearance={miniApp.isDark ? "dark" : "light"}
      platform={["macos", "ios"].includes(lp.platform) ? "ios" : "base"}
    >
      {props.children}
    </AppRoot>
  );
}

type ProvidersProps = {
  locale: string;
};

function RootInner({ children, locale }: PropsWithChildren<ProvidersProps>) {
  // Mock Telegram environment in development mode if needed.
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useTelegramMock();
  }

  const debug = useLaunchParams().startParam === "debug";
  const manifestUrl = useMemo(() => {
    return new URL("tonconnect-manifest.json", window.location.href).toString();
  }, []);

  // Enable debug mode to see all the methods sent and events received.
  useEffect(() => {
    if (debug) {
      import("eruda").then((lib) => lib.default.init());
    }
  }, [debug]);

  return (
    <I18nProviderClient locale={locale}>
      <TonConnectUIProvider manifestUrl={manifestUrl}>
        <SDKProvider acceptCustomStyles debug={debug}>
          <App>{children}</App>
        </SDKProvider>
      </TonConnectUIProvider>
    </I18nProviderClient>
  );
}

export function Root(props: PropsWithChildren<ProvidersProps>) {
  // Unfortunately, Telegram Mini Apps does not allow us to use all features of the Server Side
  // Rendering. That's why we are showing loader on the server side.
  const didMount = useDidMount();

  return didMount ? (
    <ErrorBoundary fallback={ErrorPage}>
      <RootInner {...props} />
    </ErrorBoundary>
  ) : (
    <div className="root__loading">
      <Icons.Logo />
    </div>
  );
}
