from fastapi import FastAPI,Request
from app.config import Settings
from motor.motor_asyncio import AsyncIOMotorClient
from functools import lru_cache

@lru_cache
def get_settings():
    return Settings()

async def lifespan(app:FastAPI):
    await startup_db_client(app)
    yield
    await close_db_client(app)

async def startup_db_client(app:FastAPI):
    settings = get_settings()
    app.mongo_client = AsyncIOMotorClient(
        f"mongodb://{settings.mongo_username}:{settings.mongo_password}@{settings.mongo_host}:{settings.mongo_port}"
    )    
    app.mongo_db = app.mongo_client[settings.mongo_db_name]
    print("MongoDB connected.")
async def close_db_client(app:FastAPI):
    print("MongoDB disconnected.")
    app.mongo_client.close() 


def get_db(request: Request):
    """
    Dependency that provides the MongoDB connection from FastAPI app state.
    """
    return request.app.mongo_db