"use client";

import { createClient } from "@tonner/supabase/client";
import { Button } from "@tonner/ui/button";

export function GithubSignin() {
  const supabase = createClient();

  const handleSignin = () => {
    supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
  };

  return (
    <Button onClick={handleSignin} variant="outline" className="font-mono">
      Sign in with Github
    </Button>
  );
}
