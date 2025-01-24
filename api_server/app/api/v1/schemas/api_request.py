from enum import Enum
from typing import List, Optional, Union

from pydantic import BaseModel, Field


class HttpMethod(str, Enum):
    GET = "GET"
    POST = "POST"
    PUT = "PUT"
    DELETE = "DELETE"
    
class Operator(str, Enum):
    EQUAL = "EQUAL"
    NOT_EQUAL = "NOT_EQUAL"
    GREATER_THAN = "GREATER_THAN"
    GREATER_THAN_EQUAL = "GREATER_THAN_EQUAL"
    LESS_THAN = "LESS_THAN"
    LESS_THAN_EQUAL = "LESS_THAN_EQUAL"
    LIKE = "LIKE"
    IN = "IN"

class DataType(str, Enum):
    STRING = "STRING"
    INTEGER = "INTEGER"
    FLOAT = "FLOAT"
    BOOLEAN = "BOOLEAN"
    DATE = "DATE"
    DATETIME = "DATETIME"

class SingleFilterSchema(BaseModel):
    field: str
    data_type: DataType
    operator: Operator
    value: Union[str, int, list[str], list[int]]

class FilterSchema(BaseModel):
    and_: Optional[list[SingleFilterSchema]] = None
    or_: Optional[list[SingleFilterSchema]] = None
    
class TableColumnSchema(BaseModel):
    columnName: str
    dataType: DataType
    length: Optional[int] = None
    foreignKey: Optional[str] = None
    description: Optional[str] = None
    

class ApiBodyRequestSchema(BaseModel):
    tableName: str
    columns: List[TableColumnSchema]
    max_rows: int
    page_count: int
    filter: Optional[FilterSchema] = None
    sort: Optional[dict] = None

class BeXOAPI(str, Enum):
    ACTION = "actions"
    SEARCH = "search"
    INSIGHTS = "insights"
    

class ApiRequest(BaseModel):
    method: HttpMethod
    endpoint: str
    query: Optional[str] = None
    body: Optional[list[ApiBodyRequestSchema]] = None