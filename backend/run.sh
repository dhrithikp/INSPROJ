#!/usr/bin/env bash
set -euo pipefail

# Run backend using the virtualenv's uvicorn. Run this from project root or backend/ directory.
ROOT_DIR=$(cd "$(dirname "$0")" && pwd)
VENV="$ROOT_DIR/.venv"

if [ ! -x "$VENV/bin/uvicorn" ]; then
  echo "uvicorn not found in $VENV. Activate venv or install requirements first:"
  echo "  python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt"
  exit 1
fi

"$VENV/bin/uvicorn" backend.main:app --host 0.0.0.0 --port 8000
