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

// List component props based on template schema
interface SubListModel {
  field_name: string;
  value: string;
}

interface ListModel {
  value: string;
  sub_list: SubListModel[];
}

interface ListComponentProps {
  title: string;
  description: string;
  table_name: string;
  list: ListModel[];
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

// Union type of all possible component props
type ComponentProps = 
  | TableComponentProps 
  | ListComponentProps
  | MarkdownComponentProps 
  | XYChartProps 
  | PieChartProps;

// Higher order props that wrap component-specific props
interface ComponentConfig {
  type: string;
  props: ComponentProps;
  className?: string;
}

const componentMap: Record<string, ComponentType<ComponentProps & { className?: string }>> = {
  "table": DataTable as ComponentType<ComponentProps & { className?: string }>,
  "markdown": Markdown as ComponentType<ComponentProps & { className?: string }>,
  "line_graph": LineChart as ComponentType<ComponentProps & { className?: string }>,
  "bar_graph": BarChart as ComponentType<ComponentProps & { className?: string }>,
  "pie_graph": PieChart as ComponentType<ComponentProps & { className?: string }>,
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
  SubListModel,
  ListModel,
  TableComponentProps,
  ListComponentProps,
  MarkdownComponentProps,
  XYChartProps,
  PieChartProps
};
