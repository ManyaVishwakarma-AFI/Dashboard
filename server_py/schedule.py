# ============================================
# File: server_py/schedule.py (UPDATED)
# ============================================

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger
from datetime import datetime
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

scheduler = BackgroundScheduler(timezone='Asia/Kolkata')

def sync_all_data():
    """Sync all data from RapidAPI - Runs on schedule"""
    from server_py.database_sync_service import data_sync_service
    
    logger.info("\n" + "="*70)
    logger.info(f"🔄 SCHEDULED DATA SYNC STARTED - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    logger.info("="*70)
    
    try:
        result = data_sync_service.full_sync()
        
        logger.info("\n" + "="*70)
        logger.info("✅ SCHEDULED DATA SYNC COMPLETED SUCCESSFULLY")
        logger.info(f"📊 Total items synced: {result.get('total', 0)}")
        logger.info(f"⏱️  Duration: {result.get('duration', 0):.2f} seconds")
        logger.info("="*70 + "\n")
        
    except Exception as e:
        logger.error("\n" + "="*70)
        logger.error(f"❌ SCHEDULED DATA SYNC FAILED: {str(e)}")
        logger.error("="*70 + "\n")
        import traceback
        logger.error(traceback.format_exc())

def sync_amazon_only():
    """Sync only Amazon data - Quick sync"""
    from server_py.database_sync_service import data_sync_service
    
    logger.info("🔄 Quick Amazon sync started...")
    try:
        data_sync_service.sync_amazon_products_by_search()
        logger.info("✅ Quick Amazon sync completed")
    except Exception as e:
        logger.error(f"❌ Amazon sync failed: {e}")

def sync_flipkart_only():
    """Sync only Flipkart data - Quick sync"""
    from server_py.database_sync_service import data_sync_service
    
    logger.info("🔄 Quick Flipkart sync started...")
    try:
        data_sync_service.sync_flipkart_products()
        logger.info("✅ Quick Flipkart sync completed")
    except Exception as e:
        logger.error(f"❌ Flipkart sync failed: {e}")

def start_scheduler():
    """Start scheduler with data sync jobs"""
    logger.info("\n" + "="*70)
    logger.info("🚀 STARTING SCHEDULER SERVICE")
    logger.info("="*70)
    
    # Job 1: Full sync twice daily (9 AM and 9 PM)
    scheduler.add_job(
        func=sync_all_data,
        trigger=CronTrigger(hour='9,21', minute=0),
        id='full_sync_twice_daily',
        name='Full Data Sync (Amazon + Flipkart)',
        replace_existing=True,
        max_instances=1
    )
    logger.info("✅ Scheduled: Full Data Sync at 9:00 AM & 9:00 PM daily")
    
    # Job 2: Quick Amazon sync every 6 hours
    scheduler.add_job(
        func=sync_amazon_only,
        trigger=IntervalTrigger(hours=6),
        id='amazon_sync_6h',
        name='Quick Amazon Sync',
        replace_existing=True,
        max_instances=1
    )
    logger.info("✅ Scheduled: Amazon Sync every 6 hours")
    
    # Job 3: Quick Flipkart sync every 8 hours
    scheduler.add_job(
        func=sync_flipkart_only,
        trigger=IntervalTrigger(hours=8),
        id='flipkart_sync_8h',
        name='Quick Flipkart Sync',
        replace_existing=True,
        max_instances=1
    )
    logger.info("✅ Scheduled: Flipkart Sync every 8 hours")
    
    scheduler.start()
    
    # Show next run times
    logger.info("\n📅 Next Scheduled Runs:")
    for job in scheduler.get_jobs():
        logger.info(f"  - {job.name}: {job.next_run_time}")
    
    logger.info("\n✅ Scheduler started successfully!")
    logger.info("="*70 + "\n")

def stop_scheduler():
    """Stop the scheduler gracefully"""
    try:
        if scheduler.running:
            scheduler.shutdown(wait=True)
            logger.info("\n" + "="*70)
            logger.info("🛑 SCHEDULER STOPPED")
            logger.info("="*70 + "\n")
    except Exception as e:
        logger.error(f"Error stopping scheduler: {e}")

def get_scheduler_status():
    """Get current scheduler status and job information"""
    if not scheduler.running:
        return {
            "running": False,
            "message": "Scheduler is not running",
            "jobs": []
        }
    
    jobs_info = []
    for job in scheduler.get_jobs():
        jobs_info.append({
            "id": job.id,
            "name": job.name,
            "next_run": str(job.next_run_time),
            "trigger": str(job.trigger)
        })
    
    return {
        "running": True,
        "message": "Scheduler is running",
        "total_jobs": len(jobs_info),
        "jobs": jobs_info
    }

def trigger_manual_sync():
    """Manually trigger a full sync (useful for testing)"""
    logger.info("🔧 Manual sync triggered")
    sync_all_data()