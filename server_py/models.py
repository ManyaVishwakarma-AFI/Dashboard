from sqlalchemy import Column, String, Text, Integer, Float, Boolean, JSON, TIMESTAMP, ARRAY
from .database_config import Base
from datetime import datetime
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
    updated_at = Column(TIMESTAMP, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)   # <-- THIS DOESN'T EXIST IN DB
 

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
    review_date = Column(Text)   # stored as text in DB
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
    asin = Column(String(20), unique=True, nullable=False)
    title = Column(Text, nullable=False)
    brand = Column(Text, nullable=True)
    category = Column(Text, nullable=True)
    price = Column(Float, nullable=True)
    currency = Column(String(5), nullable=True)
    rating = Column(Float, nullable=True)
    reviews = Column(Integer, nullable=True)
    availability = Column(Boolean, nullable=True)
    variation = Column(JSON, nullable=True)  # JSON column
    image_url = Column(Text, nullable=True)
    last_updated = Column(TIMESTAMP, nullable=True)
