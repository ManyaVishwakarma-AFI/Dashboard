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
from sklearn.preprocessing import MinMaxScaler

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

# ----------- Analytics -------------

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
def get_sentiment(product_id: str, db: Session = Depends(get_db)):
    return crud.get_product_sentiment_breakdown(db, product_id)

# ----------- Products -------------
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


# --------------------------
# AI Query Endpoint
# --------------------------
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


# --------------------------
# Forecast Endpoints
# --------------------------
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
    
@app.get("/top_forecast")
def top_forecasted_products(n: int = Query(10, description="Number of top products"), db: Session = Depends(get_db)):
    """
    Fetch top N products by forecasted next price
    """
    forecast_list = crud.get_top_forecasted_products(db, n)
    return {"table": "products_forecast", "count": len(forecast_list), "data": forecast_list} 

@app.get("/notifications")
def get_notifications(
    table: str = Query("products", description="Choose 'products' or 'amazon_reviews'"),
    limit: int = Query(5, description="Number of recent notifications"),
    db: Session = Depends(get_db),
):
    """
    Fetch latest product/review updates for notification bell.
    """
    table = table.lower()

    if table == "products":
        query = text(f"""
            SELECT id, title AS message, category, price
            FROM products
            ORDER BY id DESC
            LIMIT {limit}
        """)
        rows = db.execute(query).fetchall()
        data = [
            {
                "id": row.id,
                "message": f"New product added: {row.message} (₹{row.price})",
                "time": "Just now",
            }
            for row in rows
        ]
    elif table == "amazon_reviews":
        query = text(f"""
            SELECT product_title, review_headline, review_date
            FROM "Amazon_Reviews"
            ORDER BY review_date DESC
            LIMIT {limit}
        """)
        rows = db.execute(query).fetchall()
        data = [
            {
                "id": i + 1,
                "message": f"New review: {row.review_headline} on {row.product_title}",
                "time": str(row.review_date),
            }
            for i, row in enumerate(rows)
        ]
    else:
        return {"error": "Invalid table. Use 'products' or 'amazon_reviews'."}

@app.get("/top_forecast")
def top_forecasted_products(n: int = Query(10, description="Number of top products"), db: Session = Depends(get_db)):
    """
    Fetch top N products by forecasted next price
    """
    forecast_list = crud.get_top_forecasted_products(db, n)
    return {"table": "products_forecast", "count": len(forecast_list), "data": forecast_list}    

# --------------------------
# signup/login Endpoints
# --------------------------
from .routers import users
app.include_router(users.router, prefix="/users")

# Add these endpoints to your Fastapi_main.py

# --------------------------
# Filter Options Endpoint
# --------------------------
@app.get("/Amazon_Reviews/filter-options")
def get_filter_options(db: Session = Depends(get_db)):
    """
    Get available filter options (categories, ratings, price range)
    """
    try:
        # Get unique categories from Amazon_Reviews
        categories_query = db.query(models.AmazonReview.product_category)\
            .distinct()\
            .filter(models.AmazonReview.product_category.isnot(None))\
            .filter(models.AmazonReview.product_category != '')\
            .all()
        category_list = sorted([cat[0] for cat in categories_query if cat[0]])
        
        # Get unique star ratings from Amazon_Reviews
        ratings_query = db.query(models.AmazonReview.star_rating)\
            .distinct()\
            .filter(models.AmazonReview.star_rating.isnot(None))\
            .order_by(models.AmazonReview.star_rating)\
            .all()
        rating_list = sorted([int(r[0]) for r in ratings_query if r[0] and r[0] > 0])
        
        # Get price range from products table
        price_stats = db.query(
            func.min(models.Product.price).label('min_price'),
            func.max(models.Product.price).label('max_price')
        ).filter(models.Product.price.isnot(None)).first()
        
        min_price = float(price_stats.min_price) if price_stats and price_stats.min_price else 0
        max_price = float(price_stats.max_price) if price_stats and price_stats.max_price else 100000
        
        return {
            "categories": category_list,
            "ratings": rating_list,
            "price_range": {
                "min": int(min_price),
                "max": int(max_price)
            }
        }
    except Exception as e:
        print(f"Error fetching filter options: {e}")
        return {
            "error": str(e),
            "categories": [],
            "ratings": [1, 2, 3, 4, 5],
            "price_range": {"min": 0, "max": 100000}
        }


# --------------------------
# Filtered Analytics Endpoint
# --------------------------
@app.get("/Amazon_Reviews/analytics/filtered")
def get_filtered_analytics(
    category: Optional[str] = None,
    min_rating: Optional[int] = None,
    date_range: Optional[str] = "all",
    db: Session = Depends(get_db)
):
    """
    Get analytics data based on applied filters for charts
    """
    try:
        # Base query
        query = db.query(models.AmazonReview)
        
        # Apply filters
        if category and category != "All Categories":
            query = query.filter(models.AmazonReview.product_category == category)
        
        if min_rating and min_rating > 0:
            query = query.filter(models.AmazonReview.star_rating >= min_rating)
        
        # Date range filter
        if date_range != "all":
            from datetime import datetime, timedelta
            today = datetime.now()
            
            if date_range == "7d":
                start_year = today.year
                # Simple approximation - filter by year
            elif date_range == "30d":
                start_year = today.year
            elif date_range == "90d":
                start_year = today.year
            elif date_range == "1y":
                start_year = today.year - 1
            else:
                start_year = None
            
            if start_year:
                query = query.filter(models.AmazonReview.review_year >= start_year)
        
        # Get sentiment distribution
        sentiment_dist = query.with_entities(
            models.AmazonReview.Sentiment_pc,
            func.count(models.AmazonReview.review_id).label('count')
        ).group_by(models.AmazonReview.Sentiment_pc).all()
        
        # Get rating distribution
        rating_dist = query.with_entities(
            models.AmazonReview.star_rating,
            func.count(models.AmazonReview.review_id).label('count')
        ).group_by(models.AmazonReview.star_rating).all()
        
        # Get category stats
        category_stats = query.with_entities(
            models.AmazonReview.product_category,
            func.count(models.AmazonReview.review_id).label('count'),
            func.avg(models.AmazonReview.star_rating).label('avg_rating')
        ).group_by(models.AmazonReview.product_category).all()
        
        # Get top products
        top_products = query.with_entities(
            models.AmazonReview.product_title,
            func.count(models.AmazonReview.review_id).label('review_count'),
            func.avg(models.AmazonReview.star_rating).label('avg_rating')
        ).group_by(models.AmazonReview.product_title)\
         .order_by(func.count(models.AmazonReview.review_id).desc())\
         .limit(10).all()
        
        return {
            "sentiment_distribution": [
                {"sentiment": s[0], "count": s[1]} for s in sentiment_dist
            ],
            "rating_distribution": [
                {"rating": r[0], "count": r[1]} for r in rating_dist
            ],
            "category_stats": [
                {
                    "category": c[0],
                    "count": c[1],
                    "avg_rating": float(c[2]) if c[2] else 0
                } for c in category_stats
            ],
            "top_products": [
                {
                    "product_title": p[0],
                    "review_count": p[1],
                    "avg_rating": float(p[2]) if p[2] else 0
                } for p in top_products
            ],
            "total_reviews": query.count(),
            "average_rating": float(query.with_entities(
                func.avg(models.AmazonReview.star_rating)
            ).scalar() or 0)
        }
        
    except Exception as e:
        print(f"Error getting filtered analytics: {e}")
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
