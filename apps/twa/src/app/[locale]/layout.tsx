import { cn } from "@tonner/ui/cn";
import { Toaster } from "@tonner/ui/toaster";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";
import "@telegram-apps/telegram-ui/dist/styles.css";
import "../_assets/globals.css";
import { Root } from "@/components/layouts/root";

export const metadata: Metadata = {
  title: "Create tonner",
  description: "Production ready Telegram mini-app",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          `${GeistSans.variable} ${GeistMono.variable}`,
          "antialiased",
        )}
        suppressHydrationWarning
      >
        <Root locale={locale}>
          <Toaster />
          {children}
        </Root>
      </body>
    </html>
  );
}
