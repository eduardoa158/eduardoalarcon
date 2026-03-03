.PHONY: setup test lint fmt run dev

setup:
	python -m pip install --upgrade pip
	pip install -e .[dev]

test:
	pytest -q

lint:
	ruff check shockalpha app tests
	mypy shockalpha app

fmt:
	black shockalpha app tests

run:
	python -m shockalpha.run --start 2016-01-01 --end today --mode daily

dev:
	uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
