import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity, Radar, Network, Brain, ShieldAlert, ShieldCheck,
  Wifi, Crosshair, LifeBuoy, Radio, ListOrdered, Briefcase,
  Waves, Cpu, History, Power, Bell,
} from "lucide-react";
import { useNow } from "./hooks";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const nav = [
  { to: "/", label: "Mission Control", code: "MC-00", icon: Cpu },
  { to: "/runners", label: "Runner Network", code: "RN-01", icon: Network },
  { to: "/timeline", label: "Execution Timeline", code: "EX-02", icon: Activity },
  { to: "/forensics", label: "Trade Forensics", code: "TF-03", icon: History },
  { to: "/intelligence", label: "AI Intelligence", code: "AI-04", icon: Brain },
  { to: "/risk", label: "Risk Matrix", code: "RM-05", icon: ShieldAlert },
  { to: "/protection", label: "Dynamic Protection", code: "DP-06", icon: ShieldCheck },
  { to: "/integrity", label: "System Integrity", code: "SI-07", icon: LifeBuoy },
  { to: "/exchanges", label: "Exchange Conn.", code: "XC-08", icon: Wifi },
  { to: "/scanner", label: "Strategy Scanner", code: "SC-09", icon: Radar },
  { to: "/recovery", label: "Recovery Center", code: "RC-10", icon: Radio },
  { to: "/feed", label: "Tactical Feed", code: "TE-11", icon: Bell },
  { to: "/queue", label: "Execution Queue", code: "EQ-12", icon: ListOrdered },
  { to: "/positions", label: "Positions", code: "PS-13", icon: Briefcase },
  { to: "/regime", label: "Market Regime", code: "MR-14", icon: Waves },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const now = useNow(1000);

  return (
    <div className="min-h-screen flex w-full text-foreground">
      {/* SIDEBAR */}
      <aside className="w-60 shrink-0 border-r border-border bg-sidebar/80 backdrop-blur-sm flex flex-col">
        <div className="px-4 pt-5 pb-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8">
              <div className="absolute inset-0 rounded-sm border border-cyan/60 animate-ring-slow" />
              <div className="absolute inset-1 rounded-sm border border-cyan/40 animate-ring-rev" />
              <div className="absolute inset-2.5 rounded-sm bg-cyan glow-cyan" />
            </div>
            <div className="leading-tight">
              <div className="font-display text-base font-bold tracking-wider">PYTHIA</div>
              <div className="label-tac text-[9px] text-cyan">AUTONOMOUS OS · v3.14</div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-1 text-[9px] label-tac">
            <div className="flex flex-col items-start">
              <span className="text-muted-foreground">CORE</span>
              <span className="text-signal">ONLINE</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-muted-foreground">AI</span>
              <span className="text-cyan">ACTIVE</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-muted-foreground">MODE</span>
              <span className="text-warn">LIVE</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
          {nav.map((item) => {
            const active = path === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "group flex items-center gap-2.5 px-2.5 py-1.5 rounded-sm text-[12px] transition-colors relative",
                  active
                    ? "bg-cyan/10 text-cyan"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-foreground",
                )}
              >
                {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-cyan glow-cyan" />}
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="flex-1 truncate">{item.label}</span>
                <span className="label-tac text-[9px] opacity-60">{item.code}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border space-y-2">
          <button className="w-full group flex items-center justify-between gap-2 px-2.5 py-2 rounded-sm border border-danger/40 bg-danger/5 hover:bg-danger/15 transition">
            <span className="flex items-center gap-2">
              <Power className="h-3.5 w-3.5 text-danger" />
              <span className="label-tac text-danger">KILL SWITCH</span>
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-danger animate-pulse-dot" />
          </button>
          <div className="label-tac text-[9px] text-muted-foreground flex justify-between">
            <span>OPERATOR</span>
            <span className="text-foreground/80">CMDR-01</span>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col min-w-0">
        <TopBar now={now} />
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </main>
    </div>
  );
}

function TopBar({ now }: { now: Date }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const current = nav.find((n) => n.to === path) ?? nav[0];
  const utc = now.toISOString().replace("T", " · ").slice(0, 19) + "Z";

  return (
    <header className="sticky top-0 z-20 bg-background/85 backdrop-blur border-b border-border">
      <div className="flex items-center gap-4 px-5 h-12">
        <div className="flex items-center gap-2">
          <Crosshair className="h-3.5 w-3.5 text-cyan animate-tick" />
          <span className="label-tac text-cyan/90">{current.code}</span>
          <span className="text-[12px] text-foreground/90">{current.label}</span>
        </div>
        <div className="hud-divider w-px h-5 bg-border" />
        <div className="flex items-center gap-4 text-[10px] label-tac">
          <Indicator label="LATENCY" value="42ms" tone="signal" />
          <Indicator label="QUEUE" value="14" tone="cyan" />
          <Indicator label="RUNNERS" value="7/8" tone="signal" />
          <Indicator label="EXPOSURE" value="38.2%" tone="warn" />
          <Indicator label="DRAWDOWN" value="-2.14%" tone="danger" />
        </div>
        <div className="ml-auto flex items-center gap-4 text-[11px]">
          <span className="data-num text-muted-foreground">{utc}</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse-dot" />
            <span className="label-tac text-signal">SYSTEM NOMINAL</span>
          </span>
        </div>
      </div>
      {/* moving data stream */}
      <div className="relative h-[2px] overflow-hidden bg-border/40">
        <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-cyan to-transparent animate-flow-x" />
      </div>
    </header>
  );
}

function Indicator({ label, value, tone }: { label: string; value: string; tone: "cyan" | "signal" | "warn" | "danger" }) {
  const toneClass = { cyan: "text-cyan", signal: "text-signal", warn: "text-warn", danger: "text-danger" }[tone];
  return (
    <span className="flex items-center gap-1.5">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("data-num", toneClass)}>{value}</span>
    </span>
  );
}
