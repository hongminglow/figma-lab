import { cn } from "../utils/utils";
import ElectricBorder from "./ElectricBorder";
import { motion } from "motion/react";

export const AnimatedVersusBar = () => {
  const evenProgress = 60;
  const oddProgress = 30;

  return (
    <div className="w-5xl mx-auto flex items-stretch justify-between my-10">
      <ElectricBorder
        className="flex-1 rounded-tl-[45px] rounded-bl-[45px] text-start [background:var(--linear-blue-white)]"
        borderRadius={{ tl: 45, tr: 0, br: 0, bl: 45 }}
        variant="blue"
      >
        <div className="relative w-full h-full flex items-center justify-start">
          <div
            className="absolute right-0 inset-y-0 rounded-tl-[45px] rounded-bl-[45px] items-end flex [background:var(--linear-blue-dark-blue)]"
            style={{
              width: `${evenProgress}%`,
            }}
          >
            <motion.div
              initial={{
                width: 0,
              }}
              animate={{
                width: "100%",
              }}
              transition={{
                duration: 1,
                ease: "easeOut",
                repeat: Infinity,
                repeatDelay: 0.3,
              }}
              className={cn(
                "absolute right-0 inset-y-0 rounded-tl-[45px] rounded-bl-[45px] items-end flex [background:var(--linear-blue-dark-blue)]"
              )}
              style={{
                transformOrigin: "left",
                width: "100%",
              }}
            />
          </div>

          <span className="pl-5 font-bold text-[60px]/18 text-white">0</span>
        </div>
      </ElectricBorder>

      <ElectricBorder
        className="flex-1 rounded-tr-[45px] rounded-br-[45px] text-start [background:var(--linear-red-white)]"
        borderRadius={{ tl: 0, tr: 45, br: 45, bl: 0 }}
        variant="red"
      >
        <div className="relative w-full h-full flex items-center justify-end">
          <div
            className="absolute left-0 inset-y-0 rounded-tr-[45px] rounded-br-[45px] flex [background:var(--linear-red-dark-red)]"
            style={{
              width: `${oddProgress}%`,
            }}
          >
            <motion.div
              initial={{
                width: 0,
              }}
              animate={{
                width: "100%",
              }}
              transition={{
                duration: 1,
                ease: "easeOut",
                repeat: Infinity,
                repeatDelay: 0.3,
              }}
              className={cn(
                "absolute left-0 inset-y-0 rounded-tr-[45px] rounded-br-[45px] flex [background:var(--linear-red-dark-red)]"
              )}
              style={{
                transformOrigin: "left",
                width: "100%",
              }}
            />
          </div>

          <span className="pr-5 font-bold text-[60px]/18 text-white">0</span>
        </div>
      </ElectricBorder>
    </div>
  );
};
