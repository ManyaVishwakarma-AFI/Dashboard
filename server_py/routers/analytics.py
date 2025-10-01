from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from .. import crud, database_config, schemas
from datetime import datetime, timedelta
import random

router = APIRouter()

@router.get("/analytics/category-performance", response_model=List[schemas.CategoryPerformance])
def get_category_performance(db: Session = Depends(database_config.get_db)):
    return crud.get_category_performance(db)

@router.get("/analytics/geographic", response_model=List[schemas.GeographicData])
def get_geographic_data(db: Session = Depends(database_config.get_db)):
    return crud.get_geographic_data(db)

@router.get("/analytics/sales-trends")
def get_sales_trends(db: Session = Depends(database_config.get_db)):
    # This logic is a direct translation from the original routes.ts
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=6*30)

    analytics = crud.get_analytics(db, start_date=start_date, end_date=end_date)

    monthly_data = {}
    for item in analytics:
        month = item.date.strftime("%Y-%m")
        monthly_data[month] = monthly_data.get(month, 0) + float(item.revenue)

    sales_trends = [
        {
            "month": month,
            "revenue": revenue,
            "growth": random.uniform(5, 20) # Mocked as in original
        }
        for month, revenue in monthly_data.items()
    ]

    return sales_trends

@router.get("/dashboard/metrics", response_model=schemas.DashboardMetrics)
def get_dashboard_metrics(db: Session = Depends(database_config.get_db)):
    return crud.get_dashboard_metrics(db)