from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class AmazonReviewBase(BaseModel):
    """Base schema for Amazon Review"""
    product_id: Optional[str] = None
    market_place: Optional[str] = None
    customer_id: Optional[str] = None
    product_parent: Optional[str] = None
    product_title: Optional[str] = None
    product_category: Optional[str] = None
    star_rating: Optional[str] = None
    helpful_votes: Optional[str] = None
    total_votes: Optional[str] = None
    vine: Optional[str] = None
    verified_purchase: Optional[str] = None
    review_headline: Optional[str] = None
    review_body: Optional[str] = None
    review_date: Optional[str] = None
    sentiment_pc: Optional[str] = None
    review_month: Optional[str] = None
    review_day: Optional[str] = None
    review_year: Optional[str] = None
    rating_1: Optional[str] = None
    rating_2: Optional[str] = None
    rating_3: Optional[str] = None
    rating_4: Optional[str] = None
    rating_5: Optional[str] = None


class AmazonReview(AmazonReviewBase):
    """Schema for reading Amazon Review from DB"""
    review_id: str
    
    class Config:
        from_attributes = True


class ReviewStatistics(BaseModel):
    """Statistics about reviews"""
    total_reviews: int
    average_rating: float
    verified_purchases: int
    verification_rate: float


class SentimentDistribution(BaseModel):
    """Sentiment distribution data"""
    sentiment: str
    count: int


class RatingDistribution(BaseModel):
    """Rating distribution data"""
    rating: str
    count: int


class CategoryStats(BaseModel):
    """Category statistics"""
    category: str
    review_count: int
    average_rating: float


class TrendingProduct(BaseModel):
    """Trending product data"""
    product_id: str
    product_title: str
    review_count: int
    average_rating: float


class MonthlyTrend(BaseModel):
    """Monthly review trend"""
    month: str
    year: str
    review_count: int


