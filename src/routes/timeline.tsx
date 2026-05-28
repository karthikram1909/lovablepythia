import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/pythia/Panel";
import { LiveSpark } from "@/components/pythia/Spark";
import { useFeed } from "@/components/pythia/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/timeline")({
  head: () => ({ meta: [{ title: "Execution Timeline · PYTHIA" }] }),
  component: Timeline,
});

const STAGES = [
  { id: "SIGNAL", label: "SIGNAL DETECTED", t: "00:00.000" },
  { id: "VALIDATE", label: "VALIDATION", t: "00:00.038" },
  { id: "QUEUE", label: "QUEUE COMMIT", t: "00:00.061" },
  { id: "DISPATCH", label: "DISPATCH → RUNNER", t: "00:00.092" },
  { id: "EXEC", label: "EXECUTION", t: "00:00.124" },
  { id: "ACK", label: "EXCHANGE ACK", t: "00:00.181" },
  { id: "PARITY", label: "PARITY CHECK", t: "00:00.214" },
  { id: "AUDIT", label: "AUDIT TRAIL SEALED", t: "00:00.248" },
];

function Timeline() {
  const feed = useFeed();
  return (
    <div className="grid grid-cols-12 gap-4">
      <Panel title="EXECUTION LIFECYCLE" code="EX-02" status="online" right="LATEST · EXEC-A23F" className="col-span-12">
        <div className="relative py-6">
          <div className="absolute left-4 right-4 top-1/2 h-[2px] bg-border" />
          <div className="absolute left-4 top-1/2 h-[2px] bg-cyan glow-cyan" style={{ width: "76%" }} />
          <div className="relative grid grid-cols-8 gap-2">
            {STAGES.map((s, i) => (
              <div key={s.id} className="flex flex-col items-center text-center gap-2">
                <div className={cn(
                  "h-3.5 w-3.5 rounded-full border-2 z-10",
                  i < 6 ? "bg-cyan border-cyan glow-cyan" : i === 6 ? "bg-cyan/50 border-cyan animate-pulse-dot" : "bg-surface border-border"
                )} />
                <div className="label-tac text-[9px] text-foreground">{s.label}</div>
                <div className="data-num text-[10px] text-muted-foreground">{s.t}</div>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      <Panel title="ACTIVE EXECUTION TRACES" code="EX-LIVE" status="online" className="col-span-12 lg:col-span-7">
        <div className="space-y-3">
          {[
            { id: "EXEC-A23F", sym: "BTC/USDT", side: "LONG", pct: 76, latency: 181 },
            { id: "EXEC-918C", sym: "ETH/USDT", side: "SHORT", pct: 92, latency: 142 },
            { id: "EXEC-77A1", sym: "SOL/USDT", side: "LONG", pct: 38, latency: 88 },
            { id: "EXEC-44D2", sym: "ARB/USDT", side: "LONG", pct: 100, latency: 247 },
            { id: "EXEC-2210", sym: "AVAX/USDT", side: "SHORT", pct: 54, latency: 121 },
          ].map((t) => (
            <div key={t.id} className="border border-border/60 rounded-sm p-2 bg-surface/40">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-cyan">{t.id}</span>
                  <span className="font-mono">{t.sym}</span>
                  <span className={cn("label-tac text-[9px] px-1.5 py-0.5 rounded-sm",
                    t.side === "LONG" ? "bg-signal/15 text-signal" : "bg-danger/15 text-danger")}>{t.side}</span>
                </div>
                <span className="data-num text-muted-foreground">{t.latency}ms</span>
              </div>
              <div className="mt-2 h-1.5 bg-surface-3 rounded-sm overflow-hidden relative">
                <div className="absolute inset-y-0 left-0 bg-cyan glow-cyan" style={{ width: `${t.pct}%` }} />
                {t.pct < 100 && <div className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-cyan-glow to-transparent animate-flow-x" />}
              </div>
              <div className="mt-1.5 flex justify-between text-[9px] label-tac text-muted-foreground">
                <span>SIGNAL</span><span>VALIDATE</span><span>DISPATCH</span><span>EXEC</span><span>ACK</span><span>SEAL</span>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="LATENCY BREAKDOWN" code="LAT" status="online" className="col-span-12 lg:col-span-5">
        {[
          { l: "Signal → Validate", v: 38, color: "var(--cyan)" },
          { l: "Validate → Queue", v: 23, color: "var(--cyan)" },
          { l: "Queue → Dispatch", v: 31, color: "var(--teal)" },
          { l: "Dispatch → Exec", v: 32, color: "var(--teal)" },
          { l: "Exec → Ack", v: 57, color: "var(--signal)" },
          { l: "Ack → Parity", v: 33, color: "var(--signal)" },
          { l: "Parity → Audit Seal", v: 34, color: "var(--cyan)" },
        ].map((row) => (
          <div key={row.l} className="mb-2">
            <div className="flex justify-between text-[11px]">
              <span className="text-muted-foreground">{row.l}</span>
              <span className="data-num">{row.v}ms</span>
            </div>
            <div className="h-1 bg-surface-3 rounded-sm overflow-hidden">
              <div className="h-full" style={{ width: `${(row.v / 60) * 100}%`, backgroundColor: row.color }} />
            </div>
          </div>
        ))}
        <div className="mt-3 label-tac">END-TO-END</div>
        <LiveSpark color="var(--cyan)" height={48} />
      </Panel>

      <Panel title="EXECUTION STREAM" code="STREAM" status="online" className="col-span-12">
        <ul className="space-y-1 max-h-[200px] overflow-y-auto">
          {feed.map((e, i) => (
            <li key={i} className="grid grid-cols-[60px_60px_90px_1fr] gap-2 text-[11px] py-1 border-b border-border/30">
              <span className="font-mono text-muted-foreground">{e.ts}</span>
              <span className={cn("label-tac",
                e.level === "OK" && "text-signal", e.level === "AI" && "text-cyan",
                e.level === "WARN" && "text-warn", e.level === "CRIT" && "text-danger")}>{e.level}</span>
              <span className="font-mono text-cyan/70">{e.code}</span>
              <span>{e.msg}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
