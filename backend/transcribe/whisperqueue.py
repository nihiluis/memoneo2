from queue import Queue
from threading import Lock, Thread
import time
from transcribe import WhisperInstance
from db import TranscribeDB
from file import get_file_path_or_throw, try_delete_file
from constants import STATUS_COMPLETED, STATUS_FAILED


class WhisperPool:
    def __init__(self, db: TranscribeDB, model_name: str, worker_count: int = 2):
        self.db = db
        # Create multiple whisper instances based on worker_count
        self.whisper_instances = {
            f'whisper_{i}': WhisperInstance(model_name) for i in range(1, worker_count + 1)
        }
        
        self.queue = Queue()
        self.instance_locks = {
            f'whisper_{i}': Lock() for i in range(1, worker_count + 1)
        }
        
        # Track which instance is processing what
        self.current_tasks = {
            f'whisper_{i}': None for i in range(1, worker_count + 1)
        }
        
        # Start worker threads
        self.workers = [
            Thread(target=self._process_queue, args=(f'whisper_{i}',), daemon=True)
            for i in range(1, worker_count + 1)
        ]
        
        for worker in self.workers:
            worker.start()


    def add_to_transcribe_queue(self, uuid: str) -> None:
        """Add a new UUID to the transcription queue"""
        self.queue.put(uuid)
        self.db.create_transcription(uuid)
    

    def _process_queue(self, instance_name: str) -> None:
        """Worker thread function to process items from the queue"""
        whisper_instance = self.whisper_instances[instance_name]
        instance_lock = self.instance_locks[instance_name]
        
        while True:
            uuid = self.queue.get()
            try:
                with instance_lock:
                    self.current_tasks[instance_name] = uuid
                    try:
                        file_path = get_file_path_or_throw(uuid)
                        result_text = whisper_instance.transcribe(file_path)
                        self.db.update_transcription(uuid, STATUS_COMPLETED, result_text)
                    finally:
                        self.current_tasks[instance_name] = None
                self.queue.task_done()
            except Exception as e:
                self.db.update_transcription(uuid, STATUS_FAILED, "")
                print(f"Error processing {uuid} on {instance_name}: {e}")
                time.sleep(1)  # Prevent tight loop in case of repeated errors
            finally:
                try_delete_file(uuid)

    
    def get_current_tasks(self) -> dict:
        """Return a dictionary of currently processing tasks for each instance"""
        return self.current_tasks.copy()
    

    def get_queue_size(self) -> int:
        """Return the current size of the queue"""
        return self.queue.qsize()