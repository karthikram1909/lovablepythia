import { createFileRoute } from "@tanstack/react-router";
import { Panel, StatPill } from "@/components/pythia/Panel";
import { AICore } from "@/components/pythia/AICore";
import { LiveSpark, BarTrack } from "@/components/pythia/Spark";
import { useFeed, usePositions, useRunners, useQueue } from "@/components/pythia/data";
import { useLiveValue, useNow, useSeries } from "@/components/pythia/hooks";
import { Activity, ArrowUpRight, ArrowDownRight, Power, ShieldAlert, Wifi, Zap, Brain, Crosshair, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mission Control · PYTHIA" },
      { name: "description", content: "Realtime mission control for the Pythia autonomous AI trading operating system." },
    ],
  }),
  component: MissionControl,
});

function MissionControl() {
  const btc = useLiveValue(67421.5, { drift: 28, min: 60000, max: 75000, interval: 900 });
  const eth = useLiveValue(3284.12, { drift: 6, min: 2900, max: 3600, interval: 900 });
  const sol = useLiveValue(168.42, { drift: 1.2, min: 130, max: 200, interval: 900 });
  const aiConf = useLiveValue(82, { drift: 1.4, min: 60, max: 95, interval: 1500 });
  const exposure = useLiveValue(38.2, { drift: 0.5, min: 12, max: 78, interval: 1700 });
  const pnl = useLiveValue(12480, { drift: 90, min: -2000, max: 30000, interval: 1500 });
  const feed = useFeed();
  const runners = useRunners();
  const queue = useQueue();
  const positions = usePositions();
  const beat = useSeries(28, (_i, p) => Math.max(2, Math.min(98, p + (Math.random() - 0.5) * 30)), 700);

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* HEADER STRIP */}
      <div className="col-span-12 grid grid-cols-2 md:grid-cols-6 gap-3">
        <KPI label="P&L · 24H" value={`$${pnl.toFixed(0)}`} tone="signal" delta="+4.21%" />
        <KPI label="EXPOSURE" value={`${exposure.toFixed(1)}%`} tone="warn" delta="of capital" />
        <KPI label="AI CONF." value={`${aiConf.toFixed(1)}%`} tone="cyan" delta="rising" />
        <KPI label="BTC" value={btc.toFixed(2)} tone="default" delta={`±${(btc % 4).toFixed(2)}`} />
        <KPI label="ETH" value={eth.toFixed(2)} tone="default" delta={`±${(eth % 2).toFixed(2)}`} />
        <KPI label="SOL" value={sol.toFixed(2)} tone="default" delta={`±${(sol % 1).toFixed(2)}`} />
      </div>

      {/* LEFT COLUMN */}
      <div className="col-span-12 lg:col-span-3 space-y-4">
        <Panel title="RUNNER NETWORK" code="RN-01" status="online" right={`${runners.filter(r => r.status === "ACTIVE").length}/${runners.length} ACTIVE`}>
          <ul className="space-y-2">
            {runners.slice(0, 6).map((r) => (
              <li key={r.id} className="flex items-center gap-2 text-[11px]">
                <span className={cn(
                  "h-1.5 w-1.5 rounded-full animate-pulse-dot",
                  r.status === "ACTIVE" && "bg-signal",
                  r.status === "BACKOFF" && "bg-warn",
                  r.status === "STANDBY" && "bg-muted-foreground",
                )} />
                <span className="font-mono w-12 text-cyan">{r.region}</span>
                <span className="data-num text-muted-foreground w-10 text-right">{r.latency}ms</span>
                <div className="flex-1 h-1 bg-surface-3 rounded-sm overflow-hidden">
                  <div className="h-full bg-cyan/70" style={{ width: `${r.load}%` }} />
                </div>
                <span className="data-num w-8 text-right text-muted-foreground">{r.load}%</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="EXCHANGE HEALTH" code="XC-08" status="online">
          {[
            { name: "GATE.IO", lat: 38, ok: true },
            { name: "BINANCE", lat: 24, ok: true },
            { name: "OKX", lat: 71, ok: true },
            { name: "BYBIT", lat: 142, ok: false },
          ].map((x) => (
            <div key={x.name} className="flex items-center justify-between py-1 text-[11px] border-b border-border/50 last:border-0">
              <div className="flex items-center gap-2">
                <Wifi className={cn("h-3 w-3", x.ok ? "text-signal" : "text-warn")} />
                <span className="font-mono">{x.name}</span>
              </div>
              <span className={cn("data-num", x.ok ? "text-signal" : "text-warn")}>{x.lat}ms</span>
            </div>
          ))}
        </Panel>

        <Panel title="COMMAND QUEUE" code="EQ-12" status="online" right={`${queue.length} CMDS`}>
          <div className="space-y-1.5">
            {queue.slice(0, 5).map((q) => (
              <div key={q.id} className="flex items-center gap-2 text-[10px]">
                <span className="font-mono text-cyan/80 w-20 truncate">{q.id}</span>
                <span className="font-mono text-muted-foreground w-14">{q.cmd}</span>
                <span className={cn(
                  "px-1.5 py-0.5 rounded-sm border text-[9px] label-tac",
                  q.state === "ACK" && "border-signal/40 text-signal",
                  q.state === "EXECUTING" && "border-cyan/40 text-cyan",
                  q.state === "PARITY" && "border-warn/40 text-warn",
                  (q.state === "QUEUED" || q.state === "VALIDATING" || q.state === "DISPATCHED") && "border-border text-muted-foreground",
                )}>{q.state}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* CENTER */}
      <div className="col-span-12 lg:col-span-6 space-y-4">
        <Panel title="AI EXECUTION CORE" code="MC-00" status="online" glow right="REGIME · TREND_UP">
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="space-y-3">
              <Stat label="STRATEGIES" value="4 / 7" sub="dominant: MOMENTUM_X" />
              <Stat label="SIGNAL STRENGTH" value="0.84" sub="last 60s" />
              <Stat label="VOLATILITY" value="MEDIUM" sub="ATR 1.42%" />
              <Stat label="EXEC PROBABILITY" value="92.4%" sub="next 30s" />
            </div>
            <div className="flex items-center justify-center">
              <AICore size={260} />
            </div>
            <div className="space-y-3 text-right">
              <Stat label="MARKET REGIME" value="TREND_UP" sub="confirmed 14m" align="right" />
              <Stat label="BIAS" value="LONG" sub="conviction 0.71" align="right" />
              <Stat label="SCAN RATE" value="184/s" sub="symbols·streams" align="right" />
              <Stat label="LATENCY (E2E)" value="42ms" sub="p99 76ms" align="right" />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <MiniChart label="BTC · 1m" value={btc.toFixed(2)} color="var(--cyan)" />
            <MiniChart label="ETH · 1m" value={eth.toFixed(2)} color="var(--teal)" />
            <MiniChart label="SOL · 1m" value={sol.toFixed(2)} color="var(--signal)" />
          </div>
        </Panel>

        <div className="grid grid-cols-2 gap-4">
          <Panel title="SYSTEM HEARTBEAT" code="SI-07" status="online">
            <BarTrack values={beat} color="var(--cyan)" />
            <div className="mt-2 grid grid-cols-3 gap-2 text-[10px] label-tac">
              <span>TICK <span className="text-cyan">700ms</span></span>
              <span>DRIFT <span className="text-signal">±4ms</span></span>
              <span>UPTIME <span className="text-foreground">14d 06:42</span></span>
            </div>
          </Panel>
          <Panel title="ACTIVE POSITIONS" code="PS-13" status="online" right={`${positions.length} OPEN`}>
            <div className="space-y-1.5">
              {positions.slice(0, 4).map((p) => (
                <div key={p.id} className="flex items-center gap-2 text-[11px]">
                  <span className={cn("px-1.5 py-0.5 rounded-sm label-tac text-[9px]",
                    p.side === "LONG" ? "bg-signal/15 text-signal" : "bg-danger/15 text-danger")}>{p.side}</span>
                  <span className="font-mono w-20">{p.symbol}</span>
                  <span className="data-num text-muted-foreground flex-1">@{p.entry}</span>
                  <span className={cn("data-num", p.pnlPct >= 0 ? "text-signal" : "text-danger")}>
                    {p.pnlPct >= 0 ? "+" : ""}{p.pnlPct.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="col-span-12 lg:col-span-3 space-y-4">
        <Panel title="LIVE PnL" code="P-NOW" status="online" glow>
          <div className="flex items-end justify-between">
            <div>
              <div className="data-num text-3xl text-signal">+${pnl.toFixed(0)}</div>
              <div className="label-tac text-muted-foreground mt-1">SESSION · 24H</div>
            </div>
            <ArrowUpRight className="h-6 w-6 text-signal" />
          </div>
          <LiveSpark seed={48} color="var(--signal)" height={56} />
          <div className="mt-2 grid grid-cols-3 gap-2">
            <StatPill label="WINS" value="38" tone="signal" />
            <StatPill label="LOSS" value="11" tone="danger" />
            <StatPill label="WIN%" value="78" unit="%" tone="cyan" />
          </div>
        </Panel>

        <Panel title="RISK MATRIX" code="RM-05" status={exposure > 60 ? "warn" : "online"}>
          <RiskBar label="CAPITAL EXPOSURE" pct={exposure} />
          <RiskBar label="LIQUIDATION DIST." pct={84} tone="signal" />
          <RiskBar label="DRAWDOWN" pct={21} tone="warn" />
          <RiskBar label="PROTECTION INTEG." pct={97} tone="signal" />
          <RiskBar label="CORRELATION" pct={54} tone="cyan" />
        </Panel>

        <Panel title="KILL SWITCH" code="KS-00" status="danger">
          <div className="flex flex-col items-center text-center gap-3 py-2">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-danger/20 animate-glow-breath" />
              <button className="relative h-20 w-20 rounded-full border-2 border-danger bg-danger/15 hover:bg-danger/30 transition flex items-center justify-center">
                <Power className="h-7 w-7 text-danger" />
              </button>
            </div>
            <div className="label-tac text-danger">ARMED · DOUBLE-CONFIRM REQ.</div>
            <div className="text-[10px] text-muted-foreground leading-tight">
              Halts all execution, cancels open commands, and locks recovery state across the runner network.
            </div>
          </div>
        </Panel>
      </div>

      {/* BOTTOM */}
      <div className="col-span-12 grid grid-cols-12 gap-4">
        <Panel title="TACTICAL EVENT FEED" code="TE-11" status="online" right="LIVE" className="col-span-12 xl:col-span-8">
          <div className="max-h-[260px] overflow-y-auto pr-1">
            <ul className="space-y-1">
              {feed.map((e, i) => (
                <li key={i} className="grid grid-cols-[64px_64px_90px_1fr] gap-3 text-[11px] py-1 border-b border-border/30 last:border-0">
                  <span className="font-mono text-muted-foreground">{e.ts}</span>
                  <span className={cn("label-tac",
                    e.level === "OK" && "text-signal",
                    e.level === "AI" && "text-cyan",
                    e.level === "WARN" && "text-warn",
                    e.level === "CRIT" && "text-danger",
                    e.level === "INFO" && "text-muted-foreground",
                  )}>{e.level}</span>
                  <span className="font-mono text-cyan/70">{e.code}</span>
                  <span className="text-foreground/90">{e.msg}</span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>

        <Panel title="INTEGRITY ALERTS" code="IA" status="warn" className="col-span-12 xl:col-span-4">
          <ul className="space-y-2 text-[11px]">
            <Alert tone="warn" code="API.BACKOFF" msg="Execution throughput temporarily throttled · gate.io" />
            <Alert tone="signal" code="STATE.RECONCILE" msg="Position state reconciled · ETH/USDT" />
            <Alert tone="danger" code="DRIFT" msg="Runner clock drift exceeded · TKY-2 · 12ms" />
            <Alert tone="signal" code="RECOVERY" msg="recovery_lock released · ARB-91FF" />
            <Alert tone="warn" code="PARITY" msg="Parity test queued · 4,201 records" />
          </ul>
        </Panel>
      </div>
    </div>
  );
}

function KPI({ label, value, tone, delta }: { label: string; value: string; tone: "default" | "cyan" | "signal" | "warn" | "danger"; delta?: string }) {
  const toneCls = { default: "text-foreground", cyan: "text-cyan", signal: "text-signal", warn: "text-warn", danger: "text-danger" }[tone];
  return (
    <div className="panel corner-frame px-3 py-2">
      <div className="label-tac">{label}</div>
      <div className={cn("data-num text-xl mt-1", toneCls)}>{value}</div>
      {delta && <div className="label-tac text-muted-foreground mt-0.5">{delta}</div>}
    </div>
  );
}

function Stat({ label, value, sub, align = "left" }: { label: string; value: string; sub?: string; align?: "left" | "right" }) {
  return (
    <div className={cn(align === "right" && "text-right")}>
      <div className="label-tac">{label}</div>
      <div className="data-num text-base text-cyan">{value}</div>
      {sub && <div className="text-[10px] text-muted-foreground">{sub}</div>}
    </div>
  );
}

function MiniChart({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-sm border border-border/70 p-2 bg-surface/40">
      <div className="flex items-center justify-between mb-1">
        <span className="label-tac">{label}</span>
        <span className="data-num text-xs text-foreground">{value}</span>
      </div>
      <LiveSpark color={color} height={36} seed={40} />
    </div>
  );
}

function RiskBar({ label, pct, tone = "cyan" }: { label: string; pct: number; tone?: "cyan" | "signal" | "warn" | "danger" }) {
  const color = { cyan: "var(--cyan)", signal: "var(--signal)", warn: "var(--warn)", danger: "var(--danger)" }[tone];
  return (
    <div className="mb-2">
      <div className="flex justify-between text-[10px] label-tac mb-1">
        <span>{label}</span>
        <span className="data-num text-foreground">{pct.toFixed(0)}%</span>
      </div>
      <div className="h-1.5 rounded-sm bg-surface-3 overflow-hidden relative">
        <div className="absolute inset-y-0 left-0" style={{ width: `${pct}%`, backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
      </div>
    </div>
  );
}

function Alert({ tone, code, msg }: { tone: "warn" | "danger" | "signal"; code: string; msg: string }) {
  return (
    <li className="flex gap-2">
      <span className={cn("mt-1 h-1.5 w-1.5 rounded-full shrink-0",
        tone === "warn" && "bg-warn",
        tone === "danger" && "bg-danger",
        tone === "signal" && "bg-signal")} />
      <div className="flex-1">
        <div className="font-mono text-cyan/80 text-[10px]">{code}</div>
        <div className="text-foreground/90">{msg}</div>
      </div>
    </li>
  );
}
