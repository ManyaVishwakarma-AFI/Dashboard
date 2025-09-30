# app/main.py
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import uvicorn

# app package modules
from . import crud, schemas, models
from .database import get_db, engine
from .routers.analytics import router as analytics_router

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="TrendSensei API", version="1.0.0")

# Add CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL(s)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include analytics router under /api
app.include_router(analytics_router, prefix="/api")

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "TrendSensei API is running", "status": "ok"}

# Health check
@app.get("/health")
def health_check():
    return {"status": "healthy"}

# -------------------------
# Review endpoints (existing)
# -------------------------
@app.get("/api/reviews", response_model=List[schemas.AmazonReview])
def get_reviews(limit: int = 50, offset: int = 0, db: Session = Depends(get_db)):
    """Get all reviews with pagination"""
    return crud.get_reviews(db, limit=limit, offset=offset)

@app.get("/api/reviews/{review_id}", response_model=schemas.AmazonReview)
def get_review(review_id: str, db: Session = Depends(get_db)):
    """Get a specific review by ID"""
    return crud.get_review_by_id(db, review_id)

@app.get("/api/reviews/product/{product_id}", response_model=List[schemas.AmazonReview])
def get_product_reviews(product_id: str, limit: int = 20, db: Session = Depends(get_db)):
    """Get all reviews for a specific product"""
    return crud.get_product_reviews(db, product_id, limit)

@app.get("/api/reviews/search/{query}", response_model=List[schemas.AmazonReview])
def search_reviews(query: str, limit: int = 50, db: Session = Depends(get_db)):
    """Search reviews by product title, headline, or body"""
    return crud.search_reviews(db, query, limit)

# Statistics endpoints
@app.get("/api/reviews/statistics")
def get_statistics(db: Session = Depends(get_db)):
    """Get overall review statistics"""
    return crud.get_review_statistics(db)

@app.get("/api/reviews/sentiment")
def get_sentiment(db: Session = Depends(get_db)):
    """Get sentiment distribution"""
    return crud.get_sentiment_distribution(db)

@app.get("/api/reviews/ratings")
def get_ratings(db: Session = Depends(get_db)):
    """Get rating distribution"""
    return crud.get_rating_distribution(db)

@app.get("/api/reviews/categories")
def get_category_stats(db: Session = Depends(get_db)):
    """Get statistics by category"""
    return crud.get_category_statistics(db)

# Trending and analytics endpoints (these coexist with analytics router)
@app.get("/api/reviews/trending")
def get_trending(limit: int = 10, db: Session = Depends(get_db)):
    """Get trending products"""
    return crud.get_trending_products(db, limit=limit)

@app.get("/api/reviews/trends/monthly")
def get_monthly_trends(year: str = None, db: Session = Depends(get_db)):
    """Get monthly review trends"""
    return crud.get_monthly_review_trends(db, year)

@app.get("/api/reviews/helpful")
def get_helpful(limit: int = 10, db: Session = Depends(get_db)):
    """Get most helpful reviews"""
    return crud.get_helpful_reviews(db, limit)

@app.get("/api/reviews/sentiment/{product_id}")
def get_product_sentiment(product_id: str, db: Session = Depends(get_db)):
    """Get sentiment breakdown for a specific product"""
    return crud.get_product_sentiment_breakdown(db, product_id)

# If you want to run this file directly for local development:
if __name__ == "__main__":
    # Run with UVicorn for development: uvicorn app.main:app --reload
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
