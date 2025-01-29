import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Markdown } from "@/components/ui/markdown";
import { LineChart } from "@/components/ui/charts/line-chart";
import { BarChart } from "@/components/ui/charts/bar-chart";
import { PieChart } from "@/components/ui/charts/pie-chart";
import { DataTable } from "@/components/ui/data-table";
import { ComponentType } from "react";

// Table component props based on template schema
interface FieldModel {
  field_name: string;
  label: string;
  value: string | number | boolean[];
  data_type: string;
  sortable: boolean;
  filterable: boolean;
  hidden: boolean;
}

interface TableComponentProps {
  title: string;
  description: string;
  table_name: string;
  fields: FieldModel[];
}

// Markdown component props based on template schema
interface MarkdownComponentProps {
  title: string;
  description: string;
  table_name: string;
  content: string;
}

// Line and Bar chart props share the same structure
interface XYChartProps {
  title: string;
  description: string;
  table_name: string;
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

// Pie chart has a different data structure
interface PieChartProps {
  title: string;
  description: string;
  table_name: string;
  datasets: {
    field_name: string[];
    label: string[];
    values: (number | string)[];
  };
}

// Base props for simple components
interface SimpleComponentProps {
  [key: string]: unknown;
}

// Union type of all possible component props
type ComponentProps = 
  | TableComponentProps 
  | MarkdownComponentProps 
  | XYChartProps 
  | PieChartProps
  | SimpleComponentProps;

// Higher order props that wrap component-specific props
interface ComponentConfig {
  type: string;
  props: ComponentProps;
  className?: string;
}

const componentMap: Record<string, ComponentType<ComponentProps & { className?: string }>> = {
  "Button": Button as ComponentType<ComponentProps & { className?: string }>,
  "Input": Input as ComponentType<ComponentProps & { className?: string }>,
  "DataTable": DataTable as ComponentType<ComponentProps & { className?: string }>,
  "Textarea": Textarea as ComponentType<ComponentProps & { className?: string }>,
  "Markdown": Markdown as ComponentType<ComponentProps & { className?: string }>,
  "LineChart": LineChart as ComponentType<ComponentProps & { className?: string }>,
  "BarChart": BarChart as ComponentType<ComponentProps & { className?: string }>,
  "PieChart": PieChart as ComponentType<ComponentProps & { className?: string }>,
};

export function mapTextToComponent(
  text: string
): ComponentType<ComponentProps & { className?: string }> | null {
  const component = componentMap[text];
  return component || null;
}

// Export types for use in other files
export type {
  ComponentConfig,
  ComponentProps,
  FieldModel,
  TableComponentProps,
  MarkdownComponentProps,
  XYChartProps,
  PieChartProps
};
