import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/pythia/Panel";
import { LiveSpark } from "@/components/pythia/Spark";
import { Play, SkipBack, SkipForward, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/forensics")({
  head: () => ({ meta: [{ title: "Trade Forensics · PYTHIA" }] }),
  component: Forensics,
});

const EVENTS = [
  { t: "14:02:11.482", code: "SIGNAL.IN", color: "cyan", title: "Signal detected · MOMENTUM_X", detail: "BTC/USDT · score 0.84 · regime TREND_UP" },
  { t: "14:02:11.520", code: "AI.WEIGHT", color: "cyan", title: "AI sentiment weighting applied", detail: "bias +0.18 · social +0.04 · onchain +0.07" },
  { t: "14:02:11.561", code: "VALIDATE", color: "signal", title: "Pre-trade validation passed", detail: "8/8 checks · margin OK · risk allocation 1.2%" },
  { t: "14:02:11.612", code: "EXEC.OPEN", color: "signal", title: "Position opened LONG", detail: "size 0.42 · entry 67,418.20 · sl 66,212.40 · tp 70,431.60" },
  { t: "14:02:48.891", code: "PROT.SL", color: "cyan", title: "Dynamic SL advanced", detail: "66,212.40 → 67,082.10 · trailing buffer 0.42%" },
  { t: "14:03:12.044", code: "LADDER", color: "cyan", title: "Add-more ladder rung 1 filled", detail: "size 0.21 · price 67,302.50 · avg 67,376.50" },
  { t: "14:03:51.318", code: "AI.RECALC", color: "cyan", title: "AI conviction increased", detail: "0.71 → 0.84 · confluence 4/4" },
  { t: "14:04:22.701", code: "PROT.SL", color: "cyan", title: "Dynamic SL advanced", detail: "67,082.10 → 67,840.00 · profit locked +0.69%" },
  { t: "14:05:01.220", code: "TP.MOVE", color: "cyan", title: "TP extended", detail: "70,431 → 71,200 · regime persistence 92%" },
  { t: "14:05:48.014", code: "EXEC.PARTIAL", color: "signal", title: "Partial close · 50%", detail: "price 70,420 · realized +1.51%" },
  { t: "14:06:11.500", code: "EXEC.CLOSE", color: "signal", title: "Position closed · trailing SL hit", detail: "exit 71,184 · realized +2.41% · slippage 0.008%" },
  { t: "14:06:11.733", code: "AUDIT.SEAL", color: "cyan", title: "Audit trail sealed", detail: "execution_id EXEC-A23F · 11 events · hash 4f8c…c91a" },
];

