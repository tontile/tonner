import type { Metadata, Viewport } from "next";

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

export default function TWALayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  params: { domain: string };
}>) {
  return (
    <div>
      <div>{children}</div>
    </div>
  );
}
