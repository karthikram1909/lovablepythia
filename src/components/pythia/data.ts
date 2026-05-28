import { useEffect, useState } from "react";

const SYMBOLS = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "ARB/USDT", "AVAX/USDT", "BNB/USDT", "LINK/USDT", "DOGE/USDT"] as const;
const REGIONS = ["FRA-1", "NYC-3", "TKY-2", "LON-1", "SGP-2", "DUB-1", "AMS-2", "SEA-1"] as const;

export type Side = "LONG" | "SHORT";

export interface Position {
  id: string;
  symbol: string;
  side: Side;
  entry: number;
  size: number;
  pnl: number;
  pnlPct: number;
  sl: number;
  tp: number;
  ladder: number;
  conf: number;
  age: string;
}

export interface Runner {
  id: string;
  region: string;
  ip: string;
  status: "ACTIVE" | "STANDBY" | "BACKOFF" | "RECONNECT";
  latency: number;
  load: number;
  beat: number;
  ipVerified: boolean;
}

export interface QueueItem {
  id: string;
  cmd: string;
  symbol: string;
  state: "QUEUED" | "VALIDATING" | "DISPATCHED" | "EXECUTING" | "ACK" | "PARITY";
  age: number;
  attempt: number;
}

export interface FeedEvent {
  ts: string;
  level: "INFO" | "OK" | "WARN" | "CRIT" | "AI";
  code: string;
  msg: string;
}

const rnd = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

export function usePositions(): Position[] {
  const [list, setList] = useState<Position[]>(() => {
    const r = rnd(7);
    return Array.from({ length: 6 }).map((_, i) => {
      const symbol = SYMBOLS[i % SYMBOLS.length];
      const side: Side = r() > 0.45 ? "LONG" : "SHORT";
      const entry = +(10 + r() * 60000).toFixed(2);
      const pnlPct = +(r() * 6 - 1.4).toFixed(2);
      return {
        id: `EXEC-${(8200 + i).toString(16).toUpperCase()}`,
        symbol,
        side,
        entry,
        size: +(0.05 + r() * 4).toFixed(3),
        pnl: +(pnlPct * 280).toFixed(2),
        pnlPct,
        sl: +(entry * (side === "LONG" ? 0.982 : 1.018)).toFixed(2),
        tp: +(entry * (side === "LONG" ? 1.045 : 0.955)).toFixed(2),
        ladder: Math.floor(r() * 5),
        conf: +(0.55 + r() * 0.4).toFixed(2),
        age: `${Math.floor(r() * 58)}m`,
      };
    });
  });

  useEffect(() => {
    const id = setInterval(() => {
      setList((cur) =>
        cur.map((p) => {
          const drift = (Math.random() - 0.48) * 0.25;
          const pnlPct = +(p.pnlPct + drift).toFixed(2);
          return { ...p, pnlPct, pnl: +(pnlPct * 280).toFixed(2) };
        }),
      );
    }, 1500);
    return () => clearInterval(id);
  }, []);

  return list;
}

export function useRunners(): Runner[] {
  const [list, setList] = useState<Runner[]>(() => {
    const r = rnd(13);
    return REGIONS.map((region, i) => ({
      id: `RNR-${i + 1}`,
      region,
      ip: `10.${Math.floor(r() * 250)}.${Math.floor(r() * 250)}.${Math.floor(r() * 250)}`,
      status: i === 5 ? "BACKOFF" : i === 7 ? "STANDBY" : "ACTIVE",
      latency: Math.floor(20 + r() * 80),
      load: Math.floor(r() * 80),
      beat: Math.floor(r() * 100),
      ipVerified: i !== 5,
    }));
  });
  useEffect(() => {
    const id = setInterval(() => {
      setList((cur) =>
        cur.map((rn) => ({
          ...rn,
          latency: Math.max(12, Math.min(220, rn.latency + Math.floor((Math.random() - 0.5) * 14))),
          load: Math.max(0, Math.min(100, rn.load + Math.floor((Math.random() - 0.5) * 12))),
          beat: (rn.beat + 1) % 100,
        })),
      );
    }, 1100);
    return () => clearInterval(id);
  }, []);
  return list;
}

export function useQueue(): QueueItem[] {
  const states: QueueItem["state"][] = ["QUEUED", "VALIDATING", "DISPATCHED", "EXECUTING", "ACK", "PARITY"];
  const [list, setList] = useState<QueueItem[]>(() => {
    const r = rnd(33);
    return Array.from({ length: 9 }).map((_, i) => ({
      id: `CMD-${(0xa100 + i).toString(16).toUpperCase()}`,
      cmd: ["OPEN", "CLOSE", "ADD_LADDER", "MOVE_SL", "MOVE_TP", "RECONCILE"][i % 6],
      symbol: SYMBOLS[i % SYMBOLS.length],
      state: states[Math.floor(r() * states.length)],
      age: Math.floor(r() * 1200),
      attempt: 1 + Math.floor(r() * 2),
    }));
  });
  useEffect(() => {
    const id = setInterval(() => {
      setList((cur) =>
        cur.map((q, i) => {
          if (Math.random() > 0.7) {
            const idx = states.indexOf(q.state);
            const next = states[Math.min(states.length - 1, idx + 1)];
            return { ...q, state: next, age: q.age + 200 };
          }
          return { ...q, age: q.age + 200 };
        }),
      );
    }, 1500);
    return () => clearInterval(id);
  }, []);
  return list;
}

export function useFeed(): FeedEvent[] {
  const [list, setList] = useState<FeedEvent[]>(() => seedFeed());
  useEffect(() => {
    const id = setInterval(() => {
      setList((cur) => [makeEvent(), ...cur].slice(0, 60));
    }, 2200);
    return () => clearInterval(id);
  }, []);
  return list;
}

function ts() {
  return new Date().toISOString().slice(11, 19);
}

const TEMPLATES: { level: FeedEvent["level"]; code: string; msg: string }[] = [
  { level: "OK", code: "EXEC.ACK", msg: "Order acknowledged · BTC/USDT · slippage 0.011%" },
  { level: "AI", code: "AI.SENT", msg: "Sentiment shift detected · BTC bias +0.18 · regime TREND_UP" },
  { level: "INFO", code: "RUNNER.HB", msg: "Heartbeat received · RNR-3 · drift 4ms" },
  { level: "WARN", code: "API.BACKOFF", msg: "Execution throughput temporarily throttled · gate.io · 1.2s" },
  { level: "OK", code: "PROT.SL", msg: "Dynamic SL advanced · ETH/USDT · +0.42% protected" },
  { level: "AI", code: "SCAN", msg: "Confluence detected · SOL/USDT · 4 strategies aligned" },
  { level: "CRIT", code: "RECOVERY", msg: "State drift resolved · recovery_lock ETH-77A1 released" },
  { level: "INFO", code: "PARITY", msg: "Parity test passed · 12,481 orders · 0 mismatches" },
  { level: "OK", code: "LADDER", msg: "Add-more ladder rung 2 filled · ARB/USDT · avg -0.31%" },
  { level: "WARN", code: "LATENCY", msg: "Edge latency elevated · TKY-2 · 142ms peak" },
];

function makeEvent(): FeedEvent {
  const t = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
  return { ts: ts(), ...t };
}

function seedFeed(): FeedEvent[] {
  return Array.from({ length: 18 }).map(() => makeEvent());
}

export const SYMBOL_LIST = SYMBOLS;
