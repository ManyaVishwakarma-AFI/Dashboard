from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from . import models
from sqlalchemy import text
from typing import List, Dict, Any


def get_reviews(db: Session, limit: int = 50, offset: int = 0):
    return db.query(models.AmazonReview).offset(offset).limit(limit).all()

def get_review_by_id(db: Session, review_id: str):
    return db.query(models.AmazonReview).filter(models.AmazonReview.review_id == review_id).first()

def get_product_reviews(db: Session, product_id: str, limit: int = 20):
    return db.query(models.AmazonReview).filter(models.AmazonReview.product_id == product_id).limit(limit).all()

def search_reviews(db: Session, query: str, limit: int = 50):
    return db.query(models.AmazonReview).filter(
        or_(
            models.AmazonReview.product_title.ilike(f"%{query}%"),
            models.AmazonReview.review_headline.ilike(f"%{query}%"),
            models.AmazonReview.review_body.ilike(f"%{query}%")
        )
    ).limit(limit).all()

def get_review_statistics(db: Session):
    total = db.query(func.count(models.AmazonReview.review_id)).scalar()
    avg_rating = db.query(func.avg(models.AmazonReview.star_rating)).scalar()
    return {"total_reviews": total, "average_rating": float(avg_rating) if avg_rating else None}

def get_sentiment_distribution(db: Session):
    return (
        db.query(models.AmazonReview.Sentiment_pc, func.count(models.AmazonReview.review_id))
          .group_by(models.AmazonReview.Sentiment_pc)
          .all()
    )

def get_ratings_distribution(db: Session):
    return (
        db.query(models.AmazonReview.star_rating, func.count(models.AmazonReview.review_id))
          .group_by(models.AmazonReview.star_rating)
          .all()
    )

def get_category_statistics(db: Session):
    results = (
        db.query(models.AmazonReview.product_category, func.count(models.AmazonReview.review_id))
          .group_by(models.AmazonReview.product_category)
          .all()
    )
    return [{"category": category, "count": count} for category, count in results]

from sqlalchemy import func

def get_trending_products(db: Session, limit: int = 10):
    results = (
        db.query(
            models.AmazonReview.product_id,
            models.AmazonReview.product_title,
            models.AmazonReview.product_category,
            func.count(models.AmazonReview.review_id).label("review_count"),
            func.avg(models.AmazonReview.star_rating).label("avg_rating")
        )
        .group_by(
            models.AmazonReview.product_id,
            models.AmazonReview.product_title,
            models.AmazonReview.product_category
        )
        .order_by(func.count(models.AmazonReview.review_id).desc())
        .limit(limit)
        .all()
    )

    return [
        {
            "product_id": pid,
            "product_title": title,
            "category": cat,
            "review_count": rc,
            "avg_rating": avg
        }
        for pid, title, cat, rc, avg in results
    ]

def get_monthly_trends(db: Session, year: int):
    results = (
        db.query(
            models.AmazonReview.review_month,
            func.count(models.AmazonReview.review_id).label("review_count"),
            func.avg(models.AmazonReview.star_rating).label("avg_rating")
        )
        .filter(models.AmazonReview.review_year == year)
        .group_by(models.AmazonReview.review_month)
        .order_by(models.AmazonReview.review_month)
        .all()
    )

    return [
        {"month": month, "review_count": count, "avg_rating": avg}
        for month, count, avg in results
    ]

def get_helpful_reviews(db: Session, limit: int = 10):
    return db.query(models.AmazonReview).order_by(models.AmazonReview.helpful_votes.desc()).limit(limit).all()

def get_product_sentiment_breakdown(db: Session, product_id: str):
    results = (
        db.query(
            models.AmazonReview.Sentiment_pc,
            func.count(models.AmazonReview.review_id).label("count")
        )
        .filter(models.AmazonReview.product_id == product_id)
        .group_by(models.AmazonReview.Sentiment_pc)
        .all()
    )
    
    # Convert to list of dicts
    return [{"sentiment": sentiment, "count": count} for sentiment, count in results]


def get_products(db: Session, limit: int, offset: int, category: str = None,
                 min_price: float = None, max_price: float = None) -> List[Dict[str, Any]]:
    query = "SELECT * FROM products WHERE 1=1"
    if category:
        query += " AND category = :category"
    if min_price is not None:
        query += " AND price >= :min_price"
    if max_price is not None:
        query += " AND price <= :max_price"
    query += " ORDER BY last_updated DESC LIMIT :limit OFFSET :offset"

    params = {
        "category": category,
        "min_price": min_price,
        "max_price": max_price,
        "limit": limit,
        "offset": offset
    }
    result = db.execute(text(query), params)
    return [dict(row._mapping) for row in result]

# Analytics summary
def get_summary(db: Session) -> Dict[str, Any]:
    query = """
    SELECT
        COUNT(*) AS total_products,
        AVG(price) AS avg_price,
        AVG(rating) AS avg_rating,
        SUM(reviews) AS total_reviews
    FROM products
    """
    result = db.execute(text(query))
    return dict(result.mappings().first())

# Top products
def get_top_products(db: Session, n: int, by: str) -> List[Dict[str, Any]]:
    query = f"SELECT * FROM products ORDER BY {by} DESC LIMIT :n"
    result = db.execute(text(query), {"n": n})
    return [dict(row._mapping) for row in result]

# Category analytics
def get_category_analytics(db: Session) -> List[Dict[str, Any]]:
    query = """
    SELECT
        category,
        COUNT(*) AS total_products,
        AVG(price) AS avg_price,
        AVG(rating) AS avg_rating,
        SUM(reviews) AS total_reviews
    FROM products
    GROUP BY category
    ORDER BY total_products DESC
    """
    result = db.execute(text(query))
    return [dict(row._mapping) for row in result]

def get_filters(db: Session):
    query = db.execute("SELECT DISTINCT category, brand FROM amazon_reviews")
    results = query.fetchall()
    filters = []
    for row in results:
        filters.append(dict(row._mapping))  
    return filters
