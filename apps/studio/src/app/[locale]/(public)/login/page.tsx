import { GithubSignin } from "@/components/github-signin";
import Image from "next/image";

export const metadata = {
  title: "Login",
};

export default function Page() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center size-96">
        <Image
          src="/logo-dark.png"
          className="pb-6"
          alt="logo"
          width={280}
          height={280}
        />
        <GithubSignin />
      </div>
    </div>
  );
}
