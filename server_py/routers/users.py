# # ==========================================
# # FILE: routers/users.py
# # ==========================================
# from fastapi import APIRouter, HTTPException, Depends, status
# from sqlalchemy.orm import Session
# # REPLACE with this:
# import bcrypt
# from datetime import datetime
# from typing import List

# from ..database_config import get_db
# from ..models import User
# from ..schemas import UserCreate, UserOut  # make sure you have these schemas

# router = APIRouter(tags=["Users"])


# def hash_password(password: str) -> str:
#     """
#     Hash password using bcrypt directly (compatible with Python 3.13)
#     """
#     # Truncate to 72 bytes if needed
#     password_bytes = password.encode("utf-8")[:72]
#     # Generate salt and hash
#     salt = bcrypt.gensalt()
#     hashed = bcrypt.hashpw(password_bytes, salt)
#     # Return as string
#     return hashed.decode("utf-8")


# def format_business_interests(interests: List[str]) -> List[str]:
#     """
#     Clean up and normalize business interests.
#     """
#     return [i.strip().lower() for i in interests if i.strip()]


# def current_timestamp() -> datetime:
#     return datetime.utcnow()


# @router.post("/signup", response_model=UserOut, status_code=status.HTTP_201_CREATED)
# def signup(user: UserCreate, db: Session = Depends(get_db)):
#     """
#     Create a new user with hashed password and formatted business interests.
#     """
#     # Check if email already exists
#     existing_user = db.query(User).filter(User.email == user.email).first()
#     if existing_user:
#         raise HTTPException(status_code=400, detail="Email already registered")

#     # Create new user
#     db_user = User(
#         first_name=user.first_name,
#         last_name=user.last_name,
#         email=user.email,
#         password_hash=hash_password(user.password),
#         business_name=user.business_name,
#         location=user.location,
#         business_interests=format_business_interests(user.business_interests),
#         created_at=current_timestamp(),
#         updated_at=current_timestamp(),
#     )

#     db.add(db_user)
#     db.commit()
#     db.refresh(db_user)

#     return db_user

from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
import bcrypt
from datetime import datetime
from typing import List

from ..database_config import get_db
from ..models import User
from ..schemas import UserCreate, UserOut

router = APIRouter(tags=["Users"])  # Remove prefix here since it's added in main


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

    # Create new user with all fields including is_active
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
        is_active=True  # ✅ Set is_active to True by default
    )

    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")