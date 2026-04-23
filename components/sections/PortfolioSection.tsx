"use client";
import { useState } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import { PF_COLORS, BRAND, softenColor } from "@/lib/colors";
import { toLineData, toPieData, sv, fp } from "@/lib/chartUtils";
import type { ProcessedMarketData } from "@/lib/types";
import SectionHeader from "@/components/common/SectionHeader";
import ChartCard from "@/components/common/ChartCard";
import DataTable from "@/components/common/DataTable";
import LineChartWidget from "@/components/common/LineChartWidget";
import DoughnutChartWidget from "@/components/common/DoughnutChartWidget";

interface Props { data: ProcessedMarketData; s: number; e: number }

const DEFAULT_ACTIVE = new Set(["Heineken", "Heineken 0.0", "Tiger", "Tiger Radler", "Birra Moretti", "Sulhwa"]);
const EXTRA_COLORS = ["#F57F17", "#1565C0", "#6A1B9A", "#37474F", "#00695C", "#BF360C"];

function getBrandColor(brand: string, allBrands: string[]): string {
  if (PF_COLORS[brand]) return brand.startsWith("Heineken") ? PF_COLORS[brand] : softenColor(PF_COLORS[brand], 0.24);
  const idx = allBrands.indexOf(brand);
  return softenColor(EXTRA_COLORS[idx % EXTRA_COLORS.length] ?? "#aaa", 0.24);
}

export default function PortfolioSection({ data, s, e }: Props) {
  const { months, pfMS } = data;
  const allBrands = Object.keys(pfMS);
  const [active, setActive] = useState<Set<string>>(
    new Set(allBrands.filter((b) => DEFAULT_ACTIVE.has(b)))
  );

  const tag = months[s] + " – " + months[e];
  const slice = months.slice(s, e + 1);

  const activeBrands = allBrands.filter((b) => active.has(b));
  const activeSeries = Object.fromEntries(activeBrands.map((b) => [b, pfMS[b]]));
  const colorMap = Object.fromEntries(allBrands.map((b) => [b, getBrandColor(b, allBrands)]));

  const lineData = toLineData(months, activeSeries, s, e);
  const lineSeries = activeBrands.map((b) => ({
    key: b, color: colorMap[b], bold: b === "Heineken",
  }));

  const pieData = toPieData(pfMS, colorMap, e);

  const tableCols = allBrands.map((b) => ({ key: b, label: b }));
  const tableRows = slice.map((month, i) => {
    const row: Record<string, string> = { month };
    allBrands.forEach((b) => { row[b] = fp(sv(pfMS[b] ?? [], s, e)[i]); });
    return row;
  });

  function toggle(brand: string) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(brand)) next.delete(brand); else next.add(brand);
      return next;
    });
  }

  return (
    <Box>
      <SectionHeader title="HKR Portfolio M/S" tag={tag} />

      <Box sx={{ display: "flex", gap: "6px", flexWrap: "wrap", mb: "12px" }}>
        {allBrands.map((b) => (
          <Chip key={b} label={b} onClick={() => toggle(b)}
            variant={active.has(b) ? "filled" : "outlined"}
            sx={{
              fontFamily: "var(--font-barlow-condensed),'Barlow Condensed',sans-serif",
              fontSize: 11, fontWeight: 600, height: 28, letterSpacing: ".5px",
              ...(active.has(b)
                ? { background: BRAND.g1, color: "#fff", "& .MuiChip-label": { color: "#fff" } }
                : { color: BRAND.g1, borderColor: BRAND.g3 }),
            }}
          />
        ))}
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: "14px", mb: "14px" }}>
        <ChartCard title="브랜드별 M/S 추이" sub="선택 브랜드 IPS M/S (Total)">
          <LineChartWidget data={lineData} series={lineSeries} />
        </ChartCard>
        <ChartCard title="포트폴리오 구성 (최신월)" sub="도넛 차트">
          <DoughnutChartWidget data={pieData} />
        </ChartCard>
      </Box>

      <Paper sx={{ p: "14px 16px" }}>
        <Box sx={{ fontFamily: "var(--font-barlow-condensed),'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: "1px", textTransform: "uppercase", color: BRAND.g1, mb: "2px" }}>
          브랜드별 월별 상세
        </Box>
        <Box sx={{ fontSize: 11, color: "#666", mb: "4px" }}>HKR 브랜드 IPS M/S (%)</Box>
        <DataTable columns={tableCols} rows={tableRows} />
      </Paper>
    </Box>
  );
}
