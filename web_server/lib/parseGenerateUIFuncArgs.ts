import { DynamicElement } from "@/types/renderElements";

export function parseGenerateUIFuncArgs(args: string): DynamicElement {
  try {
    // Attempt to parse JSON directly
    const parsedArgs = JSON.parse(args);
    console.log("Successfully parsed arguments:", parsedArgs);
    return parsedArgs;
  } catch {
    console.error("Failed to parse JSON. Input might be malformed.");
    console.error("Original Input:", args);

    // Additional debugging: Check for single quotes
    if (args.includes("'")) {
      console.warn("Input contains single quotes. Attempting to replace with double quotes...");
      const formattedArgs = args.replace(/'/g, '"');
      try {
        const parsedArgs = JSON.parse(formattedArgs);
        console.log("Successfully parsed after formatting:", parsedArgs);
        return parsedArgs;
      } catch (nestedError) {
        console.error("Failed again after formatting:", nestedError);
        console.error("Formatted Input:", formattedArgs);
      }
    }

    throw new Error("Invalid JSON input. Parsing failed.");
  }
}
