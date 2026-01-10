import React, {
  useEffect,
  useRef,
  useCallback,
  type CSSProperties,
  type ReactNode,
} from "react";

interface ElectricBorderProps {
  children?: ReactNode;
  variant?: "blue" | "red";
  color?: string;
  speed?: number;
  chaos?: number;
  borderRadius?:
    | number
    | {
        tl?: number;
        tr?: number;
        br?: number;
        bl?: number;
      };
  className?: string;
  style?: CSSProperties;
}

const ElectricBorder: React.FC<ElectricBorderProps> = ({
  children,
  variant = "blue",
  color,
  speed = 0.8,
  chaos = 0.04,
  borderRadius = 45,
  className,
  style,
}) => {
  const effectiveColor = color ?? (variant === "red" ? "#FF4D4D" : "#82DCFF");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef(0);
  const lastFrameTimeRef = useRef(0);

  const random = useCallback((x: number): number => {
    return (Math.sin(x * 12.9898) * 43758.5453) % 1;
  }, []);

  const noise2D = useCallback(
    (x: number, y: number): number => {
      const i = Math.floor(x);
      const j = Math.floor(y);
      const fx = x - i;
      const fy = y - j;

      const a = random(i + j * 57);
      const b = random(i + 1 + j * 57);
      const c = random(i + (j + 1) * 57);
      const d = random(i + 1 + (j + 1) * 57);

      const ux = fx * fx * (3.0 - 2.0 * fx);
      const uy = fy * fy * (3.0 - 2.0 * fy);

      return (
        a * (1 - ux) * (1 - uy) +
        b * ux * (1 - uy) +
        c * (1 - ux) * uy +
        d * ux * uy
      );
    },
    [random]
  );

  const octavedNoise = useCallback(
    (
      x: number,
      octaves: number,
      lacunarity: number,
      gain: number,
      baseAmplitude: number,
      baseFrequency: number,
      time: number,
      seed: number,
      baseFlatness: number
    ): number => {
      let y = 0;
      let amplitude = baseAmplitude;
      let frequency = baseFrequency;

      for (let i = 0; i < octaves; i++) {
        let octaveAmplitude = amplitude;
        if (i === 0) {
          octaveAmplitude *= baseFlatness;
        }
        y +=
          octaveAmplitude *
          noise2D(frequency * x + seed * 100, time * frequency * 0.3);
        frequency *= lacunarity;
        amplitude *= gain;
      }

      return y;
    },
    [noise2D]
  );

  const getCornerPoint = useCallback(
    (
      centerX: number,
      centerY: number,
      radius: number,
      startAngle: number,
      arcLength: number,
      progress: number
    ): { x: number; y: number } => {
      const angle = startAngle + progress * arcLength;
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    },
    []
  );

  const normalizeCornerRadii = useCallback(
    (
      width: number,
      height: number,
      radii: { tl: number; tr: number; br: number; bl: number }
    ): { tl: number; tr: number; br: number; bl: number } => {
      const tl = Math.max(0, radii.tl);
      const tr = Math.max(0, radii.tr);
      const br = Math.max(0, radii.br);
      const bl = Math.max(0, radii.bl);

      const scaleWTop = tl + tr > 0 ? width / (tl + tr) : 1;
      const scaleWBottom = bl + br > 0 ? width / (bl + br) : 1;
      const scaleHLeft = tl + bl > 0 ? height / (tl + bl) : 1;
      const scaleHRight = tr + br > 0 ? height / (tr + br) : 1;

      const scale = Math.min(
        1,
        scaleWTop,
        scaleWBottom,
        scaleHLeft,
        scaleHRight
      );

      return {
        tl: tl * scale,
        tr: tr * scale,
        br: br * scale,
        bl: bl * scale,
      };
    },
    []
  );

  const getRoundedRectPoint = useCallback(
    (
      t: number,
      left: number,
      top: number,
      width: number,
      height: number,
      radii: { tl: number; tr: number; br: number; bl: number }
    ): { x: number; y: number } => {
      const normalized = normalizeCornerRadii(width, height, radii);
      const tl = normalized.tl;
      const tr = normalized.tr;
      const br = normalized.br;
      const bl = normalized.bl;

      const topStraight = Math.max(0, width - tl - tr);
      const rightStraight = Math.max(0, height - tr - br);
      const bottomStraight = Math.max(0, width - br - bl);
      const leftStraight = Math.max(0, height - bl - tl);

      const tlArc = (Math.PI * tl) / 2;
      const trArc = (Math.PI * tr) / 2;
      const brArc = (Math.PI * br) / 2;
      const blArc = (Math.PI * bl) / 2;

      const totalPerimeter =
        topStraight +
        trArc +
        rightStraight +
        brArc +
        bottomStraight +
        blArc +
        leftStraight +
        tlArc;

      if (totalPerimeter <= 0) {
        return { x: left, y: top };
      }

      const distance = ((t % 1) + 1) % 1;
      let remaining = distance * totalPerimeter;

      // Top edge (left -> right)
      if (remaining <= topStraight) {
        const progress = topStraight === 0 ? 0 : remaining / topStraight;
        return { x: left + tl + progress * topStraight, y: top };
      }
      remaining -= topStraight;

      // Top-right arc
      if (remaining <= trArc) {
        const progress = trArc === 0 ? 0 : remaining / trArc;
        return getCornerPoint(
          left + width - tr,
          top + tr,
          tr,
          -Math.PI / 2,
          Math.PI / 2,
          progress
        );
      }
      remaining -= trArc;

      // Right edge (top -> bottom)
      if (remaining <= rightStraight) {
        const progress = rightStraight === 0 ? 0 : remaining / rightStraight;
        return {
          x: left + width,
          y: top + tr + progress * rightStraight,
        };
      }
      remaining -= rightStraight;

      // Bottom-right arc
      if (remaining <= brArc) {
        const progress = brArc === 0 ? 0 : remaining / brArc;
        return getCornerPoint(
          left + width - br,
          top + height - br,
          br,
          0,
          Math.PI / 2,
          progress
        );
      }
      remaining -= brArc;

      // Bottom edge (right -> left)
      if (remaining <= bottomStraight) {
        const progress = bottomStraight === 0 ? 0 : remaining / bottomStraight;
        return {
          x: left + width - br - progress * bottomStraight,
          y: top + height,
        };
      }
      remaining -= bottomStraight;

      // Bottom-left arc
      if (remaining <= blArc) {
        const progress = blArc === 0 ? 0 : remaining / blArc;
        return getCornerPoint(
          left + bl,
          top + height - bl,
          bl,
          Math.PI / 2,
          Math.PI / 2,
          progress
        );
      }
      remaining -= blArc;

      // Left edge (bottom -> top)
      if (remaining <= leftStraight) {
        const progress = leftStraight === 0 ? 0 : remaining / leftStraight;
        return {
          x: left,
          y: top + height - bl - progress * leftStraight,
        };
      }
      remaining -= leftStraight;

      // Top-left arc
      const progress = tlArc === 0 ? 0 : Math.min(1, remaining / tlArc);
      return getCornerPoint(
        left + tl,
        top + tl,
        tl,
        Math.PI,
        Math.PI / 2,
        progress
      );
    },
    [getCornerPoint, normalizeCornerRadii]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const octaves = 10;
    const lacunarity = 1.6;
    const gain = 0.7;
    const amplitude = chaos;
    const frequency = 10;
    const baseFlatness = 0;
    const displacement = 60;
    const borderOffset = 60;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width + borderOffset * 2;
      const height = rect.height + borderOffset * 2;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      return { width, height };
    };

    let { width, height } = updateSize();

    const drawElectricBorder = (currentTime: number) => {
      if (!canvas || !ctx) return;

      const deltaTime = (currentTime - lastFrameTimeRef.current) / 1000;
      timeRef.current += deltaTime * speed;
      lastFrameTimeRef.current = currentTime;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      ctx.strokeStyle = effectiveColor;
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const scale = displacement;
      const left = borderOffset;
      const top = borderOffset;
      const borderWidth = width - 2 * borderOffset;
      const borderHeight = height - 2 * borderOffset;
      const rawRadii =
        typeof borderRadius === "number"
          ? {
              tl: borderRadius,
              tr: borderRadius,
              br: borderRadius,
              bl: borderRadius,
            }
          : {
              tl: borderRadius.tl ?? 0,
              tr: borderRadius.tr ?? 0,
              br: borderRadius.br ?? 0,
              bl: borderRadius.bl ?? 0,
            };
      const r = normalizeCornerRadii(borderWidth, borderHeight, rawRadii);

      const topStraight = Math.max(0, borderWidth - r.tl - r.tr);
      const rightStraight = Math.max(0, borderHeight - r.tr - r.br);
      const bottomStraight = Math.max(0, borderWidth - r.br - r.bl);
      const leftStraight = Math.max(0, borderHeight - r.bl - r.tl);
      const approximatePerimeter =
        topStraight +
        rightStraight +
        bottomStraight +
        leftStraight +
        (Math.PI / 2) * (r.tl + r.tr + r.br + r.bl);
      const sampleCount = Math.floor(approximatePerimeter / 2);

      ctx.beginPath();

      for (let i = 0; i <= sampleCount; i++) {
        const progress = i / sampleCount;

        const point = getRoundedRectPoint(
          progress,
          left,
          top,
          borderWidth,
          borderHeight,
          r
        );

        const xNoise = octavedNoise(
          progress * 8,
          octaves,
          lacunarity,
          gain,
          amplitude,
          frequency,
          timeRef.current,
          0,
          baseFlatness
        );
        const yNoise = octavedNoise(
          progress * 8,
          octaves,
          lacunarity,
          gain,
          amplitude,
          frequency,
          timeRef.current,
          1,
          baseFlatness
        );

        const displacedX = point.x + xNoise * scale;
        const displacedY = point.y + yNoise * scale;

        if (i === 0) {
          ctx.moveTo(displacedX, displacedY);
        } else {
          ctx.lineTo(displacedX, displacedY);
        }
      }

      ctx.closePath();
      ctx.stroke();

      animationRef.current = requestAnimationFrame(drawElectricBorder);
    };

    const resizeObserver = new ResizeObserver(() => {
      const newSize = updateSize();
      width = newSize.width;
      height = newSize.height;
    });
    resizeObserver.observe(container);

    animationRef.current = requestAnimationFrame(drawElectricBorder);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [
    effectiveColor,
    speed,
    chaos,
    borderRadius,
    octavedNoise,
    getRoundedRectPoint,
  ]);

  const radiusStyle: CSSProperties =
    typeof borderRadius === "number"
      ? { borderRadius }
      : {
          borderTopLeftRadius: borderRadius.tl ?? 0,
          borderTopRightRadius: borderRadius.tr ?? 0,
          borderBottomRightRadius: borderRadius.br ?? 0,
          borderBottomLeftRadius: borderRadius.bl ?? 0,
        };

  const vars = {
    "--electric-border-color": effectiveColor,
  } as CSSProperties;

  return (
    <div
      ref={containerRef}
      className={`electric-border ${className ?? ""}`}
      style={{ ...vars, ...radiusStyle, ...style }}
    >
      <div className="eb-canvas-container">
        <canvas ref={canvasRef} className="eb-canvas" />
      </div>
      <div className="eb-layers">
        <div className="eb-glow-1" />
        <div className="eb-glow-2" />
        <div className="eb-background-glow" />
      </div>
      <div className="eb-content relative">{children}</div>
    </div>
  );
};

export default ElectricBorder;
