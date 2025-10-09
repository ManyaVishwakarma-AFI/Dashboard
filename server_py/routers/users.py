# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from .. import crud, schemas, database, services
# from .auth import get_current_user
# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from .. import schemas, crud, models
# from ..database_config import get_db
# router = APIRouter()

# @router.get("/init-data")
# def init_data(db: Session = Depends(database.get_db)):
#     product_count = crud.get_product_count(db)
#     if product_count == 0:
#         services.generate_sample_products(db, count=1000) # Reduced count for faster init
#         services.generate_sample_analytics(db)
#         return {"message": "Sample data initialized successfully", "productCount": crud.get_product_count(db)}
#     else:
#         return {"message": "Data already exists", "productCount": product_count}

# @router.get("/user/{user_id}", response_model=schemas.User)
# def read_user(user_id: str, db: Session = Depends(database.get_db)):
#     db_user = crud.get_user(db, user_id=user_id)
#     if db_user is None:
#         raise HTTPException(status_code=404, detail="User not found")
#     return db_user

# @router.patch("/user/{user_id}", response_model=schemas.User)
# def update_user(
#     user_id: str,
#     updates: schemas.UserCreate,
#     db: Session = Depends(database.get_db),
#     current_user: schemas.User = Depends(get_current_user)
# ):
#     if current_user.id != user_id:
#         raise HTTPException(status_code=403, detail="Not authorized to update this user")

#     update_data = updates.dict(exclude_unset=True)

#     # Do not allow updating sensitive fields
#     update_data.pop('password', None)

#     updated_user = crud.update_user(db, user_id=user_id, updates=update_data)
#     if updated_user is None:
#         raise HTTPException(status_code=404, detail="User not found")
#     return updated_user


# router = APIRouter(prefix="/users", tags=["Users"])

# @router.post("/signup", response_model=schemas.UserResponse)
# def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
#     existing_user = db.query(models.User).filter(models.User.email == user.email).first()
#     if existing_user:
#         raise HTTPException(status_code=400, detail="Email already registered")

#     created_user = crud.create_user(db, user)
#     return created_user

# ==========================================
# FILE: routers/users.py
# ==========================================
from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
# REPLACE with this:
import bcrypt
from datetime import datetime
from typing import List

from ..database_config import get_db
from ..models import User
from ..schemas import UserCreate, UserOut  # make sure you have these schemas

router = APIRouter(tags=["Users"])


def hash_password(password: str) -> str:
    """
    Hash password using bcrypt directly (compatible with Python 3.13)
    """
    # Truncate to 72 bytes if needed
    password_bytes = password.encode("utf-8")[:72]
    # Generate salt and hash
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    # Return as string
    return hashed.decode("utf-8")


def format_business_interests(interests: List[str]) -> List[str]:
    """
    Clean up and normalize business interests.
    """
    return [i.strip().lower() for i in interests if i.strip()]


def current_timestamp() -> datetime:
    return datetime.utcnow()


@router.post("/signup", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    """
    Create a new user with hashed password and formatted business interests.
    """
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create new user
    db_user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        password_hash=hash_password(user.password),
        business_name=user.business_name,
        location=user.location,
        business_interests=format_business_interests(user.business_interests),
        created_at=current_timestamp(),
        updated_at=current_timestamp(),
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user
