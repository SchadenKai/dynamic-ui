import json
from sqlalchemy import text
from sqlmodel import Session
from app.db.session import get_sqlalchemy_engine
from app.core.openai_config import openai_client


def execute_query(query: str, params: dict = None):
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


generate_sql_query_tool = {
    "name": "generate_sql_query",
    "description": "Generate an accurate SQL query and parameters based on user human readable request. If the query is already an returned result coming from the role of the system, call the next function which is the `generate_ui`",
    "parameters": {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "The raw SQL query to execute."
            },
            "params": {
                "type": "object",
                "description": "Optional parameters to bind to the query.",
                "additionalProperties": True
            },
        },
        "required": ["query"]
    }
}


def generate_query_from_prompt(user_request: str):
    """
    Uses the LLM to generate an SQL query and parameters from a user's request.

    Args:
        user_request (str): The user's natural language request.

    Returns:
        dict: Results from the executed SQL query or an error message.
    """
    try:
        response = openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are an assistant that generates SQL queries from user requests."},
                {"role": "user", "content": user_request}
            ],
            functions=[generate_sql_query_tool],
            function_call="auto" 
        )
        if response.choices[0].message.content:
            return {"message": response.choices[0].message.content}
        function_args = json.loads(response.choices[0].message.function_call.arguments)
        query = function_args["query"]
        params = function_args.get("params", {})
        print("Generated query:", query)
        print("Generated params:", params)
        results = execute_query(query, params)
        return results
    except Exception as e:
        return {"error": str(e)}
