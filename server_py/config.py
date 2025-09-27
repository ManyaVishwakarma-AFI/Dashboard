from pydantic_settings import BaseSettings
from pathlib import Path
from dotenv import dotenv_values

# Build a fully resolved, absolute path to the .env file
env_path = Path(__file__).resolve().parent.parent / ".env"

# Load the .env file directly into a dictionary
config = dotenv_values(dotenv_path=env_path)

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    OPENAI_API_KEY: str

# Create an instance of the Settings class, passing the loaded config
settings = Settings(**config)