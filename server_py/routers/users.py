from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas, database, services
from .auth import get_current_user

router = APIRouter()

@router.get("/init-data")
def init_data(db: Session = Depends(database.get_db)):
    product_count = crud.get_product_count(db)
    if product_count == 0:
        services.generate_sample_products(db, count=1000) # Reduced count for faster init
        services.generate_sample_analytics(db)
        return {"message": "Sample data initialized successfully", "productCount": crud.get_product_count(db)}
    else:
        return {"message": "Data already exists", "productCount": product_count}

@router.get("/user/{user_id}", response_model=schemas.User)
def read_user(user_id: str, db: Session = Depends(database.get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.patch("/user/{user_id}", response_model=schemas.User)
def update_user(
    user_id: str,
    updates: schemas.UserCreate,
    db: Session = Depends(database.get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this user")

    update_data = updates.dict(exclude_unset=True)

    # Do not allow updating sensitive fields
    update_data.pop('password', None)

    updated_user = crud.update_user(db, user_id=user_id, updates=update_data)
    if updated_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user