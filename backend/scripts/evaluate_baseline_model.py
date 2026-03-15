"""Evaluate active model with static holdout, walk-forward holdout, and backtest."""

from app.db.session import SessionLocal
from app.modeling.service import ModelService


def main() -> None:
    with SessionLocal() as db:
        service = ModelService(db)
        print(service.evaluate())


if __name__ == "__main__":
    main()
