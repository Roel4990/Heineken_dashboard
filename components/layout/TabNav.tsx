"use client";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import type { TabId } from "@/lib/types";

const TABS: { id: TabId; label: string }[] = [
  { id: "overview",    label: "Overview" },
  { id: "performance", label: "HKR Performance" },
  { id: "portfolio",   label: "Portfolio" },
  { id: "category",    label: "Category View" },
];

interface Props {
  active: TabId;
  onChange: (tab: TabId) => void;
}

export default function TabNav({ active, onChange }: Props) {
  const idx = TABS.findIndex((t) => t.id === active);
  return (
    <Tabs
      value={idx}
      onChange={(_, v: number) => onChange(TABS[v].id)}
      variant="scrollable"
      scrollButtons="auto"
      sx={{ px: "28px" }}
    >
      {TABS.map((t) => (
        <Tab key={t.id} label={t.label} disableRipple />
      ))}
    </Tabs>
  );
}
