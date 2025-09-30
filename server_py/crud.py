from sqlalchemy.orm import Session
from sqlalchemy import func, or_, desc, case
from . import models, schemas
from typing import Optional, List
from datetime import datetime

# Amazon Reviews CRUD Operations

def get_reviews(
    db: Session, 
    limit: int = 50, 
    offset: int = 0,
    filters: dict = None
) -> List[models.AmazonReview]:
    """Get reviews with optional filtering"""
    query = db.query(models.AmazonReview)
    
    if filters:
        if "product_category" in filters:
            query = query.filter(models.AmazonReview.product_category == filters["product_category"])
        if "star_rating" in filters:
            query = query.filter(models.AmazonReview.star_rating == filters["star_rating"])
        if "sentiment_pc" in filters:
            query = query.filter(models.AmazonReview.sentiment_pc == filters["sentiment_pc"])
        if "verified_purchase" in filters:
            query = query.filter(models.AmazonReview.verified_purchase == filters["verified_purchase"])
        if "review_month" in filters:
            query = query.filter(models.AmazonReview.review_month == filters["review_month"])
        if "review_year" in filters:
            query = query.filter(models.AmazonReview.review_year == filters["review_year"])
    
    return query.offset(offset).limit(limit).all()


def get_review_by_id(db: Session, review_id: str):
    """Get a single review by review_id"""
    return db.query(models.AmazonReview).filter(
        models.AmazonReview.review_id == review_id
    ).first()


def get_product_reviews(db: Session, product_id: str, limit: int = 20):
    """Get all reviews for a specific product"""
    return db.query(models.AmazonReview).filter(
        models.AmazonReview.product_id == product_id
    ).limit(limit).all()


def search_reviews(db: Session, query: str, limit: int = 50):
    """Search reviews by product title, headline, or review body"""
    search_query = f"%{query.lower()}%"
    return db.query(models.AmazonReview).filter(
        or_(
            func.lower(models.AmazonReview.product_title).like(search_query),
            func.lower(models.AmazonReview.review_headline).like(search_query),
            func.lower(models.AmazonReview.review_body).like(search_query)
        )
    ).limit(limit).all()


def get_review_statistics(db: Session):
    """Get overall review statistics"""
    total_reviews = db.query(func.count(models.AmazonReview.review_id)).scalar() or 0

    # Safely calculate average rating by casting only numeric values
    avg_rating_query = func.avg(
        case(
            # Use GLOB for SQLite-compatible numeric check
            (models.AmazonReview.star_rating.op("GLOB")("[0-9]*"),
             func.cast(models.AmazonReview.star_rating, db.Integer)),
            else_=None
        )
    )
    avg_rating = db.query(avg_rating_query).scalar() or 0

    verified_count = db.query(func.count(models.AmazonReview.review_id)).filter(
        models.AmazonReview.verified_purchase == 'Y'
    ).scalar() or 0
    
    return {
        "total_reviews": total_reviews,
        "average_rating": float(avg_rating) if avg_rating else 0,
        "verified_purchases": verified_count,
        "verification_rate": (verified_count / total_reviews * 100) if total_reviews > 0 else 0
    }


def get_sentiment_distribution(db: Session):
    """Get distribution of sentiments"""
    sentiments = db.query(
        models.AmazonReview.sentiment_pc,
        func.count(models.AmazonReview.review_id).label('count')
    ).group_by(models.AmazonReview.sentiment_pc).all()
    
    return [{"sentiment": s[0], "count": s[1]} for s in sentiments]


def get_rating_distribution(db: Session):
    """Get distribution of star ratings"""
    ratings = db.query(
        models.AmazonReview.star_rating,
        func.count(models.AmazonReview.review_id).label('count')
    ).group_by(models.AmazonReview.star_rating).order_by(
        models.AmazonReview.star_rating
    ).all()
    
    return [{"rating": r[0], "count": r[1]} for r in ratings]


def get_category_statistics(db: Session):
    """Get statistics by product category"""
    # Safe average rating calculation
    avg_rating_expr = func.avg(
        case(
            (models.AmazonReview.star_rating.op("GLOB")("[0-9]*"),
             func.cast(models.AmazonReview.star_rating, db.Integer)),
            else_=None
        )
    ).label('avg_rating')

    categories = db.query(
        models.AmazonReview.product_category,
        func.count(models.AmazonReview.review_id).label('review_count'),
        avg_rating_expr
    ).group_by(models.AmazonReview.product_category).all()
    
    return [
        {
            "category": c.product_category,
            "review_count": c.review_count,
            "average_rating": float(c.avg_rating) if c.avg_rating else 0
        }
        for c in categories
    ]


def get_trending_products(db: Session, limit: int = 10):
    """Get products with most recent reviews"""
    # Safe average rating calculation
    avg_rating_expr = func.avg(
        case(
            (models.AmazonReview.star_rating.op("GLOB")("[0-9]*"),
             func.cast(models.AmazonReview.star_rating, db.Integer)),
            else_=None
        )
    ).label('avg_rating')

    products = db.query(
        models.AmazonReview.product_id,
        models.AmazonReview.product_title,
        func.count(models.AmazonReview.review_id).label('review_count'),
        avg_rating_expr
    ).group_by(
        models.AmazonReview.product_id,
        models.AmazonReview.product_title
    ).order_by(desc('review_count')).limit(limit).all()
    
    return [
        {
            "product_id": p.product_id,
            "product_title": p.product_title,
            "review_count": p.review_count,
            "average_rating": float(p.avg_rating) if p.avg_rating else 0
        }
        for p in products
    ]


def get_monthly_review_trends(db: Session, year: Optional[str] = None):
    """Get review counts by month"""
    query = db.query(
        models.AmazonReview.review_month,
        models.AmazonReview.review_year,
        func.count(models.AmazonReview.review_id).label('count')
    )
    
    if year:
        query = query.filter(models.AmazonReview.review_year == year)
    
    trends = query.group_by(
        models.AmazonReview.review_month,
        models.AmazonReview.review_year
    ).order_by(
        models.AmazonReview.review_year,
        models.AmazonReview.review_month
    ).all()
    
    return [
        {
            "month": t[0],
            "year": t[1],
            "review_count": t[2]
        }
        for t in trends
    ]


def get_helpful_reviews(db: Session, limit: int = 10):
    """Get most helpful reviews"""
    # Safe casting for helpful_votes
    safe_helpful_votes = case(
        (models.AmazonReview.helpful_votes.op("GLOB")("[0-9]*"),
         func.cast(models.AmazonReview.helpful_votes, db.Integer)),
        else_=0
    )

    return db.query(models.AmazonReview).order_by(
        desc(safe_helpful_votes)
    ).limit(limit).all()


def get_product_sentiment_breakdown(db: Session, product_id: str):
    """Get sentiment breakdown for a specific product"""
    sentiments = db.query(
        models.AmazonReview.sentiment_pc,
        func.count(models.AmazonReview.review_id).label('count')
    ).filter(
        models.AmazonReview.product_id == product_id
    ).group_by(models.AmazonReview.sentiment_pc).all()
    
    return [{"sentiment": s[0], "count": s[1]} for s in sentiments]