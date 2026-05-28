import { createFileRoute } from "@tanstack/react-router";
import { Fragment } from "react";
import { Panel } from "@/components/pythia/Panel";
import { LiveSpark } from "@/components/pythia/Spark";
import { cn } from "@/lib/utils";
import { Power, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/risk")({
  head: () => ({ meta: [{ title: "Risk Matrix · PYTHIA" }] }),
  component: Risk,
});

function Risk() {
  const symbols = ["BTC", "ETH", "SOL", "ARB", "AVAX", "BNB", "LINK", "DOGE"];
  const corr = symbols.map((_, i) => symbols.map((_, j) => +(0.4 + Math.sin(i * j) * 0.5).toFixed(2)));

  return (
    <div className="grid grid-cols-12 gap-4">
      {[
        { l: "CAPITAL DEPLOYED", v: "$382,418", t: "warn", s: "38.2% of pool" },
        { l: "LIQUIDATION DIST.", v: "16.4%", t: "signal", s: "nearest: ETH" },
        { l: "MAX DRAWDOWN 24H", v: "-2.14%", t: "danger", s: "threshold -5.00%" },
        { l: "VAR (95%)", v: "$8,420", t: "cyan", s: "horizon 24h" },
        { l: "PROTECTION INTEG.", v: "97.4%", t: "signal", s: "182 SL active" },
        { l: "RISK BUDGET", v: "61%", t: "cyan", s: "39% headroom" },
      ].map((k) => (
        <div key={k.l} className="panel corner-frame col-span-6 md:col-span-4 lg:col-span-2 px-3 py-2">
          <div className="label-tac">{k.l}</div>
          <div className={cn("data-num text-xl mt-1",
            k.t === "signal" && "text-signal", k.t === "danger" && "text-danger",
            k.t === "warn" && "text-warn", k.t === "cyan" && "text-cyan")}>{k.v}</div>
          <div className="label-tac text-muted-foreground mt-0.5">{k.s}</div>
        </div>
      ))}

      <Panel title="EXPOSURE HEATMAP" code="RM-HEAT" status="online" className="col-span-12 lg:col-span-7">
        <div className="grid" style={{ gridTemplateColumns: `60px repeat(${symbols.length}, 1fr)` }}>
          <div />
          {symbols.map(s => <div key={s} className="label-tac text-center pb-1">{s}</div>)}
          {symbols.map((row, i) => (
            <Fragment key={row}>
              <div className="label-tac py-1 pr-2 text-right">{row}</div>
              {symbols.map((_col, j) => {
                const v = Math.abs(corr[i][j]);
                return (
                  <div key={`${i}-${j}`} className="aspect-square m-[1px] rounded-sm border border-border/40 flex items-center justify-center text-[9px] data-num"
                       style={{ backgroundColor: `oklch(0.78 0.16 200 / ${v})`, color: v > 0.5 ? "oklch(0.16 0.02 240)" : "oklch(0.86 0.01 220)" }}>
                    {v.toFixed(2)}
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </Panel>

      <Panel title="RISK THRESHOLDS" code="RM-THRESH" status="online" className="col-span-12 lg:col-span-5">
        {[
          { l: "MAX EXPOSURE", v: 38, max: 75, tone: "cyan" },
          { l: "PER-SYMBOL CAP", v: 12, max: 25, tone: "cyan" },
          { l: "DAILY DRAWDOWN", v: 2.1, max: 5, tone: "warn" },
          { l: "MARGIN UTIL.", v: 41, max: 80, tone: "cyan" },
          { l: "LADDER DEPTH", v: 3, max: 5, tone: "cyan" },
          { l: "STRATEGY CONC.", v: 38, max: 60, tone: "warn" },
        ].map((r) => {
          const pct = (r.v / r.max) * 100;
          return (
            <div key={r.l} className="mb-3">
              <div className="flex justify-between text-[11px] mb-1">
                <span>{r.l}</span>
                <span><span className="data-num text-foreground">{r.v}</span><span className="text-muted-foreground"> / {r.max}</span></span>
              </div>
              <div className="h-2 rounded-sm bg-surface-3 overflow-hidden relative">
                <div className="absolute inset-y-0 left-0" style={{ width: `${pct}%`, backgroundColor: pct > 80 ? "var(--danger)" : pct > 60 ? "var(--warn)" : "var(--cyan)" }} />
                <div className="absolute inset-y-0 w-[1px] bg-danger/70" style={{ left: "80%" }} />
              </div>
            </div>
          );
        })}
      </Panel>

      <Panel title="DRAWDOWN · 24H" code="RM-DD" status="online" className="col-span-12 lg:col-span-8">
        <LiveSpark color="var(--danger)" height={120} />
      </Panel>

      <Panel title="KILL SWITCH" code="KS" status="danger" className="col-span-12 lg:col-span-4">
        <div className="text-center py-3 space-y-3">
          <ShieldAlert className="h-8 w-8 text-danger mx-auto" />
          <div className="label-tac text-danger">ARMED · DUAL-CONFIRM</div>
          <button className="w-full py-3 rounded-sm border-2 border-danger bg-danger/10 hover:bg-danger/25 transition flex items-center justify-center gap-2">
            <Power className="h-5 w-5 text-danger" />
            <span className="label-tac text-danger text-sm">HALT ALL EXECUTION</span>
          </button>
          <div className="text-[10px] text-muted-foreground">
            Cancels open commands · locks recovery state · holds positions for manual review.
          </div>
        </div>
      </Panel>
    </div>
  );
}
