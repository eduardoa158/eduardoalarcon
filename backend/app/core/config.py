from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Football Predictor API"
    database_url: str = "sqlite:///./football.db"
    log_level: str = "INFO"

    football_data_provider: str = "mock"
    football_data_api_base_url: str = "https://v3.football.api-sports.io"
    football_data_api_key: str = ""
    football_data_timeout_seconds: int = 20
    football_data_league_ids: str = "39"
    football_data_seasons: str = "2024"
    football_data_max_retries: int = 3
    football_data_max_backoff_seconds: int = 8

    artifact_path: str = "./artifacts/baseline_model.json"
    active_model_name: str = "ridge_poisson_v1_5"
    challenger_model_names: str = "ridge_poisson_v1_5,ridge_poisson_v1_5_weighted"
    app_env: str = "development"
    allow_auto_train_on_predict: bool = True

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    @field_validator("football_data_provider")
    @classmethod
    def validate_provider(cls, value: str) -> str:
        allowed = {"mock", "real"}
        normalized = value.strip().lower()
        if normalized not in allowed:
            raise ValueError(f"football_data_provider must be one of: {', '.join(sorted(allowed))}")
        return normalized

    @field_validator("app_env")
    @classmethod
    def validate_app_env(cls, value: str) -> str:
        allowed = {"development", "test", "staging", "production"}
        normalized = value.strip().lower()
        if normalized not in allowed:
            raise ValueError(f"app_env must be one of: {', '.join(sorted(allowed))}")
        return normalized

    @model_validator(mode="after")
    def validate_real_provider_settings(self) -> "Settings":
        if self.football_data_provider == "real":
            if not self.football_data_api_key.strip():
                raise ValueError("FOOTBALL_DATA_API_KEY is required when FOOTBALL_DATA_PROVIDER=real")
            if not self.football_data_league_ids.strip():
                raise ValueError("FOOTBALL_DATA_LEAGUE_IDS is required when FOOTBALL_DATA_PROVIDER=real")
            if not self.football_data_seasons.strip():
                raise ValueError("FOOTBALL_DATA_SEASONS is required when FOOTBALL_DATA_PROVIDER=real")
        return self


settings = Settings()
