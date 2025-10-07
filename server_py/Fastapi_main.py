from fastapi import FastAPI, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import uvicorn
from sqlalchemy import func

from . import crud, schemas, models
from .database_config import get_db, engine

# --------------------------
# DB initialization
# --------------------------
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Product API", version="1.1.0")

# --------------------------
# Middleware
# --------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# --------------------------
# Health & Root
# --------------------------
@app.get("/")
def read_root():
    return {"message": "Product API running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}


# --------------------------
# Amazon Reviews Endpoints
# --------------------------
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


# --------------------------
# Statistics Endpoints
# --------------------------
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


# --------------------------
# Analytics Endpoints
# --------------------------
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
def get_sentiment_breakdown(product_id: str, db: Session = Depends(get_db)):
    return crud.get_product_sentiment_breakdown(db, product_id)


# --------------------------
# Products Endpoints
# --------------------------
@app.get("/products", response_model=List[schemas.Product])
def read_products(
    limit: int = 10,
    offset: int = 0,
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    db: Session = Depends(get_db)
):
    return crud.get_products(db, limit, offset, category, min_price, max_price)

@app.get("/analytics/summary", response_model=schemas.Summary)
def analytics_summary(db: Session = Depends(get_db)):
    return crud.get_summary(db)

@app.get("/analytics/category", response_model=schemas.CategoryAnalyticsResponse)
def analytics_by_category(db: Session = Depends(get_db)):
    categories = crud.get_category_analytics(db)
    return {"categories": categories}


# ==========================================================
# 🔍 FILTERS ENDPOINTS (Merged here)
# ==========================================================

# 2️⃣ Filter Products
@app.get("/products/filter", response_model=List[schemas.Product])
def filter_products(
    category: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    min_rating: Optional[float] = Query(None),
    sort_by: Optional[str] = Query("sales_desc"),
    show_trending_only: bool = False,
    db: Session = Depends(get_db)
):
    query = db.query(models.Product)

    if category and category.lower() != "all categories":
        query = query.filter(models.Product.category.ilike(f"%{category}%"))
    if min_price is not None:
        query = query.filter(models.Product.price >= min_price)
    if max_price is not None:
        query = query.filter(models.Product.price <= max_price)
    if min_rating is not None and min_rating > 0:
        query = query.filter(models.Product.rating >= min_rating)
    if show_trending_only:
        query = query.filter(models.Product.reviews > 1000)

    if sort_by == "price_asc":
        query = query.order_by(models.Product.price.asc())
    elif sort_by == "price_desc":
        query = query.order_by(models.Product.price.desc())
    elif sort_by == "rating_desc":
        query = query.order_by(models.Product.rating.desc())

    products = query.limit(100).all()
    return products


# 3️⃣ Filter Reviews
@app.get("/reviews/filter", response_model=List[schemas.AmazonReview])
def filter_reviews(
    product_id: Optional[str] = Query(None),
    sentiment: Optional[str] = Query(None),
    min_rating: Optional[int] = Query(None),
    date_range: Optional[str] = Query("30d"),
    db: Session = Depends(get_db)
):
    query = db.query(models.AmazonReview)

    if product_id:
        query = query.filter(models.AmazonReview.product_id == product_id)
    if sentiment:
        query = query.filter(models.AmazonReview.Sentiment_pc == sentiment)
    if min_rating:
        query = query.filter(models.AmazonReview.star_rating >= min_rating)

    reviews = query.limit(100).all()
    return reviews

@app.get("/Amazon_Reviews/filters")
def get_available_filters(db: Session = Depends(get_db)):
    # ----- Categories from both tables -----
    review_categories = db.query(models.AmazonReview.product_category).distinct().all()
    product_categories = db.query(models.Product.category).distinct().all()

    # Flatten and remove None values
    review_categories = [c[0] for c in review_categories if c[0]]
    product_categories = [c[0] for c in product_categories if c[0]]

    # Merge and remove duplicates
    categories = sorted(list(set(review_categories + product_categories)))

    # ----- Ratings only from reviews -----
    # Assuming your columns are: rating_1, rating_2, rating_3, rating_4, rating_5
    ratings_columns = [
        models.AmazonReview.rating_1,
        models.AmazonReview.rating_2,
        models.AmazonReview.rating_3,
        models.AmazonReview.rating_4,
        models.AmazonReview.rating_5
    ]

    ratings_available = []
    for i, col in enumerate(ratings_columns, start=1):
        count = db.query(func.sum(col)).scalar()  # sum of this rating column across all reviews
        if count and count > 0:
            ratings_available.append(i)

    return {
        "categories": categories,
        "ratings": ratings_available
    }

# --------------------------
# Run server
# --------------------------
if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
