import ElectricBorder from "./ElectricBorder";
import { motion } from "motion/react";

import { CountingNumber } from "./AnimatedCount";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const FILL_DURATION_SECONDS = 0.75;

const EVEN_BORDER_RADIUS = { tl: 45, tr: 0, br: 0, bl: 45 } as const;
const ODD_BORDER_RADIUS = { tl: 0, tr: 45, br: 45, bl: 0 } as const;

const randomInt = (min: number, max: number) => {
  const low = Math.ceil(min);
  const high = Math.floor(max);
  return Math.floor(low + Math.random() * (high - low + 1));
};

type VersusSide = "even" | "odd";

const runRandomVersusUpdates = (options: {
  times?: number;
  minDelayMs?: number;
  maxDelayMs?: number;
  minAdd?: number;
  maxAdd?: number;
  onTick: (side: VersusSide, delta: number) => void;
}) => {
  const {
    times = 5,
    minDelayMs = 1200,
    maxDelayMs = 3600,
    minAdd = 50,
    maxAdd = 350,
    onTick,
  } = options;

  let remaining = times;
  let timeoutId: number | undefined;
  let lastSide: VersusSide | undefined;

  const scheduleNext = () => {
    if (remaining <= 0) return;

    const delay = randomInt(minDelayMs, maxDelayMs);
    timeoutId = window.setTimeout(() => {
      remaining -= 1;

      let side: VersusSide = Math.random() < 0.5 ? "even" : "odd";
      if (lastSide && side === lastSide && Math.random() < 0.65) {
        side = lastSide === "even" ? "odd" : "even";
      }
      lastSide = side;

      onTick(side, randomInt(minAdd, maxAdd));
      scheduleNext();
    }, delay);
  };

  scheduleNext();

  return () => {
    if (timeoutId) window.clearTimeout(timeoutId);
  };
};

