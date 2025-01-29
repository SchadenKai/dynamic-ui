import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Markdown } from "@/components/ui/markdown";
import { ComponentType } from "react";

// Base component props that all components should accept
interface BaseComponentProps {
  className?: string;
  [key: string]: unknown;
}

// Specific props for markdown component
interface MarkdownComponentProps extends BaseComponentProps {
  content: string;
}

// Union type of all possible component props
type ComponentProps = BaseComponentProps | MarkdownComponentProps;

const componentMap: Record<string, ComponentType<ComponentProps>> = {
  "Button": Button as ComponentType<ComponentProps>,
  "Input": Input as ComponentType<ComponentProps>,
  "Table": Table as ComponentType<ComponentProps>,
  "TableBody": TableBody as ComponentType<ComponentProps>,
  "TableCell": TableCell as ComponentType<ComponentProps>,
  "TableHead": TableHead as ComponentType<ComponentProps>,
  "TableHeader": TableHeader as ComponentType<ComponentProps>,
  "TableRow": TableRow as ComponentType<ComponentProps>,
  "Textarea": Textarea as ComponentType<ComponentProps>,
  "Markdown": Markdown as ComponentType<ComponentProps>,
};

const tableComponents = new Set([
  "Table",
  "TableBody", 
  "TableCell",
  "TableHead",
  "TableHeader",
  "TableRow"
]);

const tableStructureRules: Record<string, Set<string>> = {
  "Table": new Set(["TableHeader", "TableBody"]),
  "TableHeader": new Set(["TableRow"]),
  "TableBody": new Set(["TableRow"]),
  "TableRow": new Set(["TableCell", "TableHead"]),
};

function isTableComponent(componentName: string): boolean {
  return tableComponents.has(componentName);
}

function validateTableStructure(parentComponent: string, childComponent: string): boolean {
  if (!isTableComponent(parentComponent) || !isTableComponent(childComponent)) {
    return false;
  }
  
  const allowedChildren = tableStructureRules[parentComponent];
  return allowedChildren ? allowedChildren.has(childComponent) : false;
}

export interface TableContext {
  parentComponent?: string;
}

export function mapTextToComponent(
  text: string, 
  context: TableContext = {}
): ComponentType<ComponentProps> | null {
  const component = componentMap[text];
  
  if (!component) {
    return null;
  }

  // If this is a table component and we have a parent context, validate the structure
  if (isTableComponent(text) && context.parentComponent) {
    if (!validateTableStructure(context.parentComponent, text)) {
      console.warn(
        `Invalid table structure: ${text} cannot be a child of ${context.parentComponent}`
      );
      return null;
    }
  }

  return component;
}
