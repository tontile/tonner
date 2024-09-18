"use client";

import { useTelegram } from "@/modules/telegram/hooks";
import { Button } from "@tonner/ui/button";
import { Loader2Icon, SendIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function GetStarted() {
  const router = useRouter();
  const { webApp } = useTelegram();
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <Button
      size="lg"
      disabled={isLoading}
      onClick={async () => {
        if (webApp?.initData) {
          setIsLoading(true);
          //   await telegramSignin({initData: webApp?.initData, redirect: false }, supabase);
          setIsLoading(false);
          console.log(webApp?.initData);
        } else {
          console.log(false);
        }
      }}
    >
      {isLoading ? (
        <Loader2Icon size={20} className="mr-2 animate-spin" />
      ) : (
        <SendIcon size={20} className="mr-2" />
      )}
      <span>Get Started for Free!</span>
    </Button>
  );
}
