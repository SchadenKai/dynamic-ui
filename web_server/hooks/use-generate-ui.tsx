import { parseGenerateUIFuncArgs } from "@/lib/parseGenerateUIFuncArgs";
import { generateUISS } from "@/services/generateUISS";
import { DynamicElement } from "@/types/renderElements";
import React, { useState } from "react";

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

export function renderElement(
  element: DynamicElement,
  idx?: number
): React.ReactNode {
  const { type, label, children, attributes } = element;

  attributes?.push({ name: "key", value: idx?.toString() ?? "" });
  const parsedAttributes = parseAttributes(attributes);
  console.log(
    `parsedAttributes BEING USED by ${type}: `,
    JSON.stringify(parsedAttributes)
  );
  const props = parsedAttributes.reduce(
    (acc, { name, value }) => ({ ...acc, [name]: value }),
    {}
  );
  console.log(`PROPS BEING USED by ${type}: `, JSON.stringify(props));

  if (type === "input") {
    const element = React.createElement(type, { ...props });
    return element;
  }

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
  handleGenerateUI: () => void;
  isLoading: boolean;
  rawOutput: DynamicElement | null;
  errorAIMessage: string;
}

export function useGenerateUI(user_query: string): GenerateUIHook {
  const [rawOutput, setRawOutput] = useState<DynamicElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorAIMessage, setErrorAIMessage] = useState("");

  const handleGenerateUI = () => {
    const generateUI = async () => {
      setIsLoading(true);
      const data = { user_input: user_query };
      const res = await generateUISS(data);
      if (typeof res !== "string" && res) {
        const parsedFuncArgs = parseGenerateUIFuncArgs(res.function.arguments);
        if (parsedFuncArgs) {
          setRawOutput(parsedFuncArgs);
        }
      } else if (typeof res === "string") {
        setErrorAIMessage(res);
      }
      setIsLoading(false);
    };
    generateUI();
  };
  return {
    handleGenerateUI,
    isLoading,
    rawOutput,
    errorAIMessage,
  };
}
