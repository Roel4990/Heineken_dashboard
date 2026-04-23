"use client";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

interface Props {
  label: string;
  value: string;
  delta: number | null;
  accentColor: string;
}

export default function KpiCard({ label, value, delta, accentColor }: Props) {
  const isUp = delta != null && delta > 0.05;
  const isDn = delta != null && delta < -0.05;

  return (
    <Paper
      sx={{
        p: "13px 15px",
        borderLeft: `4px solid ${accentColor}`,
        borderRadius: "8px",
      }}
    >
      <Box
        sx={{
          fontSize: 10, fontWeight: 600, color: "#666",
          textTransform: "uppercase", letterSpacing: "1px", mb: "4px",
        }}
      >
        {label}
      </Box>
      <Box
        sx={{
          fontFamily: "var(--font-barlow-condensed),'Barlow Condensed',sans-serif",
          fontSize: 25, fontWeight: 700, color: accentColor, lineHeight: 1,
        }}
      >
        {value}
      </Box>
      {delta != null && (
        <Box
          sx={{
            fontSize: 10, mt: "3px",
            color: isUp ? "#2e7d32" : isDn ? "#c62828" : "#888",
          }}
        >
          {isUp ? "▲ +" : isDn ? "▼ -" : "▶ "}
          {Math.abs(delta).toFixed(1)}pp vs 전월
        </Box>
      )}
    </Paper>
  );
}
