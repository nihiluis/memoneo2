import sqlite3
from threading import local
from contextlib import contextmanager

class Transcription:
    def __init__(self, id: str, status: str, text: str):
        self.id = id
        self.status = status
        self.text = text

class TranscribeDB:
    def __init__(self):
        self._local = local()
        self.db_path = "transcribe.db"
        # Initialize once at startup
        with self._get_conn() as conn:
            self.setup_tables(conn)

    @contextmanager
    def _get_conn(self):
        if not hasattr(self._local, 'conn'):
            self._local.conn = sqlite3.connect(self.db_path)
        try:
            yield self._local.conn
        except Exception:
            self._local.conn.rollback()
            raise
        finally:
            self._local.conn.commit()

    def setup_tables(self, conn):
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS TRANSCRIPTIONS (
                id TEXT PRIMARY KEY,
                status TEXT CHECK(status IN ('QUEUED', 'FAILED', 'COMPLETED')),
                text TEXT DEFAULT '',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()

    def get_transcription(self, id: str) -> Transcription:
        with self._get_conn() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT id, status, text FROM TRANSCRIPTIONS WHERE id = ?
            """, (id,))
            return Transcription(*cursor.fetchone())

    def create_transcription(self, id: str):
        with self._get_conn() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO TRANSCRIPTIONS (id, status) VALUES (?, 'QUEUED')
            """, (id,))

    def update_transcription(self, id: str, status: str, text: str):
        with self._get_conn() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                UPDATE TRANSCRIPTIONS 
                SET status = ?, 
                    text = ?,
                    updated_at = CURRENT_TIMESTAMP 
                WHERE id = ?
            """, (status, text, id))

    def fail_old_transcriptions(self, timeout_seconds: int):
        """Update all transcriptions older than the specified timeout to FAILED status."""
        with self._get_conn() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                UPDATE TRANSCRIPTIONS 
                SET status = 'FAILED',
                    updated_at = CURRENT_TIMESTAMP
                WHERE (strftime('%s', 'now') - strftime('%s', created_at)) > ?
                AND status = 'QUEUED'
                RETURNING id
            """, (timeout_seconds,))
            updated_ids = [row[0] for row in cursor.fetchall()]
            return updated_ids

            
