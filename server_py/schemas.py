from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from decimal import Decimal


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    firstName: str
    lastName: str
    businessName: Optional[str] = None
    location: Optional[str] = None


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: str
    subscriptionTier: str
    createdAt: datetime

    class Config:
        from_attributes = True


# Product Schemas
class ProductBase(BaseModel):
    name: str
    category: str
    brand: str
    description: Optional[str] = None
    price: Decimal
    competitorPrices: Dict[str, Any]
    rating: Decimal
    reviewCount: int
    salesVolume: int
    profitMargin: Decimal
    stockLevel: int
    locationData: Dict[str, Any]
    launchDate: datetime
    trending: bool = False


class ProductCreate(ProductBase):
    pass


class Product(ProductBase):
    id: str
    createdAt: datetime

    class Config:
        from_attributes = True


# Analytics Schemas
class AnalyticsBase(BaseModel):
    productId: Optional[str] = None
    date: datetime
    sales: int
    revenue: Decimal
    views: int
    conversions: int
    location: str


class AnalyticsCreate(AnalyticsBase):
    pass


class Analytics(AnalyticsBase):
    id: str

    class Config:
        from_attributes = True


# ChatMessage Schemas
class ChatMessageBase(BaseModel):
    userId: Optional[str] = None
    message: str


class ChatMessageCreate(ChatMessageBase):
    pass


class ChatMessage(ChatMessageBase):
    id: str
    response: str
    timestamp: datetime

    class Config:
        from_attributes = True


# API Response Schemas
class ProductWithMetrics(Product):
    salesGrowth: float
    revenueGrowth: float
    competitivePosition: str


class CategoryPerformance(BaseModel):
    category: str
    sales: int
    revenue: float
    profitMargin: float
    growth: float


class GeographicData(BaseModel):
    location: str
    sales: int
    revenue: float
    conversionRate: float


class DashboardMetrics(BaseModel):
    totalRevenue: float
    revenueGrowth: float
    totalProducts: int
    productGrowth: float
    avgProfitMargin: float
    marginGrowth: float
    avgRating: float
    ratingGrowth: float