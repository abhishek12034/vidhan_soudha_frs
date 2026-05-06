from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    mongo_host: str
    mongo_port: int
    mongo_username: str
    mongo_password: str
    mongo_db_name: str
    class Config:
        env_file = ".env"