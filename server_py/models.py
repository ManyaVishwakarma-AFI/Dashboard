# from sqlalchemy import Column, String, Text, Integer, Float, Boolean, JSON, TIMESTAMP
# from .database_config import Base
# from sqlalchemy.ext.declarative import declarative_base
# from datetime import datetime

# class AmazonReview(Base):
#     __tablename__ = "Amazon_Reviews"   

#     review_id = Column(String, primary_key=True, index=True)

#     product_id = Column(String)
#     market_place = Column(Text)
#     customer_id = Column(String)
#     product_parent = Column(String)
#     product_title = Column(Text)
#     product_category = Column(Text)
#     star_rating = Column(Integer)
#     helpful_votes = Column(Integer)
#     total_votes = Column(Integer)
#     vine = Column(Text)
#     verified_purchase = Column(Text)
#     review_headline = Column(Text)
#     review_body = Column(Text)
#     review_date = Column(Text)   # stored as text in DB
#     Sentiment_pc = Column(Text)
#     review_month = Column(Text)
#     review_day = Column(Text)
#     review_year = Column(Integer)
#     rating_1 = Column("1 rating", Integer)
#     rating_2 = Column("2 ratings", Integer)
#     rating_3 = Column("3 ratings", Integer)
#     rating_4 = Column("4 rating", Integer)
#     rating_5 = Column("5 rating", Integer)


# class Product(Base):
#     __tablename__ = "products"  

#     id = Column(Integer, primary_key=True, index=True)
#     asin = Column(String(20), unique=True, nullable=False)
#     title = Column(Text, nullable=False)
#     brand = Column(Text, nullable=True)
#     category = Column(Text, nullable=True)
#     price = Column(Float, nullable=True)
#     currency = Column(String(5), nullable=True)
#     rating = Column(Float, nullable=True)
#     reviews = Column(Integer, nullable=True)
#     availability = Column(Boolean, nullable=True)
#     variation = Column(JSON, nullable=True)  # JSON column
#     image_url = Column(Text, nullable=True)
#     last_updated = Column(TIMESTAMP, nullable=True)

# ============================================
# SOLUTION 2: Update models.py
# ============================================
# File: server_py/models.py (CORRECTED)

from sqlalchemy import Column, String, Text, Integer, Float, Boolean, JSON, TIMESTAMP, DateTime, ARRAY
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from sqlalchemy import DateTime

# Import Base from database_config
from server_py.database_config import Base

class AmazonReview(Base):
    __tablename__ = "Amazon_Reviews"   

    review_id = Column(String, primary_key=True, index=True)
    product_id = Column(String)
    market_place = Column(Text)
    customer_id = Column(String)
    product_parent = Column(String)
    product_title = Column(Text)
    product_category = Column(Text)
    star_rating = Column(Integer)
    helpful_votes = Column(Integer)
    total_votes = Column(Integer)
    vine = Column(Text)
    verified_purchase = Column(Text)
    review_headline = Column(Text)
    review_body = Column(Text)
    review_date = Column(Text)
    Sentiment_pc = Column(Text)
    review_month = Column(Text)
    review_day = Column(Text)
    review_year = Column(Integer)
    rating_1 = Column("1 rating", Integer)
    rating_2 = Column("2 ratings", Integer)
    rating_3 = Column("3 ratings", Integer)
    rating_4 = Column("4 rating", Integer)
    rating_5 = Column("5 rating", Integer)

class Product(Base):
    __tablename__ = "products"  

    id = Column(Integer, primary_key=True, index=True)
    source = Column(String(50), nullable=True)  # 'amazon' or 'flipkart'
    product_id = Column(String(100), unique=True, index=True, nullable=True)
    asin = Column(String(20), unique=True, nullable=True)
    title = Column(Text, nullable=False)
    brand = Column(String(200), nullable=True)
    category = Column(String(200), nullable=True)
    price = Column(Float, nullable=True)
    currency = Column(String(5), nullable=True)
    original_price = Column(Float, nullable=True)
    discount = Column(Float, nullable=True)
    rating = Column(Float, nullable=True)
    reviews = Column(Integer, nullable=True)
    reviews_count = Column(Integer, nullable=True)
    availability = Column(Boolean, nullable=True)
    is_bestseller = Column(Boolean, default=False)
    is_deal = Column(Boolean, default=False)
    variation = Column(JSON, nullable=True)
    image_url = Column(Text, nullable=True)
    product_url = Column(String(500), nullable=True)
    description = Column(Text, nullable=True)
    features = Column(JSON, nullable=True)
    specifications = Column(JSON, nullable=True)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

class Review(Base):
    __tablename__ = "reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(String(100), index=True)
    source = Column(String(50))
    reviewer_name = Column(String(200))
    rating = Column(Float)
    title = Column(String(500))
    review_text = Column(Text)
    verified_purchase = Column(Boolean)
    helpful_count = Column(Integer)
    review_date = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)

class Seller(Base):
    __tablename__ = "sellers"
    
    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(String(100), unique=True, index=True)
    source = Column(String(50))
    seller_name = Column(String(200))
    rating = Column(Float)
    reviews_count = Column(Integer)
    positive_rating_percent = Column(Float)
    is_verified = Column(Boolean)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

class Deal(Base):
    __tablename__ = "deals"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(String(100), index=True)
    source = Column(String(50))
    deal_type = Column(String(100))
    discount_percent = Column(Float)
    deal_start = Column(DateTime, nullable=True)
    deal_end = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50))
    last_name = Column(String(50))
    email = Column(String(100), unique=True, index=True)
    password_hash = Column(String)
    business_name = Column(String(100))
    location = Column(String(50))
    business_interests = Column(ARRAY(String))
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    updated_at = Column(TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)