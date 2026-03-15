from collections import defaultdict
from dataclasses import dataclass

import numpy as np

from app.modeling.contracts import HistoricalMatchRecord

FEATURE_NAMES_BY_VERSION: dict[str, list[str]] = {
    "v2": [
        "bias",
        "home_attack",
        "home_defense",
        "away_attack",
        "away_defense",
        "home_matches",
        "away_matches",
        "global_goal_rate_pre_match",
        "home_advantage_bias",
    ],
    "v3": [
        "bias",
        "global_goal_rate_pre_match",
        "home_attack_all",
        "home_defense_all",
        "away_attack_all",
        "away_defense_all",
        "home_attack_recent5",
        "home_defense_recent5",
        "away_attack_recent5",
        "away_defense_recent5",
        "home_attack_home_recent5",
        "home_defense_home_recent5",
        "away_attack_away_recent5",
        "away_defense_away_recent5",
        "home_matches",
        "away_matches",
        "home_recent_matches",
        "away_recent_matches",
        "home_cold_start_flag",
        "away_cold_start_flag",
        "attack_diff_recent5",
        "defense_diff_recent5",
        "form_goal_diff_last5_home",
        "form_goal_diff_last5_away",
        "home_advantage_bias",
    ],
}

FEATURE_VERSION_ALIASES = {"baseline": "v2", "enhanced": "v3"}


@dataclass
class FeatureRow:
    features: np.ndarray
    target_home_goals: float
    target_away_goals: float


@dataclass
class TeamAggregate:
    scored: int = 0
    conceded: int = 0
    matches: int = 0
    scored_home: int = 0
    conceded_home: int = 0
    matches_home: int = 0
    scored_away: int = 0
    conceded_away: int = 0
    matches_away: int = 0
    recent_scored_all: list[int] = None  # type: ignore[assignment]
    recent_conceded_all: list[int] = None  # type: ignore[assignment]
    recent_scored_home: list[int] = None  # type: ignore[assignment]
    recent_conceded_home: list[int] = None  # type: ignore[assignment]
    recent_scored_away: list[int] = None  # type: ignore[assignment]
    recent_conceded_away: list[int] = None  # type: ignore[assignment]

    def __post_init__(self) -> None:
        self.recent_scored_all = []
        self.recent_conceded_all = []
        self.recent_scored_home = []
        self.recent_conceded_home = []
        self.recent_scored_away = []
        self.recent_conceded_away = []


def _rolling_mean(values: list[int], default: float) -> float:
    if not values:
        return default
    return float(sum(values) / len(values))


def _trim_recent(values: list[int], window: int = 5) -> list[int]:
    if len(values) <= window:
        return values
    return values[-window:]


def _team_snapshot_v2(agg: TeamAggregate, global_goal_rate: float) -> dict[str, float]:
    if agg.matches == 0:
        return {
            "attack": global_goal_rate,
            "defense": global_goal_rate,
            "matches": 0.0,
        }
    return {
        "attack": agg.scored / agg.matches,
        "defense": agg.conceded / agg.matches,
        "matches": float(agg.matches),
    }


def _team_snapshot_v3(agg: TeamAggregate, global_goal_rate: float) -> dict[str, float]:
    attack_all = agg.scored / agg.matches if agg.matches > 0 else global_goal_rate
    defense_all = agg.conceded / agg.matches if agg.matches > 0 else global_goal_rate

    attack_recent5 = _rolling_mean(agg.recent_scored_all, attack_all)
    defense_recent5 = _rolling_mean(agg.recent_conceded_all, defense_all)

    attack_home_recent5 = (
        _rolling_mean(agg.recent_scored_home, attack_all)
        if agg.recent_scored_home
        else attack_recent5
    )
    defense_home_recent5 = (
        _rolling_mean(agg.recent_conceded_home, defense_all)
        if agg.recent_conceded_home
        else defense_recent5
    )
    attack_away_recent5 = (
        _rolling_mean(agg.recent_scored_away, attack_all)
        if agg.recent_scored_away
        else attack_recent5
    )
    defense_away_recent5 = (
        _rolling_mean(agg.recent_conceded_away, defense_all)
        if agg.recent_conceded_away
        else defense_recent5
    )

    return {
        "attack_all": attack_all,
        "defense_all": defense_all,
        "attack_recent5": attack_recent5,
        "defense_recent5": defense_recent5,
        "attack_home_recent5": attack_home_recent5,
        "defense_home_recent5": defense_home_recent5,
        "attack_away_recent5": attack_away_recent5,
        "defense_away_recent5": defense_away_recent5,
        "matches": float(agg.matches),
        "recent_matches": float(len(agg.recent_scored_all)),
        "cold_start_flag": 1.0 if agg.matches < 3 else 0.0,
        "form_goal_diff_last5": attack_recent5 - defense_recent5,
    }


def _as_features_v2(home: dict[str, float], away: dict[str, float], global_goal_rate: float) -> np.ndarray:
    return np.array(
        [
            1.0,
            home["attack"],
            home["defense"],
            away["attack"],
            away["defense"],
            home["matches"],
            away["matches"],
            global_goal_rate,
            1.0,
        ],
        dtype=float,
    )


