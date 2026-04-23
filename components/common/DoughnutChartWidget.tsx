"use client";
import {
  PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer,
} from "recharts";
import type { PieDatum } from "@/lib/types";

interface Props {
  data: PieDatum[];
  chartHeight?: number;
}

export default function DoughnutChartWidget({ data, chartHeight = 250 }: Props) {
  const nonZero = data.filter((d) => d.value > 0);
  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <PieChart>
        <Pie
          data={nonZero}
          cx="45%"
          cy="50%"
          innerRadius="50%"
          outerRadius="80%"
          dataKey="value"
          isAnimationActive={false}
        >
          {nonZero.map((entry, index) => (
            <Cell key={index} fill={entry.color} stroke="#fff" strokeWidth={2} />
          ))}
        </Pie>
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          iconSize={10}
          wrapperStyle={{ fontSize: 10, paddingLeft: 8 }}
        />
        <Tooltip
          cursor={false}
          wrapperStyle={{ outline: "none" }}
          formatter={(value: unknown) => [typeof value === "number" ? `${value.toFixed(1)}%` : "—", "M/S"]}
          labelStyle={{ fontSize: 11 }}
          itemStyle={{ fontSize: 11 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
