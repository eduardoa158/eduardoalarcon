import logging

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.schemas.prediction import (
    HealthResponse,
    IngestHistoricalDataRequest,
    PredictMatchRequest,
    PredictMatchResponse,
)
from app.services.ingest_service import IngestService
from app.services.prediction_service import PredictionService
from app.services.query_parser import NaturalLanguageParser

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(status="ok")


@router.post("/ingest-historical-data")
def ingest_historical_data(payload: IngestHistoricalDataRequest, db: Session = Depends(get_db)) -> dict[str, int | str | None]:
    if payload.provider and payload.provider != settings.football_data_provider:
        raise HTTPException(
            status_code=400,
            detail=f"Payload provider '{payload.provider}' does not match configured provider '{settings.football_data_provider}'",
        )

    try:
        result = IngestService(db).ingest_historical_data()
    except (ValueError, RuntimeError, NotImplementedError) as exc:
        logger.exception("Data ingestion failed")
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    return {"status": "ok", "provider": settings.football_data_provider, **result}


@router.post("/predict-match", response_model=PredictMatchResponse)
def predict_match(payload: PredictMatchRequest, db: Session = Depends(get_db)) -> PredictMatchResponse:
    parser = NaturalLanguageParser()
    try:
        context = parser.parse(payload.query)
    except ValueError as exc:
        logger.warning("Invalid prediction query", extra={"query": payload.query})
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    try:
        return PredictionService(db).predict(payload.query, context)
    except RuntimeError as exc:
        logger.exception("Prediction failed due to model readiness")
        raise HTTPException(status_code=503, detail=str(exc)) from exc
