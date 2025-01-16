from langchain_ollama import OllamaLLM

llm = OllamaLLM(model="llama3.1")
response = llm.invoke("The first man on the moon was ...")
print(response)



from langchain_core.tools import tool

@tool
def multiply(a: int, b: int) -> int:
    """Multiply a and b."""
    return a * b