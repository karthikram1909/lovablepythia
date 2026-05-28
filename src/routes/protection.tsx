import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/pythia/Panel";
import { usePositions } from "@/components/pythia/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/protection")({
  head: () => ({ meta: [{ title: "Dynamic Protection · PYTHIA" }] }),
  component: Protection,
});

function Protection() {
  const positions = usePositions();
  return (
    <div className="grid grid-cols-12 gap-4">
      <Panel title="DYNAMIC PROTECTION ENGINE" code="DP-06" status="online" glow className="col-span-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { l: "ACTIVE PROTECTIONS", v: "182", t: "cyan" },
            { l: "SL ADVANCES · 24H", v: "1,418", t: "signal" },
            { l: "TP EXTENSIONS · 24H", v: "247", t: "cyan" },
            { l: "ENGINE TICK", v: "200ms", t: "cyan" },
          ].map(s => (
            <div key={s.l}>
              <div className="label-tac">{s.l}</div>
              <div className={cn("data-num text-2xl mt-1", s.t === "signal" ? "text-signal" : "text-cyan")}>{s.v}</div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="DYNAMIC SL LADDER" code="DP-SL" status="online" className="col-span-12">
        <div className="space-y-3">
          {positions.map(p => (
            <div key={p.id} className="border border-border/60 rounded-sm p-3 bg-surface/40">
              <div className="flex items-center gap-3 text-[11px] mb-2">
                <span className={cn("px-1.5 py-0.5 rounded-sm label-tac text-[9px]",
                  p.side === "LONG" ? "bg-signal/15 text-signal" : "bg-danger/15 text-danger")}>{p.side}</span>
                <span className="font-mono">{p.symbol}</span>
                <span className="font-mono text-cyan/80">{p.id}</span>
                <span className="ml-auto data-num text-muted-foreground">entry {p.entry}</span>
              </div>
              {/* visual ladder */}
              <div className="relative h-12 rounded-sm bg-surface-3 overflow-hidden">
                {/* zone */}
                <div className="absolute inset-y-2 left-[5%] right-[5%] border-y border-cyan/30" />
                {/* entry */}
                <span className="absolute top-1/2 -translate-y-1/2 h-7 w-[2px] bg-foreground" style={{ left: "50%" }} />
                {/* original SL */}
                <span className="absolute top-1/2 -translate-y-1/2 h-5 w-[2px] bg-danger/50" style={{ left: p.side === "LONG" ? "20%" : "80%" }} />
                {/* current SL (advanced) */}
                <span className="absolute top-1/2 -translate-y-1/2 h-7 w-[2px] bg-signal glow-signal animate-pulse-dot" style={{ left: p.side === "LONG" ? "42%" : "58%" }} />
                {/* TP */}
                <span className="absolute top-1/2 -translate-y-1/2 h-5 w-[2px] bg-cyan/70" style={{ left: p.side === "LONG" ? "82%" : "18%" }} />
                {/* trail flow */}
                <div className="absolute inset-y-5 left-[20%] right-[58%] bg-gradient-to-r from-danger/30 via-cyan/30 to-signal/30 rounded-full opacity-60" />
              </div>
              <div className="mt-2 grid grid-cols-5 text-[10px] label-tac text-muted-foreground">
                <span>SL₀ {p.sl}</span>
                <span className="text-signal">SL+ moved {p.ladder}×</span>
                <span>ENTRY {p.entry}</span>
                <span>TP {p.tp}</span>
                <span className="text-right text-cyan">PROTECTED +{(p.ladder * 0.42).toFixed(2)}%</span>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
