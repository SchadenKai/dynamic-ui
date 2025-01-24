from enum import Enum
from pydantic import BaseModel
from typing import Optional, Union, List

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