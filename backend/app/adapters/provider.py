from dataclasses import dataclass


@dataclass
class HistoricalMatchSeed:
    competition: str
    country: str
    home_team: str
    away_team: str
    home_goals: int
    away_goals: int


class HistoricalDataProvider:
    def load_matches(self) -> list[HistoricalMatchSeed]:
        raise NotImplementedError


class SeedHistoricalDataProvider(HistoricalDataProvider):
    def load_matches(self) -> list[HistoricalMatchSeed]:
        return [
            HistoricalMatchSeed("LaLiga", "Spain", "FC Barcelona", "Real Madrid", 2, 1),
            HistoricalMatchSeed("LaLiga", "Spain", "Real Madrid", "FC Barcelona", 3, 2),
            HistoricalMatchSeed("LaLiga", "Spain", "FC Barcelona", "Atletico Madrid", 1, 0),
            HistoricalMatchSeed("LaLiga", "Spain", "Real Madrid", "Sevilla", 2, 0),
        ]
