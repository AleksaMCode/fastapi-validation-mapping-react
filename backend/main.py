import uvicorn
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from models.users import NewDataRequest
from validator.helpers import normalize_error_path

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(_: Request, exc: RequestValidationError):
    normalized_errors: dict[str, str] = {}

    for error in exc.errors():
        field_path = normalize_error_path(error.get("loc", ()))
        message = error.get("msg", "Invalid value")

        if field_path:
            normalized_errors[field_path] = message

    return JSONResponse(status_code=422, content={"errors": normalized_errors})


@app.post("/new")
async def create_new_data(payload: NewDataRequest):
    # PoC endpoint: validation happens through NewDataRequest.
    pass


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=False)
