from __future__ import annotations
from typing import List
import openai
from pydantic_ai import Agent, Tool
from pydantic import Field
from enum import Enum
from pydantic import BaseModel
from app.core.agent_config import openai_client, deepseek_chat_client, groq_model
  
class TypeEnum(str, Enum):
    DIV = "div"
    BUTTON = "button"
    HEADER = "header"
    SECTION = "section"
    INPUT = "input"
    FORM = "form"
    LEGEND = "legend"
    H1 = "h1"
    H2 = "h2"
    H3 = "h3"
    H4 = "h4"
    H5 = "h5"
    H6 = "h6"
    P = "p"
    A = "a"
    UL = "ul"
    OL = "ol"
    LI = "li"
    TABLE = "table"
    THEAD = "thead"
    TBODY = "tbody"
    TR = "tr"
    TH = "th"
    TD = "td"
    IMG = "img"
    SPAN = "span"
    NAV = "nav"
    FOOTER = "footer"
    ARTICLE = "article"
    ASIDE = "aside"
    MAIN = "main"
    FIGURE = "figure"
    FIGCAPTION = "figcaption"
    BLOCKQUOTE = "blockquote"
    PRE = "pre"
    CODE = "code"
    LABEL = "label"
    TEXTAREA = "textarea"
    SELECT = "select"
    OPTION = "option"
    IFRAME = "iframe"
    CANVAS = "canvas"
    VIDEO = "video"
    AUDIO = "audio"
    SOURCE = "source"
    LINK = "link"
    META = "meta"
    STYLE = "style"
    SCRIPT = "script"


class Attribute(BaseModel):
    key: str
    value: str

class UIJsonBase(BaseModel):
    type: TypeEnum
    label: str = Field(default="", description="This is where the raw data will be displayed. Use this in best practices to display the raw data.")
    children: list[dict] = Field(default=[], description="The children elements of the element. The schema of this is a list of recursive on itself.")
    attributes: list[dict] = Field(default=[], description="The attributes of the element for example on click event for a button, type of inputs, etc.")


async def ui_json_generator_agent(user_input: str):
  agent = Agent(
    model=groq_model,
    result_retries=3,
    result_type=UIJsonBase,
    system_prompt=(
      "You are a UI Generator AI for a ReactJS application.",
      "Your job is to generate a UI that is compatible with ReactJS based on the user's request.",
      "Make sure to generate a complete UI based on the user's request.",
      "Also make sure that the final results is structured based on the defined return type schema.",
      "If the user request more than one UI, generate this inside a div element."
      "If not, regenerate it until it is structured based on the defined return type schema.",
    )
  )
  result = await agent.run(user_input)
  return result.data


class DisplayUIEnum(str, Enum):
    TABLE = "table"
    LIST = "li"
    PARAGRAPH = "p"

async def generate_ui(raw_data: str, ui_list: list[DisplayUIEnum]) -> list[UIJsonBase] | None:
    """
    This function generates a list of UI definition json based on the user's request and raw data given.
    This function will loop through the list of UI elements and generate a UI definition json for each element using the `ui_json_generator_agent` agent.
    Then it will return a list of UI definition json.
    
    Args:
    raw_data (str): The raw data to display in the UI.
    ui_list (list[DisplayUIEnum]): The list of UI elements to generate.
    
    Returns:
    list: A list of UI definition json.
    None: If the count is 1.
    """
    ui_json_list = []
    for element in range(ui_list):
        ui_json = await ui_json_generator_agent(f"Generate a {element} element that properly displays the raw data: {raw_data}")
        ui_json_list.append(ui_json)
    return ui_json_list

async def multi_uijson_generator_agent(raw_data: str, user_input: str):
  agent = Agent(
    model=groq_model,
    result_retries=3,
    result_type=UIJsonBase,
    system_prompt=(
      "You are a Layout Element Generator AI for a ReactJS application.",
      "Your job is to generate a styles layout container element that contains multiple UI elements as children.",
      "The children elements would be generated using the `generate_ui_tool` function and will return a list of UI definition JSON.",
      "Then you will need to structure the children elements based on the user's request and raw data given.",
    ),
    tools=[
      Tool(
        function=generate_ui,
        name="generate_ui_tool",
        description="This tool generates a list of UI definition json based on the user's request and raw data given.",
      )
    ]
  )
  result = await agent.run(f"user request: {user_input} raw data: {raw_data}")
  return result.data