import re
import unicodedata

from app.schemas.prediction import ExtractedContext


class NaturalLanguageParser:
    _COMPETITION_ALIASES = {
        "premier league": "Premier League",
        "la liga": "LaLiga",
        "laliga": "LaLiga",
        "champions": "UEFA Champions League",
        "champions league": "UEFA Champions League",
        "libertadores": "Copa Libertadores",
        "copa libertadores": "Copa Libertadores",
        "serie a": "Serie A",
        "bundesliga": "Bundesliga",
        "ligue 1": "Ligue 1",
    }

    _TEAM_ALIASES = {
        "barcelona": "FC Barcelona",
        "fc barcelona": "FC Barcelona",
        "real madrid": "Real Madrid",
        "madrid": "Real Madrid",
        "river": "River Plate",
        "river plate": "River Plate",
        "boca": "Boca Juniors",
        "boca juniors": "Boca Juniors",
        "manchester city": "Manchester City",
        "man city": "Manchester City",
        "city": "Manchester City",
        "arsenal": "Arsenal",
        "inter milan": "Inter Milan",
        "milan": "AC Milan",
        "ac milan": "AC Milan",
        "psg": "Paris Saint-Germain",
        "paris saint germain": "Paris Saint-Germain",
        "liverpool": "Liverpool",
        "sevilla": "Sevilla",
        "atletico": "Atletico Madrid",
        "atletico madrid": "Atletico Madrid",
    }

    _AMBIGUOUS_ALIASES = {
        "inter": ["Inter Milan", "Inter Miami"],
    }

    _INTENT_PREFIXES = (
        "quiero predecir",
        "predice",
        "pronostico para",
        "pronóstico para",
        "como sale",
        "cómo sale",
        "necesito la prediccion",
        "necesito la predicción",
        "partido",
        "la vuelta entre",
        "la ida entre",
    )

    def parse(self, query: str) -> ExtractedContext:
        cleaned = self._normalize_text(query)
        if not cleaned:
            raise ValueError("La consulta está vacía. Indica dos equipos, por ejemplo: 'Barcelona vs Real Madrid'.")

        competition = self._extract_competition(cleaned)
        home_raw, away_raw = self._extract_teams(cleaned)

        home_team = self._resolve_team(home_raw)
        away_team = self._resolve_team(away_raw)

        if home_team == away_team:
            raise ValueError("El equipo local y visitante no pueden ser el mismo.")

        return ExtractedContext(home_team=home_team, away_team=away_team, competition=competition)

    def _extract_teams(self, cleaned: str) -> tuple[str, str]:
        if re.search(r"\bentre\b", cleaned):
            segment = re.split(r"\bentre\b", cleaned, maxsplit=1)[1].strip()
            home, away = self._split_by_separator(segment, allow_y=True)
        else:
            home, away = self._split_by_separator(cleaned, allow_y=True)

        home = self._strip_intent_prefix(home.strip())
        away = self._strip_competition_suffix(away.strip())

        if not home or not away:
            raise ValueError(
                "No pude identificar ambos equipos. Usa un formato como: 'Equipo A vs Equipo B' o 'entre Equipo A y Equipo B'."
            )
        return home, away

    def _split_by_separator(self, text: str, allow_y: bool) -> tuple[str, str]:
        separators = [" vs ", " contra ", " versus "]
        if allow_y:
            separators.append(" y ")

        for sep in separators:
            token = sep.strip()
            pattern = rf"\b{re.escape(token)}\b"
            if re.search(pattern, text):
                parts = re.split(pattern, text, maxsplit=1)
                if len(parts) == 2:
                    left, right = parts
                    return left.strip(), right.strip()

        raise ValueError(
            "No encontré el separador de equipos. Prueba con 'vs', 'contra' o 'entre ... y ...'."
        )

    def _resolve_team(self, raw_team: str) -> str:
        normalized = raw_team.strip()
        if not normalized:
            raise ValueError("Falta uno de los equipos en la consulta.")

        if normalized in self._AMBIGUOUS_ALIASES:
            options = ", ".join(self._AMBIGUOUS_ALIASES[normalized])
            raise ValueError(f"El equipo '{raw_team}' es ambiguo. Especifica uno de: {options}.")

        if normalized in self._TEAM_ALIASES:
            return self._TEAM_ALIASES[normalized]

        raise ValueError(f"No reconozco el equipo '{raw_team}'. Usa un nombre más específico.")

    def _extract_competition(self, cleaned: str) -> str | None:
        for alias, canonical in self._COMPETITION_ALIASES.items():
            if alias in cleaned:
                return canonical
        return None

    def _strip_competition_suffix(self, text: str) -> str:
        cut_markers = [" por ", " en ", " de ", " para "]
        for marker in cut_markers:
            if marker in f" {text} ":
                return text.split(marker, 1)[0].strip()
        return text

    def _strip_intent_prefix(self, text: str) -> str:
        result = text
        for prefix in self._INTENT_PREFIXES:
            if result.startswith(prefix + " "):
                result = result[len(prefix) + 1 :]
        return result

    def _normalize_text(self, text: str) -> str:
        lowered = unicodedata.normalize("NFKD", text.lower())
        without_accents = "".join(ch for ch in lowered if not unicodedata.combining(ch))
        without_symbols = re.sub(r"[^a-z0-9\s]", " ", without_accents)
        normalized = re.sub(r"\s+", " ", without_symbols).strip()
        return normalized
