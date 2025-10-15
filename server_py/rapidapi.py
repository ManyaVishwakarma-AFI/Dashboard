# ============================================
# STEP 4: CREATE RAPIDAPI CLIENT
# ============================================
# File: server_py/rapidapi_client.py

import requests
import logging
from typing import Dict, List, Optional
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

class RapidAPIClient:
    """Client for fetching data from Amazon & Flipkart via RapidAPI"""
    
    def __init__(self):
        self.api_key = os.getenv("RAPIDAPI_KEY")
        self.amazon_host = os.getenv("RAPIDAPI_HOST_AMAZON", "amazon-data-scraper.p.rapidapi.com")
        self.flipkart_host = os.getenv("RAPIDAPI_HOST_FLIPKART", "flipkart-api.p.rapidapi.com")
        
        self.headers = {
            "X-RapidAPI-Key": self.api_key,
            "X-RapidAPI-Host": self.amazon_host
        }
        
    # ============================================
    # AMAZON API METHODS
    # ============================================
    
    def search_amazon_products(self, query: str, page: int = 1) -> Dict:
        """Search Amazon products by query"""
        url = f"https://{self.amazon_host}/search"
        
        params = {
            "query": query,
            "page": page,
            "country": "IN"  # Change to your country code
        }
        
        try:
            logger.info(f"Searching Amazon for: {query}")
            response = requests.get(url, headers=self.headers, params=params, timeout=30)
            response.raise_for_status()
            data = response.json()
            logger.info(f"Found {len(data.get('results', []))} products")
            return data
        except Exception as e:
            logger.error(f"Error searching Amazon: {str(e)}")
            return {"error": str(e), "results": []}
    
    def get_amazon_product_details(self, asin: str) -> Dict:
        """Get detailed product information by ASIN"""
        url = f"https://{self.amazon_host}/product"
        
        params = {"asin": asin, "country": "IN"}
        
        try:
            logger.info(f"Fetching Amazon product details: {asin}")
            response = requests.get(url, headers=self.headers, params=params, timeout=30)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Error fetching product details: {str(e)}")
            return {"error": str(e)}
    
    def get_amazon_product_reviews(self, asin: str, page: int = 1) -> Dict:
        """Get product reviews"""
        url = f"https://{self.amazon_host}/reviews"
        
        params = {
            "asin": asin,
            "page": page,
            "country": "IN"
        }
        
        try:
            logger.info(f"Fetching reviews for: {asin}")
            response = requests.get(url, headers=self.headers, params=params, timeout=30)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Error fetching reviews: {str(e)}")
            return {"error": str(e), "reviews": []}
    
    def get_amazon_best_sellers(self, category: str = "electronics") -> Dict:
        """Get best sellers by category"""
        url = f"https://{self.amazon_host}/bestsellers"
        
        params = {
            "category": category,
            "country": "IN"
        }
        
        try:
            logger.info(f"Fetching best sellers: {category}")
            response = requests.get(url, headers=self.headers, params=params, timeout=30)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Error fetching best sellers: {str(e)}")
            return {"error": str(e), "results": []}
    
    def get_amazon_deals(self) -> Dict:
        """Get current deals and offers"""
        url = f"https://{self.amazon_host}/deals"
        
        params = {"country": "IN"}
        
        try:
            logger.info("Fetching Amazon deals")
            response = requests.get(url, headers=self.headers, params=params, timeout=30)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Error fetching deals: {str(e)}")
            return {"error": str(e), "deals": []}
    
    def get_amazon_category_products(self, category: str, page: int = 1) -> Dict:
        """Get products by category"""
        url = f"https://{self.amazon_host}/category"
        
        params = {
            "category": category,
            "page": page,
            "country": "IN"
        }
        
        try:
            logger.info(f"Fetching category products: {category}")
            response = requests.get(url, headers=self.headers, params=params, timeout=30)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Error fetching category: {str(e)}")
            return {"error": str(e), "results": []}
    
    # ============================================
    # FLIPKART API METHODS
    # ============================================
    
    def search_flipkart_products(self, query: str, page: int = 1) -> Dict:
        """Search Flipkart products"""
        url = f"https://{self.flipkart_host}/search"
        
        headers = {
            "X-RapidAPI-Key": self.api_key,
            "X-RapidAPI-Host": self.flipkart_host
        }
        
        params = {"query": query, "page": page}
        
        try:
            logger.info(f"Searching Flipkart for: {query}")
            response = requests.get(url, headers=headers, params=params, timeout=30)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Error searching Flipkart: {str(e)}")
            return {"error": str(e), "results": []}
    
    def get_flipkart_product_details(self, product_id: str) -> Dict:
        """Get Flipkart product details"""
        url = f"https://{self.flipkart_host}/product"
        
        headers = {
            "X-RapidAPI-Key": self.api_key,
            "X-RapidAPI-Host": self.flipkart_host
        }
        
        params = {"id": product_id}
        
        try:
            logger.info(f"Fetching Flipkart product: {product_id}")
            response = requests.get(url, headers=headers, params=params, timeout=30)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Error fetching product: {str(e)}")
            return {"error": str(e)}

# Create global instance
rapidapi_client = RapidAPIClient()