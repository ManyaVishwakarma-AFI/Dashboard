# from fastapi import FastAPI, Depends, Query, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from sqlalchemy.orm import Session
# from sqlalchemy import text
# from typing import List, Optional
# import subprocess, json
# from pydantic import BaseModel
# import uvicorn
# import pandas as pd

# from . import crud, schemas, models
# from .database_config import get_db, engine

# models.Base.metadata.create_all(bind=engine)

# app = FastAPI(title="Amazon Reviews API", version="1.0.0")

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # TODO: restrict in production
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
# """class AIQuery(BaseModel):
#     question: str"""
# class AIQuery(BaseModel):
#     question: str
#     source: str  # "products" or "amazon_reviews"
#     limit: Optional[int] = 50
    
# def decimal_to_float(obj):
#     if isinstance(obj, (int, float)):
#         return obj
#     try:
#         return float(obj)
#     except Exception:
#         return str(obj)

# @app.get("/")
# def read_root():
#     return {"message": "Amazon Reviews API running"}

# @app.get("/health")
# def health_check():
#     return {"status": "healthy"}

# # ----------- Reviews -------------
# @app.get("/Amazon_Reviews/reviews", response_model=List[schemas.AmazonReview])
# def get_reviews(limit: int = 50, offset: int = 0, db: Session = Depends(get_db)):
#     return crud.get_reviews(db, limit=limit, offset=offset)

# @app.get("/Amazon_Reviews/reviews/{review_id}", response_model=schemas.AmazonReview)
# def get_review(review_id: str, db: Session = Depends(get_db)):
#     return crud.get_review_by_id(db, review_id)

# @app.get("/Amazon_Reviews/product/{product_id}", response_model=List[schemas.AmazonReview])
# def get_product_reviews(product_id: str, limit: int = 20, db: Session = Depends(get_db)):
#     return crud.get_product_reviews(db, product_id, limit)

# @app.get("/Amazon_Reviews/search/{query}", response_model=List[schemas.AmazonReview])
# def search_reviews(query: str, limit: int = 50, db: Session = Depends(get_db)):
#     return crud.search_reviews(db, query, limit)

# # ----------- Stats -------------
# @app.get("/Amazon_Reviews/statistics")
# def get_statistics(db: Session = Depends(get_db)):
#     return crud.get_review_statistics(db)

# @app.get("/Amazon_Reviews/sentiment", response_model=List[schemas.SentimentOut])
# def get_sentiment(db: Session = Depends(get_db)):
#     results = crud.get_sentiment_distribution(db)
#     return [schemas.SentimentOut(sentiment=sentiment, count=count) for sentiment, count in results]

# @app.get("/Amazon_Reviews/ratings", response_model=List[schemas.RatingOut])
# def get_ratings(db: Session = Depends(get_db)):
#     results = crud.get_ratings_distribution(db)
#     return [schemas.RatingOut(rating=rating, count=count) for rating, count in results]

# @app.get("/Amazon_Reviews/categories", response_model=List[schemas.CategoryOut])
# def get_category_stats(db: Session = Depends(get_db)):
#     return crud.get_category_statistics(db)

# # ----------- Analytics -------------
# @app.get("/Amazon_Reviews/trending", response_model=List[schemas.TrendingProductOut])
# def get_trending(limit: int = 10, db: Session = Depends(get_db)):
#     return crud.get_trending_products(db, limit)

# @app.get("/Amazon_Reviews/trends/monthly", response_model=List[schemas.MonthlyTrendOut])
# def monthly_trends(year: int, db: Session = Depends(get_db)):
#     return crud.get_monthly_trends(db, year)

# @app.get("/Amazon_Reviews/helpful")
# def get_helpful(limit: int = 10, db: Session = Depends(get_db)):
#     return crud.get_helpful_reviews(db, limit)

# @app.get("/Amazon_Reviews/sentiment/{product_id}", response_model=List[schemas.SentimentOut])
# def get_sentiment(product_id: str, db: Session = Depends(get_db)):
#     return crud.get_product_sentiment_breakdown(db, product_id)

