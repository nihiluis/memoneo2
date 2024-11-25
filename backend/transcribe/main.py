from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from db import TranscribeDB
from whisperqueue import WhisperPool
import os
import uuid
from constants import STATUS_QUEUED
from file import init_upload_dir, UPLOAD_DIR


import os

# Default to port 8000 if not specified
PORT = int(os.getenv("PORT", "8000"))
HOST = os.getenv("HOST", "0.0.0.0")


init_upload_dir()
db = TranscribeDB()
pool = WhisperPool(db, "tiny.en", 2)

app = FastAPI()


@app.get("/")
async def hello_world():
    return {"message": "OK"}


@app.get("/transcribe/{uuid}")
async def get_transcription(uuid: str):
    transcription = db.get_transcription(uuid)
    return JSONResponse({
        "message": "OK", 
        "id": uuid, 
        "status": transcription["status"], 
        "text": transcription["text"]
    })


@app.post("/transcribe")
async def transcribe_audio(file: UploadFile):
    # Check file type
    if not file.content_type == "audio/x-m4a":
        raise HTTPException(status_code=400, detail="Only M4A files are supported")
    
    # Check file size (5MB = 5 * 1024 * 1024 bytes)
    MAX_SIZE = 5 * 1024 * 1024
    file_size = 0
    contents = await file.read()
    file_size = len(contents)
    
    if file_size > MAX_SIZE:
        raise HTTPException(status_code=400, detail="File size must be under 5MB")

    uuid = str(uuid.uuid4())
    
    db.create_transcription(uuid)
    pool.add(uuid)

    return JSONResponse({
        "message": "OK",
        "id": uuid,
        "status": STATUS_QUEUED,
    })
