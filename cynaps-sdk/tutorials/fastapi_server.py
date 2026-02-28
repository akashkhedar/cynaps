# this code demonstrates FastAPI server with a single endpoint
# The request to this endpoint automatically logged in Cynaps instance with await client.tasks.create() method

import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from cynaps_sdk.client import AsyncCynaps

app = FastAPI()

# Initialize the async client with the API key and project ID from running Cynaps app
# Remember to set CYNAPS_API_KEY and CYNAPS_PROJECT_ID environment variables
client = AsyncCynaps(
    base_url="http://localhost:8080",
    api_key=os.getenv("CYNAPS_API_KEY"),
)
project_id = int(os.getenv("CYNAPS_PROJECT_ID"))


# Some dummy input data
class UserInput(BaseModel):
    example: str
    number: int


@app.post("/")
async def create_item(user_input: UserInput):
    try:
        task = await client.tasks.create(
            project=project_id, data=user_input.model_dump()
        )
        return task
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# Run the server with uvicorn
# pip install uvicorn
# CYNAPS_API_KEY=your-api-key CYNAPS_PROJECT_ID=project-id uvicorn fastapi_server:app --reload
# Now you can send POST requests to http://localhost:8000/ with arbitrary JSON body
# For example, you can use curl:
# curl -X POST "http://localhost:8000/" -H "Content-Type: application/json" -d '{"example": "string", "number": 123}'
