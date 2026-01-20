# db_url = "postgresql+psycopg://ai:ai@localhost:5532/ai"

# CSV_PATH = "D:\\Clari_1\\Clari_1\\Docs\\(PS)_Partner_Cases-5_Months.csv"
# WORD_PATH = "D:\\Clari_1\\Clari_1\\Docs\\Clari_solution_steps_link.docx"
# KNOWLEDGE_FOLDER = "D:\\Clari_1\\Clari_1\\mdfiles\\Data"

from pathlib import Path
import os

db_url = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg://ai:ai@localhost:5532/ai"  # LOCAL fallback
)

BASE_DIR = Path(__file__).resolve().parent
KNOWLEDGE_FOLDER = BASE_DIR / "mdfiles" / "Data"


COLLECTION_CSV = "csv_documents"
COLLECTION_WORD = "word_documents"
COLLECTION_MD = "md_documents"
COLLECTION_JSON = "json_documents"

COMBINED_KB = "combined_knowledge_base"