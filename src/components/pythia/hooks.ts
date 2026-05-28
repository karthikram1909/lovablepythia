import { useEffect, useState, useRef } from "react";

/** Smoothly drifts a value, used for live mock telemetry. */
export function useLiveValue(initial: number, opts: { drift?: number; min?: number; max?: number; interval?: number } = {}) {
  const { drift = 0.4, min = -Infinity, max = Infinity, interval = 1200 } = opts;
  const [v, setV] = useState(initial);
  useEffect(() => {
    const id = setInterval(() => {
      setV((cur) => {
        const next = cur + (Math.random() - 0.5) * drift * 2;
        return Math.min(max, Math.max(min, next));
      });
    }, interval);
    return () => clearInterval(id);
  }, [drift, min, max, interval]);
  return v;
}

export function useTicker(interval = 1000) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setN((x) => x + 1), interval);
    return () => clearInterval(id);
  }, [interval]);
  return n;
}

export function useNow(interval = 1000) {
  const [t, setT] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), interval);
    return () => clearInterval(id);
  }, [interval]);
  return t;
}

/** Series of numbers that rolls forward over time. */
export function useSeries(length: number, gen: (i: number, prev: number) => number, interval = 1500) {
  const [arr, setArr] = useState<number[]>(() => {
    const out: number[] = [];
    let prev = 0;
    for (let i = 0; i < length; i++) {
      prev = gen(i, prev);
      out.push(prev);
    }
    return out;
  });
  const ref = useRef(arr[arr.length - 1] ?? 0);
  useEffect(() => {
    const id = setInterval(() => {
      setArr((cur) => {
        const next = gen(cur.length, ref.current);
        ref.current = next;
        return [...cur.slice(1), next];
      });
    }, interval);
    return () => clearInterval(id);
  }, [gen, interval]);
  return arr;
}
