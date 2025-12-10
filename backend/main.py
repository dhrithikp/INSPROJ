from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Literal
from fastapi.middleware.cors import CORSMiddleware

try:
    # Preferred absolute import when running from project root: `uvicorn backend.main:app`
    from backend.crypto import encrypt_message, decrypt_message
except Exception:
    # Fallback when running from within the backend directory: `python main.py` or `uvicorn main:app`
    from crypto import encrypt_message, decrypt_message

app = FastAPI(title="Email Encryptor API")

# Allow CORS for local development (adjust origins in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class MessageRequest(BaseModel):
    message: str
    key: int
    method: Literal['caesar'] = 'caesar'


class MessageResponse(BaseModel):
    result: str


@app.post('/encrypt', response_model=MessageResponse)
async def encrypt(req: MessageRequest):
    if req.method != 'caesar':
        raise HTTPException(status_code=400, detail="Unsupported method")
    try:
        out = encrypt_message(req.message, req.key % 26)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {"result": out}


@app.post('/decrypt', response_model=MessageResponse)
async def decrypt(req: MessageRequest):
    if req.method != 'caesar':
        raise HTTPException(status_code=400, detail="Unsupported method")
    try:
        out = decrypt_message(req.message, req.key % 26)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {"result": out}


# Simple health and root endpoints to make local checks easier
@app.get('/health')
async def health():
    return {"status": "ok"}


@app.get('/')
async def root():
    return {"message": "Email Encryptor API - POST /encrypt and /decrypt"}


if __name__ == '__main__':
    import uvicorn

    uvicorn.run('backend.main:app', host='0.0.0.0', port=8000, reload=True)
