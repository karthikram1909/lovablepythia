import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/pythia/Panel";
import { LiveSpark } from "@/components/pythia/Spark";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/regime")({
  head: () => ({ meta: [{ title: "Market Regime · PYTHIA" }] }),
  component: Regime,
});

const REGIMES = ["RANGE", "TREND_UP", "TREND_DN", "EXPANSION", "COMPRESSION", "REGIME_BREAK"];

function Regime() {
  return (
    <div className="grid grid-cols-12 gap-4">
      <Panel title="GLOBAL MARKET REGIME" code="MR-14" status="online" glow className="col-span-12 lg:col-span-7">
        <div className="text-center py-4">
          <div className="label-tac text-cyan">CURRENT REGIME</div>
          <div className="font-display text-4xl font-bold mt-2 tracking-wide">TREND_UP</div>
          <div className="label-tac text-muted-foreground mt-1">CONFIRMED · 14m · PERSISTENCE 92%</div>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {REGIMES.map(r => (
            <div key={r} className={cn("p-2 text-center rounded-sm border",
              r==="TREND_UP" ? "border-cyan bg-cyan/10 text-cyan glow-cyan" : "border-border text-muted-foreground")}>
              <div className="label-tac text-[9px]">{r}</div>
              <div className="data-num text-sm mt-1">{r==="TREND_UP" ? "92%" : `${10 + Math.floor(Math.random()*30)}%`}</div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="VOLATILITY REGIME" code="MR-VOL" status="online" className="col-span-12 lg:col-span-5">
        <div className="text-center py-3">
          <div className="label-tac">CLASS</div>
          <div className="font-display text-2xl font-bold">MEDIUM</div>
          <div className="label-tac text-muted-foreground">ATR 1.42% · IV-RANK 38</div>
        </div>
        <LiveSpark color="var(--teal)" height={80} />
      </Panel>

      <Panel title="REGIME TRANSITION TIMELINE · 24H" code="MR-T" status="online" className="col-span-12">
        <div className="flex h-12 rounded-sm overflow-hidden border border-border">
          {[
            { r: "RANGE", w: 22, c: "var(--muted-foreground)" },
            { r: "EXPANSION", w: 14, c: "var(--cyan)" },
            { r: "TREND_UP", w: 38, c: "var(--signal)" },
            { r: "COMPRESSION", w: 8, c: "var(--warn)" },
            { r: "RANGE", w: 12, c: "var(--muted-foreground)" },
            { r: "TREND_UP", w: 6, c: "var(--signal)" },
          ].map((b, i) => (
            <div key={i} className="flex items-center justify-center text-[10px] label-tac"
                 style={{ width: `${b.w}%`, backgroundColor: b.c, color: "oklch(0.16 0.02 240)" }}>
              {b.r}
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between label-tac text-[10px] text-muted-foreground">
          <span>-24h</span><span>-18h</span><span>-12h</span><span>-6h</span><span>NOW</span>
        </div>
      </Panel>

      <Panel title="PER-SYMBOL REGIME" code="MR-SYM" status="online" className="col-span-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {["BTC/USDT","ETH/USDT","SOL/USDT","ARB/USDT","AVAX/USDT","BNB/USDT","LINK/USDT","DOGE/USDT"].map((s,i) => {
            const r = REGIMES[i % REGIMES.length];
            return (
              <div key={s} className="border border-border/60 rounded-sm p-2.5 bg-surface/40">
                <div className="flex justify-between text-[11px]"><span className="font-mono">{s}</span>
                  <span className={cn("label-tac", r==="TREND_UP"?"text-signal":r==="TREND_DN"?"text-danger":"text-cyan")}>{r}</span></div>
                <LiveSpark color={r==="TREND_UP"?"var(--signal)":r==="TREND_DN"?"var(--danger)":"var(--cyan)"} height={36} />
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}
