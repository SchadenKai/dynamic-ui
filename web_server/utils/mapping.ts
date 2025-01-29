import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Markdown } from "@/components/ui/markdown";
import { LineChart } from "@/components/ui/charts/line-chart";
import { BarChart } from "@/components/ui/charts/bar-chart";
import { PieChart } from "@/components/ui/charts/pie-chart";
import { DataTable } from "@/components/ui/data-table";
import { ComponentType } from "react";

// Base component props that all components should accept
interface BaseComponentProps {
  className?: string;
  [key: string]: unknown;
}

// Table component props based on template schema
interface FieldModel {
  field_name: string;
  label: string;
  value: string;
  data_type: string;
  sortable: boolean;
  filterable: boolean;
  hidden: boolean;
}

interface TableComponentProps extends BaseComponentProps {
  title: string;
  description: string;
  table_name: string;
  fields: FieldModel[];
}

// Markdown component props based on template schema
interface MarkdownComponentProps extends BaseComponentProps {
  title: string;
  description: string;
  table_name: string;
  content: string;
}

// Line and Bar chart props share the same structure
interface XYChartProps extends BaseComponentProps {
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
interface PieChartProps extends BaseComponentProps {
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
  | BaseComponentProps 
  | TableComponentProps 
  | MarkdownComponentProps 
  | XYChartProps 
  | PieChartProps;

const componentMap: Record<string, ComponentType<ComponentProps>> = {
  "Button": Button as ComponentType<ComponentProps>,
  "Input": Input as ComponentType<ComponentProps>,
  "DataTable": DataTable as ComponentType<ComponentProps>,
  "Textarea": Textarea as ComponentType<ComponentProps>,
  "Markdown": Markdown as ComponentType<ComponentProps>,
  "LineChart": LineChart as ComponentType<ComponentProps>,
  "BarChart": BarChart as ComponentType<ComponentProps>,
  "PieChart": PieChart as ComponentType<ComponentProps>,
};

export function mapTextToComponent(
  text: string
): ComponentType<ComponentProps> | null {
  const component = componentMap[text];
  return component || null;
}
