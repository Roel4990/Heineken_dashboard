import type { SeriesMap, RechartsPoint, HBarDatum, PieDatum, NullableNum } from "./types";

export const pct = (v: NullableNum): number | null =>
  v != null ? parseFloat((v * 100).toFixed(2)) : null;

export const fp = (v: NullableNum): string =>
  v != null ? (v * 100).toFixed(1) + "%" : "—";

export const avg = (arr: NullableNum[]): number => {
  const v = arr.filter((x): x is number => x != null);
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0;
};

/** Slice data to filter range */
export const sv = (arr: NullableNum[], s: number, e: number): NullableNum[] =>
  arr.slice(s, e + 1);

/** Build Recharts row-oriented data for line/bar charts */
export function toLineData(
  months: string[],
  series: SeriesMap,
  s: number,
  e: number
): RechartsPoint[] {
  return months.slice(s, e + 1).map((month, i) => {
    const point: RechartsPoint = { month };
    Object.entries(series).forEach(([key, vals]) => {
      const v = vals[s + i];
      point[key] = v != null ? parseFloat((v * 100).toFixed(2)) : null;
    });
    return point;
  });
}

/** Build sorted horizontal bar data */
export function toHBarData(
  series: SeriesMap,
  colors: Record<string, string> | ((key: string, idx: number) => string),
  s: number,
  e: number,
  highlightKey?: string,
): HBarDatum[] {
  return Object.entries(series)
    .map(([key, vals], idx) => ({
      name: key,
      value: parseFloat((avg(sv(vals, s, e)) * 100).toFixed(2)),
      color: typeof colors === "function" ? colors(key, idx) : (colors[key] ?? "#aaa"),
      isHighlight: highlightKey ? key === highlightKey : undefined,
    }))
    .sort((a, b) => b.value - a.value);
}

/** Build pie/doughnut data from latest value in range */
export function toPieData(
  series: SeriesMap,
  colors: Record<string, string>,
  e: number
): PieDatum[] {
  return Object.entries(series).map(([key, vals]) => ({
    name: key,
    value: parseFloat(((vals[e] ?? 0) * 100).toFixed(2)),
    color: colors[key] ?? "#ccc",
  }));
}

/** Month label display: "JAN 22" → "Jan '22" */
export const fmtMonth = (m: string): string => {
  const [mon, yr] = m.split(" ");
  return mon.charAt(0) + mon.slice(1).toLowerCase() + " '" + yr;
};
