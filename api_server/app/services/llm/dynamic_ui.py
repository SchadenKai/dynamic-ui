import openai

from app.core.openai_config import openai_client

generate_ui_tool = {
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


def generate_ui(user_input: str):
    completion = openai_client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a UI generator AI for a ReactJS application. Make use of the `generate_ui` function to Convert the user input into a UI that is compatible to ReactJS. Also remember to make each UI being generated as complete as possible based on the request of the user."},
            {"role": "user", "content": f"{user_input}"}
        ],
        tools=[generate_ui_tool]
    )
    return completion.choices[0].message.tool_calls if completion.choices[0].message.tool_calls else completion.choices[0].message.content