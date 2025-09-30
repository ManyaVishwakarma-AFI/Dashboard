from pydantic_settings import BaseSettings
from dotenv import dotenv_values

# Absolute path to your .env file
env_path = r"C:\\Users\\AFI-02-AI\\Desktop\\TrendSensei\\.env"

# Load the .env file directly into a dictionary
config = dotenv_values(dotenv_path=env_path)

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    Gemini_API_KEY: str

# Create an instance of the Settings class, passing the loaded config
settings = Settings(**config)
