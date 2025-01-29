import React from "react";
import { mapTextToComponent } from "@/utils/mapping";

interface ComponentData {
  type: string;
  props: {
    children?: string | number | ComponentData | ComponentData[];
    [key: string]: unknown;
  };
}

type NestedChildren = string | number | ComponentData | ComponentData[] | null | undefined;

interface DynamicComponentRendererProps {
  componentType: string;
  props: {
    children?: NestedChildren;
    [key: string]: unknown;
  };
}

const DynamicComponentRenderer: React.FC<DynamicComponentRendererProps> = ({ 
  componentType, 
  props 
}) => {
  const Component = mapTextToComponent(componentType);

  if (!Component) {
    return <div>Component not found</div>;
  }

  // Process children recursively
  const processChildren = (children: NestedChildren) => {
    if (children === null || children === undefined) {
      return null;
    }

    if (Array.isArray(children)) {
      return children.map((child, index) => {
        if (typeof child === 'object' && 'type' in child) {
          return (
            <DynamicComponentRenderer
              key={index}
              componentType={child.type}
              props={child.props}
            />
          );
        }
        return child;
      });
    }
    
    if (typeof children === 'object' && children !== null && 'type' in children) {
      return (
        <DynamicComponentRenderer
          componentType={children.type}
          props={children.props}
        />
      );
    }

    return children;
  };

  const processedProps = { ...props };
  if ('children' in props) {
    processedProps.children = processChildren(props.children);
  }

  return <Component {...processedProps} />;
};

export default DynamicComponentRenderer;