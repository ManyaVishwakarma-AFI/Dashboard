from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from . import models

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
    return db.query(models.AmazonReview.Sentiment_pc, func.count(models.AmazonReview.review_id))\
             .group_by(models.AmazonReview.Sentiment_pc).all()

def get_rating_distribution(db: Session):
    return db.query(models.AmazonReview.star_rating, func.count(models.AmazonReview.review_id))\
             .group_by(models.AmazonReview.star_rating).all()

def get_category_statistics(db: Session):
    return db.query(models.AmazonReview.product_category, func.count(models.AmazonReview.review_id))\
             .group_by(models.AmazonReview.product_category).all()

def get_trending_products(db: Session, limit: int = 10):
    return db.query(models.AmazonReview.product_id, func.count(models.AmazonReview.review_id).label("review_count"))\
             .group_by(models.AmazonReview.product_id)\
             .order_by(func.count(models.AmazonReview.review_id).desc())\
             .limit(limit).all()

def get_monthly_review_trends(db: Session, year: str = None):
    query = db.query(models.AmazonReview.review_year, models.AmazonReview.review_month,
                     func.count(models.AmazonReview.review_id))\
              .group_by(models.AmazonReview.review_year, models.AmazonReview.review_month)
    if year:
        query = query.filter(models.AmazonReview.review_year == year)
    return query.all()

def get_helpful_reviews(db: Session, limit: int = 10):
    return db.query(models.AmazonReview).order_by(models.AmazonReview.helpful_votes.desc()).limit(limit).all()

def get_product_sentiment_breakdown(db: Session, product_id: str):
    return db.query(models.AmazonReview.Sentiment_pc, func.count(models.AmazonReview.review_id))\
             .filter(models.AmazonReview.product_id == product_id)\
             .group_by(models.AmazonReview.Sentiment_pc).all()
