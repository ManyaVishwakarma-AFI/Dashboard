from sqlalchemy import (
    JSON,
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    location = Column(String, nullable=True)
    businessName = Column(String, nullable=True)
    subscriptionTier = Column(String, default="free")
    createdAt = Column(DateTime, nullable=False)

    chat_messages = relationship("ChatMessage", back_populates="user")


class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    price = Column(String, nullable=False)
    rating = Column(String, nullable=False)
    brand = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    trending = Column(Boolean, default=False)
    salesVolume = Column(Integer, nullable=False)
    profitMargin = Column(String, nullable=False)
    locationData = Column(JSON, nullable=True)
    createdAt = Column(DateTime, nullable=False)

    analytics = relationship("Analytics", back_populates="product")


class Analytics(Base):
    __tablename__ = "analytics"

    id = Column(String, primary_key=True, index=True)
    productId = Column(String, ForeignKey("products.id"), nullable=True)
    date = Column(DateTime, nullable=False)
    revenue = Column(String, nullable=False)
    sales = Column(Integer, nullable=False)

    product = relationship("Product", back_populates="analytics")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(String, primary_key=True, index=True)
    userId = Column(String, ForeignKey("users.id"), nullable=True)
    message = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    timestamp = Column(DateTime, nullable=False)

    user = relationship("User", back_populates="chat_messages")