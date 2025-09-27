import uvicorn
from fastapi import FastAPI
from .database import engine, Base
from . import models
from .routers import auth, products, analytics, ai, chat, users

# Create all database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Include all the routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(products.router, prefix="/api", tags=["Products"])
app.include_router(analytics.router, prefix="/api", tags=["Analytics"])
app.include_router(ai.router, prefix="/api", tags=["AI"])
app.include_router(chat.router, prefix="/api", tags=["Chat"])
app.include_router(users.router, prefix="/api", tags=["Users & Data"])


@app.get("/")
def read_root():
    return {"message": "FastAPI server is running"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)