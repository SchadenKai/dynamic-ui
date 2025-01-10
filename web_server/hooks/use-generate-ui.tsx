import { parseGenerateUIFuncArgs } from "@/lib/parseGenerateUIFuncArgs";
import { generateUISS } from "@/services/generateUISS";
import { DynamicElement } from "@/types/renderElements";
import React, { useState } from "react";
import useLocalStorage from "./use-local-storage";

function parseAttributes(
  attributes: { name: string; value: string }[] | undefined
): { name: string; value: unknown }[] {
  const parsedAttributes: { name: string; value: unknown }[] = [];

  attributes?.forEach(({ name, value }) => {
    // Convert onClick or any stringified function to an actual function
    if (name.startsWith("on") && typeof value === "string") {
      parsedAttributes.push({ name, value: new Function(`return ${value}`)() });
    } else {
      parsedAttributes.push({ name, value });
    }
  });

  return parsedAttributes;
}

function renderElement(element: DynamicElement, idx?: number): React.ReactNode {
  const { type, label, children, attributes } = element;
  attributes?.push({ name: "key", value: idx?.toString() || "" });
  const parsedAttributes = parseAttributes(attributes);
  const props = parsedAttributes.reduce(
    (acc, { name, value }) => ({ ...acc, [name]: value }),
    {}
  );
  console.log(`PROPS BEING USED by ${type}: `, JSON.stringify(props));

  if (label) {
    const element = React.createElement(type, { ...props }, label);
    return element;
  }

  if (children) {
    const element = React.createElement(
      type,
      { ...props },
      children.map((child, idx) => renderElement(child, idx))
    );
    return element;
  }

  return null;
}

interface GenerateUIHook {
  dynamicElement: React.ReactNode;
  handleGenerateUI: () => void;
  isLoading: boolean;
  rawOutput: DynamicElement | null;
}

export function useGenerateUI(user_query: string): GenerateUIHook {
  const [dynamicElement, setDynamicElement] = useState<React.ReactNode>(null);
  const [rawResponse, setRawResponse] = useLocalStorage("rawResponse", "");
  const [rawOutput, setRawOutput] = useState<DynamicElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateUI = () => {
    const generateUI = async () => {
      setIsLoading(true);
      const data = { user_input: user_query };
      const res = await generateUISS(data);
      setRawResponse(JSON.stringify(res));
      if (rawResponse) {
        const jsonResponse = JSON.parse(rawResponse);
        const parsedFuncArgs = parseGenerateUIFuncArgs(
          jsonResponse.function.arguments
        );
        if (parsedFuncArgs) {
          setRawOutput(parsedFuncArgs);
          setDynamicElement(renderElement(parsedFuncArgs));
        }
      } else if (res) {
        const parsedFuncArgs = parseGenerateUIFuncArgs(res.function.arguments);
        if (parsedFuncArgs) {
          setRawOutput(parsedFuncArgs);
          setDynamicElement(renderElement(parsedFuncArgs));
        }
      }
      setIsLoading(false);
    };
    generateUI();
  };

  return { dynamicElement, handleGenerateUI, isLoading, rawOutput };
}
