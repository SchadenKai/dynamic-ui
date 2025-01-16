import { DynamicElement } from "@/types/renderElements";
import { parseAttributes } from "./parseAttributes";
import React from "react";

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