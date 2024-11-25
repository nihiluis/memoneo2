import os

UPLOAD_DIR = "uploads"

def get_file_path_or_throw(uuid: str) -> str:
    file_path = os.path.join(UPLOAD_DIR, f"{uuid}.m4a")
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
    return file_path

def init_upload_dir():
    os.makedirs(UPLOAD_DIR, exist_ok=True)


def write_file(uuid: str, contents: bytes):
    file_path = os.path.join(UPLOAD_DIR, f"{uuid}.m4a")
    with open(file_path, "wb") as f:
        f.write(contents)


def try_delete_file(uuid: str):
    file_path = os.path.join(UPLOAD_DIR, f"{uuid}.m4a")
    if os.path.exists(file_path):
        os.remove(file_path)
