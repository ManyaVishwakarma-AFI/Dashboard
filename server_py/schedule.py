# from apscheduler.schedulers.background import BackgroundScheduler
# import requests

# scheduler = BackgroundScheduler()

# def refresh_dashboard_cache():
#     """
#     This job automatically calls the FastAPI endpoint
#     to refresh the dashboard cache.
#     """
#     try:
#         response = requests.post("http://127.0.0.1:8000/api/cache/refresh")
#         print(f"[CRON] Cache refresh triggered → {response.status_code}")
#     except Exception as e:
#         print(f"[CRON] Cache refresh failed → {e}")

# def start_scheduler():
#     """
#     Starts the scheduler with a recurring cache refresh job.
#     """
#     scheduler.add_job(
#         refresh_dashboard_cache,
#         "interval",
#         minutes=30,  
#         id="cache_refresh_job"
#     )
#     scheduler.start()
#     print("✅ Scheduler started - auto-refresh every 30 minutes")

# def stop_scheduler():
#     scheduler.shutdown()
#     print("🛑 Scheduler stopped")

# def get_scheduler_status():
#     return {
#         "running": scheduler.running,
#         "jobs": [
#             {
#                 "id": job.id,
#                 "name": job.name,
#                 "next_run_time": str(job.next_run_time)
#             }
#             for job in scheduler.get_jobs()
#         ]
#     }






# ============================================
# SOLUTION 4: Update schedule.py
# ============================================
# File: server_py/schedule.py (CORRECTED)

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

scheduler = BackgroundScheduler(timezone='Asia/Kolkata')

def sync_all_data():
    """Sync all data from RapidAPI - Runs twice daily"""
    # Import here to avoid circular import
    from server_py.database_sync_service import data_sync_service
    
    logger.info("="*60)
    logger.info(f"🔄 STARTING DATA SYNC - {datetime.now()}")
    logger.info("="*60)
    
    try:
        data_sync_service.full_sync()
        logger.info("="*60)
        logger.info("✅ DATA SYNC COMPLETED SUCCESSFULLY")
        logger.info("="*60)
    except Exception as e:
        logger.error(f"❌ DATA SYNC FAILED: {str(e)}")
        logger.info("="*60)

def start_scheduler():
    """Start scheduler with data sync jobs"""
    logger.info("🚀 Starting Scheduler with Data Sync...")
    
    # Sync data twice daily: 9 AM and 9 PM
    scheduler.add_job(
        func=sync_all_data,
        trigger=CronTrigger(hour='9,21', minute=0),
        id='sync_data_twice_daily',
        name='Sync Amazon & Flipkart Data',
        replace_existing=True,
        max_instances=1
    )
    logger.info("✅ Scheduled: Data Sync (9 AM & 9 PM daily)")
    
    scheduler.start()
    logger.info("✅ Scheduler started!")

def stop_scheduler():
    try:
        scheduler.shutdown(wait=True)
        logger.info("🛑 Scheduler stopped")
    except Exception as e:
        logger.error(f"Error stopping scheduler: {e}")

def get_scheduler_status():
    return {
        "running": scheduler.running,
        "jobs": [
            {
                "id": job.id,
                "name": job.name,
                "next_run": str(job.next_run_time)
            }
            for job in scheduler.get_jobs()
        ]
    }