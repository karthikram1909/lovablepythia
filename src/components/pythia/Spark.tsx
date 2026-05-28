import { useSeries } from "./hooks";
import { cn } from "@/lib/utils";

export function Sparkline({
  data,
  className,
  color = "var(--cyan)",
  fill = true,
  height = 48,
}: {
  data: number[];
  className?: string;
  color?: string;
  fill?: boolean;
  height?: number;
}) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 100;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = height - ((v - min) / range) * height;
    return [x, y] as const;
  });
  const d = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
  const areaD = `${d} L${w},${height} L0,${height} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className={cn("w-full", className)} preserveAspectRatio="none">
      {fill && (
        <>
          <defs>
            <linearGradient id={`g-${color}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.35" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaD} fill={`url(#g-${color})`} />
        </>
      )}
      <path d={d} fill="none" stroke={color} strokeWidth={1} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function LiveSpark({ seed = 60, color, height }: { seed?: number; color?: string; height?: number }) {
  const series = useSeries(seed, (i, prev) => prev + (Math.random() - 0.48) * 2, 1100);
  return <Sparkline data={series} color={color} height={height} />;
}

/** Bar/heartbeat track */
export function BarTrack({ values, max = 100, color = "var(--cyan)" }: { values: number[]; max?: number; color?: string }) {
  return (
    <div className="flex items-end gap-[2px] h-8">
      {values.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-[1px]"
          style={{
            height: `${Math.max(4, (v / max) * 100)}%`,
            backgroundColor: color,
            opacity: 0.4 + (i / values.length) * 0.6,
          }}
        />
      ))}
    </div>
  );
}
