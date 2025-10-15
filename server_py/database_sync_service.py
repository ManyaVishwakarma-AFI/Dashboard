
# ============================================
# SOLUTION 5: Update database_sync_service.py
# ============================================
# File: server_py/database_sync_service.py (CORRECTED IMPORT)

from server_py.rapidapi import rapidapi_client
from server_py.database_config import DatabaseService
import logging
from datetime import datetime
from typing import List

logger = logging.getLogger(__name__)

class DataSyncService:
    """Service to sync data from RapidAPI to database"""
    
    def __init__(self):
        self.api_client = rapidapi_client
        self.db_service = DatabaseService()
    
    def sync_amazon_products(self, categories: List[str] = None):
        """Sync Amazon products by categories"""
        if not categories:
            categories = ["electronics", "fashion", "home", "books", "sports"]
        
        logger.info("="*50)
        logger.info("Starting Amazon products sync")
        
        total_synced = 0
        
        for category in categories:
            try:
                logger.info(f"Syncing category: {category}")
                data = self.api_client.get_amazon_category_products(category)
                products = data.get('results', [])
                
                for product in products:
                    try:
                        product_data = {
                            'source': 'amazon',
                            'product_id': product.get('asin'),
                            'title': product.get('title'),
                            'brand': product.get('brand'),
                            'category': category,
                            'price': product.get('price'),
                            'original_price': product.get('original_price'),
                            'discount': product.get('discount'),
                            'rating': product.get('rating'),
                            'reviews_count': product.get('reviews_count'),
                            'image_url': product.get('image'),
                            'product_url': product.get('url'),
                            'availability': product.get('in_stock', True)
                        }
                        
                        self.db_service.save_product(product_data)
                        total_synced += 1
                    except Exception as e:
                        logger.error(f"Error saving product: {str(e)}")
                        continue
                
            except Exception as e:
                logger.error(f"Error syncing category {category}: {str(e)}")
                continue
        
        logger.info(f"✅ Synced {total_synced} Amazon products")
        logger.info("="*50)
        return total_synced
    
    def sync_amazon_best_sellers(self):
        """Sync Amazon best sellers"""
        logger.info("Syncing Amazon best sellers")
        try:
            data = self.api_client.get_amazon_best_sellers()
            products = data.get('results', [])
            
            count = 0
            for product in products:
                try:
                    product_data = {
                        'source': 'amazon',
                        'product_id': product.get('asin'),
                        'title': product.get('title'),
                        'price': product.get('price'),
                        'rating': product.get('rating'),
                        'image_url': product.get('image'),
                        'product_url': product.get('url'),
                        'is_bestseller': True
                    }
                    
                    self.db_service.save_product(product_data)
                    count += 1
                except Exception as e:
                    logger.error(f"Error: {str(e)}")
                    continue
            
            logger.info(f"✅ Synced {count} best sellers")
        except Exception as e:
            logger.error(f"Error syncing best sellers: {str(e)}")
    
    def sync_amazon_deals(self):
        """Sync Amazon deals"""
        logger.info("Syncing Amazon deals")
        try:
            data = self.api_client.get_amazon_deals()
            deals = data.get('deals', [])
            
            count = 0
            for deal in deals:
                try:
                    product_data = {
                        'source': 'amazon',
                        'product_id': deal.get('asin'),
                        'title': deal.get('title'),
                        'price': deal.get('deal_price'),
                        'original_price': deal.get('original_price'),
                        'discount': deal.get('discount_percent'),
                        'image_url': deal.get('image'),
                        'is_deal': True
                    }
                    
                    self.db_service.save_product(product_data)
                    
                    deal_data = {
                        'product_id': deal.get('asin'),
                        'source': 'amazon',
                        'deal_type': deal.get('type', 'daily'),
                        'discount_percent': deal.get('discount_percent'),
                        'is_active': True
                    }
                    
                    self.db_service.save_deal(deal_data)
                    count += 1
                except Exception as e:
                    logger.error(f"Error: {str(e)}")
                    continue
            
            logger.info(f"✅ Synced {count} deals")
        except Exception as e:
            logger.error(f"Error syncing deals: {str(e)}")
    
    def full_sync(self):
        """Perform full sync of all data"""
        logger.info("🚀 Starting full data sync")
        self.sync_amazon_products()
        self.sync_amazon_best_sellers()
        self.sync_amazon_deals()
        logger.info("✅ Full sync completed")
    
    def __del__(self):
        self.db_service.close()

# Create global instance
data_sync_service = DataSyncService()
