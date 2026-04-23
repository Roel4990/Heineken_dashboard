"use client";
import Box from "@mui/material/Box";
import { BRAND } from "@/lib/colors";

interface Props {
  title: string;
  tag: string;
}

export default function SectionHeader({ title, tag }: Props) {
  return (
    <Box
      sx={{
        display: "flex", alignItems: "center", gap: "9px",
        mb: "14px", pb: "9px", borderBottom: `2px solid #dde8d5`,
      }}
    >
      <Box
        component="h2"
        sx={{
          fontFamily: "var(--font-barlow-condensed),'Barlow Condensed',sans-serif",
          fontWeight: 700, fontSize: 19, letterSpacing: "1px",
          textTransform: "uppercase", color: BRAND.g1, m: 0,
        }}
      >
        {title}
      </Box>
      <Box
        sx={{
          fontSize: 10, fontWeight: 600, color: "#666",
          px: "9px", py: "3px", border: "1px solid #dde8d5",
          borderRadius: "10px", letterSpacing: ".5px",
        }}
      >
        {tag}
      </Box>
    </Box>
  );
}
