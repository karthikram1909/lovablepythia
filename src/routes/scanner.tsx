import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/pythia/Panel";
import { LiveSpark } from "@/components/pythia/Spark";
import { SYMBOL_LIST } from "@/components/pythia/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/scanner")({
  head: () => ({ meta: [{ title: "Strategy Scanner · PYTHIA" }] }),
  component: Scanner,
});

const STRATS = ["MOMENTUM_X", "MEAN_REVERT", "BREAKOUT_VOL", "LIQ_HUNT", "CARRY_FUND", "ARB_TRI", "REGIME_FLIP"];

function Scanner() {
  return (
    <div className="grid grid-cols-12 gap-4">
      <Panel title="MULTI-STRATEGY SCANNER" code="SC-09" status="online" right={`${STRATS.length} STRATEGIES · ${SYMBOL_LIST.length} SYMBOLS`} className="col-span-12">
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="label-tac text-muted-foreground border-b border-border">
                <th className="text-left py-2 pr-3">SYMBOL</th>
                {STRATS.map(s => <th key={s} className="px-2 text-center font-normal">{s}</th>)}
                <th className="text-right pl-2">CONFLUENCE</th>
              </tr>
            </thead>
            <tbody>
              {SYMBOL_LIST.map((sym, i) => {
                const cells = STRATS.map((_, j) => +(Math.sin(i * 3 + j * 7) * 0.5 + 0.4).toFixed(2));
                const conf = +(cells.reduce((a, b) => a + Math.max(0, b), 0) / cells.length).toFixed(2);
                return (
                  <tr key={sym} className="border-b border-border/30">
                    <td className="py-1.5 pr-3 font-mono">{sym}</td>
                    {cells.map((v, k) => (
                      <td key={k} className="px-1 text-center">
                        <div className="mx-auto h-6 w-12 rounded-sm flex items-center justify-center data-num text-[10px]"
                          style={{
                            backgroundColor: v > 0.5 ? `oklch(0.78 0.18 145 / ${v})` : v > 0.2 ? `oklch(0.82 0.16 200 / ${v})` : "oklch(0.30 0.02 235 / 0.4)",
                            color: v > 0.4 ? "oklch(0.16 0.02 240)" : "oklch(0.86 0.01 220)",
                          }}>
                          {v.toFixed(2)}
                        </div>
                      </td>
                    ))}
                    <td className="text-right pl-2">
                      <span className={cn("data-num", conf > 0.5 ? "text-signal" : conf > 0.3 ? "text-cyan" : "text-muted-foreground")}>
                        {(conf * 100).toFixed(0)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="SCAN THROUGHPUT" code="SC-T" status="online" className="col-span-12 lg:col-span-8">
        <LiveSpark color="var(--cyan)" height={120} />
      </Panel>
      <Panel title="SCAN STATS" code="SC-S" status="online" className="col-span-12 lg:col-span-4">
        {[["Symbols watched","48"],["Streams/s","184"],["Triggers · 1h","27"],["Validated","19"],["Executed","11"],["AI veto","8"]].map(([k,v]) => (
          <div key={k} className="flex justify-between py-1.5 border-b border-border/30 last:border-0 text-[11px]">
            <span className="text-muted-foreground">{k}</span><span className="data-num text-cyan">{v}</span>
          </div>
        ))}
      </Panel>
    </div>
  );
}