def _as_features_v3(home: dict[str, float], away: dict[str, float], global_goal_rate: float) -> np.ndarray:
    return np.array(
        [
            1.0,
            global_goal_rate,
            home["attack_all"],
            home["defense_all"],
            away["attack_all"],
            away["defense_all"],
            home["attack_recent5"],
            home["defense_recent5"],
            away["attack_recent5"],
            away["defense_recent5"],
            home["attack_home_recent5"],
            home["defense_home_recent5"],
            away["attack_away_recent5"],
            away["defense_away_recent5"],
            home["matches"],
            away["matches"],
            home["recent_matches"],
            away["recent_matches"],
            home["cold_start_flag"],
            away["cold_start_flag"],
            home["attack_recent5"] - away["defense_recent5"],
            away["attack_recent5"] - home["defense_recent5"],
            home["form_goal_diff_last5"],
            away["form_goal_diff_last5"],
            1.0,
        ],
        dtype=float,
    )


def _build_features(home: TeamAggregate, away: TeamAggregate, global_goal_rate: float, feature_version: str) -> np.ndarray:
    if feature_version == "v2":
        return _as_features_v2(_team_snapshot_v2(home, global_goal_rate), _team_snapshot_v2(away, global_goal_rate), global_goal_rate)
    if feature_version == "v3":
        return _as_features_v3(_team_snapshot_v3(home, global_goal_rate), _team_snapshot_v3(away, global_goal_rate), global_goal_rate)
    raise ValueError(f"Unsupported feature_version '{feature_version}'")


def _update_aggregates(home: TeamAggregate, away: TeamAggregate, home_goals: int, away_goals: int) -> None:
    home.scored += home_goals
    home.conceded += away_goals
    home.matches += 1
    home.scored_home += home_goals
    home.conceded_home += away_goals
    home.matches_home += 1

    away.scored += away_goals
    away.conceded += home_goals
    away.matches += 1
    away.scored_away += away_goals
    away.conceded_away += home_goals
    away.matches_away += 1

    home.recent_scored_all = _trim_recent(home.recent_scored_all + [home_goals])
    home.recent_conceded_all = _trim_recent(home.recent_conceded_all + [away_goals])
    home.recent_scored_home = _trim_recent(home.recent_scored_home + [home_goals])
    home.recent_conceded_home = _trim_recent(home.recent_conceded_home + [away_goals])

    away.recent_scored_all = _trim_recent(away.recent_scored_all + [away_goals])
    away.recent_conceded_all = _trim_recent(away.recent_conceded_all + [home_goals])
    away.recent_scored_away = _trim_recent(away.recent_scored_away + [away_goals])
    away.recent_conceded_away = _trim_recent(away.recent_conceded_away + [home_goals])


def normalize_feature_version(feature_version: str) -> str:
    normalized = feature_version.strip().lower()
    normalized = FEATURE_VERSION_ALIASES.get(normalized, normalized)
    if normalized not in FEATURE_NAMES_BY_VERSION:
        raise ValueError(f"Unsupported feature_version '{feature_version}'")
    return normalized


def feature_names(feature_version: str) -> list[str]:
    normalized = normalize_feature_version(feature_version)
    return FEATURE_NAMES_BY_VERSION[normalized]


def build_training_rows(history: list[HistoricalMatchRecord], feature_version: str = "v2") -> list[FeatureRow]:
    normalized_version = normalize_feature_version(feature_version)
    ordered = sorted(history, key=lambda m: (m.played_at, m.match_id))
    if not ordered:
        return []

    team_stats: dict[str, TeamAggregate] = defaultdict(TeamAggregate)
    rows: list[FeatureRow] = []

    total_goals_seen = 0
    matches_seen = 0

    for match in ordered:
        global_goal_rate = total_goals_seen / (2 * matches_seen) if matches_seen > 0 else 1.2
        home_agg = team_stats[match.home_team]
        away_agg = team_stats[match.away_team]

        rows.append(
            FeatureRow(
                features=_build_features(home_agg, away_agg, global_goal_rate, normalized_version),
                target_home_goals=float(match.home_goals),
                target_away_goals=float(match.away_goals),
            )
        )

        _update_aggregates(home_agg, away_agg, match.home_goals, match.away_goals)
        total_goals_seen += match.home_goals + match.away_goals
        matches_seen += 1

    return rows


def build_inference_features(home_team: str, away_team: str, history: list[HistoricalMatchRecord], feature_version: str = "v2") -> np.ndarray:
    normalized_version = normalize_feature_version(feature_version)
    ordered = sorted(history, key=lambda m: (m.played_at, m.match_id))
    if not ordered:
        if normalized_version == "v2":
            return np.array([1.0, 1.2, 1.2, 1.2, 1.2, 0.0, 0.0, 1.2, 1.0], dtype=float)
        return np.array([1.0, 1.2] + [1.2] * 8 + [0.0] * 14 + [1.0], dtype=float)

    team_stats: dict[str, TeamAggregate] = defaultdict(TeamAggregate)
    total_goals_seen = 0
    matches_seen = 0

    for match in ordered:
        home_agg = team_stats[match.home_team]
        away_agg = team_stats[match.away_team]
        _update_aggregates(home_agg, away_agg, match.home_goals, match.away_goals)
        total_goals_seen += match.home_goals + match.away_goals
        matches_seen += 1

    global_goal_rate = total_goals_seen / (2 * matches_seen) if matches_seen > 0 else 1.2
    return _build_features(team_stats[home_team], team_stats[away_team], global_goal_rate, normalized_version)


def summarize_feature_vector(features: np.ndarray, feature_version: str) -> dict[str, float]:
    names = feature_names(feature_version)
    return {name: round(float(value), 4) for name, value in zip(names, features.tolist(), strict=False)}
