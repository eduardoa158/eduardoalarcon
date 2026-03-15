export interface PredictMatchRequest {
  query: string;
}

export interface PredictMatchResponse {
  status: 'ok';
  context: {
    home_team: string;
    away_team: string;
    competition?: string | null;
  };
  expected_goals: {
    home: number;
    away: number;
  };
  probabilities_1x2: {
    home_win: number;
    draw: number;
    away_win: number;
  };
  top_scorelines: Array<{
    home_goals: number;
    away_goals: number;
    probability: number;
  }>;
  top_scorers: Array<{
    team: string;
    player_alias: string;
    probability_to_score: number;
  }>;
  feature_summary: Record<string, number>;
  probability_metadata: {
    calibration_applied: boolean;
    calibration_method?: string | null;
  };
  explanatory_factors: string[];
  future_modules_ready: string[];
}
