from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Competition(Base):
    __tablename__ = "competitions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    provider_id: Mapped[str | None] = mapped_column(String(64), unique=True, nullable=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    country: Mapped[str] = mapped_column(String(80), nullable=False)


class Team(Base):
    __tablename__ = "teams"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    provider_id: Mapped[str | None] = mapped_column(String(64), unique=True, nullable=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    attack_rating: Mapped[float] = mapped_column(Float, default=1.0)
    defense_rating: Mapped[float] = mapped_column(Float, default=1.0)


class Match(Base):
    __tablename__ = "matches"
    __table_args__ = (UniqueConstraint("provider_id", name="uq_matches_provider_id"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    provider_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    competition_id: Mapped[int] = mapped_column(ForeignKey("competitions.id"), nullable=False)
    home_team_id: Mapped[int] = mapped_column(ForeignKey("teams.id"), nullable=False)
    away_team_id: Mapped[int] = mapped_column(ForeignKey("teams.id"), nullable=False)
    home_goals: Mapped[int] = mapped_column(Integer, nullable=False)
    away_goals: Mapped[int] = mapped_column(Integer, nullable=False)
    played_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    is_finished: Mapped[bool] = mapped_column(Boolean, default=True)

    competition: Mapped[Competition] = relationship()


class MatchStatistic(Base):
    __tablename__ = "match_statistics"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    match_id: Mapped[int] = mapped_column(ForeignKey("matches.id"), nullable=False)
    team_id: Mapped[int] = mapped_column(ForeignKey("teams.id"), nullable=False)
    is_home: Mapped[bool] = mapped_column(Boolean, nullable=False)
    possession_pct: Mapped[float | None] = mapped_column(Float, nullable=True)
    shots_total: Mapped[int | None] = mapped_column(Integer, nullable=True)
    shots_on_target: Mapped[int | None] = mapped_column(Integer, nullable=True)
    corners: Mapped[int | None] = mapped_column(Integer, nullable=True)
    fouls: Mapped[int | None] = mapped_column(Integer, nullable=True)


class DataSyncState(Base):
    __tablename__ = "data_sync_states"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    provider: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    last_synced_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    last_success_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    last_cursor: Mapped[str | None] = mapped_column(String(64), nullable=True)
    last_error: Mapped[str | None] = mapped_column(String(500), nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ModelTrainingRun(Base):
    __tablename__ = "model_training_runs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    model_name: Mapped[str] = mapped_column(String(80), nullable=False)
    artifact_path: Mapped[str] = mapped_column(String(255), nullable=False)
    trained_samples: Mapped[int] = mapped_column(Integer, nullable=False)
    validation_mae_home: Mapped[float] = mapped_column(Float, nullable=False)
    validation_mae_away: Mapped[float] = mapped_column(Float, nullable=False)
    validation_brier_1x2: Mapped[float] = mapped_column(Float, nullable=False)
    validation_log_loss_1x2: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    walk_forward_brier_1x2: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    walk_forward_log_loss_1x2: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    calibration_method: Mapped[str | None] = mapped_column(String(64), nullable=True)
    calibration_temperature: Mapped[float | None] = mapped_column(Float, nullable=True)
    calibration_fit_samples: Mapped[int | None] = mapped_column(Integer, nullable=True)
    calibration_improved: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    evaluation_holdout_size: Mapped[int] = mapped_column(Integer, nullable=False, default=2)
    backtest_splits: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    dataset_provider: Mapped[str] = mapped_column(String(64), nullable=False, default="unknown")
    feature_version: Mapped[str] = mapped_column(String(32), nullable=False, default="unknown")
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Prediction(Base):
    __tablename__ = "predictions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    request_text: Mapped[str] = mapped_column(Text, nullable=False)
    home_team_id: Mapped[int] = mapped_column(ForeignKey("teams.id"), nullable=False)
    away_team_id: Mapped[int] = mapped_column(ForeignKey("teams.id"), nullable=False)
    home_win_prob: Mapped[float] = mapped_column(Float, nullable=False)
    draw_prob: Mapped[float] = mapped_column(Float, nullable=False)
    away_win_prob: Mapped[float] = mapped_column(Float, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
