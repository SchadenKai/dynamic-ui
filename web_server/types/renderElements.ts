export type Attribute = { [key: string]: unknown };

export interface DynamicElement {
  type: string;
  label?: string;
  children?: DynamicElement[];
  attributes?: Attribute | Attribute[];
}
