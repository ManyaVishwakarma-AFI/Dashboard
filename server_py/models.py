from sqlalchemy import Column, String, Text, Integer
from .database import Base

class AmazonReview(Base):
    """Amazon PC Reviews Model matching your CSV structure"""
    __tablename__ = "amazon_pc_reviews"
    
    # Using review_id as primary key since it should be unique
    review_id = Column(Text, primary_key=True, index=True)
    
    # Product Information
    product_id = Column(Text, index=True)
    product_parent = Column(Text)
    product_title = Column(Text)
    product_category = Column(Text, index=True)
    
    # Marketplace & Customer
    market_place = Column(Text)
    customer_id = Column(Text)
    
    # Review Content
    review_headline = Column(Text)
    review_body = Column(Text)
    star_rating = Column(Text, index=True)  # Stored as TEXT from CSV
    
    # Review Metadata
    helpful_votes = Column(Text)
    total_votes = Column(Text)
    vine = Column(Text)
    verified_purchase = Column(Text, index=True)
    
    # Date Information
    review_date = Column(Text)
    review_month = Column(Text, index=True)  # e.g., "August"
    review_day = Column(Text)
    review_year = Column(Text, index=True)
    
    # Sentiment Analysis
    sentiment_pc = Column("Sentiment_pc", Text, index=True)
    
    # Rating Breakdown
    rating_1 = Column("1 rating", Text)
    rating_2 = Column("2 ratings", Text)
    rating_3 = Column("3 ratings", Text)
    rating_4 = Column("4 rating", Text)
    rating_5 = Column("5 rating", Text)
    
    def __repr__(self):
        return f"<AmazonReview(review_id={self.review_id}, product={self.product_title[:30]})>"