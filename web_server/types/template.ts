
interface FieldModel {
    field_name: string;
    label: string;
    value: string | number | boolean[];
    data_type: string;
    sortable: boolean;
    filterable: boolean;
    hidden: boolean;
}

interface TableComponentModel {
    component_type: "table";
    title: string;
    description: string;
    table_name: string;
    fields: FieldModel[];
}

interface SubListModel {
    field_name: string;
    value: string;
}

interface ListModel {
    value: string;
    sub_list: SubListModel[];
}

interface ListComponentModel {
    component_type: "list";
    title: string;
    description: string;
    table_name: string;
    list: ListModel[];
}

interface MarkdownComponent {
    component_type: "markdown";
    title: string;
    description: string;
    table_name: string;
    content: string;
}

interface DatasetYData {
    field_name: string;
    label: string;
    values: (number | string)[];
}

interface DatasetXData {
    field_name: string;
    label: string;
    values: (number | string)[];
}

interface DatasetModel {
    y_data: DatasetYData[];
    x_data: DatasetXData;
}

interface LineGraphComponent {
    component_type: "line_graph";
    title: string;
    description: string;
    table_name: string;
    datasets: DatasetModel;
}

interface BarGraphComponent {
    component_type: "bar_graph";
    title: string;
    description: string;
    table_name: string;
    datasets: DatasetModel;
}

interface PieGraphDatasetModel {
    field_name: string[];
    label: string[];
    values: (number | string)[];
}

interface PieGraphComponent {
    component_type: "pie_graph";
    title: string;
    description: string;
    table_name: string;
    datasets: PieGraphDatasetModel;
}

type ComponentModel = TableComponentModel | ListComponentModel | MarkdownComponent | LineGraphComponent | BarGraphComponent | PieGraphComponent;

export interface TemplateModel {
    template_name: string;
    description: string;
    components: ComponentModel[];
}
