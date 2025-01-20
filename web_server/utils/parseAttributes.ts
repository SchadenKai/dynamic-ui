import { Attribute } from "@/types/renderElements";

export function parseAttributes(
  attributes: Attribute | Attribute[] | undefined
): Record<string, unknown> {
  if (!attributes) return {};

  // Combine array of attributes into a single object
  if (Array.isArray(attributes)) {
    return attributes.reduce((acc, attr) => {
      if (typeof attr === "object" && attr !== null) {
        return { ...acc, ...attr };
      }
      console.warn("Invalid attribute found:", attr);
      return acc;
    }, {});
  }

  if (typeof attributes === "object" && attributes !== null) {
    return attributes;
  }

  console.warn("Invalid attributes format:", attributes);
  return {};
}
