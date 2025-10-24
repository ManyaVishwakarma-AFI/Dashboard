# from sqlalchemy.orm import Session
# from sqlalchemy import func, or_
# from . import models
# from sqlalchemy import text
# from typing import List, Dict, Any
# import pandas as pd
# import numpy as np
# from tensorflow.keras.models import Sequential
# from tensorflow.keras.layers import LSTM, Dense
# from sklearn.preprocessing import MinMaxScaler

# def get_reviews(db: Session, limit: int = 50, offset: int = 0):
#     return db.query(models.AmazonReview).offset(offset).limit(limit).all()

# def get_review_by_id(db: Session, review_id: str):
#     return db.query(models.AmazonReview).filter(models.AmazonReview.review_id == review_id).first()

# def get_product_reviews(db: Session, product_id: str, limit: int = 20):
#     return db.query(models.AmazonReview).filter(models.AmazonReview.product_id == product_id).limit(limit).all()

# def search_reviews(db: Session, query: str, limit: int = 50):
#     return db.query(models.AmazonReview).filter(
#         or_(
#             models.AmazonReview.product_title.ilike(f"%{query}%"),
#             models.AmazonReview.review_headline.ilike(f"%{query}%"),
#             models.AmazonReview.review_body.ilike(f"%{query}%")
#         )
#     ).limit(limit).all()

# def get_review_statistics(db: Session):
#     total = db.query(func.count(models.AmazonReview.review_id)).scalar()
#     avg_rating = db.query(func.avg(models.AmazonReview.star_rating)).scalar()
#     return {"total_reviews": total, "average_rating": float(avg_rating) if avg_rating else None}

# def get_sentiment_distribution(db: Session):
#     return (
#         db.query(models.AmazonReview.Sentiment_pc, func.count(models.AmazonReview.review_id))
#           .group_by(models.AmazonReview.Sentiment_pc)
#           .all()
#     )

# def get_ratings_distribution(db: Session):
#     return (
#         db.query(models.AmazonReview.star_rating, func.count(models.AmazonReview.review_id))
#           .group_by(models.AmazonReview.star_rating)
#           .all()
#     )

# def get_category_statistics(db: Session):
#     results = (
#         db.query(models.AmazonReview.product_category, func.count(models.AmazonReview.review_id))
#           .group_by(models.AmazonReview.product_category)
#           .all()
#     )
#     return [{"category": category, "count": count} for category, count in results]

# from sqlalchemy import func

# def get_trending_products(db: Session, limit: int = 10):
#     results = (
#         db.query(
#             models.AmazonReview.product_id,
#             models.AmazonReview.product_title,
#             models.AmazonReview.product_category,
#             func.count(models.AmazonReview.review_id).label("review_count"),
#             func.avg(models.AmazonReview.star_rating).label("avg_rating")
#         )
#         .group_by(
#             models.AmazonReview.product_id,
#             models.AmazonReview.product_title,
#             models.AmazonReview.product_category
#         )
#         .order_by(func.count(models.AmazonReview.review_id).desc())
#         .limit(limit)
#         .all()
#     )

#     return [
#         {
#             "product_id": pid,
#             "product_title": title,
#             "category": cat,
#             "review_count": rc,
#             "avg_rating": avg
#         }
#         for pid, title, cat, rc, avg in results
#     ]

# def get_monthly_trends(db: Session, year: int):
#     results = (
#         db.query(
#             models.AmazonReview.review_month,
#             func.count(models.AmazonReview.review_id).label("review_count"),
#             func.avg(models.AmazonReview.star_rating).label("avg_rating")
#         )
#         .filter(models.AmazonReview.review_year == year)
#         .group_by(models.AmazonReview.review_month)
#         .order_by(models.AmazonReview.review_month)
#         .all()
#     )

#     return [
#         {"month": month, "review_count": count, "avg_rating": avg}
#         for month, count, avg in results
#     ]

# def get_helpful_reviews(db: Session, limit: int = 10):
#     return db.query(models.AmazonReview).order_by(models.AmazonReview.helpful_votes.desc()).limit(limit).all()

# def get_product_sentiment_breakdown(db: Session, product_id: str):
#     results = (
#         db.query(
#             models.AmazonReview.Sentiment_pc,
#             func.count(models.AmazonReview.review_id).label("count")
#         )
#         .filter(models.AmazonReview.product_id == product_id)
#         .group_by(models.AmazonReview.Sentiment_pc)
#         .all()
#     )
    
