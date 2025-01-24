from typing import List, Optional, Union

from pydantic import BaseModel

from app.api.v1.schemas.api_request import HttpMethod


class Validation(BaseModel):
    required: bool
    minLength: Optional[int] = None
    maxLength: Optional[int] = None
    pattern: Optional[str] = None
    min: Optional[int] = None
    max: Optional[int] = None
    email: Optional[bool] = None
    url: Optional[bool] = None
    date: Optional[bool] = None
    custom: Optional[str] = None

class FormFieldComponent(BaseModel):
    field: str
    dataType: str
    label: str
    placeholder: str
    required: bool
    disabled: bool
    hidden: bool
    value: Union[str, List[str]]
    inputType: str
    validation: Validation

class FormComponent(BaseModel):
    title: str
    description: str
    action: str
    method: HttpMethod
    fields: List[FormFieldComponent]

class TableFieldComponent(BaseModel):
    field: str
    label: str
    dataType: str
    sortable: bool
    filterable: bool
    hidden: bool

class TableComponent(BaseModel):
    title: str
    description: str
    fields: List[TableFieldComponent]

class ParagraphComponent(BaseModel):
    value: str
    label: str

class DatasetItem(BaseModel):
    label: str
    data: int
    backgroundColor: str
    borderColor: str
    borderWidth: int

class ChartComponent(BaseModel):
    title: str
    description: str
    action: str
    method: HttpMethod
    type: str
    labels: List[str]
    datasets: List[DatasetItem]

class ListComponent(BaseModel):
    title: str
    description: str
    items: Union[List[str], List['ListComponent']]