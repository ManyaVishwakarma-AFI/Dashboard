# ============================================
# SOLUTION 1: Fix database_config.py
# ============================================
# File: server_py/database_config.py (CORRECTED)

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from sqlalchemy.ext.declarative import declarative_base
import logging
import os
from dotenv import load_dotenv
from datetime import datetime
from typing import List, Optional

load_dotenv()
logger = logging.getLogger(__name__)

# Database URL
DATABASE_URL = "postgresql://seller-db:Seller!db@122.176.108.253:5432/db1"

# Create engine
engine = create_engine(DATABASE_URL)

# Create SessionLocal
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base - THIS SHOULD BE HERE, NOT IMPORTED
Base = declarative_base()

def get_db():
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class DatabaseService:
    """Service for database operations"""
    
    def __init__(self):
        self.db = SessionLocal()
    
    def close(self):
        self.db.close()
    
    def save_product(self, product_data: dict):
        """Save or update product"""
        # Import here to avoid circular import
        from server_py.models import Product
        
        try:
            existing = self.db.query(Product).filter(
                Product.product_id == product_data['product_id']
            ).first()
            
            if existing:
                for key, value in product_data.items():
                    setattr(existing, key, value)
                existing.last_updated = datetime.utcnow()
                product = existing
            else:
                product = Product(**product_data)
                self.db.add(product)
            
            self.db.commit()
            self.db.refresh(product)
            logger.info(f"Saved product: {product.product_id}")
            return product
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error saving product: {str(e)}")
            raise
    
    def save_reviews(self, reviews_data: List[dict]) -> int:
        """Save multiple reviews"""
        from server_py.models import Review
        
        try:
            count = 0
            for review_data in reviews_data:
                review = Review(**review_data)
                self.db.add(review)
                count += 1
            
            self.db.commit()
            logger.info(f"Saved {count} reviews")
            return count
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error saving reviews: {str(e)}")
            raise
    
    def save_deal(self, deal_data: dict):
        """Save deal"""
        from server_py.models import Deal
        
        try:
            deal = Deal(**deal_data)
            self.db.add(deal)
            self.db.commit()
            self.db.refresh(deal)
            logger.info(f"Saved deal: {deal.product_id}")
            return deal
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error saving deal: {str(e)}")
            raise
    
    def get_all_products(self, limit: int = 100):
        """Get all products"""
        from server_py.models import Product
        return self.db.query(Product).limit(limit).all()
    
    def get_product_by_id(self, product_id: str):
        """Get product by ID"""
        from server_py.models import Product
        return self.db.query(Product).filter(
            Product.product_id == product_id
        ).first()
    
