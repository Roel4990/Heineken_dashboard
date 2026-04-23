"use client";
import {
  ComposedChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";

export interface DualSeries {
  key: string;
  color: string;
  axis: "left" | "right";
  bold?: boolean;
}

interface Props {
  data: Record<string, string | number | null>[];
  series: DualSeries[];
  leftLabel?: string;
  rightLabel?: string;
  chartHeight?: number;
}

const tickStyle = { fontSize: 9 } as const;

export default function DualAxisLineWidget({
  data, series, leftLabel = "%", rightLabel = "PI", chartHeight = 250,
}: Props) {
  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <ComposedChart data={data} margin={{ top: 4, right: 48, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ebebeb" vertical={false} />
        <XAxis dataKey="month" tick={tickStyle} interval="preserveStartEnd" angle={-35} textAnchor="end" height={40} />
        <YAxis
          yAxisId="left"
          tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
          tick={{ fontSize: 10 }}
          width={38}
          label={{ value: leftLabel, angle: -90, position: "insideLeft", style: { fontSize: 9, fill: "#999" } }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tickFormatter={(v: number) => `${v.toFixed(0)}`}
          tick={{ fontSize: 10 }}
          width={38}
          label={{ value: rightLabel, angle: 90, position: "insideRight", style: { fontSize: 9, fill: "#999" } }}
        />
        <Tooltip
          cursor={false}
          wrapperStyle={{ outline: "none" }}
          formatter={(value: unknown, name: unknown) => {
            const nameStr = String(name);
            const s = series.find((x) => x.key === nameStr);
            if (s?.axis === "right") return [typeof value === "number" ? value.toFixed(1) : "—", nameStr];
            return [typeof value === "number" ? `${(value * 100).toFixed(1)}%` : "—", nameStr];
          }}
          labelStyle={{ fontSize: 11 }}
          itemStyle={{ fontSize: 11 }}
        />
        <Legend wrapperStyle={{ fontSize: 10, paddingTop: 6 }} iconSize={10} />
        {series.map((s) => (
          <Line
            key={s.key}
            yAxisId={s.axis}
            type="monotone"
            dataKey={s.key}
            stroke={s.color}
            strokeWidth={s.bold ? 2 : 1.4}
            dot={{ r: 2, stroke: s.color, strokeWidth: 1, fill: "#fff" }}
            connectNulls
            isAnimationActive={false}
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
