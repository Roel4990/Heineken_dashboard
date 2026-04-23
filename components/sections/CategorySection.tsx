"use client";
import { useState } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { NAB_COLORS, RTD_COLORS, LOCAL_COLORS, BRAND } from "@/lib/colors";
import type { ProcessedMarketData, CatSubTab, RechartsPoint } from "@/lib/types";
import SectionHeader from "@/components/common/SectionHeader";
import ChartCard from "@/components/common/ChartCard";
import LineChartWidget from "@/components/common/LineChartWidget";
import DualAxisLineWidget from "@/components/common/DualAxisLineWidget";
import type { DualSeries } from "@/components/common/DualAxisLineWidget";

interface Props { data: ProcessedMarketData }

const SUB_TABS: { id: CatSubTab; label: string }[] = [
  { id: "nab",   label: "NAB (무알코올)" },
  { id: "rtd",   label: "Cider & Radler" },
  { id: "local", label: "Local Brand MS & PI" },
];

function buildLineData(months: string[], series: Record<string, (number | null)[]>): RechartsPoint[] {
  return months.map((month, i) => {
    const point: RechartsPoint = { month };
    Object.entries(series).forEach(([k, arr]) => { point[k] = arr[i] ?? null; });
    return point;
  });
}

export default function CategorySection({ data }: Props) {
  const { nabMonths, nabVol, months, rtdVol, localMonths, localMS, localPI } = data;
  const [sub, setSub] = useState<CatSubTab>("nab");

  // NAB — volume (HL)
  const nabData = buildLineData(
    nabMonths,
    Object.fromEntries(
      Object.entries(nabVol).map(([k, arr]) => [k, nabMonths.map((m) => {
        const gi = months.indexOf(m);
        return gi >= 0 ? arr[gi] : null;
      })])
    )
  );
  const nabSeries = Object.keys(nabVol).map((k) => ({
    key: k, color: NAB_COLORS[k] ?? "#aaa", bold: k === "Total NAB",
  }));

  // RTD — volume (HL)
  const rtdMonths = months.filter((_, i) => Object.values(rtdVol).some((arr) => arr[i] != null));
  const rtdData = buildLineData(
    rtdMonths,
    Object.fromEntries(
      Object.entries(rtdVol).map(([k, arr]) => [k, rtdMonths.map((m) => {
        const gi = months.indexOf(m);
        return gi >= 0 ? arr[gi] : null;
      })])
    )
  );
  const rtdSeries = Object.keys(rtdVol).map((k) => ({
    key: k, color: RTD_COLORS[k] ?? "#aaa",
  }));

  // Local Brand — MS (ratio) + PI (0‑100) dual axis
  const localData: RechartsPoint[] = localMonths.map((month, i) => {
    const point: RechartsPoint = { month };
    Object.entries(localMS).forEach(([k, arr]) => { point[`${k}_MS`] = arr[i] ?? null; });
    Object.entries(localPI).forEach(([k, arr]) => { point[`${k}_PI`] = arr[i] ?? null; });
    return point;
  });
  const localSeries: DualSeries[] = [
    ...Object.keys(localMS).map((k) => ({
      key: `${k}_MS`, color: LOCAL_COLORS[k] ?? "#aaa", axis: "left" as const,
      bold: k === "CASS",
    })),
    ...Object.keys(localPI).map((k) => ({
      key: `${k}_PI`, color: LOCAL_COLORS[k] ?? "#aaa", axis: "right" as const,
    })),
  ];
  // Show only CASS MS + PI for readability by default
  const localSeriesFiltered: DualSeries[] = ([
    { key: "CASS_MS",  color: LOCAL_COLORS.CASS,  axis: "left"  as const, bold: true },
    { key: "TERRA_MS", color: LOCAL_COLORS.TERRA,  axis: "left"  as const },
    { key: "HITE_MS",  color: LOCAL_COLORS.HITE,   axis: "left"  as const },
    { key: "KLOUD_MS", color: LOCAL_COLORS.KLOUD,  axis: "left"  as const },
    { key: "CASS_PI",  color: "#FF7043",            axis: "right" as const, bold: true },
  ] as DualSeries[]).filter((s) => localData.some((d) => d[s.key] != null));

  return (
    <Box>
      <SectionHeader title="Category View" tag="전체 기간" />

      {/* Sub-tab chips */}
      <Box sx={{ display: "flex", gap: "6px", mb: "16px" }}>
        {SUB_TABS.map((t) => (
          <Chip key={t.id} label={t.label} onClick={() => setSub(t.id)}
            variant={sub === t.id ? "filled" : "outlined"}
            sx={{
              fontFamily: "var(--font-barlow-condensed),'Barlow Condensed',sans-serif",
              fontSize: 11, fontWeight: 600, height: 28, letterSpacing: ".5px",
              ...(sub === t.id
                ? { background: BRAND.g1, color: "#fff", "& .MuiChip-label": { color: "#fff" } }
                : { color: BRAND.g1, borderColor: BRAND.g3 }),
            }}
          />
        ))}
      </Box>

      {/* NAB */}
      {sub === "nab" && (
        <Box>
          <ChartCard title="NAB 볼륨 추이" sub="Total Korea Offline (HL)" height={300} fullWidth>
            <LineChartWidget data={nabData} series={nabSeries} yFormatter={(v) => `${v.toLocaleString()}`} />
          </ChartCard>
        </Box>
      )}

      {/* RTD */}
      {sub === "rtd" && (
        <Box>
          <ChartCard title="Cider & Radler 볼륨 추이" sub="Total market (HL) — Somersby / Tiger Radler" height={300} fullWidth>
            <LineChartWidget data={rtdData} series={rtdSeries} yFormatter={(v) => `${v.toLocaleString()}`} />
          </ChartCard>
        </Box>
      )}

      {/* Local Brand */}
      {sub === "local" && (
        <Box>
          <ChartCard title="Local Brand MS & PI" sub="M/S(좌축) + PI 유통지수(우축) — 2020~2021" height={320} fullWidth>
            <DualAxisLineWidget
              data={localData}
              series={localSeriesFiltered}
              leftLabel="M/S"
              rightLabel="PI"
            />
          </ChartCard>
          <ChartCard title="Local Brand MS 전체 추이" sub="CASS / TERRA / HITE / KLOUD / Others" height={280} fullWidth>
            <LineChartWidget
              data={localMonths.map((m, i) => {
                const p: RechartsPoint = { month: m };
                Object.entries(localMS).forEach(([k, arr]) => { p[k] = arr[i] ?? null; });
                return p;
              })}
              series={Object.keys(localMS).map((k) => ({ key: k, color: LOCAL_COLORS[k] ?? "#aaa", bold: k === "CASS" }))}
              yFormatter={(v) => `${(v * 100).toFixed(1)}%`}
            />
          </ChartCard>
        </Box>
      )}
    </Box>
  );
}
