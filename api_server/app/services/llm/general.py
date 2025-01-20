from enum import Enum
from pydantic_ai import Agent, Tool
from sqlalchemy import text
from sqlmodel import Session
from app.services.llm.dynamic_ui import ui_json_generator_agent
from app.db.session import get_sqlalchemy_engine
from app.services.llm.execute_query import sql_generator_agent
from app.core.agent_config import groq_model
from pydantic import BaseModel, Field

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



def execute_query(query: str, params: dict = None) -> list[dict] | None:
    """
    Executes a raw SQL query with optional parameters using SQLModel.

    Args:
        query (str): The raw SQL query to execute.
        params (dict, optional): Parameters to bind to the query. Defaults to None.

    Returns:
        list[dict]: A list of rows as dictionaries if the query returns results.
        None: If the query doesn't return rows (e.g., INSERT, UPDATE).
    """
    with Session(get_sqlalchemy_engine()) as session:
        # Use SQLAlchemy text for parameterized queries
        statement = text(query)
        result = session.execute(statement, params or {})

        # Check if the query returns rows
        if result.returns_rows:
            rows = result.fetchall()
            columns = result.keys()
            return [dict(zip(columns, row)) for row in rows]
        else:
            session.commit()
            return None


async def generate_ui_json(count: int, raw_data: list[dict]) -> list[UIJsonBase]:
    """
    Generates a UI JSON based on the count or number of UI layouts to be created and raw_data.
    
    Args:
        count (int): The number of UI layouts to generate.
        raw_data (list[dict]): The raw_data to be represented in the UI.
    
    Returns:
        list[UIJsonBase]: List of generated UI JSON based on the count and raw_data. This contains both the UI element definition and attributes, and raw_data.
    """
    r = await ui_json_generator_agent(f"Generate {count} basic UI element for a ReactJS application that best represents the raw data given: {raw_data}")
    return r

async def template_json_generator(user_input: str):
    agent = Agent(
        model=groq_model,
        result_retries=3,
        result_type=UIJsonBase,
        tools=[
            Tool(
                name="sql_generator_agent",
                function=sql_generator_agent,
                description="Generates SQL queries based on the user's request.",
                takes_ctx=False
            ),
            Tool(
                name="generate_ui_json",
                function=generate_ui_json,
                description="Generates UI JSON based on the count or number of UI layouts to be created and raw_data.",
                takes_ctx=False
            )
        ],
        system_prompt="""
            You are a dynamic UI generator where in based on the user's request, you will do the following steps:
            1. Retrieve raw data from the database by passing on the user's exact query to `sql_generator_agent`.
            2. Generate atleast 2 or 3 UI layouts that can best describe and display the user's request data using the `generate_ui_json` tool .
            3. Compile the generated UI layouts into a single div element with  proper attributes for layouting those  UI elements from step 2.
            REMINDER:
            Don't call the `final_result` tool unless the last step is done.
        """
    )
    result = await agent.run(user_input)
    return result.data