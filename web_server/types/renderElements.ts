export interface DynamicElement {
  type: string;
  label?: string;
  children?: DynamicElement[];
  attributes?: { name: string; value: string }[];
}
