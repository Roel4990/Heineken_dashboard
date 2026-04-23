import { loadCsvFromSupabase } from "./loadCsv";
import type { ProcessedMarketData, SeriesMap, Top10Brand, NullableNum } from "./types";

// ── helpers ──────────────────────────────────────────────────────────────────

const MON_NUM: Record<string, number> = {
  JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
  JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11,
};

function monthSortKey(m: string): number {
  const [mon, yr] = m.split(" ");
  const year = parseInt(yr) + (parseInt(yr) < 50 ? 2000 : 1900);
  return year * 12 + (MON_NUM[mon.toUpperCase()] ?? 0);
}

function sortMonths(arr: string[]): string[] {
  return [...new Set(arr)].sort((a, b) => monthSortKey(a) - monthSortKey(b));
}

function nullArr(n: number): NullableNum[] {
  return Array(n).fill(null);
}

function buildIdx(months: string[]): Map<string, number> {
  return new Map(months.map((m, i) => [m, i]));
}

// ── channel / company maps ────────────────────────────────────────────────────

const CH_MAP: Record<string, string> = {
  "Off total market": "Total",
  Hyper: "Hyper",
  CVS: "CVS",
  CLSM: "CLSM",
  ALSM: "ALSM",
  SJJ: "SJJ",
  Unionshop: "Union",
};

const MAIN_COMPANIES = ["HKR", "ABI IPS", "Beer K", "HITE IPS", "LOTTE IPS"];

const HKR_BRAND_MAP: Record<string, string> = {
  Heineken: "Heineken",
  "Heineken0.0": "Heineken 0.0",
  Edelweiss: "Edelweiss",
  Tiger: "Tiger",
  "Tiger radler": "Tiger Radler",
  Sulhwa: "Sulhwa",
  "Birra Moretti": "Birra Moretti",
  Desperados: "Desperados",
  Lagunitas: "Lagunitas",
  Strongbow: "Strongbow",
  Applefox: "Applefox",
};

// ── MS_IPS_marketshare processor ─────────────────────────────────────────────

function processIPS(
  rows: Record<string, string>[],
  months: string[],
  idx: Map<string, number>
) {
  const n = months.length;
  const channels = Object.values(CH_MAP);

  const coMSByChannel: Record<string, SeriesMap> = {};
  channels.forEach((ch) => {
    coMSByChannel[ch] = Object.fromEntries(MAIN_COMPANIES.map((c) => [c, nullArr(n)]));
  });
  const coMS: SeriesMap = Object.fromEntries(MAIN_COMPANIES.map((c) => [c, nullArr(n)]));
  const hkrChMS: SeriesMap = Object.fromEntries(channels.map((ch) => [ch, nullArr(n)]));

  const hkrBrands = Object.values(HKR_BRAND_MAP);
  const hkrBrandMSByChannel: Record<string, SeriesMap> = {};
  channels.forEach((ch) => {
    hkrBrandMSByChannel[ch] = Object.fromEntries(hkrBrands.map((b) => [b, nullArr(n)]));
  });
  const pfMS: SeriesMap = Object.fromEntries(hkrBrands.map((b) => [b, nullArr(n)]));

  for (const row of rows) {
    const ch = CH_MAP[row.channel];
    if (!ch) continue;
    const mi = idx.get(row.month_year);
    if (mi == null) continue;
    const ms = parseFloat(row.market_share);
    if (isNaN(ms)) continue;

    const isCompanyRow = row.brand === row.channel_detail;
    const isHKRBrandRow = row.channel_detail === "HKR" && row.brand !== "HKR";

    if (isCompanyRow && MAIN_COMPANIES.includes(row.channel_detail)) {
      if (coMSByChannel[ch][row.channel_detail]) {
        coMSByChannel[ch][row.channel_detail][mi] = ms;
      }
      if (ch === "Total") coMS[row.channel_detail][mi] = ms;
    }

    if (isCompanyRow && row.channel_detail === "HKR") {
      hkrChMS[ch][mi] = ms;
    }

    if (isHKRBrandRow) {
      const brandDisplay = HKR_BRAND_MAP[row.brand];
      if (!brandDisplay) continue;
      if (hkrBrandMSByChannel[ch][brandDisplay] !== undefined) {
        hkrBrandMSByChannel[ch][brandDisplay][mi] = ms;
      }
      if (ch === "Total") pfMS[brandDisplay][mi] = ms;
    }
  }

  function filterEmpty(sm: SeriesMap): SeriesMap {
    return Object.fromEntries(
      Object.entries(sm).filter(([, arr]) => arr.some((v) => v != null))
    );
  }

  const pfFiltered = filterEmpty(pfMS);
  channels.forEach((ch) => {
    hkrBrandMSByChannel[ch] = filterEmpty(hkrBrandMSByChannel[ch]);
  });

  return { coMS, hkrChMS, coMSByChannel, hkrBrandMSByChannel, pfMS: pfFiltered };
}

