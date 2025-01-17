import { DynamicElement } from "@/types/renderElements";
import { parseAttributes } from "@/utils/parseAttributes";
import React from "react";

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

  // Parse attributes
  const parsedAttributes = parseAttributes(attributes);

  // Handle void elements
  if (_VOID_ELEMENTS.has(type)) {
    return React.createElement(type, parsedAttributes);
  }

  // Parse children recursively
  const parsedChildren = (children || []).map((child, index) => (
    <React.Fragment key={index}>{parseElement(child)}</React.Fragment>
  ));

  // Add label as a child if available (for non-void elements)
  if (label) {
    parsedChildren.unshift(
      <React.Fragment key="label">{label}</React.Fragment>
    );
  }

  // Return the React element
  return React.createElement(type, parsedAttributes, parsedChildren);
}
