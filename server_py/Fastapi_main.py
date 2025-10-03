from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Optional
import subprocess, json
from pydantic import BaseModel
import uvicorn

from . import crud, schemas, models
from .database_config import get_db, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Amazon Reviews API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class AIQuery(BaseModel):
    question: str

def decimal_to_float(obj):
    if isinstance(obj, (int, float)):
        return obj
    try:
        return float(obj)
    except Exception:
        return str(obj)


@app.get("/")
def read_root():
    return {"message": "Amazon Reviews API running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# ----------- Reviews -------------
@app.get("/Amazon_Reviews/reviews", response_model=List[schemas.AmazonReview])
def get_reviews(limit: int = 50, offset: int = 0, db: Session = Depends(get_db)):
    return crud.get_reviews(db, limit=limit, offset=offset)

@app.get("/Amazon_Reviews/reviews/{review_id}", response_model=schemas.AmazonReview)
def get_review(review_id: str, db: Session = Depends(get_db)):
    return crud.get_review_by_id(db, review_id)

@app.get("/Amazon_Reviews/product/{product_id}", response_model=List[schemas.AmazonReview])
def get_product_reviews(product_id: str, limit: int = 20, db: Session = Depends(get_db)):
    return crud.get_product_reviews(db, product_id, limit)

@app.get("/Amazon_Reviews/search/{query}", response_model=List[schemas.AmazonReview])
def search_reviews(query: str, limit: int = 50, db: Session = Depends(get_db)):
    return crud.search_reviews(db, query, limit)

# ----------- Stats -------------
@app.get("/Amazon_Reviews/statistics")
def get_statistics(db: Session = Depends(get_db)):
    return crud.get_review_statistics(db)

@app.get("/Amazon_Reviews/sentiment", response_model=List[schemas.SentimentOut])
def get_sentiment(db: Session = Depends(get_db)):
    results = crud.get_sentiment_distribution(db)
    return [schemas.SentimentOut(sentiment=sentiment, count=count) for sentiment, count in results]

@app.get("/Amazon_Reviews/ratings", response_model=List[schemas.RatingOut])
def get_ratings(db: Session = Depends(get_db)):
    results = crud.get_ratings_distribution(db)
    return [schemas.RatingOut(rating=rating, count=count) for rating, count in results]

@app.get("/Amazon_Reviews/categories", response_model=List[schemas.CategoryOut])
def get_category_stats(db: Session = Depends(get_db)):
    return crud.get_category_statistics(db)

# ----------- Analytics -------------
@app.get("/Amazon_Reviews/trending", response_model=List[schemas.TrendingProductOut])
def get_trending(limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_trending_products(db, limit)

@app.get("/Amazon_Reviews/trends/monthly", response_model=List[schemas.MonthlyTrendOut])
def monthly_trends(year: int, db: Session = Depends(get_db)):
    return crud.get_monthly_trends(db, year)

@app.get("/Amazon_Reviews/helpful")
def get_helpful(limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_helpful_reviews(db, limit)

@app.get("/Amazon_Reviews/sentiment/{product_id}", response_model=List[schemas.SentimentOut])
def get_sentiment(product_id: str, db: Session = Depends(get_db)):
    return crud.get_product_sentiment_breakdown(db, product_id)

# ----------- Products -------------
@app.get("/products", response_model=List[schemas.Product])
def read_products(limit: int = 10, offset: int = 0, category: schemas.Optional[str] = None,
                  min_price: schemas.Optional[float] = None, max_price: schemas.Optional[float] = None,
                  db: Session = Depends(get_db)):
    return crud.get_products(db, limit, offset, category, min_price, max_price)

@app.get("/analytics/summary", response_model=schemas.Summary)
def analytics_summary(db: Session = Depends(get_db)):
    return crud.get_summary(db)

@app.get("/analytics/category", response_model=schemas.CategoryAnalyticsResponse)
def analytics_by_category(db: Session = Depends(get_db)):
    categories = crud.get_category_analytics(db)
    return {"categories": categories}

@app.post("/ai/query")
def ask_ai(query: AIQuery):
    question = query.question

    with engine.connect() as conn:
        # Count products
        summary = conn.execute(text("SELECT COUNT(*) AS total FROM products"))
        total_products = summary.scalar()

        # Top products
        products = conn.execute(
            text("""
            SELECT id, category, brand, title, price, rating
            FROM products 
            ORDER BY reviews DESC 
            LIMIT 50
            """)
        )
        top_products = [dict(row._mapping) for row in products]

        # Recent Amazon reviews
        reviews = conn.execute(
            text("""
            SELECT product_id, star_rating, review_headline, review_body, review_date 
            FROM "Amazon_Reviews"
            ORDER BY review_date DESC 
            LIMIT 50
            """)
        )
        amazon_reviews = [dict(row._mapping) for row in reviews]

    # JSON safe
    top_products_json = json.dumps(top_products, indent=2, default=decimal_to_float)
    reviews_json = json.dumps(amazon_reviews, indent=2, default=decimal_to_float)

    # Prompt for AI
    prompt = f"""
    We have {total_products} products in the database.

    Top 50 products:
    {top_products_json}

    Recent Amazon reviews:
    {reviews_json}

    Question: {question}
    Answer in simple, human-readable text using the above context.
    """

    try:
        result = subprocess.run(
            ["ollama", "run", "mistral"],
            input=prompt,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="ignore"
        )
        answer = result.stdout.strip()
    except Exception as e:
        answer = f"Error: {str(e)}"

    return {"answer": answer}


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
