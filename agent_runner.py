import os
from phi.agent import Agent
from phi.model.openai import OpenAIChat
from phi.knowledge.csv import CSVKnowledgeBase
from phi.knowledge.docx import DocxKnowledgeBase
from phi.knowledge.json import JSONKnowledgeBase
from phi.knowledge.text import TextKnowledgeBase
from phi.vectordb.pgvector import PgVector2, SearchType, PgVector
from knowledge_config import db_url, CSV_PATH, WORD_PATH, COLLECTION_CSV, COLLECTION_WORD, KNOWLEDGE_FOLDER, COLLECTION_JSON,COLLECTION_MD, COMBINED_KB
from logger import logger

# Validate paths
if not os.path.exists(CSV_PATH):
    raise FileNotFoundError(f"CSV file not found at {CSV_PATH}")
if not os.path.exists(WORD_PATH):
    raise FileNotFoundError(f"Word file not found at {WORD_PATH}")
if not os.path.exists(KNOWLEDGE_FOLDER):
    raise FileNotFoundError(f"Knowledge folder not found at {KNOWLEDGE_FOLDER}")


# Initialize knowledge bases
# CSV_knowledge_base = CSVKnowledgeBase(
#     path=CSV_PATH,
#     vector_db=PgVector2(collection=COLLECTION_CSV, db_url=db_url)
# )
# Word_knowledge_base = DocxKnowledgeBase(
#     path=WORD_PATH,
#     vector_db=PgVector2(collection=COLLECTION_WORD, db_url=db_url)
# )

md_knowledge_base = TextKnowledgeBase(
    path=KNOWLEDGE_FOLDER,    # SAME folder
    vector_db=PgVector(
        # collection=COLLECTION_MD,
        table_name="MD_knowledge",
        db_url=db_url,
        search_type = SearchType.hybrid
    ),
)


# json_knowledge_base = JSONKnowledgeBase(
#     path=KNOWLEDGE_FOLDER,    # SAME folder
#     vector_db=PgVector2(
#         collection=COLLECTION_JSON,
#         db_url=db_url,
#     ),
# )

# combined_knowledge_base = JSONKnowledgeBase(
#     path=KNOWLEDGE_FOLDER,    # SAME folder
#     vector_db=PgVector2(
#         collection=COMBINED_KB,
#         db_url=db_url,
#     ),
# )


# Load them only once
# try:
#     CSV_knowledge_base.load(recreate=False)
#     logger.info("CSV knowledge base loaded successfully.")
# except Exception as e:
#     logger.error("Failed to load CSV knowledge base: %s", e)
#     raise

# try:
#     Word_knowledge_base.load(recreate=False)
#     logger.info("Word knowledge base loaded successfully.")
# except Exception as e:
#     logger.error("Failed to load Word knowledge base: %s", e)
#     raise

try:
    md_knowledge_base.load(recreate=False)
    logger.info("MD knowledge base loaded successfully.")
except Exception as e:
    logger.error("Failed to load MD knowledge base: %s", e)
    raise

# try:
#     json_knowledge_base.load(recreate=True)
#     logger.info("JSON knowledge base loaded successfully.")
# except Exception as e:
#     logger.error("Failed to load JSON knowledge base: %s", e)
#     raise

# try:
#     combined_knowledge_base.load(recreate=True)
#     logger.info("Combined knowledge base loaded successfully.")
# except Exception as e:
#     logger.error("Failed to load combined knowledge base: %s", e)
#     raise

# def load_csv_instructions():
#     with open("csv_agent_instructions.txt", "r", encoding="utf-8") as f:
#         return f.read()

# def load_word_instructions():
#     with open("word_agent_instructions.txt", "r", encoding="utf-8") as f:
#         return f.read()
    
def Stanford_chatbot_instructions():
    with open("Stanford_chatbot_agent_instructions.txt", "r", encoding="utf-8") as f:
        return f.read()
    


def run_support_query(user_message: str) -> str:
    logger.info("Running support query for: %s", user_message)

    try:
        stanford_agent = Agent(
            name="Stanford_agent",
            knowledge=md_knowledge_base,
            search_knowledge=True,
            model=OpenAIChat(id="gpt-4o"),
            instructions=Stanford_chatbot_instructions()
        )
        chatbot_output = stanford_agent.run(user_message).content.strip()
        logger.info("Stanford agent run successful.")
    except Exception as e:
        logger.error("Stanford agent failed: %s", e)
        chatbot_output = f"Error while querying Stanford knowledge base: {e}"

    # try:
    #     csv_agent = Agent(
    #         name="csv_case_agent",
    #         knowledge=CSV_knowledge_base,
    #         search_knowledge=True,
    #         model=OpenAIChat(id="gpt-4o"),
    #         instructions=load_csv_instructions()
    #     )
    #     csv_output = csv_agent.run(user_message).content.strip()
    #     logger.info("CSV agent run successful.")
    # except Exception as e:
    #     logger.error("CSV agent failed: %s", e)
    #     csv_output = f"Error while querying CSV knowledge base: {e}"

    # try:
    #     word_agent = Agent(
    #         name="word_doc_agent",
    #         knowledge=Word_knowledge_base,
    #         search_knowledge=True,
    #         model=OpenAIChat(id="gpt-4o"),
    #         instructions=load_word_instructions()
    #     )
    #     word_output = word_agent.run(user_message).content.strip()
    #     logger.info("Word agent run successful.")
    # except Exception as e:
    #     logger.error("Word agent failed: %s", e)
    #     word_output = f"Error while querying Word knowledge base: {e}"

    return chatbot_output