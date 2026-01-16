from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from agent_runner import run_support_query
from logger import logger

api_app = FastAPI(title="AI Support Case Assistant")
api_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    message: str

@api_app.post("/query")
async def query_case(request: QueryRequest):
    logger.info("Received API request: %s", request.message)
    try:
        result = run_support_query(request.message)
        return {"result": result}
    except Exception as e:
        logger.error("Exception during API request: %s", e)
        return JSONResponse(status_code=500, content={"error": str(e)})