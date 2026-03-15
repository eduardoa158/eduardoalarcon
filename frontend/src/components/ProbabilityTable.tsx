import React from 'react';
import { PredictMatchResponse } from '@/types/prediction';

interface Props {
  probabilities: PredictMatchResponse['probabilities_1x2'];
}

export function ProbabilityTable({ probabilities }: Props): JSX.Element {
  return (
    <table className="w-full overflow-hidden rounded-lg border bg-white">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-3 text-left">Resultado</th>
          <th className="p-3 text-left">Probabilidad</th>
        </tr>
      </thead>
      <tbody>
        <tr><td className="p-3">1 (Local)</td><td className="p-3">{(probabilities.home_win * 100).toFixed(1)}%</td></tr>
        <tr><td className="p-3">X (Empate)</td><td className="p-3">{(probabilities.draw * 100).toFixed(1)}%</td></tr>
        <tr><td className="p-3">2 (Visitante)</td><td className="p-3">{(probabilities.away_win * 100).toFixed(1)}%</td></tr>
      </tbody>
    </table>
  );
}