function Forensics() {
  return (
    <div className="grid grid-cols-12 gap-4">
      <Panel title="FORENSIC REPLAY · EXEC-A23F" code="TF-03" status="online" className="col-span-12 lg:col-span-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <button className="h-7 w-7 rounded-sm border border-border bg-surface flex items-center justify-center"><SkipBack className="h-3 w-3" /></button>
            <button className="h-7 w-7 rounded-sm border border-cyan bg-cyan/15 text-cyan flex items-center justify-center glow-cyan"><Play className="h-3 w-3" /></button>
            <button className="h-7 w-7 rounded-sm border border-border bg-surface flex items-center justify-center"><SkipForward className="h-3 w-3" /></button>
            <span className="label-tac ml-3 text-cyan">PLAYBACK · 1×</span>
          </div>
          <span className="data-num text-muted-foreground text-[11px]">DURATION 04:00.251</span>
        </div>

        <div className="relative h-48 rounded-sm border border-border bg-surface/50 p-2">
          <PriceChart />
        </div>

        <div className="mt-3 h-2 rounded-sm bg-surface-3 relative overflow-hidden">
          <div className="absolute inset-y-0 left-0 bg-cyan glow-cyan" style={{ width: "62%" }} />
          {[8, 14, 22, 38, 47, 58, 76, 88, 96].map((p) => (
            <span key={p} className="absolute top-0 h-full w-[2px] bg-cyan-glow" style={{ left: `${p}%` }} />
          ))}
        </div>
        <div className="mt-1 flex justify-between label-tac text-[9px] text-muted-foreground">
          <span>SIGNAL</span><span>OPEN</span><span>LADDER</span><span>SL+1</span><span>SL+2</span><span>TP+</span><span>PARTIAL</span><span>CLOSE</span><span>SEAL</span>
        </div>
      </Panel>

      <Panel title="EXECUTION SUMMARY" code="SUM" status="online" className="col-span-12 lg:col-span-4">
        {[
          ["execution_id", "EXEC-A23F"],
          ["recovery_lock_id", "—"],
          ["symbol", "BTC/USDT"],
          ["side", "LONG"],
          ["strategy", "MOMENTUM_X"],
          ["entry avg", "67,376.50"],
          ["exit avg", "70,802.00"],
          ["realized PnL", "+$2,480.12"],
          ["return", "+2.41%"],
          ["max drawdown", "-0.18%"],
          ["sl moves", "4"],
          ["ladder rungs", "2"],
          ["audit hash", "4f8c…c91a"],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between py-1 text-[11px] border-b border-border/30 last:border-0">
            <span className="label-tac">{k}</span>
            <span className={cn("data-num", k === "realized PnL" || k === "return" ? "text-signal" : "text-foreground")}>{v}</span>
          </div>
        ))}
      </Panel>

      <Panel title="EVENT LEDGER" code="LEDGER" status="online" className="col-span-12">
        <div className="relative pl-6">
          <div className="absolute left-2 top-2 bottom-2 w-[1px] bg-border" />
          <ul className="space-y-3">
            {EVENTS.map((e, i) => (
              <li key={i} className="relative">
                <span className={cn("absolute -left-[19px] top-1 h-2 w-2 rounded-full",
                  e.color === "cyan" && "bg-cyan glow-cyan",
                  e.color === "signal" && "bg-signal glow-signal")} />
                <div className="grid grid-cols-[100px_120px_1fr] gap-3 text-[11px]">
                  <span className="font-mono text-muted-foreground">{e.t}</span>
                  <span className="font-mono text-cyan">{e.code}</span>
                  <div>
                    <div className="text-foreground">{e.title}</div>
                    <div className="text-muted-foreground">{e.detail}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Panel>

      <Panel title="SEARCH FORENSICS" code="QUERY" status="idle" className="col-span-12">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input placeholder="execution_id, symbol, recovery_lock_id, audit hash…"
                 className="flex-1 bg-transparent border border-border rounded-sm px-3 py-1.5 text-[12px] outline-none focus:border-cyan" />
          <button className="px-3 py-1.5 border border-cyan/50 text-cyan rounded-sm text-[11px] label-tac">QUERY</button>
        </div>
      </Panel>
    </div>
  );
}

function PriceChart() {
  return (
    <svg viewBox="0 0 400 120" className="w-full h-full">
      <defs>
        <linearGradient id="pa" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--cyan)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--cyan)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0,80 L40,72 L80,75 L120,55 L160,52 L200,40 L240,35 L280,28 L320,18 L360,22 L400,10 L400,120 L0,120 Z" fill="url(#pa)" />
      <path d="M0,80 L40,72 L80,75 L120,55 L160,52 L200,40 L240,35 L280,28 L320,18 L360,22 L400,10" fill="none" stroke="var(--cyan)" strokeWidth="1.2" />
      {/* SL lines */}
      <line x1="0" y1="95" x2="120" y2="95" stroke="var(--danger)" strokeOpacity="0.5" strokeDasharray="3 3" />
      <line x1="120" y1="78" x2="240" y2="78" stroke="var(--danger)" strokeOpacity="0.5" strokeDasharray="3 3" />
      <line x1="240" y1="55" x2="400" y2="55" stroke="var(--danger)" strokeOpacity="0.5" strokeDasharray="3 3" />
      {/* TP */}
      <line x1="0" y1="20" x2="320" y2="20" stroke="var(--signal)" strokeOpacity="0.4" strokeDasharray="3 3" />
      <line x1="320" y1="6" x2="400" y2="6" stroke="var(--signal)" strokeOpacity="0.6" strokeDasharray="3 3" />
      {/* event markers */}
      {[40, 100, 160, 220, 280, 340].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={80 - i * 10} r="3" fill="var(--cyan)" />
          <circle cx={x} cy={80 - i * 10} r="3" fill="none" stroke="var(--cyan)" opacity="0.4">
            <animate attributeName="r" from="3" to="8" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>
      ))}
    </svg>
  );
}
