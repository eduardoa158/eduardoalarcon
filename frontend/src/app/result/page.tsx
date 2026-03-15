import React from 'react';
import { ExpectedGoalsCard } from '@/components/ExpectedGoalsCard';
import { ProbabilityTable } from '@/components/ProbabilityTable';
import { predictMatch } from '@/lib/api';

interface Props {
  searchParams: { query?: string };
}

export default async function ResultPage({ searchParams }: Props): Promise<JSX.Element> {
  const query = searchParams.query ?? 'Quiero predecir el partido entre FC Barcelona y Real Madrid';
  try {
    const data = await predictMatch({ query });

    return (
      <section className="space-y-6">
        <h1 className="text-3xl font-bold">Resultado de predicción</h1>
        <p className="text-gray-600">
          {data.context.home_team} vs {data.context.away_team} {data.context.competition ? `· ${data.context.competition}` : ''}
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <ExpectedGoalsCard team={data.context.home_team} xg={data.expected_goals.home} />
          <ExpectedGoalsCard team={data.context.away_team} xg={data.expected_goals.away} />
        </div>
        <ProbabilityTable probabilities={data.probabilities_1x2} />

        <div className="rounded-lg border bg-white p-4 text-sm text-gray-700">
          <p>
            Calibración probabilística:{' '}
            <span className="font-medium">
              {data.probability_metadata.calibration_applied
                ? `activa (${data.probability_metadata.calibration_method ?? 'desconocida'})`
                : 'no activa'}
            </span>
          </p>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <h2 className="mb-3 text-xl font-semibold">Top scorelines (escenarios probables)</h2>
          <ul className="space-y-1 text-gray-700">
            {data.top_scorelines.map((s) => (
              <li key={`${s.home_goals}-${s.away_goals}`}>
                {s.home_goals}-{s.away_goals} · {(s.probability * 100).toFixed(1)}%
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <h2 className="mb-3 text-xl font-semibold">Feature summary (señales, no causalidad)</h2>
          <ul className="grid gap-1 text-gray-700 md:grid-cols-2">
            {Object.entries(data.feature_summary).map(([name, value]) => (
              <li key={name}>
                <span className="font-medium">{name}:</span> {value}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <h2 className="mb-3 text-xl font-semibold">Factores explicativos (simulados)</h2>
          <ul className="list-disc pl-6 text-gray-700">
            {data.explanatory_factors.map((factor) => (
              <li key={factor}>{factor}</li>
            ))}
          </ul>
        </div>
      </section>
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo obtener la predicción.';
    return (
      <section className="space-y-4">
        <h1 className="text-3xl font-bold">Resultado de predicción</h1>
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-800">
          <p className="font-semibold">No fue posible generar la predicción.</p>
          <p className="mt-2 text-sm">{message}</p>
        </div>
      </section>
    );
  }
}
