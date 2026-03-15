import { PredictMatchRequest, PredictMatchResponse } from '@/types/prediction';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export async function predictMatch(payload: PredictMatchRequest): Promise<PredictMatchResponse> {
  const response = await fetch(`${API_URL}/predict-match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  if (!response.ok) {
    const body = await response.text();
    try {
      const parsed = JSON.parse(body) as { detail?: string };
      const detail = parsed.detail ?? body;
      throw new Error(`Predict request failed (${response.status}): ${detail}`);
    } catch {
      throw new Error(`Predict request failed (${response.status}): ${body}`);
    }
  }

  return response.json() as Promise<PredictMatchResponse>;
}
