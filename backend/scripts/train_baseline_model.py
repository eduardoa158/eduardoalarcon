"""Train champion/challenger models with historical matches and persist artifacts."""

from app.db.session import SessionLocal
from app.modeling.service import ModelService


def main() -> None:
    with SessionLocal() as db:
        result = ModelService(db).train_and_store()
        print(result)


if __name__ == "__main__":
    main()