// ── Top10 from MS_beer_raw ────────────────────────────────────────────────────

const TOP10_SKIP = new Set([
  "ABI IPS", "Beer K", "HITE IPS", "LOTTE IPS", "HKR",
  "ABI", "HITE", "Lotte", "Beer_IPS", "Total market",
  "Total Local beer", "CASS", "others", "Others",
]);

function processTop10(
  rows: Record<string, string>[],
  months: string[]
): Top10Brand[] {
  const totalRows = rows.filter((r) => r.channel === "Off total market");

  const volByBrand = new Map<string, number>();
  const coByBrand = new Map<string, string>();
  for (const r of totalRows) {
    if (TOP10_SKIP.has(r.brand)) continue;
    volByBrand.set(r.brand, (volByBrand.get(r.brand) ?? 0) + parseFloat(r.volume || "0"));
    if (!coByBrand.has(r.brand)) coByBrand.set(r.brand, r.company_market ?? "");
  }

  const ranked = [...volByBrand.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);

  const sortedMonths = sortMonths(months);
  const latestMonth = sortedMonths[sortedMonths.length - 1];
  const latestYear = latestMonth.split(" ")[1];
  const prevYear = String(parseInt(latestYear) - 1).padStart(2, "0");
  const latestYearMonths = new Set(months.filter((m) => m.endsWith(` ${latestYear}`)));
  const prevYearMonths = new Set(months.filter((m) => m.endsWith(` ${prevYear}`)));

  const T10_COLORS = [
    "#1a6b1a", "#1565C0", "#E65100", "#c62828", "#6A1B9A",
    "#00695C", "#BF360C", "#37474F", "#F57F17", "#4E342E",
  ];

  return ranked.map(([brand], i) => {
    const brandRows = totalRows.filter((r) => r.brand === brand);
    const latestRow = brandRows.find((r) => r.month_year === latestMonth);
    const mtd = parseFloat(latestRow?.volume ?? "0");

    const ytd = brandRows
      .filter((r) => latestYearMonths.has(r.month_year))
      .reduce((s, r) => s + parseFloat(r.volume || "0"), 0);
    const prevYTD = brandRows
      .filter((r) => prevYearMonths.has(r.month_year))
      .reduce((s, r) => s + parseFloat(r.volume || "0"), 0);

    const vsLY = prevYTD > 0 ? ((ytd - prevYTD) / prevYTD) * 100 : null;

    return {
      name: brand,
      company: coByBrand.get(brand) ?? "",
      color: T10_COLORS[i] ?? "#aaa",
      mtd,
      ytd,
      vsLY,
    };
  });
}

// ── NAB from NAB_raw_volume ───────────────────────────────────────────────────

const NAB_DISPLAY: Record<string, string> = {
  "Total NAB": "Total NAB",
  "IPS NAB": "IPS NAB",
  "Heineken0.0": "Heineken 0.0",
  "Grolsch 0.0": "Grolsch 0.0",
  "Kozel 0.0": "Kozel 0.0",
};

function processNAB(
  rows: Record<string, string>[],
  months: string[],
  idx: Map<string, number>
) {
  const total = rows.filter((r) => r.channel === "Total Korea Offline");
  const n = months.length;
  const vol: SeriesMap = Object.fromEntries(
    Object.values(NAB_DISPLAY).map((b) => [b, nullArr(n)])
  );
  for (const r of total) {
    const display = NAB_DISPLAY[r.brand];
    if (!display) continue;
    const mi = idx.get(r.month_year);
    if (mi == null) continue;
    const v = parseFloat(r.volume);
    if (!isNaN(v)) vol[display][mi] = v;
  }
  return vol;
}

// ── RTD from RTD_raw_volume ───────────────────────────────────────────────────

