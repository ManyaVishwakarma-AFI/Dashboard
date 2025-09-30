import pandas as pd
from sqlalchemy.orm import Session
from .database import SessionLocal, engine
from . import models

# Path to the CSV file
CSV_PATH = "amazon_pc_Data_enriched.csv"

def load_data_from_csv(db: Session, csv_path: str = CSV_PATH):
    """
    Load data from the enriched CSV file into the database.
    """
    print(f"Loading data from {csv_path}...")

    try:
        # Read the CSV file using pandas
        df = pd.read_csv(csv_path)

        # Rename columns to match the SQLAlchemy model attributes
        column_mapping = {
            "Sentiment_pc": "sentiment_pc",
            "1 rating": "rating_1",
            "2 ratings": "rating_2",
            "3 ratings": "rating_3",
            "4 rating": "rating_4",
            "5 rating": "rating_5",
        }
        df.rename(columns=column_mapping, inplace=True)

        # Convert DataFrame to a list of dictionaries
        data_to_load = df.to_dict(orient="records")

        # Bulk insert the data
        db.bulk_insert_mappings(models.AmazonReview, data_to_load)
        db.commit()

        print(f"Successfully loaded {len(data_to_load)} records into the database.")

    except FileNotFoundError:
        print(f"Error: The file {csv_path} was not found.")
    except Exception as e:
        print(f"An error occurred: {e}")
        db.rollback()

if __name__ == "__main__":
    # Create tables if they don't exist
    models.Base.metadata.create_all(bind=engine)

    # Get a new database session
    db = SessionLocal()

    try:
        # Load the data
        load_data_from_csv(db)
    finally:
        # Always close the session
        db.close()