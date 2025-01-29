"use client";

import * as React from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
} from "@/components/ui/chart";
import {
  Pie,
  PieChart as RechartsPieChart,
  Cell,
} from "recharts";

export interface PieChartProps {
  title?: string;
  description?: string;
  className?: string;
  datasets: {
    field_name: string[];
    label: string[];
    values: (number | string)[];
  };
}

interface PieDataPoint {
  name: string;
  value: number;
  fieldName: string;
}

export function PieChart({ datasets, className }: PieChartProps) {
  const data: PieDataPoint[] = datasets.label.map((label, index) => ({
    name: label,
    value: Number(datasets.values[index]) || 0,
    fieldName: datasets.field_name[index],
  }));

  // Create a config object for the chart with colors
  const config = data.reduce((acc, item) => {
    acc[item.fieldName] = {
      label: item.name,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  return (
    <ChartContainer config={config} className={className}>
      <RechartsPieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          labelLine={false}
          label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={config[entry.fieldName].color}
            />
          ))}
        </Pie>
        <ChartTooltip />
        <ChartLegend />
      </RechartsPieChart>
    </ChartContainer>
  );
}