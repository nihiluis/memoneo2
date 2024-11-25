import sqlite3

class TranscribeDB:
    def __init__(self):
        self.conn = sqlite3.connect("transcribe.db")
        self.setup_tables()


    def setup_tables(self):
        cursor = self.conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS TRANSCRIPTIONS (
                id TEXT PRIMARY KEY,
                status TEXT CHECK(status IN ('QUEUED', 'FAILED', 'COMPLETED')),
                text TEXT DEFAULT ''
            )
        """)
        self.conn.commit()


    def create_transcription(self, id: str):
        cursor = self.conn.cursor()
        cursor.execute("""
            INSERT INTO TRANSCRIPTIONS (id, status) VALUES (?, 'QUEUED')
        """, (id,))
        self.conn.commit()


    def update_transcription(self, id: str, status: str, text: str):
        cursor = self.conn.cursor()
        cursor.execute("""
            UPDATE TRANSCRIPTIONS SET status = ?, text = ? WHERE id = ?
        """, (status, text, id))
        self.conn.commit()
