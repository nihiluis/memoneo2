from db import TranscribeDB
import threading
import time
from file import try_delete_file

def start_cleanup_cronjob(db: TranscribeDB, interval: int, timeout_seconds: int):
    """
    Start a background thread that periodically cleans up old transcriptions.
    Default timeout is 1 hour (3600 seconds).
    """
    
    def cleanup_job():
        while True:
            try:
                old_failed_ids = db.fail_old_transcriptions(timeout_seconds)

                for id in old_failed_ids:
                    try_delete_file(id)

                print(f"Cleaned up {len(old_failed_ids)} transcriptions")
            except Exception as e:
                print(f"Error in cleanup job: {e}")
            time.sleep(interval)  # Wait for 1 minute

    
    cleanup_thread = threading.Thread(target=cleanup_job, daemon=True)
    cleanup_thread.start()