export const AnimatedVersusBar = () => {
  const [evenAmount, setEvenAmount] = useState<{ from: number; value: number }>(
    { from: 0, value: 0 }
  );
  const [oddAmount, setOddAmount] = useState<{ from: number; value: number }>({
    from: 0,
    value: 0,
  });

  const evenAnimTokenRef = useRef(0);
  const oddAnimTokenRef = useRef(0);
  const [evenAnimToken, setEvenAnimToken] = useState(0);
  const [oddAnimToken, setOddAnimToken] = useState(0);

  const [evenBorderActive, setEvenBorderActive] = useState(false);
  const [oddBorderActive, setOddBorderActive] = useState(false);
  const [evenBorderRevealProgress, setEvenBorderRevealProgress] = useState(0);
  const [oddBorderRevealProgress, setOddBorderRevealProgress] = useState(0);

  const total = evenAmount.value + oddAmount.value;

  const { evenPercent, oddPercent } = useMemo(() => {
    if (total <= 0) {
      return { evenPercent: 50, oddPercent: 50 };
    }

    const even = (evenAmount.value / total) * 100;
    const clampedEven = Math.max(0, Math.min(100, even));
    return {
      evenPercent: clampedEven,
      oddPercent: 100 - clampedEven,
    };
  }, [evenAmount.value, total]);

  useEffect(() => {
    const cancel = runRandomVersusUpdates({
      times: 5,
      onTick: (side, delta) => {
        if (side === "even") {
          evenAnimTokenRef.current += 1;
          setEvenAnimToken(evenAnimTokenRef.current);
          setEvenBorderActive(false);
          setEvenBorderRevealProgress(0);
          setEvenAmount((prev) => ({
            from: prev.value,
            value: prev.value + delta,
          }));
        } else {
          oddAnimTokenRef.current += 1;
          setOddAnimToken(oddAnimTokenRef.current);
          setOddBorderActive(false);
          setOddBorderRevealProgress(0);
          setOddAmount((prev) => ({
            from: prev.value,
            value: prev.value + delta,
          }));
        }
      },
    });

    return cancel;
  }, []);

  const onEvenFillComplete = useCallback((token: number) => {
    if (token !== evenAnimTokenRef.current) return;
    setEvenBorderActive(true);
    requestAnimationFrame(() => setEvenBorderRevealProgress(1));
  }, []);

  const onOddFillComplete = useCallback((token: number) => {
    if (token !== oddAnimTokenRef.current) return;
    setOddBorderActive(true);
    requestAnimationFrame(() => setOddBorderRevealProgress(1));
  }, []);

  return (
    <div className="w-5xl mx-auto flex items-stretch my-10">
      {/* Even side */}
      <motion.div
        className="min-w-0 "
        style={{ flexGrow: 0, flexShrink: 0 }}
        animate={{ flexBasis: `${evenPercent.toFixed(4)}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <ElectricBorder
          className="w-full rounded-tl-[45px] rounded-bl-[45px] text-start [background:var(--linear-blue-white)]"
          borderRadius={EVEN_BORDER_RADIUS}
          variant="blue"
          active={evenBorderActive}
          revealProgress={evenBorderRevealProgress}
          revealFrom="right"
        >
          <div className="relative py-3.5 w-full h-full flex items-center justify-start overflow-hidden">
            {evenAnimToken === 0 ? (
              <div className="absolute right-0 inset-y-0 w-full rounded-tl-[45px] rounded-bl-[45px] [background:var(--linear-blue-dark-blue)]" />
            ) : (
              <motion.div
                key={`even-fill-${evenAnimToken}`}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{
                  duration: FILL_DURATION_SECONDS,
                  ease: "easeOut",
                }}
                onAnimationComplete={() => onEvenFillComplete(evenAnimToken)}
                className="absolute right-0 inset-y-0 rounded-tl-[45px] rounded-bl-[45px] [background:var(--linear-blue-dark-blue)]"
              />
            )}

            <motion.span
              key={`even-label-${evenAnimToken}`}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative z-10 pl-5 font-bold text-[60px]/18 text-white"
            >
              <CountingNumber
                number={evenAmount.value}
                fromNumber={evenAmount.from}
                transition={{ stiffness: 90, damping: 50 }}
              />
            </motion.span>
          </div>
        </ElectricBorder>
      </motion.div>

      {/* Odd side */}
      <motion.div
        className="min-w-0"
        style={{ flexGrow: 0, flexShrink: 0 }}
        animate={{ flexBasis: `${oddPercent.toFixed(4)}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <ElectricBorder
          className="w-full rounded-tr-[45px] rounded-br-[45px] text-start [background:var(--linear-red-white)]"
          borderRadius={ODD_BORDER_RADIUS}
          variant="red"
          active={oddBorderActive}
          revealProgress={oddBorderRevealProgress}
          revealFrom="left"
        >
          <div className="relative py-3.5 w-full h-full flex items-center justify-end overflow-hidden">
            {oddAnimToken === 0 ? (
              <div className="absolute left-0 inset-y-0 w-full rounded-tr-[45px] rounded-br-[45px] [background:var(--linear-red-dark-red)]" />
            ) : (
              <motion.div
                key={`odd-fill-${oddAnimToken}`}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{
                  duration: FILL_DURATION_SECONDS,
                  ease: "easeOut",
                }}
                onAnimationComplete={() => onOddFillComplete(oddAnimToken)}
                className="absolute left-0 inset-y-0 rounded-tr-[45px] rounded-br-[45px] [background:var(--linear-red-dark-red)]"
              />
            )}

            <motion.span
              key={`odd-label-${oddAnimToken}`}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative z-10 pr-5 font-bold text-[60px]/18 text-white"
            >
              <CountingNumber
                number={oddAmount.value}
                fromNumber={oddAmount.from}
                transition={{ stiffness: 90, damping: 50 }}
              />
            </motion.span>
          </div>
        </ElectricBorder>
      </motion.div>
    </div>
  );
};
