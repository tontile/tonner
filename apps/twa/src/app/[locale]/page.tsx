import GetStarted from "@/components/twa/get-started";
import Image from "next/image";

export const metadata = {
  title: "Get Started",
};

export default async function Page() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center size-96">
        {/* TODO: Authorize user  */}
        <Image
          src="/logo-dark.png"
          className="pb-6"
          alt="logo"
          width={72}
          height={72}
        />
        <section className="bg-dot-black pt-14 text-center">
          <h1 className="font-display mt-4 text-4xl font-bold">
            Create your telegram app in seconds
          </h1>
          <div className="mt-10 flex justify-center">
            <GetStarted />
          </div>
          <span className="text-sm">
            <p>
              This mini-app is a part of <a href="https://tonner.io">Tonner</a>{" "}
              Project
            </p>
          </span>
        </section>
      </div>
    </div>
  );
}
