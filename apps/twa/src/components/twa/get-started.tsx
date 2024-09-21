"use client";

import { Button } from "@tonner/ui/button";
import { Loader2Icon, SendIcon } from "lucide-react";
import React from "react";

export default function GetStarted() {
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <Button size="lg" disabled={isLoading}>
      {isLoading ? (
        <Loader2Icon size={20} className="mr-2 animate-spin" />
      ) : (
        <SendIcon size={20} className="mr-2" />
      )}
      <span>Get Started for Free!</span>
    </Button>
  );
}
