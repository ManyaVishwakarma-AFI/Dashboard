from fastapi import APIRouter, Depends, Body
from sqlalchemy.orm import Session
from .. import crud, schemas, database, services
from typing import Dict, Any

router = APIRouter()

@router.post("/ai/chart-insight")
def get_chart_insight(
    chart_type: str = Body(..., embed=True),
    data: Dict[str, Any] = Body(..., embed=True),
    db: Session = Depends(database.get_db)
):
    insight = services.generate_chart_insight(chart_type, data)
    return {"insight": insight}

@router.post("/ai/recommendations")
def get_recommendations(
    userLocation: str = Body("Mumbai", embed=True),
    db: Session = Depends(database.get_db)
):
    products = crud.get_products(db, limit=50)
    analytics = crud.get_analytics(db)
    recommendations = services.generate_dashboard_recommendations(userLocation, products, analytics)
    return recommendations