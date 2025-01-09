import openai

tool = [
    {
        type: "function",
        function: {
            "name": "generate_ui",
            "description": "Generate a user interface based on the user's input",
            "parameters": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "enum": [
                            "div", "button", "input", "text", "image", "video", "audio", 
                            "form", "list", "table", "chart", "map", "calendar", "slider", 
                            "dropdown", "checkbox", "radio", "switch", "link", "icon", 
                            "label", "heading", "paragraph", "code", "quote", "divider", 
                            "spacer", "container"
                        ]
                    },
                    "label": {
                        "type": "string"
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
            },
        }
    }
]

def generate_prompt():
    return {"message": "Prompt generated"}

def generate_ui():
    return {"message": "UI generated"}