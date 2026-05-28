import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/pythia/Panel";
import { usePositions } from "@/components/pythia/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/positions")({
  head: () => ({ meta: [{ title: "Positions · PYTHIA" }] }),
  component: Positions,
});

function Positions() {
  const positions = usePositions();
  const total = positions.reduce((a,p) => a + p.pnl, 0);
  return (
    <div className="grid grid-cols-12 gap-4">
      <Panel title="POSITION COMMAND" code="PS-13" status="online" right={`${positions.length} OPEN`} className="col-span-12">
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="label-tac text-muted-foreground border-b border-border">
                {["EXEC ID","SYMBOL","SIDE","SIZE","ENTRY","SL","TP","LADDER","CONF","AGE","P&L","P&L %",""].map(h => (
                  <th key={h} className="text-left py-2 px-2 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {positions.map(p => (
                <tr key={p.id} className="border-b border-border/30 hover:bg-surface/40">
                  <td className="py-2 px-2 font-mono text-cyan">{p.id}</td>
                  <td className="py-2 px-2 font-mono">{p.symbol}</td>
                  <td className="py-2 px-2"><span className={cn("px-1.5 py-0.5 rounded-sm label-tac text-[9px]",
                    p.side==="LONG"?"bg-signal/15 text-signal":"bg-danger/15 text-danger")}>{p.side}</span></td>
                  <td className="py-2 px-2 data-num">{p.size}</td>
                  <td className="py-2 px-2 data-num">{p.entry}</td>
                  <td className="py-2 px-2 data-num text-danger/90">{p.sl}</td>
                  <td className="py-2 px-2 data-num text-signal/90">{p.tp}</td>
                  <td className="py-2 px-2 data-num">{p.ladder}/5</td>
                  <td className="py-2 px-2 data-num text-cyan">{(p.conf*100).toFixed(0)}%</td>
                  <td className="py-2 px-2 data-num text-muted-foreground">{p.age}</td>
                  <td className={cn("py-2 px-2 data-num", p.pnl>=0?"text-signal":"text-danger")}>{p.pnl>=0?"+":""}${p.pnl.toFixed(2)}</td>
                  <td className={cn("py-2 px-2 data-num", p.pnlPct>=0?"text-signal":"text-danger")}>{p.pnlPct>=0?"+":""}{p.pnlPct.toFixed(2)}%</td>
                  <td className="py-2 px-2"><button className="label-tac text-[9px] px-2 py-0.5 border border-cyan/40 text-cyan rounded-sm hover:bg-cyan/10">CLOSE</button></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-border/60">
                <td colSpan={10} className="py-2 px-2 text-right label-tac">AGGREGATE</td>
                <td className={cn("py-2 px-2 data-num", total>=0?"text-signal":"text-danger")}>{total>=0?"+":""}${total.toFixed(2)}</td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Panel>
    </div>
  );
}
