export type MonthLabel = string; // "NOV 25" format

export type NullableNum = number | null;

export type SeriesMap = Record<string, NullableNum[]>;

export type TabId = "overview" | "performance" | "portfolio" | "category";
export type CatSubTab = "nab" | "rtd" | "local";

export interface RechartsPoint {
  month: string;
  [key: string]: string | number | null;
}

export interface HBarDatum {
  name: string;
  value: number;
  color: string;
  isHighlight?: boolean;
}

export interface PieDatum {
  name: string;
  value: number;
  color: string;
}

export interface Top10Brand {
  name: string;
  company: string;
  color: string;
  mtd: number;       // HL — latest month
  ytd: number;       // HL — latest year sum
  vsLY: number | null; // % change vs same period last year
}

export interface ProcessedMarketData {
  months: string[];  // sorted "MMM YY" from MS_IPS (NOV 18 → NOV 25)

  // Tab 1: Overview
  coMS: SeriesMap;       // company IPS M/S (Total channel)
  hkrChMS: SeriesMap;    // HKR M/S per channel

  top10: Top10Brand[];

  // Tab 2: HKR Performance (per channel)
  coMSByChannel: Record<string, SeriesMap>;        // channel → company MS
  hkrBrandMSByChannel: Record<string, SeriesMap>;  // channel → HKR brand MS

  // Tab 3: Portfolio
  pfMS: SeriesMap;  // HKR brand M/S (Total)

  // Tab 4: Category View
  nabMonths: string[];
  nabVol: SeriesMap;    // NAB brand volumes (Total Korea Offline)
  rtdVol: SeriesMap;    // RTD brand volumes (Total market)
  localMonths: string[];
  localMS: SeriesMap;   // Local brand M/S (ratio 0‑1)
  localPI: SeriesMap;   // Local brand PI (0‑100)
}
