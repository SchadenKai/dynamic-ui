from pydantic_ai import Agent
from app.api.v1.schemas.template_json import TemplateJSON, TemplateModel
from app.core.agent_config import groq_model, openai_model


_SERVER = "https://stgapp.coolriots.ai/bexo"
_ENDPOINT = "/bexo/bexinsights/search?tenant_id=64f9f31ab8f2b3acae3x4sfe"
_HEADERS = {
    "Content-Type": "application/json",
    "access-token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZHlhbml6YWluaUBnbWFpbC5jb20iLCJpYXQiOjE3Mzc1MjM5MDcsImV4cCI6MTczNzYxMDMwNywic2NvcGUiOiJ0cmFpbmVlIiwidGVuYW50SWQiOiI2NGY5ZjMxYWI4ZjJiM2FjYWUzeDRzZmUifQ.VkqU20ojo9zGqsfwR5KYbdLQ-BhFJaJK2paeI3m0xKo"
}

async def template_json_generator_agent(user_input: str):
    agent = Agent(
        model=groq_model,
        result_retries=3,
        result_type=TemplateModel,
        system_prompt=(
            "You are a Template JSON Generator AI",
            "The Template JSON both includes the UI component definition and the API request definition that is requested by the user.",
        )
    )
    response = await agent.run(user_input)
    return response.data