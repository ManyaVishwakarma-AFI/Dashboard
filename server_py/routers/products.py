from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import crud, schemas, database

router = APIRouter()

@router.get("/products", response_model=List[schemas.Product])
def read_products(
    limit: int = 50,
    offset: int = 0,
    category: Optional[str] = None,
    minPrice: Optional[float] = None,
    maxPrice: Optional[float] = None,
    minRating: Optional[float] = None,
    location: Optional[str] = None,
    db: Session = Depends(database.get_db)
):
    filters = {
        "category": category,
        "minPrice": minPrice,
        "maxPrice": maxPrice,
        "minRating": minRating,
        "location": location,
    }
    # Remove None values so we don't filter on them
    filters = {k: v for k, v in filters.items() if v is not None}
    products = crud.get_products(db, limit=limit, offset=offset, filters=filters)
    return products

@router.get("/products/trending", response_model=List[schemas.ProductWithMetrics])
def read_trending_products(limit: int = 10, db: Session = Depends(database.get_db)):
    return crud.get_trending_products(db, limit=limit)

@router.get("/products/top-profit", response_model=List[schemas.ProductWithMetrics])
def read_top_profit_products(limit: int = 10, db: Session = Depends(database.get_db)):
    return crud.get_top_profit_products(db, limit=limit)

@router.get("/products/underperforming", response_model=List[schemas.ProductWithMetrics])
def read_underperforming_products(limit: int = 10, db: Session = Depends(database.get_db)):
    return crud.get_underperforming_products(db, limit=limit)

@router.get("/products/search", response_model=List[schemas.Product])
def search_products(q: str = Query(..., min_length=1), db: Session = Depends(database.get_db)):
    return crud.search_products(db, query=q)