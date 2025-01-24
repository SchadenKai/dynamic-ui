type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface FormFieldComponent {
    field: string,
    dataType: "string" | "number" | "boolean" | "date",
    label: string,
    placeholder: string,
    required: boolean,
    disabled: boolean,
    hidden: boolean,
    value: string | string[],
    inputType: "text" | "number" | "password" | "email" | "date" | "checkbox" | "radio" | "select" | "textarea",
    validation: {
        required: boolean,
        minLength: number,
        maxLength: number,
        pattern: string,
        min: number,
        max: number,
        email: boolean,
        url: boolean,
        date: boolean,
        custom: string
    }
}

export interface FormComponent {
    title: string,
    description: string,
    action: string,
    method: HttpMethod,
    fields: FormFieldComponent[],
}

export interface TableFieldComponent {
    field: string,
    label: string,
    dataType: "string" | "number" | "boolean" | "date",
    sortable: boolean,
    filterable: boolean,
    hidden: boolean,
}

export interface TableComponent {
    title: string,
    description: string,
    fields: TableFieldComponent[],
}

export interface ParagraphComponent {
    value: string,
    label: string
}

export interface DatasetItem {
    label: string,
    data: number,
    backgroundColor: string,
    borderColor: string,
    borderWidth: number,
}

export interface ChartComponent {
    title: string,
    description: string,
    action: string,
    method: HttpMethod,
    type: "line" | "bar" | "pie" | "doughnut" | "radar" | "polarArea",
    labels: string[],
    datasets: DatasetItem[]
}

export interface ListComponent {
    title: string,
    description: string,
    items: string[] | ListComponent[]
}