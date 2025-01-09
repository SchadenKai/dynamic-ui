import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import React from "react";

interface Element {
  type: string;
  value?: string;
  children?: Element[];
  props?: Record<string, unknown>;
}

const templateJSON: Element = {
  type: "table",
  children: [
    {
      type: "tr",
      children: [
        {
          type: "th",
          value: "Date",
        },
        {
          type: "th",
          value: "Bill File",
        },
      ],
    },
    {
      type: "tr",
      children: [
        {
          type: "td",
          value: "2023-01-01",
        },
        {
          type: "td",
          value: "bill_2023_01_01.pdf",
        },
      ],
    },
    {
      type: "tr",
      children: [
        {
          type: "td",
          value: "2023-02-01",
        },
        {
          type: "td",
          value: "bill_2023_02_01.pdf",
        },
      ],
    },
    {
      type: "tr",
      children: [
        {
          type: "td",
          value: "2023-02-01",
        },
        {
          type: "td",
          value: "bill_2023_02_01.pdf",
        },
      ],
    },
    {
      type: "tr",
      children: [
        {
          type: "td",
          value: "2023-02-01",
        },
        {
          type: "td",
          value: "bill_2023_02_01.pdf",
        },
      ],
    },
    {
      type: "tr",
      children: [
        {
          type: "td",
          value: "2023-02-01",
        },
        {
          type: "td",
          value: "bill_2023_02_01.pdf",
        },
      ],
    },
    {
      type: "tr",
      children: [
        {
          type: "td",
          value: "2023-02-01",
        },
        {
          type: "td",
          value: "bill_2023_02_01.pdf",
        },
      ],
    },
    
  ],
};

const templateJSONSchadcn: Element = {
  type: "Table",
  children: [
    {
      type: "TableRow",
      children: [
        { type: "TableCell", props: { variant: "header" }, value: "Date" },
        { type: "TableCell", props: { variant: "header" }, value: "File" },
      ],
    },
    {
      type: "TableRow",
      children: [
        { type: "TableCell", value: "01-01-2025" },
        { type: "TableCell", value: "Jan2025payslip.pdf" },
      ],
    },
    {
      type: "TableRow",
      children: [
        { type: "TableCell", value: "02-01-2025" },
        { type: "TableCell", value: "Feb2025payslip.pdf" },
      ],
    },
  ],
};

function renderElement(element: Element): React.ReactNode {
  const { type, value, children } = element;

  if (value) {
    return React.createElement(type, {}, value);
  }

  if (children) {
    return React.createElement(
      type,
      {},
      children.map((child) => renderElement(child))
    );
  }

  return null;
}

const componentMap: Record<string, React.ElementType> = {
  Table: Table,
  TableBody: TableBody,
  TableRow: TableRow,
  TableCell: TableCell,
  TableHead: TableHead,
};

const renderSchadcnElement = (element: Element) => {
  const { type, value, children, props } = element;

  // Map type to shadcn/ui component
  const Component = componentMap[type];
  if (!Component) {
    console.warn(`Unknown component type: ${type}`);
    return null;
  }

  // Render component with value or children
  if (value) {
    return <Component {...props}>{value}</Component>;
  }

  if (children) {
    return (
      <Component {...props}>
        {children.map((child) => renderElement(child))}
      </Component>
    );
  }

  return <Component {...props} />;
};

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor="user-query">Enter user query</Label>
          <Input id="user-query" />
        </div>
        <div>
          <h2>Output HTML</h2>
          <div className="border border-gray-200 p-4 w-full">
            {renderElement(templateJSON)}
          </div>
          {/* <h2>Using Schadcn Components</h2>
          <div className="border border-gray-200 p-4 w-full">
            {renderSchadcnElement(templateJSONSchadcn)}
          </div> */}
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
