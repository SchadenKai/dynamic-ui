from __future__ import annotations
from typing import List
import openai
from pydantic_ai import Agent
from pydantic import Field
from enum import Enum
from pydantic import BaseModel
from app.core.agent_config import openai_client, deepseek_chat_client, groq_model

generate_ui_tool ={
              "name": "generate_ui",
            "description": "Generate UI for React Application through generating a JSON object that represents the UI.",
            "parameters": {
              "type": "object",
              "properties": {
                "type": {
                  "type": "string",
                  "enum":["div", "button", "header", "section", "input", "form", "legend", "h1", "h2", "h3", "h4", "h5", "h6", "p", "a", "ul", "ol", "li", "table", "thead", "tbody", "tr", "th", "td", "img", "span", "nav", "footer", "article", "aside", "main", "figure", "figcaption", "blockquote", "pre", "code", "label", "textarea", "select", "option", "iframe", "canvas", "video", "audio", "source", "link", "meta", "style", "script"],
                  "description": "The type of the element to be generated"
                },
                "label":{
                    "type":"string",
                    "description": "The text content of the element"
                },
                "children": {
                    "type": "array",
                    "description": "The children elements of the element",
                    "items": {
                       "$ref": "#",
                     }
                },
                "attributes":{
                    "type": "array", 
                    "description": "The attributes of the element for example on click event for a button, type of inputs, etc.",
                    "items": {
                        "$ref": "#/$defs/attribute" 
                     }
                }
              },
              "required": ["type"],
              "$defs": {
                "attribute": {
                    "type": "object",
                    "properties":{
                        "name": { "type": "string"},
                        "value": {"type":"string"}
                   }
                }
              },
            }
            }

generate_ui_tool_deepseek = {
            "type": "function",
            "function": {
              "name": "generate_ui",
            "description": "Generate UI for React Application through generating a JSON object that represents the UI.",
            "parameters": {
              "type": "object",
              "properties": {
                "type": {
                  "type": "string",
                  "enum":["div", "button", "header", "section", "input", "form", "legend", "h1", "h2", "h3", "h4", "h5", "h6", "p", "a", "ul", "ol", "li", "table", "thead", "tbody", "tr", "th", "td", "img", "span", "nav", "footer", "article", "aside", "main", "figure", "figcaption", "blockquote", "pre", "code", "label", "textarea", "select", "option", "iframe", "canvas", "video", "audio", "source", "link", "meta", "style", "script"],
                  "description": "The type of the element to be generated"
                },
                "label":{
                    "type":"string",
                    "description": "The text content of the element"
                },
                "children": {
                    "type": "array",
                    "description": "The children elements of the element",
                    "items": {
                       "$ref": "#",
                     }
                },
                "attributes":{
                    "type": "array", 
                    "description": "The attributes of the element for example on click event for a button, type of inputs, etc.",
                    "items": {
                        "$ref": "#/$defs/attribute" 
                     }
                }
              },
              "required": ["type"],
              "$defs": {
                "attribute": {
                    "type": "object",
                    "properties":{
                        "name": { "type": "string"},
                        "value": {"type":"string"}
                   }
                }
              },
            }
            }
        }


def generate_ui(user_input: str):
    completion = deepseek_chat_client.chat.completions.create(
        model="deepseek-chat",
        messages=[
            {"role": "system", "content": "You are a UI generator AI for a ReactJS application. Make use of the `generate_ui` function to Convert the user input into a UI that is compatible to ReactJS. Also remember to make each UI being generated as complete as possible based on the request of the user."},
            {"role": "user", "content": f"{user_input}"}
        ],
        tools=[generate_ui_tool]
    )
    return completion.choices[0].message.tool_calls if completion.choices[0].message.tool_calls else completion.choices[0].message.content
  
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
    label: str
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
      "If not, regenerate it until it is structured based on the defined return type schema."
    )
  )
  result = await agent.run(user_input)
  return result.data