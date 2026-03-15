from sqlalchemy import select
from sqlalchemy.orm import Session, aliased

from app.domain.models import Match, Team
from app.modeling.contracts import HistoricalMatchRecord


def fetch_historical_matches(db: Session) -> list[HistoricalMatchRecord]:
    home_team = aliased(Team)
    away_team = aliased(Team)

    rows = db.execute(
        select(
            Match.id,
            Match.played_at,
            Match.home_goals,
            Match.away_goals,
            home_team.name.label("home_name"),
            away_team.name.label("away_name"),
        )
        .join(home_team, Match.home_team_id == home_team.id)
        .join(away_team, Match.away_team_id == away_team.id)
        .where(Match.is_finished.is_(True))
        .order_by(Match.played_at.asc())
    ).all()

    return [
        HistoricalMatchRecord(
            match_id=row.id,
            played_at=row.played_at,
            home_team=row.home_name,
            away_team=row.away_name,
            home_goals=row.home_goals,
            away_goals=row.away_goals,
        )
        for row in rows
    ]
