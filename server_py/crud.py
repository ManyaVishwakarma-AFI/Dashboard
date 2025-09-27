import random
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from . import models, schemas
from uuid import uuid4
from datetime import datetime, timedelta
from passlib.context import CryptContext
from decimal import Decimal

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# User methods
def get_user(db: Session, user_id: str):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(
        id=str(uuid4()),
        email=user.email,
        password=hashed_password,
        firstName=user.firstName,
        lastName=user.lastName,
        businessName=user.businessName,
        location=user.location,
        createdAt=datetime.utcnow(),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: str, updates: dict):
    db.query(models.User).filter(models.User.id == user_id).update(updates)
    db.commit()
    return get_user(db, user_id)

# Product methods
def get_products(db: Session, limit: int = 50, offset: int = 0, filters: dict = None):
    query = db.query(models.Product)
    if filters:
        if "category" in filters:
            query = query.filter(models.Product.category == filters["category"])
        if "minPrice" in filters:
            query = query.filter(models.Product.price >= filters["minPrice"])
        if "maxPrice" in filters:
            query = query.filter(models.Product.price <= filters["maxPrice"])
        if "minRating" in filters:
            query = query.filter(models.Product.rating >= filters["minRating"])
        if "location" in filters:
            # This is a simplified version of the original location filter
            query = query.filter(models.Product.locationData.has_key(filters["location"]))
    return query.offset(offset).limit(limit).all()

def get_product(db: Session, product_id: str):
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(**product.dict(), id=str(uuid4()), createdAt=datetime.utcnow())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def get_trending_products(db: Session, limit: int = 10):
    products = db.query(models.Product).filter(models.Product.trending == True).order_by(models.Product.salesVolume.desc()).limit(limit).all()
    return [
        schemas.ProductWithMetrics(
            **p.__dict__,
            salesGrowth=random.uniform(10, 50),
            revenueGrowth=random.uniform(5, 40),
            competitivePosition="leading"
        ) for p in products
    ]

def get_top_profit_products(db: Session, limit: int = 10):
    products = db.query(models.Product).order_by(models.Product.profitMargin.desc()).limit(limit).all()
    return [
        schemas.ProductWithMetrics(
            **p.__dict__,
            salesGrowth=random.uniform(5, 30),
            revenueGrowth=random.uniform(3, 25),
            competitivePosition="profitable"
        ) for p in products
    ]

def get_underperforming_products(db: Session, limit: int = 10):
    products = db.query(models.Product).order_by(models.Product.salesVolume.asc()).limit(limit).all()
    return [
        schemas.ProductWithMetrics(
            **p.__dict__,
            salesGrowth=random.uniform(-30, -5),
            revenueGrowth=random.uniform(-25, -3),
            competitivePosition="needs attention"
        ) for p in products
    ]

def search_products(db: Session, query: str):
    search_query = f"%{query.lower()}%"
    return db.query(models.Product).filter(
        or_(
            func.lower(models.Product.name).like(search_query),
            func.lower(models.Product.category).like(search_query),
            func.lower(models.Product.brand).like(search_query),
        )
    ).all()

def get_product_count(db: Session):
    return db.query(models.Product).count()

# Analytics methods
def get_analytics(db: Session, product_id: str = None, start_date: datetime = None, end_date: datetime = None):
    query = db.query(models.Analytics)
    if product_id:
        query = query.filter(models.Analytics.productId == product_id)
    if start_date:
        query = query.filter(models.Analytics.date >= start_date)
    if end_date:
        query = query.filter(models.Analytics.date <= end_date)
    return query.all()

def create_analytics(db: Session, analytics: schemas.AnalyticsCreate):
    db_analytics = models.Analytics(**analytics.dict(), id=str(uuid4()))
    db.add(db_analytics)
    db.commit()
    db.refresh(db_analytics)
    return db_analytics

def get_dashboard_metrics(db: Session):
    total_revenue = db.query(func.sum(models.Analytics.revenue)).scalar() or 0
    total_products = db.query(func.count(models.Product.id)).scalar() or 0
    avg_profit_margin = db.query(func.avg(models.Product.profitMargin)).scalar() or 0
    avg_rating = db.query(func.avg(models.Product.rating)).scalar() or 0

    return schemas.DashboardMetrics(
        totalRevenue=float(total_revenue),
        revenueGrowth=12.3, # Mocked as in original
        totalProducts=total_products,
        productGrowth=8.7, # Mocked as in original
        avgProfitMargin=float(avg_profit_margin),
        marginGrowth=2.1, # Mocked as in original
        avgRating=float(avg_rating),
        ratingGrowth=0.3 # Mocked as in original
    )

def get_category_performance(db: Session):
    # This is a complex query to replicate directly, so we'll simulate it
    # based on the logic from the original MemStorage.
    products = db.query(models.Product).all()
    categories = list(set(p.category for p in products))
    performance_data = []

    for category in categories:
        category_products = [p for p in products if p.category == category]
        sales = sum(p.salesVolume for p in category_products)
        revenue = sum(p.salesVolume * p.price for p in category_products)
        profit_margin = sum(p.profitMargin for p in category_products) / len(category_products) if category_products else 0

        performance_data.append(schemas.CategoryPerformance(
            category=category,
            sales=sales,
            revenue=float(revenue),
            profitMargin=float(profit_margin),
            growth=random.uniform(5, 40) # Mocked as in original
        ))
    return performance_data

def get_geographic_data(db: Session):
    # This data was entirely mocked in the original, so we replicate that.
    locations = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Pune']
    return [
        schemas.GeographicData(
            location=loc,
            sales=random.randint(10000, 50000),
            revenue=random.randint(200000, 1000000),
            conversionRate=random.uniform(2, 10)
        ) for loc in locations
    ]

# Chat methods
def get_chat_messages(db: Session, user_id: str, limit: int = 50):
    return db.query(models.ChatMessage).filter(models.ChatMessage.userId == user_id).order_by(models.ChatMessage.timestamp.desc()).limit(limit).all()

def create_chat_message(db: Session, message: schemas.ChatMessageCreate, response: str):
    db_message = models.ChatMessage(
        id=str(uuid4()),
        **message.dict(),
        response=response,
        timestamp=datetime.utcnow()
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message