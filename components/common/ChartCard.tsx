"use client";
import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { BRAND } from "@/lib/colors";
import type { ReactNode } from "react";

interface Props {
  title: string;
  sub?: string;
  height?: number | string;
  children: ReactNode;
  fullWidth?: boolean;
}

export default function ChartCard({ title, sub, height = 250, children, fullWidth }: Props) {
  return (
    <Paper sx={{ p: "14px 16px", gridColumn: fullWidth ? "1/-1" : undefined }}>
      <Box
        sx={{
          fontFamily: "var(--font-barlow-condensed),'Barlow Condensed',sans-serif",
          fontWeight: 700, fontSize: 13, letterSpacing: "1px",
          textTransform: "uppercase", color: BRAND.g1, mb: "2px",
        }}
      >
        {title}
      </Box>
      {sub && (
        <Box sx={{ fontSize: 11, color: "#666", mb: "10px" }}>{sub}</Box>
      )}
      <div style={{ position: "relative", width: "100%" }}>
        {React.isValidElement(children)
          ? React.cloneElement(children as React.ReactElement<{ chartHeight?: number }>, {
              chartHeight: typeof height === "number" ? height : 250,
            })
          : children}
      </div>
    </Paper>
  );
}
