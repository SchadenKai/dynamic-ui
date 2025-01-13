import { DynamicElement } from "@/types/renderElements"

export function parseGenerateUIFuncArgs(args: string): DynamicElement {
    // Replace single quotes with double quotes
    const formattedArgs = args.replace(/'/g, '"');
  
    try {
      // Parse the cleaned JSON
      const parsedArgs = JSON.parse(formattedArgs);
      console.log("parsedArgs", parsedArgs);
      return parsedArgs;
    } catch (error) {
      console.error("Failed to parse JSON:", error, "Input:", formattedArgs);
      throw new Error("Invalid JSON input");
    }
  }