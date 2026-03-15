from sqlalchemy import select
from sqlalchemy.orm import Session

from app.domain.models import Competition, Match, MatchStatistic, Team
from app.etl.transform import NormalizedDataset


class DataLoadError(Exception):
    pass


def _upsert_competitions(db: Session, dataset: NormalizedDataset) -> dict[str, Competition]:
    mapping: dict[str, Competition] = {}
    for item in dataset.competitions:
        competition = db.scalar(select(Competition).where(Competition.provider_id == item.provider_id))
        if not competition:
            competition = Competition(provider_id=item.provider_id, name=item.name, country=item.country)
            db.add(competition)
            db.flush()
        else:
            competition.name = item.name
            competition.country = item.country
        mapping[item.provider_id] = competition
    return mapping


def _upsert_teams(db: Session, dataset: NormalizedDataset) -> dict[str, Team]:
    mapping: dict[str, Team] = {}
    for item in dataset.teams:
        team = db.scalar(select(Team).where(Team.provider_id == item.provider_id))
        if not team:
            team = Team(provider_id=item.provider_id, name=item.name)
            db.add(team)
            db.flush()
        else:
            team.name = item.name
        mapping[item.provider_id] = team
    return mapping


def load_dataset(db: Session, dataset: NormalizedDataset) -> dict[str, int]:
    competitions = _upsert_competitions(db, dataset)
    teams = _upsert_teams(db, dataset)

    ingested_matches = 0
    ingested_stats = 0
    for item in dataset.matches:
        competition = competitions.get(item.competition_provider_id)
        home_team = teams.get(item.home_team_provider_id)
        away_team = teams.get(item.away_team_provider_id)

        if not competition or not home_team or not away_team:
            raise DataLoadError("Dataset references unknown competition/team provider IDs")

        match = db.scalar(select(Match).where(Match.provider_id == item.provider_id))
        if not match:
            match = Match(
                provider_id=item.provider_id,
                competition_id=competition.id,
                home_team_id=home_team.id,
                away_team_id=away_team.id,
                home_goals=item.home_goals,
                away_goals=item.away_goals,
                played_at=item.played_at,
                is_finished=item.is_finished,
            )
            db.add(match)
            db.flush()
            ingested_matches += 1
        else:
            match.competition_id = competition.id
            match.home_team_id = home_team.id
            match.away_team_id = away_team.id
            match.home_goals = item.home_goals
            match.away_goals = item.away_goals
            match.played_at = item.played_at
            match.is_finished = item.is_finished

        db.query(MatchStatistic).filter(MatchStatistic.match_id == match.id).delete()

        for stat in item.stats:
            team = teams.get(stat.team_provider_id)
            if not team:
                raise DataLoadError("Dataset references unknown team in match statistics")
            inferred_is_home = stat.team_provider_id == item.home_team_provider_id
            db.add(
                MatchStatistic(
                    match_id=match.id,
                    team_id=team.id,
                    is_home=inferred_is_home,
                    possession_pct=stat.possession_pct,
                    shots_total=stat.shots_total,
                    shots_on_target=stat.shots_on_target,
                    corners=stat.corners,
                    fouls=stat.fouls,
                )
            )
            ingested_stats += 1

    db.commit()
    return {
        "competitions": len(dataset.competitions),
        "teams": len(dataset.teams),
        "ingested_matches": ingested_matches,
        "ingested_stats": ingested_stats,
    }
