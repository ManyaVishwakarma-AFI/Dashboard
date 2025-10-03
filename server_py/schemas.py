from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime
class MonthlyTrendOut(BaseModel):
    month: str
    review_count: int
    avg_rating: float

class TrendingProductOut(BaseModel):
    product_id: str
    product_title: Optional[str]
    category: Optional[str]
    review_count: int
    avg_rating: Optional[float]

class CategoryOut(BaseModel):
    category: str
    count: int

class RatingOut(BaseModel):
    rating: int
    count: int

class SentimentOut(BaseModel):
    sentiment: str
    count: int

class AmazonReview(BaseModel):
    review_id: str
    product_id: Optional[str]
    market_place: Optional[str]
    customer_id: Optional[str]
    product_parent: Optional[str]
    product_title: Optional[str]
    product_category: Optional[str]
    star_rating: Optional[int]
    helpful_votes: Optional[int]
    total_votes: Optional[int]
    vine: Optional[str]
    verified_purchase: Optional[str]
    review_headline: Optional[str]
    review_body: Optional[str]
    review_date: Optional[str]  
    Sentiment_pc: Optional[str]
    review_month: Optional[str]
    review_day: Optional[str]
    review_year: Optional[int]
    rating_1: Optional[int]
    rating_2: Optional[int]
    rating_3: Optional[int]
    rating_4: Optional[int]
    rating_5: Optional[int]

    class Config:
        from_attributes = True

class Product(BaseModel):
    id: int
    asin: str
    title: str
    brand: Optional[str]
    category: Optional[str]
    price: Optional[float]
    currency: Optional[str]
    rating: Optional[float]
    reviews: Optional[int]
    availability: Optional[bool]
    variation: Optional[Dict[str, Any]]  
    image_url: Optional[str]
    last_updated: Optional[datetime]  

    class Config:
        from_attributes = True

class Product(BaseModel):
    id: int
    title: str
    brand: Optional[str]
    category: Optional[str]
    price: Optional[float]
    rating: Optional[float]
    reviews: Optional[int]
    last_updated: Optional[datetime]

    class Config:
       from_attributes = True

class Summary(BaseModel):
    total_products: int
    avg_price: Optional[float]
    avg_rating: Optional[float]
    total_reviews: Optional[int]

class TopProductsResponse(BaseModel):
    top_products: List[Product]

class CategoryAnalytics(BaseModel):
    category: str
    total_products: int
    avg_price: Optional[float]
    avg_rating: Optional[float]
    total_reviews: Optional[int]

class CategoryAnalyticsResponse(BaseModel):
    categories: List[CategoryAnalytics]

class AIQuery(BaseModel):
    question: str
