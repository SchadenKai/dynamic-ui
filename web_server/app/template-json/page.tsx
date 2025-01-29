"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DynamicComponentRenderer from "@/lib/dynamicComponent";
import React from "react";

const Page: React.FC = () => {
  const [response, setResponse] = React.useState<string | null>(null);
  const [input, setInput] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const handleSend = async () => {
    setIsLoading(true);
    const data = {
      message: input,
    };
    const response = await fetch(
      "http://localhost:8000/chat/llm/template-json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const json = await response.json();
    setResponse(json);
    setIsLoading(false);
  };

  const componentsData = [
    {
      type: "Button",
      props: {
        placeholder: "Enter text",
        children: "Click Me",
        onClick: () => {
          console.log("Hello World");
        },
      },
    },
    { type: "Input", props: { placeholder: "Enter text" } },
    { type: "Textarea", props: { placeholder: "Enter more text" } },
    {
      type: "Markdown",
      props: {
        content: `# Example Markdown
## Features
- **Bold text** and *italic text*
- Lists and nested lists
  - Subitem 1
  - Subitem 2
- Code blocks

\`\`\`javascript
const greeting = "Hello World";
console.log(greeting);
\`\`\`

> This is a blockquote

Visit our [website](https://example.com)`,
        className: "p-4 border rounded-lg"
      }
    },
    {
      type: "LineChart",
      props: {
        className: "w-full h-[300px] p-4",
        datasets: {
          x_data: {
            field_name: "month",
            label: "Month",
            values: ["Jan", "Feb", "Mar", "Apr", "May"]
          },
          y_data: [
            {
              field_name: "sales",
              label: "Sales",
              values: [30, 40, 35, 50, 45]
            },
            {
              field_name: "revenue",
              label: "Revenue",
              values: [50, 45, 55, 70, 65]
            }
          ]
        }
      }
    },
    {
      type: "BarChart",
      props: {
        className: "w-full h-[300px] p-4",
        datasets: {
          x_data: {
            field_name: "category",
            label: "Category",
            values: ["A", "B", "C", "D", "E"]
          },
          y_data: [
            {
              field_name: "value1",
              label: "Value 1",
              values: [20, 30, 40, 25, 35]
            },
            {
              field_name: "value2",
              label: "Value 2",
              values: [15, 25, 35, 30, 20]
            }
          ]
        }
      }
    },
    {
      type: "PieChart",
      props: {
        className: "w-full h-[300px] p-4",
        datasets: {
          field_name: ["segment1", "segment2", "segment3", "segment4"],
          label: ["Segment 1", "Segment 2", "Segment 3", "Segment 4"],
          values: [30, 25, 20, 25]
        }
      }
    },
    {
      type: "Table",
      props: {
        className: "w-full border-collapse",
        children: [
          {
            type: "TableHeader",
            props: {
              children: [
                {
                  type: "TableRow",
                  props: {
                    children: [
                      { type: "TableHead", props: { children: "Name" } },
                      { type: "TableHead", props: { children: "Role" } },
                      { type: "TableHead", props: { children: "Status" } },
                    ],
                  },
                },
              ],
            },
          },
          {
            type: "TableBody",
            props: {
              children: [
                {
                  type: "TableRow",
                  props: {
                    children: [
                      { type: "TableCell", props: { children: "John Doe" } },
                      { type: "TableCell", props: { children: "Developer" } },
                      { type: "TableCell", props: { children: "Active" } },
                    ],
                  },
                },
                {
                  type: "TableRow",
                  props: {
                    children: [
                      { type: "TableCell", props: { children: "Jane Smith" } },
                      { type: "TableCell", props: { children: "Designer" } },
                      { type: "TableCell", props: { children: "Away" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ];

  return (
    <div className="flex flex-col items-center justify-start h-full w-full p-5 ">
      <h1>Raw Data</h1>
      <Input
        onChange={(e) => setInput(e.currentTarget.value)}
        className="mx-4"
      />
      <Button disabled={isLoading} className="mx-4" onClick={handleSend}>
        {isLoading ? "Loading..." : "Send"}
      </Button>
      <div>{response && <pre>{JSON.stringify(response, null, 2)}</pre>}</div>
      <div className="w-full my-4 border p-5 flex flex-col items-center justify-start gap-3">
        {componentsData.map((component, index) => (
          <DynamicComponentRenderer
            key={index}
            componentType={component.type}
            props={component.props}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;
