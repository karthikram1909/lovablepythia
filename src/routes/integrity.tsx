import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/pythia/Panel";
import { LiveSpark } from "@/components/pythia/Spark";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/integrity")({
  head: () => ({ meta: [{ title: "System Integrity · PYTHIA" }] }),
  component: Integrity,
});

function Integrity() {
  return (
    <div className="grid grid-cols-12 gap-4">
      <Panel title="SUBSYSTEM HEALTH" code="SI-07" status="online" className="col-span-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            ["EXECUTION ENGINE", "NOMINAL", "signal"],
            ["RUNNER MESH", "NOMINAL", "signal"],
            ["AI INFERENCE", "NOMINAL", "signal"],
            ["EXCHANGE BRIDGE", "THROTTLED", "warn"],
            ["AUDIT LEDGER", "NOMINAL", "signal"],
            ["RECOVERY DAEMON", "NOMINAL", "signal"],
            ["SCANNER FABRIC", "NOMINAL", "signal"],
            ["RISK ENGINE", "NOMINAL", "signal"],
            ["PARITY WORKER", "RUNNING", "cyan"],
            ["RATE LIMITER", "ACTIVE", "cyan"],
            ["STATE STORE", "NOMINAL", "signal"],
            ["TIME SYNC", "Δ4ms", "signal"],
          ].map(([l, v, t]) => (
            <div key={l} className="border border-border/60 rounded-sm p-2 bg-surface/40">
              <div className="label-tac">{l}</div>
              <div className={cn("data-num text-sm mt-1",
                t === "signal" && "text-signal", t === "warn" && "text-warn", t === "cyan" && "text-cyan")}>{v}</div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="QUEUE DELAY · ROLLING" code="SI-Q" status="online" className="col-span-12 lg:col-span-6">
        <LiveSpark color="var(--cyan)" height={120} />
        <div className="grid grid-cols-3 mt-2 text-[11px]">
          <div><div className="label-tac">p50</div><div className="data-num text-cyan">38ms</div></div>
          <div><div className="label-tac">p95</div><div className="data-num text-cyan">112ms</div></div>
          <div><div className="label-tac">p99</div><div className="data-num text-warn">214ms</div></div>
        </div>
      </Panel>

      <Panel title="RATE-LIMIT BACKOFF" code="SI-RL" status="warn" className="col-span-12 lg:col-span-6">
        <ul className="space-y-2 text-[11px]">
          {[
            { ex: "gate.io", op: "spot/order", until: "1.2s", note: "Execution throughput temporarily throttled" },
            { ex: "binance", op: "futures/klines", until: "0.4s", note: "Telemetry refresh paced" },
            { ex: "okx", op: "ws/private", until: "—", note: "Backoff cleared 2.4s ago" },
          ].map((r, i) => (
            <li key={i} className="flex items-start gap-3 border-b border-border/30 pb-2 last:border-0">
              <span className={cn("mt-1 h-1.5 w-1.5 rounded-full", r.until === "—" ? "bg-signal" : "bg-warn")} />
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="font-mono"><span className="text-cyan">{r.ex}</span> · {r.op}</span>
                  <span className="data-num text-warn">{r.until}</span>
                </div>
                <div className="text-muted-foreground">{r.note}</div>
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="STALE EXECUTION CLEANUP" code="SI-CLN" status="online" className="col-span-12 lg:col-span-6">
        {[
          ["Stale orders detected · 24h", "12"],
          ["Auto-cleared", "11"],
          ["Manually reviewed", "1"],
          ["Mean cleanup time", "1.4s"],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between py-1.5 border-b border-border/30 last:border-0 text-[11px]">
            <span className="text-muted-foreground">{k}</span>
            <span className="data-num text-cyan">{v}</span>
          </div>
        ))}
      </Panel>

      <Panel title="API STABILITY · 1H" code="SI-API" status="online" className="col-span-12 lg:col-span-6">
        <div className="grid grid-cols-12 gap-1">
          {Array.from({ length: 60 }).map((_, i) => (
            <div key={i} className={cn("h-8 rounded-sm",
              i % 17 === 0 ? "bg-warn/60" : i % 23 === 0 ? "bg-danger/50" : "bg-signal/50")} />
          ))}
        </div>
        <div className="mt-2 flex justify-between label-tac text-[10px] text-muted-foreground">
          <span>-60m</span><span>-30m</span><span>NOW</span>
        </div>
      </Panel>
    </div>
  );
}
