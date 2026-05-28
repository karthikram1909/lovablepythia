import { useNow } from "./hooks";

/** Animated AI core: rotating rings, pulsing nucleus, sweeping radar. */
export function AICore({ size = 280 }: { size?: number }) {
  const now = useNow(900);
  const conf = 0.78 + Math.sin(now.getTime() / 4000) * 0.08;

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      {/* outer ring */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 animate-ring-slow">
        <circle cx="100" cy="100" r="92" fill="none" stroke="var(--cyan)" strokeOpacity="0.25" strokeDasharray="2 6" />
      </svg>
      <svg viewBox="0 0 200 200" className="absolute inset-0 animate-ring-rev">
        <circle cx="100" cy="100" r="78" fill="none" stroke="var(--cyan)" strokeOpacity="0.4" strokeDasharray="1 3" />
        <circle cx="100" cy="100" r="78" fill="none" stroke="var(--cyan)" strokeOpacity="0.7" strokeDasharray="20 240" />
      </svg>
      <svg viewBox="0 0 200 200" className="absolute inset-0 animate-ring-slow">
        <circle cx="100" cy="100" r="60" fill="none" stroke="var(--teal)" strokeOpacity="0.5" strokeDasharray="40 200" />
      </svg>
      {/* radar sweep */}
      <div className="absolute inset-6 rounded-full overflow-hidden">
        <div className="absolute inset-0 animate-radar origin-center"
             style={{ background: "conic-gradient(from 0deg, transparent 0deg, oklch(0.82 0.16 200 / 0.18) 30deg, transparent 60deg)" }} />
      </div>
      {/* core */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="relative">
          <div className="h-16 w-16 rounded-full bg-cyan/15 border border-cyan animate-glow-breath" />
          <div className="absolute inset-3 rounded-full bg-cyan glow-cyan" />
        </div>
        <div className="mt-3 label-tac text-cyan">AI CORE</div>
        <div className="data-num text-2xl text-foreground">{(conf * 100).toFixed(2)}%</div>
        <div className="label-tac text-[9px] text-muted-foreground">CONFIDENCE</div>
      </div>
      {/* corner ticks */}
      {[0, 90, 180, 270].map((deg) => (
        <span
          key={deg}
          className="absolute top-1/2 left-1/2 h-2 w-[1px] bg-cyan/70"
          style={{ transform: `translate(-50%, -${size / 2}px) rotate(${deg}deg)`, transformOrigin: `center ${size / 2}px` }}
        />
      ))}
    </div>
  );
}
