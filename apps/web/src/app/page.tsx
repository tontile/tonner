import { AnimatedText } from "@/components/animated-text";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@tonner/ui/tooltip";

export default function Page() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute -top-[118px] inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:4.5rem_2rem] -z-10 [transform:perspective(1000px)_rotateX(-63deg)] h-[80%] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent pointer-events-none -z-10" />

      <h1 className="font-departure text-[40px] md:text-[84px] relative z-10 text-center h-[120px] md:h-auto leading-tight">
        <AnimatedText text="under heavy development" />
      </h1>

      <p className="relative z-10 text-center max-w-[80%] mt-0 md:mt-4">
        building the core capabilities.
      </p>

      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href="https://dorahacks.io/buidl/11660"
              target="_blank"
              rel="noreferrer"
              className="mt-10 mb-8"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm underline">Live on dorahacks</span>
              </div>
            </a>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={15} className="text-xs">
            Tonner – TWA Builder with TON integration
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="absolute -bottom-[280px] inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:4.5rem_2rem] -z-10 [transform:perspective(560px)_rotateX(63deg)] pointer-events-none" />
      <div className="absolute w-full bottom-[100px] h-1/2  bg-gradient-to-b from-background to-transparent pointer-events-none -z-10" />
    </div>
  );
}
