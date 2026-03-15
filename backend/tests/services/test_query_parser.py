import pytest

from app.services.query_parser import NaturalLanguageParser


@pytest.mark.parametrize(
    "query,expected_home,expected_away,expected_competition",
    [
        ("Quiero predecir Barcelona vs Real Madrid", "FC Barcelona", "Real Madrid", None),
        ("Pronóstico para River contra Boca", "River Plate", "Boca Juniors", None),
        (
            "Predice el partido entre Manchester City y Arsenal por Premier League",
            "Manchester City",
            "Arsenal",
            "Premier League",
        ),
        ("Cómo sale Inter Milan vs Milan", "Inter Milan", "AC Milan", None),
        (
            "Necesito la predicción de la vuelta entre PSG y Liverpool",
            "Paris Saint-Germain",
            "Liverpool",
            None,
        ),
        ("Barcelona vs Real Madrid", "FC Barcelona", "Real Madrid", None),
        ("FC Barcelona vs Real Madrid", "FC Barcelona", "Real Madrid", None),
        ("real madrid vs barcelona", "Real Madrid", "FC Barcelona", None),
        ("River Plate vs Boca Juniors", "River Plate", "Boca Juniors", None),
        ("man city vs arsenal", "Manchester City", "Arsenal", None),
        ("partido manchester city contra arsenal", "Manchester City", "Arsenal", None),
        (
            "entre manchester city y arsenal en premier league",
            "Manchester City",
            "Arsenal",
            "Premier League",
        ),
        (
            "entre barcelona y sevilla por laliga",
            "FC Barcelona",
            "Sevilla",
            "LaLiga",
        ),
        (
            "entre atletico y real madrid por la liga",
            "Atletico Madrid",
            "Real Madrid",
            "LaLiga",
        ),
        ("psg vs liverpool por champions", "Paris Saint-Germain", "Liverpool", "UEFA Champions League"),
        ("river vs boca por libertadores", "River Plate", "Boca Juniors", "Copa Libertadores"),
        ("milan vs inter milan en serie a", "AC Milan", "Inter Milan", "Serie A"),
        ("arsenal vs man city", "Arsenal", "Manchester City", None),
        ("sevilla contra atletico", "Sevilla", "Atletico Madrid", None),
        ("la ida entre barcelona y real madrid", "FC Barcelona", "Real Madrid", None),
        ("la vuelta entre psg y liverpool", "Paris Saint-Germain", "Liverpool", None),
        (
            "predice entre man city y liverpool en premier league",
            "Manchester City",
            "Liverpool",
            "Premier League",
        ),
    ],
)
def test_query_parser_supported_cases(
    query: str,
    expected_home: str,
    expected_away: str,
    expected_competition: str | None,
) -> None:
    parser = NaturalLanguageParser()
    result = parser.parse(query)

    assert result.home_team == expected_home
    assert result.away_team == expected_away
    assert result.competition == expected_competition


@pytest.mark.parametrize(
    "query,expected_error",
    [
        ("", "consulta está vacía"),
        ("Barcelona", "separador de equipos"),
        ("Quiero predecir Barcelona", "separador de equipos"),
        ("Barcelona vs", "ambos equipos"),
        ("vs Real Madrid", "ambos equipos"),
        ("Inter vs Milan", "ambiguo"),
        ("PSG vs PSG", "no pueden ser el mismo"),
        ("EquipoX vs Real Madrid", "No reconozco el equipo"),
        ("Barcelona contra EquipoY", "No reconozco el equipo"),
        ("Pronóstico para River y", "ambos equipos"),
    ],
)
def test_query_parser_unsupported_cases(query: str, expected_error: str) -> None:
    parser = NaturalLanguageParser()
    with pytest.raises(ValueError, match=expected_error):
        parser.parse(query)
