from fastapi import FastAPI, status, APIRouter
from app.api import router as api_router
from app.db import lifespan
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(lifespan=lifespan)
app.include_router(api_router, prefix="/api/v1")
allow_origins = ["http://117.247.188.221:5173", "http://localhost:5173"]


app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,  # allow specific origin
    allow_credentials=True,
    allow_methods=["*"],  # allow all HTTP methods
    allow_headers=["*"],  # allow all headers
)


@app.get("/")
def testing():
    return {"it is working fine "}
