# Email Encryptor - Backend (FastAPI) + Frontend (React + Vite)

This workspace contains:

- `backend/` - FastAPI application exposing `/encrypt` and `/decrypt` endpoints (Caesar cipher).
- `frontend/` - React + Vite dashboard that calls the backend.

## Backend - run

1. Create a virtual environment and install dependencies:

```bash
cd /Users/dhrithikp/Desktop/CrytoProject/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Run the server using uvicorn:

```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`.

Endpoints:
- POST `/encrypt` { message: str, key: int, method: 'caesar' }
- POST `/decrypt` { message: str, key: int, method: 'caesar' }

Response: `{ result: string }`

## Frontend - run (Vite)

1. Install dependencies and start dev server:

```bash
cd /Users/dhrithikp/Desktop/CrytoProject/frontend
npm install
npm run dev
```

2. Open the URL shown by Vite (usually `http://localhost:5173`) and use the dashboard.

If the frontend cannot reach the backend, edit the `VITE_API_BASE` environment variable or change `API_BASE` in `src/App.jsx`.

## Notes
- This setup is for local development. For production, configure CORS, hostnames, and build steps properly.
- The backend uses a simple Caesar cipher. If you want Vigenère or other ciphers, I can add them.
# INSPROJ
