"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DynamicComponentRenderer from "@/lib/dynamicComponent";
import React from "react";
import { ComponentConfig, ComponentProps, TableComponentProps, MarkdownComponentProps, XYChartProps, PieChartProps } from "@/utils/mapping";

interface TemplateResponse {
  template_json: {
    template_name: string;
    description: string;
    components: Array<{
      component_type: string;
      title: string;
      description: string;
      table_name: string;
      fields?: Array<{
        field_name: string;
        label: string;
        value: string | number | boolean[];
        data_type: string;
        sortable: boolean;
        filterable: boolean;
        hidden: boolean;
      }>;
      content?: string;
      datasets?: {
        x_data?: {
          field_name: string;
          label: string;
          values: (number | string)[];
        };
        y_data?: Array<{
          field_name: string;
          label: string;
          values: (number | string)[];
        }>;
        field_name?: string[];
        label?: string[];
        values?: (number | string)[];
      };
    }>;
  };
  api_query: unknown;
}

const Page: React.FC = () => {
  const [response, setResponse] = React.useState<TemplateResponse | null>(null);
  const [input, setInput] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleSend = async () => {
    setIsLoading(true);
    const data = {
      message: input,
    };
    try {
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
    } catch (error) {
      console.error("Error fetching template:", error);
    }
    setIsLoading(false);
  };

  const mapResponseToComponents = (template: TemplateResponse): ComponentConfig[] => {
    if (!template.template_json?.components) return [];

    return template.template_json.components.map(component => {
      const baseProps = {
        component_type: component.component_type,
        title: component.title,
        description: component.description,
        table_name: component.table_name,
      };

      let mappedProps: ComponentProps;
      switch (component.component_type) {
        case "table":
          mappedProps = {
            ...baseProps,
            fields: component.fields || [],
          } as TableComponentProps;
          break;

        case "markdown":
          mappedProps = {
            ...baseProps,
            content: component.content || "",
          } as MarkdownComponentProps;
          break;

        case "line_graph":
        case "bar_graph":
          if (component.datasets?.x_data && component.datasets?.y_data) {
            mappedProps = {
              ...baseProps,
              datasets: {
                x_data: component.datasets.x_data,
                y_data: component.datasets.y_data,
              },
            } as XYChartProps;
          } else {
            throw new Error(`Invalid ${component.component_type} data structure`);
          }
          break;

        case "pie_graph":
          if (
            component.datasets?.field_name &&
            component.datasets?.label &&
            component.datasets?.values
          ) {
            mappedProps = {
              ...baseProps,
              datasets: {
                field_name: component.datasets.field_name,
                label: component.datasets.label,
                values: component.datasets.values,
              },
            } as PieChartProps;
          } else {
            throw new Error("Invalid pie graph data structure");
          }
          break;

        default:
          throw new Error(`Unknown component type: ${component.component_type}`);
      }

      return {
        type: component.component_type,
        props: mappedProps,
        className: getDefaultClassForComponent(component.component_type)
      };
    });
  };

  const getDefaultClassForComponent = (type: string): string => {
    switch (type) {
      case "table":
        return "w-full";
      case "markdown":
        return "p-4 border rounded-lg";
      case "line_graph":
      case "bar_graph":
      case "pie_graph":
        return "w-full h-[300px] p-4";
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col items-center justify-start h-full w-full p-5">
      <h1>Template Generator</h1>
      <Input
        onChange={(e) => setInput(e.currentTarget.value)}
        className="mx-4 mb-2"
        placeholder="Enter your request..."
      />
      <Button disabled={isLoading} className="mx-4 mb-4" onClick={handleSend}>
        {isLoading ? "Generating..." : "Generate Template"}
      </Button>
      
      {response?.template_json && (
        <div className="w-full">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">{response.template_json.template_name}</h2>
            <p className="text-sm text-muted-foreground">{response.template_json.description}</p>
          </div>
          
          <div className="w-full my-4 border p-5 flex flex-col items-center justify-start gap-3">
            {(() => {
              try {
                return mapResponseToComponents(response).map((component, index) => (
                  <DynamicComponentRenderer
                    key={index}
                    componentType={component.type}
                    props={component.props}
                    className={component.className}
                  />
                ));
              } catch (error) {
                console.error('Error mapping components:', error);
                return (
                  <div className="p-4 border border-red-200 bg-red-50 text-red-700 rounded-lg">
                    Error rendering components: {(error as Error).message}
                  </div>
                );
              }
            })()}
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Raw Response</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-auto">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
