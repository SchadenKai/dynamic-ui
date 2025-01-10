import openai

from app.core.openai_config import client

tools = [
        {
          "type": "function",
          "function": {
            "name": "generate_ui",
            "description": "Generate UI for React Application",
            "parameters": {
              "type": "object",
              "properties": {
                "type": {
                  "type": "string",
                  "enum":["div", "button", "header", "section", "input", "form", "legend", "h1", "h2", "h3", "h4", "h5", "h6", "p", "a", "ul", "ol", "li", "table", "thead", "tbody", "tr", "th", "td", "img", "span", "nav", "footer", "article", "aside", "main", "figure", "figcaption", "blockquote", "pre", "code", "label", "textarea", "select", "option", "iframe", "canvas", "video", "audio", "source", "link", "meta", "style", "script"]
                },
                "label":{
                    "type":"string"
                },
                "children": {
                    "type": "array",
                    "items": {
                       "$ref": "#",
                     }
                },
                "attributes":{
                    "type": "array", 
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
    ]; 


def generate_ui(user_input: str):
    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a UI generator AI for a ReactJS application. Convert the user input into a UI that is compatible to ReactJS."},
            {"role": "user", "content": f"{user_input}"}
        ],
        tools=tools
    )
    return completion.choices[0].message.tool_calls