#     # Convert to list of dicts
#     return [{"sentiment": sentiment, "count": count} for sentiment, count in results]


# def get_products(db: Session, limit: int, offset: int, category: str = None,
#                  min_price: float = None, max_price: float = None) -> List[Dict[str, Any]]:
#     query = "SELECT * FROM products WHERE 1=1"
#     if category:
#         query += " AND category = :category"
#     if min_price is not None:
#         query += " AND price >= :min_price"
#     if max_price is not None:
#         query += " AND price <= :max_price"
#     query += " ORDER BY last_updated DESC LIMIT :limit OFFSET :offset"

#     params = {
#         "category": category,
#         "min_price": min_price,
#         "max_price": max_price,
#         "limit": limit,
#         "offset": offset
#     }
#     result = db.execute(text(query), params)
#     return [dict(row._mapping) for row in result]

# # Analytics summary
# def get_summary(db: Session) -> Dict[str, Any]:
#     query = """
#     SELECT
#         COUNT(*) AS total_products,
#         AVG(price) AS avg_price,
#         AVG(rating) AS avg_rating,
#         SUM(reviews) AS total_reviews
#     FROM Flipkart
#     """
#     result = db.execute(text(query))
#     return dict(result.mappings().first())

# # Top products
# """def get_top_products(db: Session, n: int, by: str) -> List[Dict[str, Any]]:
#     query = f"SELECT * FROM Flipkart ORDER BY {by} DESC LIMIT :n"
#     result = db.execute(text(query), {"n": n})
#     return [dict(row._mapping) for row in result]"""


# def get_top_products(db: Session, n: int):
#     return db.query(models.Product).order_by(models.Product.rating.desc()).limit(n).all()

# def get_top_products_amazon(db: Session, n: int):
#     """
#     Get top N products by number of reviews with average rating
#     """
#     result = (
#         db.query(
#             models.AmazonReview.product_title,
#             func.avg(models.AmazonReview.star_rating).label("avg_rating"),
#             func.count(models.AmazonReview.review_id).label("review_count")
#         )
#         .group_by(models.AmazonReview.product_title)
#         .order_by(func.count(models.AmazonReview.review_id).desc())
#         .limit(n)
#         .all()
#     )
#     # Convert SQLAlchemy Row objects to dicts
#     return [dict(product_title=r.product_title, avg_rating=r.avg_rating, review_count=r.review_count) for r in result]



# # Category analytics
# def get_category_analytics(db: Session) -> List[Dict[str, Any]]:
#     query = """
#     SELECT
#         category,
#         COUNT(*) AS total_products,
#         AVG(price) AS avg_price,
#         AVG(rating) AS avg_rating,
#         SUM(reviews) AS total_reviews
#     FROM Flipkart
#     GROUP BY category
#     ORDER BY total_products DESC
#     """
#     result = db.execute(text(query))
#     return [dict(row._mapping) for row in result]

# def forecast_next_price(df: pd.DataFrame, look_back=5, epochs=50) -> float:
#     """
#     df: pandas dataframe with 'price' column sorted by date
#     Returns forecasted next price
#     """
#     if len(df) < look_back:
#         return df['price'].iloc[-1]  # fallback if not enough data

#     scaler = MinMaxScaler()
#     prices = scaler.fit_transform(df['price'].values.reshape(-1,1))

#     X, y = [], []
#     for i in range(look_back, len(prices)):
#         X.append(prices[i-look_back:i,0])
#         y.append(prices[i,0])

#     X, y = np.array(X), np.array(y)
#     X = X.reshape(X.shape[0], X.shape[1], 1)

#     model = Sequential()
#     model.add(LSTM(50, return_sequences=True, input_shape=(X.shape[1],1)))
#     model.add(LSTM(50))
#     model.add(Dense(1))
#     model.compile(optimizer='adam', loss='mean_squared_error')
#     model.fit(X, y, epochs=epochs, batch_size=16, verbose=0)

#     last_sequence = X[-1]
#     next_price = model.predict(last_sequence.reshape(1, look_back,1), verbose=0)
#     next_price = scaler.inverse_transform(next_price.reshape(-1,1))[0,0]
#     return float(next_price)

# def get_top_forecasted_products(db: Session, n: int = 10) -> list:
#     """
#     Fetch all products from DB, forecast next price per product using LSTM,
#     return top N products by forecasted price
#     """
#     # Get all products and their historical prices
#     query = "SELECT id, title, price, last_updated as date FROM Flipkart ORDER BY id, last_updated"
#     df = pd.read_sql(query, db.bind)

