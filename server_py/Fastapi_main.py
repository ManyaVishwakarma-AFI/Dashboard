from fastapi import FastAPI, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from sqlalchemy import text
from typing import List, Optional
import subprocess, json
from pydantic import BaseModel
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
"""class AIQuery(BaseModel):
    question: str"""
class AIQuery(BaseModel):
    question: str
    source: str  # "products" or "amazon_reviews"
    limit: Optional[int] = 50
    
def decimal_to_float(obj):
    if isinstance(obj, (int, float)):
        return obj
    try:
        return float(obj)
    except Exception:
        return str(obj)


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
# @app.post("/ai/query")
# def ask_ai(query: AIQuery):
#     question = query.question

#     with engine.connect() as conn:
#         # Count products
#         summary = conn.execute(text("SELECT COUNT(*) AS total FROM products"))
#         total_products = summary.scalar()

#         # Top products
#         products = conn.execute(
#             text("""
#             SELECT id, category, brand, title, price, rating
#             FROM products 
#             ORDER BY reviews DESC 
#             LIMIT 50
#             """)
#         )
#         top_products = [dict(row._mapping) for row in products]

#         # Recent Amazon reviews
#         reviews = conn.execute(
#             text("""
#             SELECT product_id, star_rating, review_headline, review_body, review_date 
#             FROM "Amazon_Reviews"
#             ORDER BY review_date DESC 
#             LIMIT 50
#             """)
#         )
#         amazon_reviews = [dict(row._mapping) for row in reviews]

#     # JSON safe
#     top_products_json = json.dumps(top_products, indent=2, default=decimal_to_float)
#     reviews_json = json.dumps(amazon_reviews, indent=2, default=decimal_to_float)

#     # Prompt for AI
#     prompt = f"""
#     We have {total_products} products in the database.

#     Top 50 products:
#     {top_products_json}

#     Recent Amazon reviews:
#     {reviews_json}

#     Question: {question}
#     Answer in simple, human-readable text using the above context.
#     """

#     try:
#         result = subprocess.run(
#             ["ollama", "run", "mistral"],
#             input=prompt,
#             capture_output=True,
#             text=True,
#             encoding="utf-8",
#             errors="ignore"
#         )
#         answer = result.stdout.strip()
#     except Exception as e:
#         answer = f"Error: {str(e)}"

#     return {"answer": answer}
@app.post("/ai/query")
def ask_ai(query: AIQuery, db: Session = Depends(get_db)):
    limit = query.limit or 50  # default 50 if not provided
    source = query.source.lower()

    if source == "products":
        # Fetch top products only
        rows = db.execute(
            text(f"""
            SELECT id, category, brand, title, price, rating
            FROM products
            ORDER BY reviews DESC
            LIMIT {limit}
            """)
        ).all()
        data_list = [dict(row._mapping) for row in rows]
        table_name = "Products"
    elif source == "amazon_reviews":
        # Fetch recent Amazon reviews only
        rows = db.execute(
            text(f"""
            SELECT product_title, star_rating, review_headline, review_body, review_date
            FROM "Amazon_Reviews"
            ORDER BY review_date DESC
            LIMIT {limit}
            """)
        ).all()
        data_list = [dict(row._mapping) for row in rows]
        table_name = "Amazon Reviews"
    else:
        return {"error": "Invalid source. Use 'products' or 'amazon_reviews'."}

    # Convert to JSON safe for AI
    data_json = json.dumps(data_list, indent=2, default=decimal_to_float)

    prompt = f"""
    We have {len(data_list)} records in the {table_name} table.

    Top {limit} entries:
    {data_json}

    Question: {query.question}
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

# @app.get("/products/top", response_model=List[schemas.Product])
# def top_products_products_table(n: int = 10, db: Session = Depends(get_db)):
#     """
#     Fetch top N products from the products table based on rating.
#     """
#     return crud.get_top_products(db, n)

# @app.get("/Amazon_Reviews/top", response_model=List[schemas.TopAmazonReview])
# def top_products_amazon_reviews(n: int = 10, db: Session = Depends(get_db)):
#     return crud.get_top_products_amazon(db, n)

@app.get("/top")
def get_top_items(
    table: str = Query(..., description="Choose 'products' or 'amazon_reviews'"),
    n: int = Query(10, description="Number of top items to fetch"),
    db: Session = Depends(get_db),
):
    """
    Fetch top N entries from either products or Amazon_Reviews table.
    Use ?table=products or ?table=amazon_reviews
    """
    table = table.lower()
    
    if table == "products":
        data = crud.get_top_products(db, n)
        return {"table": "products", "count": len(data), "data": data}
    elif table == "amazon_reviews":
        data = crud.get_top_products_amazon(db, n)
        return {"table": "amazon_reviews", "count": len(data), "data": data}
    else:
        return {"error": "Invalid table. Use 'products' or 'amazon_reviews'."}


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
