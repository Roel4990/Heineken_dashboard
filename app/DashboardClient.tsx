"use client";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Fade from "@mui/material/Fade";
import type { TabId, ProcessedMarketData } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { processData } from "@/lib/dataProcessor";
import AppHeader from "@/components/layout/AppHeader";
import TabNav from "@/components/layout/TabNav";
import FilterBar from "@/components/layout/FilterBar";
import OverviewSection from "@/components/sections/OverviewSection";
import PerformanceSection from "@/components/sections/PerformanceSection";
import PortfolioSection from "@/components/sections/PortfolioSection";
import CategorySection from "@/components/sections/CategorySection";

export default function DashboardClient() {
  const router = useRouter();
  const [data, setData] = useState<ProcessedMarketData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [range, setRange] = useState({ s: 0, e: 0 });
  const handleApply = useCallback((s: number, e: number) => setRange({ s, e }), []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/login");
        return;
      }
      processData()
        .then((d) => {
          setData(d);
          setRange({ s: 0, e: d.months.length - 1 });
        })
        .catch((err: unknown) => {
          setError(err instanceof Error ? err.message : "Failed to load data");
        });
    });
  }, [router]);

  if (error) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <Box sx={{ color: "error.main", textAlign: "center" }}>
          <div>Error loading data</div>
          <div style={{ fontSize: 12, marginTop: 8, opacity: 0.7 }}>{error}</div>
        </Box>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <CircularProgress sx={{ color: "#1a6b1a" }} />
      </Box>
    );
  }

  const { months } = data;
  const currentMonth = months[range.e] ?? "";

  const sections: { id: TabId; node: React.ReactNode }[] = [
    { id: "overview",    node: <OverviewSection    data={data} s={range.s} e={range.e} /> },
    { id: "performance", node: <PerformanceSection data={data} s={range.s} e={range.e} /> },
    { id: "portfolio",   node: <PortfolioSection   data={data} s={range.s} e={range.e} /> },
    { id: "category",   node: <CategorySection     data={data} /> },
  ];

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppHeader currentMonth={currentMonth} />
      <TabNav active={activeTab} onChange={setActiveTab} />
      <FilterBar months={months} startIdx={range.s} endIdx={range.e} onApply={handleApply} />

      <Box component="main" sx={{ flex: 1, p: { xs: "14px 14px 40px", md: "18px 28px 40px" } }}>
        {sections.map(({ id, node }) =>
          activeTab === id ? (
            <Fade key={id} in timeout={250}>
              <Box>{node}</Box>
            </Fade>
          ) : null
        )}
      </Box>

      <Box
        component="footer"
        sx={{
          background: "#1a6b1a", color: "rgba(255,255,255,.5)", fontSize: 10,
          p: "10px 28px", textAlign: "center", letterSpacing: "1px",
          "& strong": { color: "#fff" },
        }}
      >
        <strong>ONE TAP by CMI</strong> · Off Premise Analysis · Korea IPS Beer Market ·{" "}
        <strong>HEINEKEN Korea</strong> · FOR INTERNAL USE ONLY
      </Box>
    </Box>
  );
}
