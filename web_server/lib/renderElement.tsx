import React from "react";
import { DynamicElement } from "@/types/renderElements";
import { parseAttributes } from "@/utils/parseAttributes";

const _VOID_ELEMENTS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "source",
  "track",
  "wbr",
]);

export function parseElement(elementData: DynamicElement): React.ReactNode {
  const { type, attributes, children, label } = elementData;

  if (!type || typeof type !== "string") {
    console.warn("Invalid type for element:", elementData);
    return null;
  }

  // Parse attributes
  const parsedAttributes = parseAttributes(attributes);

  // Handle void elements
  if (_VOID_ELEMENTS.has(type)) {
    return React.createElement(type, parsedAttributes);
  }

  // Parse children recursively
  const parsedChildren = (children || []).map((child, index) => {
    return <React.Fragment key={index}>{parseElement(child)}</React.Fragment>;
  });

  // Add label if provided
  if (label) {
    parsedChildren.unshift(<span key="label">{label}</span>);
  }

  // Return React element
  return React.createElement(type, parsedAttributes, parsedChildren);
}
