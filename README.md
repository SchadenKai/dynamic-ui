# Dynamic UI through Generative AI
With the current capabilities of generative AI such as LLMs, it is not impossible to generate any text base content, this includes codes. Codes is what makes up an application and if the code can also be generated by LLMs, then dynamic UI is not possible.
Dynamic UI is a proof of concept for an application that has UI that adapts based on the user's demand. This can be charts, forms, list, tables, etc.
The core logic for this is the LLM and Tool Calling / Function Calling that enables to LLM to extend it capabilities and specialize on generating structured JSON that matches the interface for rendering into a UI.

## Tech Stack
- FastAPI
- OpenAI
- Huggingface transformers (free alternative for OpenAI)
- NextJS
- SchadcnUI
- Docker