"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Cell, LabelList, ResponsiveContainer,
} from "recharts";
import type { HBarDatum } from "@/lib/types";

interface Props {
  data: HBarDatum[];
  chartHeight?: number;
}

export default function HBarChartWidget({ data, chartHeight = 250 }: Props) {
  const yWidth = Math.max(...data.map((d) => d.name.length)) * 6.5 + 8;
  const hasHighlight = data.some((d) => d.isHighlight);

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 48, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#ebebeb" horizontal={false} />
        <XAxis
          type="number"
          tickFormatter={(v: number) => `${v}%`}
          tick={{ fontSize: 10 }}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={yWidth}
          tick={(props: { x?: number | string; y?: number | string; payload?: { value: string } }) => {
            const px = Number(props.x ?? 0);
            const py = Number(props.y ?? 0);
            const val = props.payload?.value ?? "";
            const isHl = hasHighlight && data.find((d) => d.name === val)?.isHighlight;
            return (
              <text x={px} y={py} dy={4} textAnchor="end" fontSize={10}
                fontWeight={isHl ? 700 : 500} fill={isHl ? "#1a6b1a" : "#666"}>
                {val}
              </text>
            );
          }}
        />
        <Tooltip
          cursor={false}
          wrapperStyle={{ outline: "none" }}
          formatter={(value: unknown) => [typeof value === "number" ? `${value.toFixed(1)}%` : "—", "M/S"]}
          labelStyle={{ fontSize: 11 }}
          itemStyle={{ fontSize: 11 }}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} isAnimationActive={false}>
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={entry.color}
              fillOpacity={hasHighlight && !entry.isHighlight ? 0.72 : 1}
            />
          ))}
          <LabelList
            dataKey="value"
            position="right"
            content={({ x, y, width, height, value, index: i }) => {
              const entry = typeof i === "number" ? data[i] : undefined;
              const nx = (x as number) + (width as number) + 5;
              const ny = (y as number) + (height as number) / 2 + 4;
              return (
                <text
                  x={nx}
                  y={ny}
                  fontSize={entry?.isHighlight ? 12 : 11}
                  fontWeight={entry?.isHighlight ? 700 : 500}
                  fill={entry?.isHighlight ? "#1a6b1a" : "#666"}
                >
                  {typeof value === "number" ? `${value.toFixed(1)}%` : ""}
                </text>
              );
            }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