#     forecast_list = []
#     for product_id, group in df.groupby('id'):
#         group = group.sort_values('date')
#         forecast_price = forecast_next_price(group)
#         forecast_list.append({
#             "product_id": product_id,
#             "title": group['title'].iloc[0],
#             "forecast_price": forecast_price,
#             "currency": "₹"
#         })

#     # Sort descending and take top N
#     forecast_list = sorted(forecast_list, key=lambda x: x['forecast_price'], reverse=True)[:n]

#     return forecast_list


from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from . import models
from sqlalchemy import text
from typing import List, Dict, Any
import pandas as pd
import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from sklearn.preprocessing import MinMaxScaler

def get_reviews(db: Session, limit: int = 50, offset: int = 0):
    return db.query(models.AmazonReview).offset(offset).limit(limit).all()

def get_review_by_id(db: Session, review_id: str):
    return db.query(models.AmazonReview).filter(models.AmazonReview.review_id == review_id).first()

def get_product_reviews(db: Session, product_id: str, limit: int = 20):
    return db.query(models.AmazonReview).filter(models.AmazonReview.product_id == product_id).limit(limit).all()

def search_reviews(db: Session, query: str, limit: int = 50):
    return db.query(models.AmazonReview).filter(
        or_(
            models.AmazonReview.product_title.ilike(f"%{query}%"),
            models.AmazonReview.review_headline.ilike(f"%{query}%"),
            models.AmazonReview.review_body.ilike(f"%{query}%")
        )
    ).limit(limit).all()

def get_review_statistics(db: Session):
    total = db.query(func.count(models.AmazonReview.review_id)).scalar()
    avg_rating = db.query(func.avg(models.AmazonReview.star_rating)).scalar()
    return {"total_reviews": total, "average_rating": float(avg_rating) if avg_rating else None}

def get_sentiment_distribution(db: Session):
    return (
        db.query(models.AmazonReview.Sentiment_pc, func.count(models.AmazonReview.review_id))
          .group_by(models.AmazonReview.Sentiment_pc)
          .all()
    )

def get_ratings_distribution(db: Session):
    return (
        db.query(models.AmazonReview.star_rating, func.count(models.AmazonReview.review_id))
          .group_by(models.AmazonReview.star_rating)
          .all()
    )

def get_category_statistics(db: Session):
    results = (
        db.query(models.AmazonReview.product_category, func.count(models.AmazonReview.review_id))
          .group_by(models.AmazonReview.product_category)
          .all()
    )
    return [{"category": category, "count": count} for category, count in results]

def get_trending_products(db: Session, limit: int = 10):
    results = (
        db.query(
            models.AmazonReview.product_id,
            models.AmazonReview.product_title,
            models.AmazonReview.product_category,
            func.count(models.AmazonReview.review_id).label("review_count"),
            func.avg(models.AmazonReview.star_rating).label("avg_rating")
        )
        .group_by(
            models.AmazonReview.product_id,
            models.AmazonReview.product_title,
            models.AmazonReview.product_category
        )
        .order_by(func.count(models.AmazonReview.review_id).desc())
        .limit(limit)
        .all()
    )

    return [
        {
            "product_id": pid,
            "product_title": title,
            "category": cat,
            "review_count": rc,
            "avg_rating": avg
        }
        for pid, title, cat, rc, avg in results
    ]

def get_monthly_trends(db: Session, year: int):
    results = (
        db.query(
            models.AmazonReview.review_month,
            func.count(models.AmazonReview.review_id).label("review_count"),
            func.avg(models.AmazonReview.star_rating).label("avg_rating")
        )
        .filter(models.AmazonReview.review_year == year)
        .group_by(models.AmazonReview.review_month)
        .order_by(models.AmazonReview.review_month)
        .all()
    )

    return [
        {"month": month, "review_count": count, "avg_rating": avg}
        for month, count, avg in results
    ]

def get_helpful_reviews(db: Session, limit: int = 10):
    return db.query(models.AmazonReview).order_by(models.AmazonReview.helpful_votes.desc()).limit(limit).all()

def get_product_sentiment_breakdown(db: Session, product_id: str):
    results = (
        db.query(
            models.AmazonReview.Sentiment_pc,
            func.count(models.AmazonReview.review_id).label("count")
        )
        .filter(models.AmazonReview.product_id == product_id)
        .group_by(models.AmazonReview.Sentiment_pc)
        .all()
    )
    
    return [{"sentiment": sentiment, "count": count} for sentiment, count in results]

