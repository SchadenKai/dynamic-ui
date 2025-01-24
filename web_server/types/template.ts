import { ApiRequest } from "./api-request";
import { ChartComponent, FormComponent, ListComponent, ParagraphComponent, TableComponent } from "./component";

export interface TemplateJSONComponent {
    chart?: ChartComponent,
    paragraph?: ParagraphComponent,
    form?: FormComponent,
    table?: TableComponent,
    list?: ListComponent
    // Add more component types here
}

export interface TemplateJSON {
    templateName: string, // Unique identifier for the template
    description: string, // Metadata information for the LLM to know what the template is about
    component: TemplateJSONComponent[], // List of components that make up the template
    apiRequest: ApiRequest // API request object that the template uses
}