# # ----------- Products -------------
# @app.get("/products", response_model=List[schemas.Product])
# def read_products(limit: int = 10, offset: int = 0, category: schemas.Optional[str] = None,
#                   min_price: schemas.Optional[float] = None, max_price: schemas.Optional[float] = None,
#                   db: Session = Depends(get_db)):
#     return crud.get_products(db, limit, offset, category, min_price, max_price)

# @app.get("/analytics/summary", response_model=schemas.Summary)
# def analytics_summary(db: Session = Depends(get_db)):
#     return crud.get_summary(db)

# @app.get("/analytics/category", response_model=schemas.CategoryAnalyticsResponse)
# def analytics_by_category(db: Session = Depends(get_db)):
#     categories = crud.get_category_analytics(db)
#     return {"categories": categories}


# @app.post("/ai/query")
# def ask_ai(query: AIQuery, db: Session = Depends(get_db)):
#     limit = query.limit or 50  # default 50 if not provided
#     source = query.source.lower()

#     if source == "Flipkart":
#         # Fetch top products only
#         rows = db.execute(
#             text(f"""
#             SELECT id, category, brand, title, price, rating
#             FROM Flipkart
#             ORDER BY reviews DESC
#             LIMIT {limit}
#             """)
#         ).all()
#         data_list = [dict(row._mapping) for row in rows]
#         table_name = "Flipkart"
#     elif source == "amazon_reviews":
#         # Fetch recent Amazon reviews only
#         rows = db.execute(
#             text(f"""
#             SELECT product_title, star_rating, review_headline, review_body, review_date
#             FROM "Amazon_Reviews"
#             ORDER BY review_date DESC
#             LIMIT {limit}
#             """)
#         ).all()
#         data_list = [dict(row._mapping) for row in rows]
#         table_name = "Amazon Reviews"
#     else:
#         return {"error": "Invalid source. Use 'flipkart' or 'amazon_reviews'."}

#     # Convert to JSON safe for AI
#     data_json = json.dumps(data_list, indent=2, default=decimal_to_float)

#     prompt = f"""
#     We have {len(data_list)} records in the {table_name} table.

#     Top {limit} entries:
#     {data_json}

#     Question: {query.question}
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


# @app.get("/top")
# def get_top_items(
#     table: str = Query(..., description="Choose 'products' or 'amazon_reviews'"),
#     n: int = Query(10, description="Number of top items to fetch"),
#     db: Session = Depends(get_db),
# ):
#     """
#     Fetch top N entries from either products or Amazon_Reviews table.
#     Use ?table=products or ?table=amazon_reviews
#     """
#     table = table.lower()
    
#     if table == "products":
#         data = crud.get_top_products(db, n)
#         return {"table": "products", "count": len(data), "data": data}
#     elif table == "amazon_reviews":
#         data = crud.get_top_products_amazon(db, n)
#         return {"table": "amazon_reviews", "count": len(data), "data": data}
#     else:
#         return {"error": "Invalid table. Use 'products' or 'amazon_reviews'."}
    
# @app.get("/top_forecast")
# def top_forecasted_products(n: int = Query(10, description="Number of top products"), db: Session = Depends(get_db)):
#     """
#     Fetch top N products by forecasted next price
#     """
#     forecast_list = crud.get_top_forecasted_products(db, n)
#     return {"table": "products_forecast", "count": len(forecast_list), "data": forecast_list} 

# @app.get("/notifications")
# def get_notifications(
#     table: str = Query("products", description="Choose 'products' or 'amazon_reviews'"),
#     limit: int = Query(5, description="Number of recent notifications"),
#     db: Session = Depends(get_db),
# ):
#     """
#     Fetch latest product/review updates for notification bell.
#     """
#     table = table.lower()

