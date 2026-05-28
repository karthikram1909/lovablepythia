import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/pythia/Panel";
import { AICore } from "@/components/pythia/AICore";
import { LiveSpark } from "@/components/pythia/Spark";
import { useLiveValue } from "@/components/pythia/hooks";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/intelligence")({
  head: () => ({ meta: [{ title: "AI Intelligence Center · PYTHIA" }] }),
  component: Intelligence,
});

function Intelligence() {
  const conf = useLiveValue(0.82, { drift: 0.01, min: 0.4, max: 0.98, interval: 1200 });
  return (
    <div className="grid grid-cols-12 gap-4">
      <Panel title="AI CORE STATE" code="AI-04" status="online" glow className="col-span-12 lg:col-span-4">
        <AICore size={300} />
        <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
          {[
            ["MODEL", "PYTHIA-CORE v3.14"],
            ["UPTIME", "14d 06:42"],
            ["INFERENCES/s", "1,184"],
            ["FEATURES", "812"],
            ["MEMORY DEPTH", "240m"],
            ["CONFIDENCE", `${(conf * 100).toFixed(1)}%`],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col">
              <span className="label-tac">{k}</span>
              <span className="data-num text-cyan">{v}</span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="SENTIMENT WEIGHTING" code="AI-SENT" status="online" className="col-span-12 lg:col-span-4">
        {[
          { l: "Order flow", v: 0.62, sign: 1 },
          { l: "Funding skew", v: 0.41, sign: 1 },
          { l: "Open interest Δ", v: 0.28, sign: 1 },
          { l: "Social pulse", v: 0.18, sign: -1 },
          { l: "On-chain transfers", v: 0.34, sign: 1 },
          { l: "News classifier", v: 0.22, sign: -1 },
          { l: "Volatility regime", v: 0.55, sign: 1 },
          { l: "Liquidity depth", v: 0.71, sign: 1 },
        ].map((s) => (
          <div key={s.l} className="mb-2">
            <div className="flex justify-between text-[11px]">
              <span>{s.l}</span>
              <span className={cn("data-num", s.sign > 0 ? "text-signal" : "text-danger")}>
                {s.sign > 0 ? "+" : "−"}{s.v.toFixed(2)}
              </span>
            </div>
            <div className="h-1 bg-surface-3 rounded-sm overflow-hidden flex">
              <div className="w-1/2 flex justify-end">
                {s.sign < 0 && <div className="h-full bg-danger" style={{ width: `${s.v * 100}%` }} />}
              </div>
              <div className="w-1/2">
                {s.sign > 0 && <div className="h-full bg-signal" style={{ width: `${s.v * 100}%` }} />}
              </div>
            </div>
          </div>
        ))}
      </Panel>

      <Panel title="STRATEGY DOMINANCE" code="AI-STR" status="online" className="col-span-12 lg:col-span-4">
        {[
          { l: "MOMENTUM_X", v: 38 },
          { l: "MEAN_REVERT", v: 22 },
          { l: "BREAKOUT_VOL", v: 17 },
          { l: "LIQ_HUNT", v: 12 },
          { l: "CARRY_FUND", v: 7 },
          { l: "ARB_TRI", v: 4 },
        ].map((s) => (
          <div key={s.l} className="flex items-center gap-3 mb-2 text-[11px]">
            <span className="font-mono w-32">{s.l}</span>
            <div className="flex-1 h-2 bg-surface-3 rounded-sm overflow-hidden">
              <div className="h-full bg-cyan glow-cyan" style={{ width: `${s.v * 2.5}%` }} />
            </div>
            <span className="data-num w-10 text-right">{s.v}%</span>
          </div>
        ))}
        <div className="hud-divider my-3" />
        <div className="label-tac">CONFLUENCE INDEX · 60s</div>
        <LiveSpark color="var(--cyan)" height={56} />
      </Panel>

      <Panel title="SIGNAL CONFIDENCE BY SYMBOL" code="AI-SIG" status="online" className="col-span-12 lg:col-span-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {["BTC/USDT", "ETH/USDT", "SOL/USDT", "ARB/USDT", "AVAX/USDT", "BNB/USDT", "LINK/USDT", "DOGE/USDT"].map((s, i) => {
            const c = 0.45 + ((i * 13) % 50) / 100;
            return (
              <div key={s} className="border border-border/60 rounded-sm p-2.5 bg-surface/40">
                <div className="flex justify-between text-[11px]">
                  <span className="font-mono">{s}</span>
                  <span className={cn("data-num", c > 0.7 ? "text-signal" : c > 0.5 ? "text-cyan" : "text-warn")}>
                    {(c * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="mt-1.5 h-1 bg-surface-3 rounded-sm overflow-hidden">
                  <div className="h-full" style={{ width: `${c * 100}%`, backgroundColor: c > 0.7 ? "var(--signal)" : c > 0.5 ? "var(--cyan)" : "var(--warn)" }} />
                </div>
                <div className="mt-1 label-tac text-[9px] text-muted-foreground">EXEC PROB · {(c * 95).toFixed(0)}%</div>
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel title="MARKET REGIME · LIVE" code="AI-REG" status="online" className="col-span-12 lg:col-span-4">
        <div className="text-center py-3">
          <div className="label-tac text-cyan">CURRENT</div>
          <div className="font-display text-2xl font-bold mt-1">TREND_UP</div>
          <div className="label-tac text-muted-foreground">CONFIRMED 14m AGO</div>
        </div>
        <div className="grid grid-cols-3 gap-1 mt-2">
          {["RANGE", "TREND_UP", "TREND_DN", "EXPANSION", "COMPRESSION", "REGIME_BREAK"].map((r, i) => (
            <div key={r} className={cn("py-1.5 text-center text-[10px] label-tac rounded-sm border",
              r === "TREND_UP" ? "border-cyan text-cyan bg-cyan/10" : "border-border text-muted-foreground")}>{r}</div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
