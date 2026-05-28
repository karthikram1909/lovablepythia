import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/pythia/Panel";
import { useRunners } from "@/components/pythia/data";
import { LiveSpark } from "@/components/pythia/Spark";
import { cn } from "@/lib/utils";
import { Activity, Shield, Wifi } from "lucide-react";

export const Route = createFileRoute("/runners")({
  head: () => ({ meta: [{ title: "Runner Network · PYTHIA" }, { name: "description", content: "Distributed autonomous execution runners." }] }),
  component: RunnerNetwork,
});

function RunnerNetwork() {
  const runners = useRunners();
  return (
    <div className="grid grid-cols-12 gap-4">
      <Panel title="GLOBAL RUNNER MESH" code="RN-01" status="online" right="DISTRIBUTED EXECUTION FABRIC" className="col-span-12 lg:col-span-8">
        <div className="relative aspect-[16/9] rounded-sm overflow-hidden bg-surface/60 border border-border">
          <Mesh runners={runners} />
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2 text-[10px] label-tac">
          <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse-dot" /> ACTIVE NODES</span>
          <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-warn" /> BACKOFF</span>
          <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" /> STANDBY</span>
          <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-cyan" /> COMMAND TRANSFER</span>
        </div>
      </Panel>

      <Panel title="MESH STATS" code="RN-STATS" status="online" className="col-span-12 lg:col-span-4">
        {[
          { l: "Active runners", v: `${runners.filter(r => r.status === "ACTIVE").length}/${runners.length}` },
          { l: "Mean latency", v: `${Math.round(runners.reduce((a, r) => a + r.latency, 0) / runners.length)}ms` },
          { l: "p99 latency", v: `${Math.max(...runners.map(r => r.latency))}ms` },
          { l: "Total load", v: `${Math.round(runners.reduce((a, r) => a + r.load, 0) / runners.length)}%` },
          { l: "Synchronization", v: "OK · Δ4ms" },
          { l: "IP verification", v: `${runners.filter(r => r.ipVerified).length}/${runners.length}` },
        ].map((s) => (
          <div key={s.l} className="flex justify-between py-1.5 border-b border-border/40 last:border-0 text-[12px]">
            <span className="text-muted-foreground">{s.l}</span>
            <span className="data-num text-cyan">{s.v}</span>
          </div>
        ))}
        <div className="mt-3">
          <div className="label-tac mb-1">COMMAND TRANSFER · 60s</div>
          <LiveSpark color="var(--cyan)" height={48} />
        </div>
      </Panel>

      <Panel title="RUNNER REGISTRY" code="RN-REG" status="online" className="col-span-12">
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead className="label-tac text-muted-foreground">
              <tr className="border-b border-border">
                {["ID", "REGION", "IP", "STATUS", "LATENCY", "LOAD", "HEARTBEAT", "IP VERIFY", "BACKOFF"].map(h => (
                  <th key={h} className="py-2 text-left font-normal px-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {runners.map((r) => (
                <tr key={r.id} className="border-b border-border/30 hover:bg-surface/40">
                  <td className="py-2 px-2 font-mono text-cyan">{r.id}</td>
                  <td className="py-2 px-2 font-mono">{r.region}</td>
                  <td className="py-2 px-2 font-mono text-muted-foreground">{r.ip}</td>
                  <td className="py-2 px-2">
                    <span className={cn("px-1.5 py-0.5 rounded-sm label-tac text-[9px] border",
                      r.status === "ACTIVE" && "border-signal/40 text-signal",
                      r.status === "BACKOFF" && "border-warn/40 text-warn",
                      r.status === "STANDBY" && "border-border text-muted-foreground",
                      r.status === "RECONNECT" && "border-cyan/40 text-cyan",
                    )}>{r.status}</span>
                  </td>
                  <td className="py-2 px-2 data-num">{r.latency}ms</td>
                  <td className="py-2 px-2">
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-20 bg-surface-3 rounded-sm overflow-hidden">
                        <div className="h-full bg-cyan/80" style={{ width: `${r.load}%` }} />
                      </div>
                      <span className="data-num text-muted-foreground">{r.load}%</span>
                    </div>
                  </td>
                  <td className="py-2 px-2">
                    <Heartbeat />
                  </td>
                  <td className="py-2 px-2">
                    {r.ipVerified ? <span className="text-signal flex items-center gap-1"><Shield className="h-3 w-3" />VERIFIED</span> : <span className="text-warn">PENDING</span>}
                  </td>
                  <td className="py-2 px-2 data-num text-muted-foreground">{r.status === "BACKOFF" ? "1.2s" : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function Heartbeat() {
  return (
    <div className="flex items-end gap-[2px] h-4">
      {[20, 90, 30, 70, 40, 80, 25, 60, 35].map((v, i) => (
        <div key={i} className="w-[2px] bg-cyan animate-tick" style={{ height: `${v}%`, animationDelay: `${i * 80}ms` }} />
      ))}
    </div>
  );
}

function Mesh({ runners }: { runners: ReturnType<typeof useRunners> }) {
  const positions = [
    { x: 18, y: 38 }, { x: 32, y: 30 }, { x: 78, y: 42 }, { x: 48, y: 28 },
    { x: 86, y: 60 }, { x: 22, y: 70 }, { x: 56, y: 64 }, { x: 70, y: 22 },
  ];
  return (
    <svg viewBox="0 0 100 60" className="absolute inset-0 w-full h-full">
      {/* grid */}
      <defs>
        <pattern id="meshgrid" width="5" height="5" patternUnits="userSpaceOnUse">
          <path d="M 5 0 L 0 0 0 5" fill="none" stroke="oklch(0.30 0.03 235 / 0.4)" strokeWidth="0.1" />
        </pattern>
      </defs>
      <rect width="100" height="60" fill="url(#meshgrid)" />
      {/* connections */}
      {positions.flatMap((a, i) =>
        positions.slice(i + 1).map((b, j) => (
          <line key={`${i}-${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke="oklch(0.78 0.16 200 / 0.15)" strokeWidth="0.15" strokeDasharray="0.5 0.5" />
        )),
      )}
      {/* animated transfer line */}
      <line x1={positions[0].x} y1={positions[0].y} x2={positions[3].x} y2={positions[3].y}
            stroke="var(--cyan)" strokeWidth="0.3" strokeDasharray="1 1.5">
        <animate attributeName="stroke-dashoffset" from="0" to="-10" dur="1.5s" repeatCount="indefinite" />
      </line>
      <line x1={positions[3].x} y1={positions[3].y} x2={positions[6].x} y2={positions[6].y}
            stroke="var(--cyan)" strokeWidth="0.3" strokeDasharray="1 1.5">
        <animate attributeName="stroke-dashoffset" from="0" to="-10" dur="2s" repeatCount="indefinite" />
      </line>
      {/* nodes */}
      {positions.map((p, i) => {
        const r = runners[i];
        if (!r) return null;
        const color = r.status === "ACTIVE" ? "var(--signal)" : r.status === "BACKOFF" ? "var(--warn)" : "var(--muted-foreground)";
        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="2.4" fill="none" stroke={color} strokeOpacity="0.5">
              <animate attributeName="r" from="2.4" to="4" dur="2s" repeatCount="indefinite" />
              <animate attributeName="stroke-opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx={p.x} cy={p.y} r="1.2" fill={color} />
            <text x={p.x + 2} y={p.y - 1.6} fontSize="1.4" fill="oklch(0.86 0.01 220)" fontFamily="monospace">{r.region}</text>
            <text x={p.x + 2} y={p.y + 2.2} fontSize="1.2" fill="oklch(0.66 0.02 230)" fontFamily="monospace">{r.latency}ms</text>
          </g>
        );
      })}
    </svg>
  );
}