def get_products(db: Session, limit: int, offset: int, category: str = None,
                 min_price: float = None, max_price: float = None) -> List[Dict[str, Any]]:
    query = "SELECT * FROM flipkart WHERE 1=1"
    if category:
        query += " AND category = :category"
    if min_price is not None:
        query += " AND price >= :min_price"
    if max_price is not None:
        query += " AND price <= :max_price"
    query += " ORDER BY last_updated DESC LIMIT :limit OFFSET :offset"

    params = {
        "category": category,
        "min_price": min_price,
        "max_price": max_price,
        "limit": limit,
        "offset": offset
    }
    result = db.execute(text(query), params)
    return [dict(row._mapping) for row in result]

def get_summary(db: Session) -> Dict[str, Any]:
    query = """
    SELECT
        COUNT(*) AS total_products,
        AVG(price) AS avg_price,
        AVG(rating) AS avg_rating,
        SUM(reviews) AS total_reviews
    FROM flipkart
    """
    result = db.execute(text(query))
    return dict(result.mappings().first())

def get_top_products(db: Session, n: int):
    return db.query(models.Product).order_by(models.Product.rating.desc()).limit(n).all()

def get_top_products_amazon(db: Session, n: int):
    result = (
        db.query(
            models.AmazonReview.product_title,
            func.avg(models.AmazonReview.star_rating).label("avg_rating"),
            func.count(models.AmazonReview.review_id).label("review_count")
        )
        .group_by(models.AmazonReview.product_title)
        .order_by(func.count(models.AmazonReview.review_id).desc())
        .limit(n)
        .all()
    )
    return [dict(product_title=r.product_title, avg_rating=r.avg_rating, review_count=r.review_count) for r in result]

def get_category_analytics(db: Session) -> List[Dict[str, Any]]:
    query = """
    SELECT
        category,
        COUNT(*) AS total_products,
        AVG(price) AS avg_price,
        AVG(rating) AS avg_rating,
        SUM(reviews) AS total_reviews
    FROM flipkart
    GROUP BY category
    ORDER BY total_products DESC
    """
    result = db.execute(text(query))
    return [dict(row._mapping) for row in result]

def forecast_next_price(df: pd.DataFrame, look_back=5, epochs=50) -> float:
    if len(df) < look_back:
        return df['price'].iloc[-1]

    scaler = MinMaxScaler()
    prices = scaler.fit_transform(df['price'].values.reshape(-1,1))

    X, y = [], []
    for i in range(look_back, len(prices)):
        X.append(prices[i-look_back:i,0])
        y.append(prices[i,0])

    X, y = np.array(X), np.array(y)
    X = X.reshape(X.shape[0], X.shape[1], 1)

    model = Sequential()
    model.add(LSTM(50, return_sequences=True, input_shape=(X.shape[1],1)))
    model.add(LSTM(50))
    model.add(Dense(1))
    model.compile(optimizer='adam', loss='mean_squared_error')
    model.fit(X, y, epochs=epochs, batch_size=16, verbose=0)

    last_sequence = X[-1]
    next_price = model.predict(last_sequence.reshape(1, look_back,1), verbose=0)
    next_price = scaler.inverse_transform(next_price.reshape(-1,1))[0,0]
    return float(next_price)

def get_flipkart_categories(db: Session):
    rows = db.execute(text("SELECT DISTINCT category FROM flipkart")).fetchall()
    return [{"category": row.category} for row in rows]

def get_amazon_categories(db: Session):
    rows = db.execute(text('SELECT DISTINCT product_category AS category FROM "Amazon_Reviews"')).fetchall()
    return [{"category": row.category} for row in rows]


def get_top_forecasted_products(db: Session, n: int = 10) -> list:
    query = "SELECT id, title, price, last_updated as date FROM flipkart ORDER BY id, last_updated"
    df = pd.read_sql(query, db.bind)

    forecast_list = []
    for product_id, group in df.groupby('id'):
        group = group.sort_values('date')
        forecast_price = forecast_next_price(group)
        forecast_list.append({
            "product_id": product_id,
            "title": group['title'].iloc[0],
            "forecast_price": forecast_price,
            "currency": "₹"
        })

    forecast_list = sorted(forecast_list, key=lambda x: x['forecast_price'], reverse=True)[:n]

    return forecast_list
