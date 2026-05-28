import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/pythia/Panel";
import { useQueue } from "@/components/pythia/data";
import { LiveSpark } from "@/components/pythia/Spark";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/queue")({
  head: () => ({ meta: [{ title: "Execution Queue · PYTHIA" }] }),
  component: Queue,
});

const STAGES = ["QUEUED", "VALIDATING", "DISPATCHED", "EXECUTING", "ACK", "PARITY"] as const;

function Queue() {
  const q = useQueue();
  return (
    <div className="grid grid-cols-12 gap-4">
      <Panel title="EXECUTIONCOMMAND PIPELINE" code="EQ-12" status="online" className="col-span-12">
        <div className="grid grid-cols-6 gap-3">
          {STAGES.map(s => {
            const items = q.filter(x => x.state === s);
            return (
              <div key={s} className="border border-border/60 rounded-sm bg-surface/40 p-2 min-h-[180px]">
                <div className="flex justify-between items-center mb-2">
                  <span className="label-tac text-cyan">{s}</span>
                  <span className="data-num text-[10px] text-muted-foreground">{items.length}</span>
                </div>
                <ul className="space-y-1">
                  {items.map(it => (
                    <li key={it.id} className="border border-border/40 rounded-sm p-1.5 text-[10px] bg-surface">
                      <div className="font-mono text-cyan/80 truncate">{it.id}</div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>{it.cmd}</span>
                        <span className="data-num">{it.age}ms</span>
                      </div>
                      <div className="font-mono text-foreground">{it.symbol}</div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel title="QUEUE THROUGHPUT" code="EQ-T" status="online" className="col-span-12 lg:col-span-8">
        <LiveSpark color="var(--cyan)" height={120} />
      </Panel>
      <Panel title="QUEUE STATS" code="EQ-S" status="online" className="col-span-12 lg:col-span-4">
        {[["In flight","14"],["Cmds/s","42"],["Mean lifetime","184ms"],["Retries · 1h","3"],["Failed · 1h","0"],["Backpressure","NONE"]].map(([k,v]) => (
          <div key={k} className="flex justify-between py-1.5 border-b border-border/30 last:border-0 text-[11px]">
            <span className="text-muted-foreground">{k}</span><span className="data-num text-cyan">{v}</span>
          </div>
        ))}
      </Panel>
    </div>
  );
}
