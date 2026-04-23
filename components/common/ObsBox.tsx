"use client";
import Box from "@mui/material/Box";
import { BRAND } from "@/lib/colors";
import type { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}

export default function ObsBox({ title, children }: Props) {
  return (
    <Box
      sx={{
        background: "linear-gradient(135deg,#f8fff4,#e4f5d0)",
        border: "1px solid #b8dca0",
        borderLeft: `4px solid ${BRAND.g3}`,
        borderRadius: "8px",
        p: "13px 17px",
        mb: "16px",
      }}
    >
      <Box
        sx={{
          fontFamily: "var(--font-barlow-condensed),'Barlow Condensed',sans-serif",
          fontWeight: 700, fontSize: 12, letterSpacing: "1px",
          textTransform: "uppercase", color: BRAND.g1, mb: "7px",
        }}
      >
        {title}
      </Box>
      <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
        {children}
      </Box>
    </Box>
  );
}

export function ObsItem({ children }: { children: ReactNode }) {
  return (
    <Box
      component="li"
      sx={{
        fontSize: 12, py: "3px", pl: "13px", position: "relative",
        "&::before": { content: "'▸'", position: "absolute", left: 0, color: BRAND.g3 },
      }}
    >
      {children}
    </Box>
  );
}
