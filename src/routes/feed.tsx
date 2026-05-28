import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/pythia/Panel";
import { useFeed } from "@/components/pythia/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/feed")({
  head: () => ({ meta: [{ title: "Tactical Event Feed · PYTHIA" }] }),
  component: Feed,
});

function Feed() {
  const feed = useFeed();
  const counts = { OK: 0, AI: 0, INFO: 0, WARN: 0, CRIT: 0 } as Record<string, number>;
  feed.forEach(e => counts[e.level]++);
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 grid grid-cols-5 gap-3">
        {(["OK","AI","INFO","WARN","CRIT"] as const).map(l => (
          <div key={l} className="panel corner-frame px-3 py-2">
            <div className="label-tac">{l}</div>
            <div className={cn("data-num text-2xl mt-1",
              l==="OK"&&"text-signal", l==="AI"&&"text-cyan", l==="INFO"&&"text-foreground",
              l==="WARN"&&"text-warn", l==="CRIT"&&"text-danger")}>{counts[l]}</div>
          </div>
        ))}
      </div>

      <Panel title="LIVE TACTICAL FEED" code="TE-11" status="online" right="STREAM · UNFILTERED" className="col-span-12">
        <ul className="space-y-1 max-h-[640px] overflow-y-auto pr-2">
          {feed.map((e, i) => (
            <li key={i} className="grid grid-cols-[80px_60px_120px_1fr] gap-3 text-[11px] py-1.5 border-b border-border/30">
              <span className="font-mono text-muted-foreground">{e.ts}</span>
              <span className={cn("label-tac",
                e.level === "OK" && "text-signal", e.level === "AI" && "text-cyan",
                e.level === "WARN" && "text-warn", e.level === "CRIT" && "text-danger",
                e.level === "INFO" && "text-muted-foreground")}>{e.level}</span>
              <span className="font-mono text-cyan/70">{e.code}</span>
              <span>{e.msg}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