const RTD_BRANDS = ["SOMERSBY", "TIGER RADLER"];
const RTD_DISPLAY: Record<string, string> = {
  SOMERSBY: "Somersby",
  "TIGER RADLER": "Tiger Radler",
};

function processRTD(
  rows: Record<string, string>[],
  months: string[],
  idx: Map<string, number>
) {
  const total = rows.filter((r) => r.market === "Total market" && RTD_BRANDS.includes(r.brand));
  const n = months.length;
  const vol: SeriesMap = Object.fromEntries(
    Object.values(RTD_DISPLAY).map((b) => [b, nullArr(n)])
  );
  for (const r of total) {
    const display = RTD_DISPLAY[r.brand];
    if (!display) continue;
    const mi = idx.get(r.month_year);
    if (mi == null) continue;
    const v = parseFloat(r.volume);
    if (!isNaN(v)) vol[display][mi] = (vol[display][mi] ?? 0) + v;
  }
  return vol;
}

// ── Local Brand PI from oneTAP_brand_MS_PI ───────────────────────────────────

const LOCAL_BRANDS = ["CASS", "TERRA", "HITE", "KLOUD", "Others"];
const LOCAL_MON: Record<string, string> = {
  Jan: "JAN", Feb: "FEB", Mar: "MAR", Apr: "APR",
  May: "MAY", Jun: "JUN", Jul: "JUL", Aug: "AUG",
  Sep: "SEP", Oct: "OCT", Nov: "NOV", Dec: "DEC",
};

function processLocal(rows: Record<string, string>[]) {
  const filtered = rows.filter((r) => LOCAL_BRANDS.includes(r.brand));

  const rawMonths = filtered.map((r) => {
    const yr = r.year.replace("Y", "");
    const mon = LOCAL_MON[r.month] ?? r.month.toUpperCase().slice(0, 3);
    return `${mon} ${yr}`;
  });
  const localMonths = sortMonths(rawMonths);
  const localIdx = buildIdx(localMonths);
  const n = localMonths.length;

  const localMS: SeriesMap = Object.fromEntries(LOCAL_BRANDS.map((b) => [b, nullArr(n)]));
  const localPI: SeriesMap = Object.fromEntries(LOCAL_BRANDS.map((b) => [b, nullArr(n)]));

  for (const r of filtered) {
    const yr = r.year.replace("Y", "");
    const mon = LOCAL_MON[r.month] ?? r.month.toUpperCase().slice(0, 3);
    const mLabel = `${mon} ${yr}`;
    const mi = localIdx.get(mLabel);
    if (mi == null) continue;
    const ms = parseFloat(r.MS);
    const pi = parseFloat(r.PI);
    if (!isNaN(ms)) localMS[r.brand][mi] = ms;
    if (!isNaN(pi)) localPI[r.brand][mi] = pi;
  }

  return { localMonths, localMS, localPI };
}

// ── main entry ────────────────────────────────────────────────────────────────

export async function processData(): Promise<ProcessedMarketData> {
  const [ipsRaw, beerRaw, nabRaw, rtdRaw, localRaw] = await Promise.all([
    loadCsvFromSupabase("raw/MS_IPS_marketshare.csv"),
    loadCsvFromSupabase("raw/MS_beer_raw.csv"),
    loadCsvFromSupabase("raw/NAB_raw_volume.csv"),
    loadCsvFromSupabase("raw/RTD_raw_volume.csv"),
    loadCsvFromSupabase("raw/oneTAP_brand_MS_PI.csv"),
  ]);

  const months = sortMonths(ipsRaw.map((r) => r.month_year).filter(Boolean));
  const idx = buildIdx(months);

  const { coMS, hkrChMS, coMSByChannel, hkrBrandMSByChannel, pfMS } = processIPS(ipsRaw, months, idx);
  const top10 = processTop10(beerRaw, months);
  const nabVol = processNAB(nabRaw, months, idx);
  const rtdVol = processRTD(rtdRaw, months, idx);
  const { localMonths, localMS, localPI } = processLocal(localRaw);

  const nabMonths = months.filter((_, i) => nabVol["Total NAB"]?.[i] != null);

  return {
    months,
    coMS,
    hkrChMS,
    top10,
    coMSByChannel,
    hkrBrandMSByChannel,
    pfMS,
    nabMonths,
    nabVol,
    rtdVol,
    localMonths,
    localMS,
    localPI,
  };
}
