"use client";

import * as React from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
} from "recharts";

export interface BarChartProps {
  title?: string;
  description?: string;
  className?: string;
  datasets: {
    y_data: Array<{
      field_name: string;
      label: string;
      values: (number | string)[];
    }>;
    x_data: {
      field_name: string;
      label: string;
      values: (number | string)[];
    };
  };
}

interface ChartDataPoint {
  [key: string]: number | string;
}

export function BarChart({ datasets, className }: BarChartProps) {
  const data = datasets.x_data.values.map((xValue, index) => {
    const point: ChartDataPoint = {
      [datasets.x_data.field_name]: xValue,
    };
    datasets.y_data.forEach((yData) => {
      point[yData.field_name] = yData.values[index];
    });
    return point;
  });

  // Create a config object for the chart
  const config = datasets.y_data.reduce((acc, yData) => {
    acc[yData.field_name] = {
      label: yData.label,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  return (
    <ChartContainer config={config} className={className}>
      <RechartsBarChart data={data}>
        <XAxis
          dataKey={datasets.x_data.field_name}
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <ChartTooltip />
        {datasets.y_data.map((yData) => (
          <Bar
            key={yData.field_name}
            dataKey={yData.field_name}
            fill={config[yData.field_name].color}
            radius={[4, 4, 0, 0]}
          />
        ))}
        <ChartLegend />
      </RechartsBarChart>
    </ChartContainer>
  );
}