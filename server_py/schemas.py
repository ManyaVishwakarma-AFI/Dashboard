from pydantic import BaseModel
from typing import Optional

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
    review_date: Optional[str]  # stored as text
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
        orm_mode = True
