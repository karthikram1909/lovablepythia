import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface PanelProps {
  title?: string;
  code?: string;
  status?: "online" | "warn" | "danger" | "idle";
  right?: ReactNode;
  children: ReactNode;
  className?: string;
  glow?: boolean;
  bare?: boolean;
}

const statusColor: Record<string, string> = {
  online: "bg-signal glow-signal",
  warn: "bg-warn",
  danger: "bg-danger glow-danger",
  idle: "bg-muted-foreground",
};

export function Panel({ title, code, status, right, children, className, glow, bare }: PanelProps) {
  return (
    <section
      className={cn(
        "panel corner-frame relative",
        glow && "panel-glow",
        bare ? "p-0" : "p-4",
        className,
      )}
    >
      {(title || right) && (
        <header className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {status && (
              <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse-dot", statusColor[status])} />
            )}
            <h3 className="label-tac text-[10px] text-foreground/90">{title}</h3>
            {code && <span className="label-tac text-cyan/70">/ {code}</span>}
          </div>
          {right && <div className="text-[10px] label-tac">{right}</div>}
        </header>
      )}
      {children}
    </section>
  );
}

export function StatPill({
  label,
  value,
  unit,
  tone = "default",
}: {
  label: string;
  value: string | number;
  unit?: string;
  tone?: "default" | "cyan" | "signal" | "warn" | "danger";
}) {
  const toneClass = {
    default: "text-foreground",
    cyan: "text-cyan",
    signal: "text-signal",
    warn: "text-warn",
    danger: "text-danger",
  }[tone];
  return (
    <div className="flex flex-col gap-0.5">
      <span className="label-tac">{label}</span>
      <span className={cn("data-num text-lg font-semibold", toneClass)}>
        {value}
        {unit && <span className="ml-1 text-xs text-muted-foreground">{unit}</span>}
      </span>
    </div>
  );
}
