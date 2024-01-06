from fastapi import FastAPI, Form, UploadFile, File, Request
import uvicorn
from extractor import extract
import uuid
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/extract_from_doc")
def extract_from_doc(
        type: str = Form(...),
        file: UploadFile = File(...),
):
    content = file.file.read()
    file_path = "../uploads/" + str(uuid.uuid4()) + ".pdf"

    with open(file_path, "wb") as f:
        f.write(content)

    try:
        extracted_data = extract(file_path, type)
    except Exception as e:
        extracted_data = {
            'error': str(e)
        }

    if os.path.exists(file_path):
        os.remove(file_path)

    return extracted_data


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
