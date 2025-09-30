from fastapi import APIRouter, Depends, Body
from sqlalchemy.orm import Session
from .. import crud, schemas, database, services
from typing import Dict, Any

router = APIRouter()

# @router.post("/ai/chart-insight")
# def get_chart_insight(
#     chart_type: str = Body(..., embed=True),
#     data: Dict[str, Any] = Body(..., embed=True),
#     db: Session = Depends(database.get_db)
# ):
#     insight = services.generate_chart_insight(chart_type, data)
#     return {"insight": insight}


@router.post("/ai/chart-insight")
def get_chart_insight(
    request: Request,
    chart_type: str = Body(..., embed=True),
    data: Dict[str, Any] = Body(..., embed=True),
    db: Session = Depends(database.get_db)
):
    # full URL (includes query params if any)
    full_url = str(request.url)

    # base URL (scheme + host + port)
    base_url = str(request.base_url)

    print("Base URL:", base_url)
    print("Full URL:", full_url)

    insight = services.generate_chart_insight(chart_type, data)
    return {
        "insight": insight,
        "base_url": base_url,
        "full_url": full_url
    }

@router.post("/ai/recommendations")
def get_recommendations(
    userLocation: str = Body("Mumbai", embed=True),
    db: Session = Depends(database.get_db)
):
    products = crud.get_products(db, limit=50)
    analytics = crud.get_analytics(db)
    recommendations = services.generate_dashboard_recommendations(userLocation, products, analytics)
    return recommendations