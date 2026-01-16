import sys
import uvicorn
from cli import cli_app
from api import api_app

if __name__ == "__main__":
    if "serve" in sys.argv:
        uvicorn.run(api_app, host="0.0.0.0", port=8000)
    else:
        cli_app()