from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from db import TranscribeDB
from whisperqueue import WhisperPool
from uuid import uuid4
from constants import STATUS_QUEUED
from file import init_upload_dir, save_file
from cleanup import start_cleanup_cronjob

import os


init_upload_dir()
db = TranscribeDB()
pool = WhisperPool(db, "tiny.en", 1)

start_cleanup_cronjob(db, 60, 3600)

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
        "status": transcription.status, 
        "text": transcription.text,
    })


@app.post("/transcribe")
async def transcribe_audio(file: UploadFile):
    allowed_content_types = ["audio/x-m4a", "application/octet-stream"]
    if file.content_type not in allowed_content_types:
        raise HTTPException(status_code=400, detail=f"Only M4A files are supported, got {file.content_type}")
    
    if not file.filename.lower().endswith('.m4a'):
        raise HTTPException(status_code=400, detail="File must have .m4a extension")
    
    # Check file size (5MB = 5 * 1024 * 1024 bytes)
    MAX_SIZE = 5 * 1024 * 1024
    file_size = 0
    contents = await file.read()
    file_size = len(contents)
    
    if file_size > MAX_SIZE:
        raise HTTPException(status_code=400, detail="File size must be under 5MB")
    


    id = str(uuid4())

    save_file(id, contents)
    pool.add_to_transcribe_queue(id)

    return JSONResponse({
        "message": "OK",
        "id": id,
        "status": STATUS_QUEUED,
    })
