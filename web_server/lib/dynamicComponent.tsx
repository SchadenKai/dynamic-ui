import React from "react";
import { mapTextToComponent, type ComponentProps } from "@/utils/mapping";

interface DynamicComponentRendererProps {
  componentType: string;
  props: ComponentProps;
  className?: string;
}

const DynamicComponentRenderer: React.FC<DynamicComponentRendererProps> = ({ 
  componentType, 
  props,
  className 
}) => {
  const Component = mapTextToComponent(componentType);

  if (!Component) {
    return <div>Component not found</div>;
  }

  return <Component {...props} className={className} />;
};

export default DynamicComponentRenderer;