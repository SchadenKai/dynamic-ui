from enum import Enum
from pydantic import BaseModel
from typing import Optional, Union, List, Literal

from app.api.v1.schemas.api_request import ApiRequest
from app.api.v1.schemas.components import ChartComponent, ParagraphComponent, FormComponent, TableComponent, ListComponent


class TemplateJSONComponent(BaseModel):
    chart: Optional[ChartComponent] = None
    paragraph: Optional[ParagraphComponent] = None
    form: Optional[FormComponent] = None
    table: Optional[TableComponent] = None
    list: Optional[ListComponent] = None

class TemplateJSON(BaseModel):
    templateName: str
    description: str
    component: List[TemplateJSONComponent]
    apiRequest: ApiRequest

# new template json schema
    
from pydantic import BaseModel, Field, RootModel
from typing import List, Optional, Union

class FieldModel(BaseModel):
    field_name: str = Field(description="Name of the field in the table")
    label: str = Field(description="Display label of the field_name in the table")
    value: str = Field(default="", description="Default value of the field_name in the table. This acts as a placeholder for the field value from the database")
    data_type: str = Field(description="Data type of the field_name in the table")
    sortable: bool
    filterable: bool
    hidden: bool

class TableComponent(BaseModel):
    component_type: Literal["table"] = Field("table")
    title: str = Field(description="Metadata Title of the table")
    description: str = Field(description="Metadata Description of the table")
    table_name: str = Field(description="Name of the table in the database")
    fields: List[FieldModel] = Field(description="List of fields in the table specified by table_name")

class SubListModel(BaseModel):
    field_name: str
    value: str = Field(default="", description="Default value of the field_name in the table. This acts as a placeholder for the field value from the database")

class ListModel(BaseModel):  
    value: str = Field(default="", description="Default value of the field_name in the table. This acts as a placeholder for the field value from the database")
    sub_list: List[SubListModel]

class ListComponent(BaseModel):
    component_type: Literal["list"] = Field("list")
    title: str = Field(description="Metadata Title of the list")
    description: str = Field(description="Metadata Description of the list")
    table_name: str = Field(description="Name of the table in the database")
    list: List[ListModel] = Field(description="List of fields in the table specified by table_name")

class MarkdownComponent(BaseModel):
    component_type: Literal["markdown"] = Field("markdown")
    title: str = Field(description="Metadata Title of the markdown")
    description: str = Field(description="Metadata Description of the markdown")
    table_name: str = Field(description="Name of the table in the database")
    content: str = Field(description="Markdown format of the LLM response based on the user request")

class DatasetYData(BaseModel):
    field_name: str = Field(description="Name of the field in the table")
    label: str = Field(description="Display label of the field_name in the table")
    values: List[Union[int, float]] = Field(default=[], description="A placeholder for the list of values for the field_name in the table")

class DatasetXData(BaseModel):
    field_name: str = Field(description="Name of the field in the table")
    label: str = Field(description="Display label of the field_name in the table")
    values: List[Union[int, float, str]] = Field(default=[], description="A placeholder for the list of values for the field_name in the table")

class DatasetModel(BaseModel):
    y_data: List[DatasetYData] = Field(description="List of fields that are requested by the user that can be plotted on the y-axis. The size of the values should be the same as the shape of the values of the x_data")
    x_data: DatasetXData = Field(description="Field in the table that are requested by the user that can be plotted on the x-axis. The size of the values should be the same as the shape of the values of the y_data")


class LineGraphComponent(BaseModel):
    component_type: Literal["line_graph"] = Field("line_graph")
    title: str = Field(description="Metadata Title of the line graph")
    description: str = Field(description="Metadata Description of the line graph")
    table_name: str = Field(description="Name of the table in the database")
    datasets: DatasetModel

class BarGraphComponent(BaseModel):
    component_type: Literal["bar_graph"] = Field("bar_graph")
    title: str = Field(description="Metadata Title of the bar graph")
    description: str = Field(description="Metadata Description of the bar graph")
    table_name: str = Field(description="Name of the table in the database")
    datasets: DatasetModel

class PieGraphDatasetModel(BaseModel):
    field_name: List[str] = Field(description="List of name of the field in the table")
    label: List[str] = Field(description="Display label of the field_name in the table")
    values: List[Union[int, float]] = Field(default=[], description="A placeholder for the value of the field_name in the table")

class PieGraphComponent(BaseModel):
    component_type: Literal["pie_graph"] = Field("pie_graph")
    title: str = Field(description="Metadata Title of the pie graph")
    description: str = Field(description="Metadata Description of the pie graph")
    table_name: str = Field(description="Name of the table in the database")
    datasets: PieGraphDatasetModel = Field(description="List of fields in the table specified by table_name. The shape of the field_name, label and values should be the same")

class ComponentModel(RootModel[Union[
    TableComponent, 
    ListComponent, 
    MarkdownComponent, 
    LineGraphComponent, 
    BarGraphComponent, 
    PieGraphComponent
]]):
    pass

class TemplateModel(BaseModel):
    template_name: str = Field(description="Unique name id of the template which will be stored in the database incase of repeated request from the user for the same template")
    description: str = Field(description="Metadata Description of the template")
    components: List[ComponentModel]
