# Makefile for FastAPI Dashboard

# Environment variables
PYTHON=python3
UVICORN=uvicorn
APP_MODULE=server_py.Fastapi_main:app
HOST=0.0.0.0
PORT=9001

.PHONY: run clean freeze

# Run the FastAPI app with reload enabled
run:
	$(UVICORN) $(APP_MODULE) --reload --host $(HOST) --port $(PORT)

# Remove __pycache__ and pyc files
clean:
	find . -type d -name '__pycache__' -exec rm -r {} +
	find . -type f -name '*.pyc' -delete

# Freeze current environment into requirements.txt
freeze:
	uv pip freeze > requirements.txt
