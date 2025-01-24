import React from "react";
import { mapTextToComponent } from "@/utils/mapping";

interface DynamicComponentRendererProps {
  componentType: string;
  props: any;
}

const DynamicComponentRenderer: React.FC<DynamicComponentRendererProps> = ({ componentType, props }) => {
  const Component = mapTextToComponent(componentType);

  if (!Component) {
    return <div>Component not found</div>;
  }

  return <Component {...props} />;
};

export default DynamicComponentRenderer;