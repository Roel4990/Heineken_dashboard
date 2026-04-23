"use client";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { CO_COLORS, BRAND, softenColor } from "@/lib/colors";
import { toLineData, toHBarData, sv, fp } from "@/lib/chartUtils";
import type { ProcessedMarketData } from "@/lib/types";
import SectionHeader from "@/components/common/SectionHeader";
import KpiCard from "@/components/common/KpiCard";
import ChartCard from "@/components/common/ChartCard";
import LineChartWidget from "@/components/common/LineChartWidget";
import HBarChartWidget from "@/components/common/HBarChartWidget";

interface Props { data: ProcessedMarketData; s: number; e: number }

const KPI_COMPANIES = ["HKR", "ABI IPS", "Beer K", "HITE IPS", "LOTTE IPS"];

export default function OverviewSection({ data, s, e }: Props) {
  const { months, coMS, top10 } = data;
  const tag = months[s] + " – " + months[e];

  const coColorMap = Object.fromEntries(
    Object.entries(CO_COLORS).map(([k, c]) => [k, k === "HKR" ? c : softenColor(c)])
  );

  const coLineData = toLineData(months, coMS, s, e);
  const coSeries = Object.keys(coMS).map((k) => ({
    key: k, color: coColorMap[k] ?? "#aaa", bold: k === "HKR",
  }));

  const coBarData = toHBarData(coMS, coColorMap, s, e, "HKR");

  return (
    <Box>
      <SectionHeader title="Total IPS Market Overview" tag={tag} />

      {/* KPI row */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(3,1fr)", md: "repeat(5,1fr)" }, gap: "11px", mb: "16px" }}>
        {KPI_COMPANIES.map((k) => {
          const vals = sv(coMS[k] ?? [], s, e);
          const cur = vals[vals.length - 1];
          const pre = vals.length > 1 ? vals[vals.length - 2] : null;
          const delta = cur != null && pre != null ? (cur - pre) * 100 : null;
          return (
            <KpiCard key={k} label={k} value={fp(cur)} delta={delta} accentColor={CO_COLORS[k] ?? BRAND.g1} />
          );
        })}
      </Box>

      {/* Charts row */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: "14px", mb: "14px" }}>
        <ChartCard title="회사별 IPS M/S 추이" sub={tag}>
          <LineChartWidget data={coLineData} series={coSeries} />
        </ChartCard>
        <ChartCard title="기간 평균 M/S 비교" sub="선택 기간 평균값">
          <HBarChartWidget data={coBarData} />
        </ChartCard>
      </Box>

      {/* Top 10 table */}
      <Paper sx={{ p: "14px 16px", mt: "14px" }}>
        <Box sx={{ fontFamily: "var(--font-barlow-condensed),'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: "1px", textTransform: "uppercase", color: BRAND.g1, mb: "2px" }}>
          Top 10 브랜드 볼륨
        </Box>
        <Box sx={{ fontSize: 11, color: "#666", mb: "8px" }}>최신 연도 기준 MTD · YTD (HL) · vs LY</Box>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Company</TableCell>
              <TableCell align="right">MTD (HL)</TableCell>
              <TableCell align="right">YTD (HL)</TableCell>
              <TableCell align="right">vs LY</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {top10.map((b, i) => {
              const isUp = b.vsLY != null && b.vsLY > 0;
              const isDn = b.vsLY != null && b.vsLY < 0;
              return (
                <TableRow key={b.name}>
                  <TableCell sx={{ color: "#aaa", fontWeight: 400 }}>{i + 1}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: b.color, flexShrink: 0 }} />
                      <strong>{b.name}</strong>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: "#888" }}>{b.company}</TableCell>
                  <TableCell align="right">{b.mtd > 0 ? b.mtd.toLocaleString("en", { maximumFractionDigits: 0 }) : "—"}</TableCell>
                  <TableCell align="right">{b.ytd > 0 ? b.ytd.toLocaleString("en", { maximumFractionDigits: 0 }) : "—"}</TableCell>
                  <TableCell align="right" sx={{ color: isUp ? "#2e7d32" : isDn ? "#c62828" : "#888", fontWeight: 600 }}>
                    {b.vsLY != null ? `${isUp ? "▲ +" : isDn ? "▼ " : ""}${b.vsLY.toFixed(1)}%` : "—"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
