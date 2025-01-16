export function parseAttributes(
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
  