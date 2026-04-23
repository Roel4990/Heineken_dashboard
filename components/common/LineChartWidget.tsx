"use client";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import type { RechartsPoint } from "@/lib/types";

interface SeriesDef {
  key: string;
  color: string;
  bold?: boolean;
}

interface Props {
  data: RechartsPoint[];
  series: SeriesDef[];
  chartHeight?: number;
  yFormatter?: (v: number) => string;
}

const tickStyle = { fontSize: 9 } as const;
const tickStyleY = { fontSize: 10 } as const;

export default function LineChartWidget({ data, series, chartHeight = 250, yFormatter }: Props) {
  const fmt = yFormatter ?? ((v: number) => `${v}%`);
  const highlightedKeys = new Set(series.filter((item) => item.bold).map((item) => item.key));
  const hasBold = highlightedKeys.size > 0;

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ebebeb" vertical={false} />
        <XAxis
          dataKey="month"
          tick={tickStyle}
          interval="preserveStartEnd"
          angle={-35}
          textAnchor="end"
          height={40}
        />
        <YAxis
          tickFormatter={fmt}
          tick={tickStyleY}
          width={40}
        />
        <Tooltip
          cursor={false}
          wrapperStyle={{ outline: "none" }}
          formatter={(value: unknown) =>
            typeof value === "number" ? fmt(value) : "—"
          }
          labelStyle={{ fontSize: 11 }}
          itemStyle={{ fontSize: 11 }}
        />
        <Legend
          wrapperStyle={{ fontSize: 10, paddingTop: 6 }}
          iconSize={10}
          formatter={(value) => {
            const isHighlight = highlightedKeys.has(String(value));
            return (
              <span style={{ fontWeight: isHighlight ? 700 : 500, color: isHighlight ? "#1a6b1a" : "#666" }}>
                {String(value)}
              </span>
            );
          }}
        />
        {series.map((s) => {
          const dim = hasBold && !s.bold;
          return (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              stroke={s.color}
              strokeWidth={s.bold ? 2.1 : 1.2}
              strokeOpacity={dim ? 0.72 : 1}
              dot={{
                r: s.bold ? 2.8 : 2.2,
                stroke: s.color,
                strokeWidth: 1.2,
                fill: "#fff",
              }}
              connectNulls
              isAnimationActive={false}
            />
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  );
}