#     if table == "Flipkart":
#         query = text(f"""
#             SELECT id, title AS message, category, price
#             FROM Flipkart
#             ORDER BY id DESC
#             LIMIT {limit}
#         """)
#         rows = db.execute(query).fetchall()
#         data = [
#             {
#                 "id": row.id,
#                 "message": f"New product added: {row.message} (₹{row.price})",
#                 "time": "Just now",
#             }
#             for row in rows
#         ]
#     elif table == "amazon_reviews":
#         query = text(f"""
#             SELECT product_title, review_headline, review_date
#             FROM "Amazon_Reviews"
#             ORDER BY review_date DESC
#             LIMIT {limit}
#         """)
#         rows = db.execute(query).fetchall()
#         data = [
#             {
#                 "id": i + 1,
#                 "message": f"New review: {row.review_headline} on {row.product_title}",
#                 "time": str(row.review_date),
#             }
#             for i, row in enumerate(rows)
#         ]
#     else:
#         return {"error": "Invalid table. Use 'products' or 'amazon_reviews'."}

#     return {"table": table, "count": len(data), "data": data}

# from .routers import users
# app.include_router(users.router, prefix="/users")


# # @app.get("/analytics/category/{category_name}")
# # def get_products_by_category(category_name: str, db: Session = Depends(get_db)):
# #     """
# #     Returns all products in a category with name, avg price, total reviews, and avg rating.
# #     """
# #     query = text("""
# #         SELECT title AS product_name,
# #                ROUND(AVG(price), 2) AS avg_price,
# #                SUM(reviews) AS total_reviews,
# #                ROUND(AVG(rating), 2) AS avg_rating
# #         FROM products
# #         WHERE LOWER(category) = LOWER(:category_name)
# #         GROUP BY title
# #         ORDER BY total_reviews DESC
# #         LIMIT 50
# #     """)
# #     rows = db.execute(query, {"category_name": category_name}).fetchall()
# #     products = [dict(row._mapping) for row in rows]
# #     return {"category": category_name, "products": products}


# @app.get("/analytics/category/{category_name}")
# def get_products_by_category(
#     category_name: str,
#     limit: int = 20,          # products per page
#     offset: int = 0,          # skip first N products
#     db: Session = Depends(get_db)
# ):
#     """
#     Returns Flipkart in a category with pagination.
#     """
#     query = text("""
#         SELECT title AS product_name,
#                ROUND(AVG(price), 2) AS avg_price,
#                SUM(reviews) AS total_reviews,
#                ROUND(AVG(rating), 2) AS avg_rating
#         FROM Flipkart
#         WHERE LOWER(category) = LOWER(:category_name)
#         GROUP BY title
#         ORDER BY total_reviews DESC
#         LIMIT :limit OFFSET :offset
#     """)
#     rows = db.execute(query, {"category_name": category_name, "limit": limit, "offset": offset}).fetchall()
#     products = [dict(row._mapping) for row in rows]

#     count_query = text("""
#         SELECT COUNT(DISTINCT title) as total_count
#         FROM Flipkart
#         WHERE LOWER(category) = LOWER(:category_name)
#     """)
#     total_count = db.execute(count_query, {"category_name": category_name}).fetchone().total_count

#     return {"category": category_name, "products": products, "total_count": total_count}


# @app.get("/product/{product_title}")
# def get_product_details(product_title: str, db: Session = Depends(get_db)):
#     """
#     Get product details by title (case-insensitive, space-safe).
#     """
#     query = text("""
#         SELECT 
#             title AS product_name,
#             ROUND(AVG(price), 2) AS avg_price,
#             ROUND(AVG(rating), 2) AS avg_rating,
#             SUM(reviews) AS total_reviews
#         FROM Flipkart
#         WHERE LOWER(TRIM(title)) = LOWER(TRIM(:product_title))
#         GROUP BY title
#         LIMIT 1
#     """)
#     row = db.execute(query, {"product_title": product_title}).fetchone()

#     if not row:
#         raise HTTPException(status_code=404, detail="Product not found")

#     return dict(row._mapping)

# if __name__ == "__main__":
#     uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)


from fastapi import FastAPI, Depends, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Optional
import subprocess, json
from pydantic import BaseModel
import uvicorn
import pandas as pd

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
    source: str  # "flipkart" or "amazon_reviews"
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

