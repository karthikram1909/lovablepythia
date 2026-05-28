import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/pythia/Panel";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/recovery")({
  head: () => ({ meta: [{ title: "Recovery & Reconciliation · PYTHIA" }] }),
  component: Recovery,
});

const LOCKS = [
  { id: "ETH-77A1", reason: "State drift · qty mismatch", age: "0:42", state: "RESOLVED" },
  { id: "ARB-91FF", reason: "Unacknowledged close", age: "1:18", state: "RESOLVED" },
  { id: "BTC-2210", reason: "Partial fill · pending parity", age: "0:08", state: "ACTIVE" },
  { id: "SOL-44D2", reason: "Exchange ack timeout", age: "0:21", state: "ACTIVE" },
  { id: "AVAX-1290", reason: "Stale order cleanup", age: "2:01", state: "RESOLVED" },
];

function Recovery() {
  return (
    <div className="grid grid-cols-12 gap-4">
      <Panel title="RECOVERY DAEMON STATUS" code="RC-10" status="online" glow className="col-span-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[["DAEMON UPTIME","14d 06:42","cyan"],["LOCKS ACTIVE","2","warn"],["AUTO-RESOLVED · 24H","48","signal"],["MANUAL · 24H","1","cyan"]].map(([l,v,t]) => (
            <div key={l}><div className="label-tac">{l}</div>
              <div className={cn("data-num text-2xl mt-1", t==="signal" && "text-signal", t==="warn" && "text-warn", t==="cyan" && "text-cyan")}>{v}</div></div>
          ))}
        </div>
      </Panel>

      <Panel title="ACTIVE & RECENT RECOVERY LOCKS" code="RC-LOCK" status="warn" className="col-span-12 lg:col-span-7">
        <ul className="space-y-2">
          {LOCKS.map((l) => (
            <li key={l.id} className="border border-border/60 rounded-sm p-2 bg-surface/40 flex items-center gap-3 text-[11px]">
              <span className={cn("h-1.5 w-1.5 rounded-full", l.state === "ACTIVE" ? "bg-warn animate-pulse-dot" : "bg-signal")} />
              <span className="font-mono text-cyan w-28">recovery_lock_{l.id}</span>
              <span className="flex-1 text-foreground/90">{l.reason}</span>
              <span className="data-num text-muted-foreground">{l.age}</span>
              <span className={cn("label-tac", l.state === "ACTIVE" ? "text-warn" : "text-signal")}>{l.state}</span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="STATE RECONCILIATION" code="RC-REC" status="online" className="col-span-12 lg:col-span-5">
        {[["Local positions","12"],["Remote positions","12"],["Local orders","18"],["Remote orders","18"],["Drift detected","0"],["Last parity test","12s ago"],["Parity hash","8a4f…1c20"],["Mean reconcile","184ms"]].map(([k,v]) => (
          <div key={k} className="flex justify-between py-1 text-[11px] border-b border-border/30 last:border-0">
            <span className="text-muted-foreground">{k}</span><span className="data-num text-cyan">{v}</span>
          </div>
        ))}
      </Panel>
    </div>
  );
}
