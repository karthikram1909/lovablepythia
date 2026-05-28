import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/pythia/Panel";
import { LiveSpark } from "@/components/pythia/Spark";
import { cn } from "@/lib/utils";
import { Wifi } from "lucide-react";

export const Route = createFileRoute("/exchanges")({
  head: () => ({ meta: [{ title: "Exchange Connectivity · PYTHIA" }] }),
  component: Exchanges,
});

const EXCHANGES = [
  { name: "GATE.IO", ws: "OK", rest: "OK", lat: 38, drift: 4, balance: 482109.4, account: "ACC-OPS-01", status: "ACTIVE" },
  { name: "BINANCE", ws: "OK", rest: "OK", lat: 24, drift: 2, balance: 318204.1, account: "ACC-OPS-02", status: "ACTIVE" },
  { name: "OKX", ws: "OK", rest: "OK", lat: 71, drift: 8, balance: 92410.2, account: "ACC-OPS-03", status: "ACTIVE" },
  { name: "BYBIT", ws: "DEGRADED", rest: "OK", lat: 142, drift: 18, balance: 42180.3, account: "ACC-OPS-04", status: "DEGRADED" },
  { name: "KRAKEN", ws: "OK", rest: "OK", lat: 88, drift: 6, balance: 28012.8, account: "ACC-OPS-05", status: "STANDBY" },
];

function Exchanges() {
  return (
    <div className="grid grid-cols-12 gap-4">
      {EXCHANGES.map(x => (
        <Panel key={x.name} title={x.name} code="XC-08" status={x.status === "DEGRADED" ? "warn" : "online"} className="col-span-12 md:col-span-6 lg:col-span-4">
          <div className="flex items-center justify-between mb-2">
            <span className="label-tac text-cyan">{x.account}</span>
            <span className={cn("label-tac", x.status === "ACTIVE" ? "text-signal" : x.status === "DEGRADED" ? "text-warn" : "text-muted-foreground")}>{x.status}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] mb-2">
            <Cell l="WS" v={x.ws} good={x.ws === "OK"} />
            <Cell l="REST" v={x.rest} good={x.rest === "OK"} />
            <Cell l="LATENCY" v={`${x.lat}ms`} good={x.lat < 100} />
            <Cell l="CLOCK Δ" v={`${x.drift}ms`} good={x.drift < 10} />
          </div>
          <LiveSpark color={x.status === "DEGRADED" ? "var(--warn)" : "var(--cyan)"} height={36} />
          <div className="mt-2 flex justify-between text-[11px]">
            <span className="label-tac">BALANCE (USD)</span>
            <span className="data-num text-foreground">${x.balance.toLocaleString()}</span>
          </div>
        </Panel>
      ))}

      <Panel title="GATE.IO · STATE SYNCHRONIZATION" code="XC-SYNC" status="online" className="col-span-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ["LOCAL POSITIONS", "12"], ["REMOTE POSITIONS", "12"],
            ["DRIFT EVENTS · 24H", "0"], ["LAST PARITY", "12s ago"],
            ["RECONCILE LATENCY", "184ms"], ["AUDIT HASH", "8a4f…1c20"],
            ["WS UPTIME", "99.98%"], ["RECONNECTS · 24H", "2"],
          ].map(([k, v]) => (
            <div key={k}>
              <div className="label-tac">{k}</div>
              <div className="data-num text-cyan text-base mt-0.5">{v}</div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function Cell({ l, v, good }: { l: string; v: string; good: boolean }) {
  return (
    <div className="border border-border/40 rounded-sm px-2 py-1">
      <div className="label-tac">{l}</div>
      <div className={cn("data-num", good ? "text-signal" : "text-warn")}>{v}</div>
    </div>
  );
}
