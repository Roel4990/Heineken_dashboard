"use client";
import { useState } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { CH_COLORS, PF_COLORS, BRAND, softenColor } from "@/lib/colors";
import { toLineData } from "@/lib/chartUtils";
import type { ProcessedMarketData } from "@/lib/types";
import SectionHeader from "@/components/common/SectionHeader";
import ChartCard from "@/components/common/ChartCard";
import LineChartWidget from "@/components/common/LineChartWidget";

interface Props { data: ProcessedMarketData; s: number; e: number }

const CHANNELS = ["Total", "Hyper", "CVS", "CLSM", "ALSM", "Union", "SJJ"];

const EXTRA_COLORS = ["#F57F17", "#1565C0", "#6A1B9A", "#37474F", "#00695C", "#BF360C"];
function brandColor(brand: string, allBrands: string[]): string {
  if (PF_COLORS[brand]) return softenColor(PF_COLORS[brand], 0.18);
  const idx = allBrands.indexOf(brand);
  return softenColor(EXTRA_COLORS[idx % EXTRA_COLORS.length] ?? "#aaa", 0.24);
}

export default function PerformanceSection({ data, s, e }: Props) {
  const { months, hkrBrandMSByChannel, hkrChMS } = data;
  const [selected, setSelected] = useState<string>("Total");
  const tag = months[s] + " – " + months[e];

  const brandMap = hkrBrandMSByChannel[selected] ?? {};
  const allBrands = Object.keys(brandMap);
  const brandLineData = toLineData(months, brandMap, s, e);
  const brandSeries = allBrands.map((b) => ({
    key: b, color: brandColor(b, allBrands), bold: b === "Heineken",
  }));

  const hkrAllData = toLineData(months, hkrChMS, s, e);
  const hkrAllSeries = Object.keys(hkrChMS).map((k) => ({
    key: k, color: CH_COLORS[k] ?? "#aaa", bold: k === selected,
  }));

  return (
    <Box>
      <SectionHeader title="HKR Performance by Channel" tag={tag} />

      {/* HKR 전채널 — 전체 조망 (moved from Overview) */}
      <ChartCard title="HKR 전채널 M/S 추이" sub="7개 채널 동시 표시" height={280} fullWidth>
        <LineChartWidget data={hkrAllData} series={hkrAllSeries} />
      </ChartCard>

      {/* Channel selector */}
      <Box sx={{ display: "flex", gap: "6px", flexWrap: "wrap", mb: "14px", mt: "14px" }}>
        {CHANNELS.map((ch) => (
          <Chip key={ch} label={ch} onClick={() => setSelected(ch)}
            variant={selected === ch ? "filled" : "outlined"}
            sx={{
              fontFamily: "var(--font-barlow-condensed),'Barlow Condensed',sans-serif",
              fontSize: 11, fontWeight: 600, height: 28, letterSpacing: ".5px",
              ...(selected === ch
                ? { background: BRAND.g1, color: "#fff", "& .MuiChip-label": { color: "#fff" } }
                : { color: BRAND.g1, borderColor: BRAND.g3 }),
            }}
          />
        ))}
      </Box>

      {/* HKR sub-brand by channel */}
      <ChartCard title="HKR Portfolio by Channel" sub={`${selected} 채널 브랜드별 M/S 추이`} height={280} fullWidth>
        <LineChartWidget data={brandLineData} series={brandSeries} />
      </ChartCard>
    </Box>
  );
}
