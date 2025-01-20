import json
from pydantic import BaseModel, Field
from pydantic_ai import Agent, Tool
from sqlalchemy import text
from sqlmodel import Session
from app.db.session import get_sqlalchemy_engine
from app.core.agent_config import openai_client, groq_model


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

generate_sql_query_tool_deepseek = {
    "type": "function",
    "function": {
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

_DB_SCHEMA_DUMP = """
CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 3391 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 859 (class 1247 OID 24578)
-- Name: chatrole; Type: TYPE; Schema: public; Owner: user
--

CREATE TYPE public.chatrole AS ENUM (
    'SYSTEM',
    'USER'
);


ALTER TYPE public.chatrole OWNER TO "user";

--
-- TOC entry 853 (class 1247 OID 16395)
-- Name: roleenum; Type: TYPE; Schema: public; Owner: user
--

CREATE TYPE public.roleenum AS ENUM (
    'student',
    'trainer',
    'admin'
);


ALTER TYPE public.roleenum OWNER TO "user";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 16389)
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO "user";

--
-- TOC entry 220 (class 1259 OID 24584)
-- Name: chathistory; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.chathistory (
    message character varying NOT NULL,
    role public.chatrole NOT NULL,
    chat_id integer NOT NULL,
    sent_at timestamp without time zone,
    sender_id uuid NOT NULL
);


ALTER TABLE public.chathistory OWNER TO "user";

--
-- TOC entry 219 (class 1259 OID 24583)
-- Name: chathistory_chat_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.chathistory_chat_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.chathistory_chat_id_seq OWNER TO "user";

--
-- TOC entry 3392 (class 0 OID 0)
-- Dependencies: 219
-- Name: chathistory_chat_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.chathistory_chat_id_seq OWNED BY public.chathistory.chat_id;


--
-- TOC entry 221 (class 1259 OID 24597)
-- Name: sessiontoken; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.sessiontoken (
    token_id uuid NOT NULL,
    user_id uuid NOT NULL,
    token character varying NOT NULL,
    created_at timestamp without time zone NOT NULL,
    expires_at timestamp without time zone NOT NULL
);


ALTER TABLE public.sessiontoken OWNER TO "user";

--
-- TOC entry 218 (class 1259 OID 16401)
-- Name: users; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.users (
    role public.roleenum NOT NULL,
    full_name character varying NOT NULL,
    email character varying NOT NULL,
    phone_number character varying,
    password_hash character varying NOT NULL,
    user_id uuid NOT NULL,
    date_joined timestamp without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO "user";

--
-- TOC entry 3228 (class 2604 OID 24587)
-- Name: chathistory chat_id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.chathistory ALTER COLUMN chat_id SET DEFAULT nextval('public.chathistory_chat_id_seq'::regclass);


--
-- TOC entry 3230 (class 2606 OID 16393)
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- TOC entry 3234 (class 2606 OID 24591)
-- Name: chathistory chathistory_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.chathistory
    ADD CONSTRAINT chathistory_pkey PRIMARY KEY (chat_id);


--
-- TOC entry 3236 (class 2606 OID 24603)
-- Name: sessiontoken sessiontoken_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.sessiontoken
    ADD CONSTRAINT sessiontoken_pkey PRIMARY KEY (token_id);


--
-- TOC entry 3238 (class 2606 OID 24605)
-- Name: sessiontoken sessiontoken_token_key; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.sessiontoken
    ADD CONSTRAINT sessiontoken_token_key UNIQUE (token);


--
-- TOC entry 3232 (class 2606 OID 16409)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 3239 (class 2606 OID 24592)
-- Name: chathistory chathistory_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.chathistory
    ADD CONSTRAINT chathistory_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(user_id);


--
-- TOC entry 3240 (class 2606 OID 24606)
-- Name: sessiontoken sessiontoken_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.sessiontoken
    ADD CONSTRAINT sessiontoken_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);

"""


class SQLSchemaBase(BaseModel):
    query: str = Field(description="The raw SQL query to execute.")
    params: dict = Field(default={}, description="Optional parameters to bind to the query.")

async def sql_generator_agent(user_input: str):
    agent = Agent(
        model=groq_model,
        result_retries=3,
        result_type=list[dict] | None,
        result_tool_description="The raw results of the `execute_query` function call.",
        system_prompt=(
            "You are an assistant that generates SQL queries from user requests and automatically runs the function `execute_query` once detected that the user's intent is to interact with the database.",
            "This is the schema of the database you are working with",
            _DB_SCHEMA_DUMP,
            "The in the final step, return the results of `execute_query` function call."
        ),
        tools=[
            Tool(function=execute_query, 
                 takes_ctx=False, name="execute_query", 
                 description="Executes a raw SQL query with optional parameters using SQLModel.",
                ),
        ]
    )
    results = await agent.run(user_input)
    return results.data

async def sql_generator_second_agent(ctx, user_input: str):
    agent = Agent(
        model=groq_model,
        result_retries=3,
        result_type=list[dict] | None,
        result_tool_description="The raw results of the `execute_query` function call.",
        system_prompt=(
            "You are an assistant that generates SQL queries from user requests and automatically runs the function `execute_query` once detected that the user's intent is to interact with the database.",
            "This is the schema of the database you are working with",
            _DB_SCHEMA_DUMP,
            "The in the final step, return the results of `execute_query` function call."
        ),
        tools=[
            Tool(function=execute_query, 
                 takes_ctx=False, name="execute_query", 
                 description="Executes a raw SQL query with optional parameters using SQLModel.",
                ),
        ]
    )
    results = await agent.run(user_input)
    return results.data