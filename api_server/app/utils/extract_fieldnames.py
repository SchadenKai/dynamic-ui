from typing import Dict, List
from app.api.v1.schemas.template_json import TemplateModel, ComponentModel, TableComponent, ListComponent, LineGraphComponent, BarGraphComponent, PieGraphComponent

def extract_table_and_field_names(template: TemplateModel) -> Dict[str, List[str]]:
    result = {}
    for component in template.components:
        component_data = component.root
        if component_data.component_type == "table":
            table_name = component_data.table_name
            field_names = [field.field_name for field in component_data.fields]
        elif component_data.component_type == "list":
            table_name = component_data.table_name
            field_names = [item.field_name for sublist in component_data.list for item in sublist.sub_list]
        elif component_data.component_type in ["line_graph", "bar_graph"]:
            table_name = component_data.table_name
            field_names = [data.field_name for data in component_data.datasets.y_data]
            field_names.append(component_data.datasets.x_data.field_name)
        elif component_data.component_type == "pie_graph":
            table_name = component_data.table_name
            field_names = component_data.datasets.field_name
        else:
            continue
        result[table_name] = field_names
    return result