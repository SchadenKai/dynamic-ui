import { Attribute } from "@/types/renderElements";

export function parseAttributes(attributes: Attribute | Attribute[] | undefined): Attribute {
  if (!attributes) return {};

  // Combine array of attributes into a single object
  if (Array.isArray(attributes)) {
    return attributes.reduce((acc, attr) => ({ ...acc, ...attr }), {});
  }

  return attributes;
}