import { cn } from "../utils/utils";
import ElectricBorder from "./ElectricBorder";
import { motion } from "motion/react";

export const AnimatedVersusBar = () => {
  const evenProgress = 60;

  return (
    <div className="w-5xl mx-auto py-3.5 flex items-center justify-between bg-[#FFFFFF1A]">
      <div className="flex-1 rounded-tl-[45px] rounded-bl-[45px] text-start [background:var(--linear-blue-white)]">
        <ElectricBorder>
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
                width: `100%`,
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
                width: `${evenProgress}%`,
              }}
            />
          </div>

          <span className="font-bold text-[60px]/18 text-white">0</span>
        </ElectricBorder>
      </div>
      <div className="flex-1 rounded-tr-[45px] rounded-br-[45px] text-end [background:var(--linear-red-white)]">
        <span className="font-bold text-[60px]/18 text-white">0</span>
      </div>
    </div>
  );
};
