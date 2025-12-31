import { useState, useEffect } from "react";

interface CountDownTimerProps {
  initialSeconds?: number;
  onComplete?: () => void;
  label?: string;
}

export const CountDownTimer = ({
  initialSeconds = 60,
  onComplete,
  label = "PLACE YOUR BET",
}: CountDownTimerProps) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  // Calculate progress percentage (1 = full, 0 = empty)
  const progress = seconds / initialSeconds;
  // Convert to degrees for conic gradient (360 = full circle)
  const progressDegrees = progress * 360;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, seconds, onComplete]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setSeconds(initialSeconds);
  };

  // Calculate fade stops with bounds checking
  const fadeStart = Math.max(0, progressDegrees - 15);
  const fadeMiddle = Math.max(0, progressDegrees - 8);
  const fadeEnd = Math.max(0, progressDegrees - 2);

  // Conic gradient starting from 0deg (NORTH/12 o'clock)
  // Green portion: 0deg to progressDegrees (clockwise from top)
  // Transparent portion: progressDegrees to 360deg
  // This makes the transparent area grow ANTICLOCKWISE from the top
  const conicGradient = `conic-gradient(
    from 0deg at 50% 50%,
    rgba(3, 184, 71, 0.8) 0deg,
    rgba(3, 184, 71, 0.8) ${fadeStart}deg,
    #00D24F ${fadeMiddle}deg,
    rgba(5, 171, 68, 0.2) ${fadeEnd}deg,
    rgba(6, 158, 64, 0) ${progressDegrees}deg,
    rgba(6, 158, 64, 0) 360deg
  )`;

  return (
    <div className="flex flex-col items-center gap-4 my-4">
      {/* Outer circle container with dark gradient background */}
      <div className="relative size-[200px] rounded-full bg-linear-to-b from-[rgba(2,2,2,0.66)] to-[rgba(0,0,0,0.132)]">
        {/* Progress ring with conic gradient - 35px thick border INSIDE the outer circle */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: conicGradient,
            // Mask to create 35px thick ring: outer radius 100px, inner radius 65px
            // 65/100 = 65%
            mask: "radial-gradient(circle at center, transparent 50%, black 50%)",
            WebkitMask:
              "radial-gradient(circle at center, transparent 50%, black 50%)",
          }}
        />

        {/* Curved text label - positioned INSIDE the 35px border ring */}
        <svg
          className="absolute inset-0 size-full pointer-events-none"
          viewBox="0 0 200 200"
        >
          <defs>
            {/* Arc path for curved text - centered in the 35px border ring */}
            {/* Ring spans from radius 65px to 100px, so center at ~82.5px */}
            {/* Arc at top portion of the circle */}
            <path
              id="curvedTextPath"
              d="M 22,100 A 78,78 0 0,1 178,100"
              fill="none"
            />
          </defs>
          <text
            className="fill-white text-2xl font-bold tracking-[0.15em]"
            textAnchor="middle"
          >
            <textPath href="#curvedTextPath" startOffset="52%">
              {label}
            </textPath>
          </text>
        </svg>

        {/* Inner content area - inside the 35px border ring */}
        <div className="absolute inset-[35px] rounded-full flex flex-col items-center justify-center">
          <span className="text-[77.78px]/[78px] font-bold text-white">
            {seconds}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors"
          >
            Start
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium transition-colors"
          >
            Pause
          </button>
        )}
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
};