# ----------- flipkart -------------
@app.get("/flipkart", response_model=List[schemas.Product])
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
def ask_ai(query: AIQuery, db: Session = Depends(get_db)):
    limit = query.limit or 50
    source = query.source.lower()

    if source == "flipkart":
        rows = db.execute(
            text(f"""
            SELECT id, category, brand, title, price, rating
            FROM flipkart
            ORDER BY reviews DESC
            LIMIT {limit}
            """)
        ).all()
        data_list = [dict(row._mapping) for row in rows]
        table_name = "flipkart"
    elif source == "amazon_reviews":
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
        return {"error": "Invalid source. Use 'flipkart' or 'amazon_reviews'."}

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


@app.get("/top")
def get_top_items(
    table: str = Query(..., description="Choose 'flipkart' or 'amazon_reviews'"),
    n: int = Query(10, description="Number of top items to fetch"),
    db: Session = Depends(get_db),
):
    table = table.lower()
    
    if table == "flipkart":
        data = crud.get_top_products(db, n)
        return {"table": "flipkart", "count": len(data), "data": data}
    elif table == "amazon_reviews":
        data = crud.get_top_products_amazon(db, n)
        return {"table": "amazon_reviews", "count": len(data), "data": data}
    else:
        return {"error": "Invalid table. Use 'flipkart' or 'amazon_reviews'."}
    
@app.get("/top_forecast")
def top_forecasted_products(n: int = Query(10, description="Number of top products"), db: Session = Depends(get_db)):
    forecast_list = crud.get_top_forecasted_products(db, n)
    return {"table": "flipkart_forecast", "count": len(forecast_list), "data": forecast_list} 

@app.get("/notifications")
def get_notifications(
    table: str = Query("flipkart", description="Choose 'flipkart' or 'amazon_reviews'"),
    limit: int = Query(5, description="Number of recent notifications"),
    db: Session = Depends(get_db),
):
    table = table.lower()

    if table == "flipkart":
        query = text(f"""
            SELECT id, title AS message, category, price
            FROM flipkart
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
        return {"error": "Invalid table. Use 'flipkart' or 'amazon_reviews'."}

    return {"table": table, "count": len(data), "data": data}


@app.get("/analytics/category/{category_name}")
def get_products_by_category(
    category_name: str,
    limit: int = 20,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    query = text("""
        SELECT title AS product_name,
               ROUND(AVG(price), 2) AS avg_price,
               SUM(reviews) AS total_reviews,
               ROUND(AVG(rating), 2) AS avg_rating
        FROM flipkart
        WHERE LOWER(category) = LOWER(:category_name)
        GROUP BY title
        ORDER BY total_reviews DESC
        LIMIT :limit OFFSET :offset
    """)
    rows = db.execute(query, {"category_name": category_name, "limit": limit, "offset": offset}).fetchall()
    products = [dict(row._mapping) for row in rows]

    count_query = text("""
        SELECT COUNT(DISTINCT title) as total_count
        FROM flipkart
        WHERE LOWER(category) = LOWER(:category_name)
    """)
    total_count = db.execute(count_query, {"category_name": category_name}).fetchone().total_count

    return {"category": category_name, "products": products, "total_count": total_count}


@app.get("/product/{product_title}")
def get_product_details(product_title: str, db: Session = Depends(get_db)):
    query = text("""
        SELECT 
            title AS product_name,
            ROUND(AVG(price), 2) AS avg_price,
            ROUND(AVG(rating), 2) AS avg_rating,
            SUM(reviews) AS total_reviews
        FROM flipkart
        WHERE LOWER(TRIM(title)) = LOWER(TRIM(:product_title))
        GROUP BY title
        LIMIT 1
    """)
    row = db.execute(query, {"product_title": product_title}).fetchone()

    if not row:
        raise HTTPException(status_code=404, detail="Product not found")

    return dict(row._mapping)

@app.get("/categories")
def get_categories(table: str = Query("flipkart"), db: Session = Depends(get_db)):
    """
    Return a list of distinct categories for a given table
    """
    table = table.lower()
    if table == "flipkart":
        return crud.get_flipkart_categories(db)  # Should return list of dicts with 'category' key
    elif table == "amazon_reviews":
        return crud.get_amazon_categories(db)
    else:
        return {"error": "Invalid table"}
    

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
