from openai import OpenAI

from app.core.config import Settings

client = OpenAI(api_key=Settings().openai_key)

tools = [
  {
      "type": "function",
      "function": {
          "name": "get_weather",
          "parameters": {
              "type": "object",
              "properties": {
                  "location": {"type": "string"}
              },
          },
      },
  }
]


def get_current_weather(location: str):
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",  
        messages=[
            {"role": "user", "content": f"What's the weather like in {location} today?"}
        ],
        tools=tools
    )

    return completion.choices[0].message.tool_calls